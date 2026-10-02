import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	aduan,
	aduanPesan,
	aduanLampiran,
	users,
	produk,
	pesanan,
	pengajuanHarga
} from '$lib/server/db/schema';
import { KATEGORI_LABEL, TIPE_TARGET, type TipeTarget } from '$lib/aduan';
import { periksaBukti, simpanBukti, type BuktiSiap } from '$lib/server/bukti';

type UserLokal = { id: string; role: string };

// semua user yang pernah berinteraksi (pesanan / pengajuan harga) dengan user ini
async function idLawan(userId: string) {
	const p = await db
		.select({ a: pesanan.pelangganId, b: pesanan.jastiperId })
		.from(pesanan)
		.where(or(eq(pesanan.pelangganId, userId), eq(pesanan.jastiperId, userId)));
	const h = await db
		.select({ a: pengajuanHarga.pelangganId, b: pengajuanHarga.jastiperId })
		.from(pengajuanHarga)
		.where(or(eq(pengajuanHarga.pelangganId, userId), eq(pengajuanHarga.jastiperId, userId)));
	const set = new Set<string>();
	for (const r of [...p, ...h]) {
		set.add(r.a);
		set.add(r.b);
	}
	set.delete(userId);
	return [...set];
}

export async function muatKandidat(user: UserLokal) {
	const lawan = await idLawan(user.id);

	const akun = lawan.length
		? await db.select({ id: users.id, nama: users.nama }).from(users).where(inArray(users.id, lawan))
		: [];

	const baris = await db
		.select({ id: pesanan.id, total: pesanan.totalHarga, createdAt: pesanan.createdAt })
		.from(pesanan)
		.where(or(eq(pesanan.pelangganId, user.id), eq(pesanan.jastiperId, user.id)))
		.orderBy(desc(pesanan.createdAt))
		.limit(50);
	const pesananList = baris.map((r) => ({
		id: r.id,
		label: `#${r.id.slice(0, 8)} · ${r.createdAt.toLocaleDateString('id-ID')} · Rp${r.total.toLocaleString('id-ID')}`
	}));

	// laporan produk hanya untuk pelanggan, dari jastiper yang pernah berinteraksi
	const produkList =
		user.role === 'pelanggan' && lawan.length
			? await db
					.select({ id: produk.id, nama: produk.nama })
					.from(produk)
					.where(inArray(produk.jastiperId, lawan))
					.limit(200)
			: [];

	return { akun, produk: produkList, pesanan: pesananList };
}

// simpan semua foto ke disk lalu catat di tabel lampiran
async function simpanLampiran(aduanId: string, pesanId: string | null, siap: BuktiSiap[]) {
	for (const b of siap) {
		const namaFile = await simpanBukti(b);
		await db.insert(aduanLampiran).values({
			id: crypto.randomUUID(),
			aduanId,
			pesanId,
			namaFile,
			namaAsli: b.namaAsli,
			mime: b.mime,
			ukuran: b.buffer.length
		});
	}
}

export async function muatLampiran(aduanId: string) {
	return db
		.select({
			id: aduanLampiran.id,
			pesanId: aduanLampiran.pesanId,
			namaAsli: aduanLampiran.namaAsli
		})
		.from(aduanLampiran)
		.where(eq(aduanLampiran.aduanId, aduanId))
		.orderBy(aduanLampiran.createdAt);
}

export async function buatAduan(
	user: UserLokal,
	f: { tipe: string; targetId: string; kategori: string; deskripsi: string },
	files: File[]
): Promise<{ error: string } | { id: string }> {
	if (!(TIPE_TARGET as readonly string[]).includes(f.tipe)) return { error: 'Jenis laporan tidak valid.' };
	if (!(f.kategori in KATEGORI_LABEL)) return { error: 'Pilih kategori laporan.' };
	const deskripsi = f.deskripsi.trim();
	if (deskripsi.length < 10) return { error: 'Jelaskan masalahnya minimal 10 karakter.' };
	if (deskripsi.length > 1000) return { error: 'Penjelasan maksimal 1000 karakter.' };

	const cek = await periksaBukti(files);
	if ('error' in cek) return { error: cek.error };

	const tipe = f.tipe as TipeTarget;
	let targetId: string | null = null;
	let targetNama: string | null = null;

	if (tipe !== 'umum') {
		if (!f.targetId) return { error: 'Pilih yang ingin dilaporkan.' };
		targetId = f.targetId;

		if (tipe === 'akun') {
			if (targetId === user.id) return { error: 'Kamu tidak bisa melaporkan akunmu sendiri.' };
			const lawan = await idLawan(user.id);
			if (!lawan.includes(targetId)) return { error: 'Akun tersebut tidak bisa dilaporkan.' };
			const [u] = await db.select({ nama: users.nama }).from(users).where(eq(users.id, targetId));
			if (!u) return { error: 'Akun tidak ditemukan.' };
			targetNama = u.nama;
		} else if (tipe === 'produk') {
			const [p] = await db
				.select({ nama: produk.nama, jastiperId: produk.jastiperId })
				.from(produk)
				.where(eq(produk.id, targetId));
			const lawan = await idLawan(user.id);
			if (!p || p.jastiperId === user.id || !lawan.includes(p.jastiperId))
				return { error: 'Produk tersebut tidak bisa dilaporkan.' };
			targetNama = p.nama;
		} else {
			const [p] = await db
				.select({ id: pesanan.id })
				.from(pesanan)
				.where(
					and(
						eq(pesanan.id, targetId),
						or(eq(pesanan.pelangganId, user.id), eq(pesanan.jastiperId, user.id))
					)
				);
			if (!p) return { error: 'Pesanan tidak ditemukan.' };
			targetNama = `Pesanan #${p.id.slice(0, 8)}`;
		}

		// anti-spam: satu aduan aktif per target
		const [dobel] = await db
			.select({ id: aduan.id })
			.from(aduan)
			.where(
				and(
					eq(aduan.pelaporId, user.id),
					eq(aduan.targetTipe, tipe),
					eq(aduan.targetId, targetId),
					inArray(aduan.status, ['baru', 'diproses'])
				)
			)
			.limit(1);
		if (dobel) return { error: 'Kamu sudah punya aduan yang masih berjalan untuk hal ini.' };
	}

	const id = crypto.randomUUID();
	await db.insert(aduan).values({
		id,
		pelaporId: user.id,
		targetTipe: tipe,
		targetId,
		targetNama,
		kategori: f.kategori,
		deskripsi
	});
	await simpanLampiran(id, null, cek.siap);
	return { id };
}

export async function muatDaftar(userId: string) {
	const daftar = await db
		.select()
		.from(aduan)
		.where(eq(aduan.pelaporId, userId))
		.orderBy(desc(aduan.createdAt));
	if (!daftar.length) return [];

	const belum = await db
		.select({ aduanId: aduanPesan.aduanId, n: sql<number>`count(*)::int` })
		.from(aduanPesan)
		.where(
			and(
				inArray(aduanPesan.aduanId, daftar.map((a) => a.id)),
				eq(aduanPesan.peran, 'admin'),
				eq(aduanPesan.dibaca, false)
			)
		)
		.groupBy(aduanPesan.aduanId);
	const peta = new Map(belum.map((b) => [b.aduanId, b.n]));
	return daftar.map((a) => ({ ...a, belumDibaca: peta.get(a.id) ?? 0 }));
}

// untuk badge menu
export async function jumlahBelumDibaca(userId: string) {
	const [r] = await db
		.select({ n: sql<number>`count(*)::int` })
		.from(aduanPesan)
		.innerJoin(aduan, eq(aduan.id, aduanPesan.aduanId))
		.where(and(eq(aduan.pelaporId, userId), eq(aduanPesan.peran, 'admin'), eq(aduanPesan.dibaca, false)));
	return r?.n ?? 0;
}

export async function muatDetail(userId: string, aduanId: string) {
	const [a] = await db
		.select()
		.from(aduan)
		.where(and(eq(aduan.id, aduanId), eq(aduan.pelaporId, userId)));
	if (!a) return null;

	await db
		.update(aduanPesan)
		.set({ dibaca: true })
		.where(and(eq(aduanPesan.aduanId, aduanId), eq(aduanPesan.peran, 'admin'), eq(aduanPesan.dibaca, false)));

	const pesan = await db
		.select({
			id: aduanPesan.id,
			peran: aduanPesan.peran,
			isi: aduanPesan.isi,
			createdAt: aduanPesan.createdAt
		})
		.from(aduanPesan)
		.where(eq(aduanPesan.aduanId, aduanId))
		.orderBy(aduanPesan.createdAt);

	const lampiran = await muatLampiran(aduanId);
	return {
		aduan: a,
		pesan: pesan.map((p) => ({ ...p, lampiran: lampiran.filter((l) => l.pesanId === p.id) })),
		lampiranAduan: lampiran.filter((l) => !l.pesanId)
	};
}

/* ---------- helper untuk route (pelanggan & jastiper memakai yang sama) ---------- */

function ambilFile(fd: FormData) {
	return fd.getAll('bukti').filter((x): x is File => x instanceof File && x.size > 0);
}

export async function loadDaftar({ locals, url }: RequestEvent) {
	const user = locals.user;
	if (!user) redirect(303, '/publik/masuk');
	return {
		daftar: await muatDaftar(user.id),
		kandidat: await muatKandidat(user),
		prefill: { tipe: url.searchParams.get('tipe') ?? '', targetId: url.searchParams.get('id') ?? '' }
	};
}

export async function handleBuat({ locals, request }: RequestEvent, basePath: string) {
	const user = locals.user;
	if (!user) redirect(303, '/publik/masuk');
	const fd = await request.formData();
	const nilai = {
		tipe: String(fd.get('tipe') ?? ''),
		targetId: String(fd.get('targetId') ?? ''),
		kategori: String(fd.get('kategori') ?? ''),
		deskripsi: String(fd.get('deskripsi') ?? '')
	};
	const hasil = await buatAduan(user, nilai, ambilFile(fd));
	if ('error' in hasil) return fail(400, { pesan: hasil.error, nilai });
	redirect(303, `${basePath}/${hasil.id}`);
}

export async function loadDetail({ locals, params }: RequestEvent) {
	const user = locals.user;
	if (!user) redirect(303, '/publik/masuk');
	const hasil = await muatDetail(user.id, params.id!);
	if (!hasil) error(404, 'Aduan tidak ditemukan');
	return hasil;
}

export async function handleBalas({ locals, request, params }: RequestEvent) {
	const user = locals.user;
	if (!user) redirect(303, '/publik/masuk');

	const fd = await request.formData();
	const isi = String(fd.get('isi') ?? '').trim();
	const files = ambilFile(fd);
	if (!isi && files.length === 0) return fail(400, { pesan: 'Tulis pesan atau lampirkan foto.' });
	if (isi.length > 1000) return fail(400, { pesan: 'Pesan maksimal 1000 karakter.' });

	const cek = await periksaBukti(files);
	if ('error' in cek) return fail(400, { pesan: cek.error });

	const [a] = await db
		.select({ status: aduan.status })
		.from(aduan)
		.where(and(eq(aduan.id, params.id!), eq(aduan.pelaporId, user.id)));
	if (!a) error(404, 'Aduan tidak ditemukan');
	if (a.status === 'selesai' || a.status === 'ditolak')
		return fail(400, { pesan: 'Aduan ini sudah ditutup. Buat aduan baru jika masih ada masalah.' });

	const pesanId = crypto.randomUUID();
	await db.insert(aduanPesan).values({
		id: pesanId,
		aduanId: params.id!,
		pengirimId: user.id,
		peran: 'pelapor',
		isi
	});
	await simpanLampiran(params.id!, pesanId, cek.siap);
	return { sukses: true };
}