import { error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	aduan,
	aduanPesan,
	users,
	jastiperProfiles,
	produk,
	pesanan,
	logAdmin
} from '$lib/server/db/schema';
import { muatLampiran } from '$lib/server/aduan';
import type { Actions, PageServerLoad } from './$types';

type Aduan = typeof aduan.$inferSelect;

const BOLEH: Record<string, string[]> = {
	akun: ['tegur', 'nonaktifkan_akun', 'tolak', 'selesai'],
	produk: ['tegur', 'sembunyikan_produk', 'nonaktifkan_akun', 'tolak', 'selesai'],
	pesanan: ['tegur', 'nonaktifkan_akun', 'tolak', 'selesai'],
	umum: ['tolak', 'selesai']
};

const RINGKAS: Record<string, string> = {
	tegur: 'Admin telah menegur pihak yang dilaporkan.',
	nonaktifkan_akun: 'Akun yang dilaporkan telah dinonaktifkan.',
	sembunyikan_produk: 'Produk yang dilaporkan telah disembunyikan dari katalog.',
	tolak: 'Aduan ditutup tanpa tindakan terhadap pihak yang dilaporkan.',
	selesai: 'Aduan ditandai selesai.'
};

async function infoUser(id: string) {
	const [u] = await db
		.select({
			id: users.id,
			nama: users.nama,
			email: users.email,
			role: users.role,
			aktif: users.aktif,
			noWa: jastiperProfiles.noWa
		})
		.from(users)
		.leftJoin(jastiperProfiles, eq(jastiperProfiles.userId, users.id))
		.where(eq(users.id, id));
	return u ?? null;
}

// cari pihak terlapor + info target
async function resolveTarget(a: Aduan) {
	let terlapor: Awaited<ReturnType<typeof infoUser>> | null = null;
	let targetInfo: Record<string, unknown> | null = null;

	if (a.targetTipe === 'akun' && a.targetId) {
		terlapor = await infoUser(a.targetId);
	} else if (a.targetTipe === 'produk' && a.targetId) {
		const [p] = await db.select().from(produk).where(eq(produk.id, a.targetId));
		if (p) {
			targetInfo = { nama: p.nama, harga: p.harga, aktif: p.aktif };
			terlapor = await infoUser(p.jastiperId);
		}
	} else if (a.targetTipe === 'pesanan' && a.targetId) {
		const [p] = await db.select().from(pesanan).where(eq(pesanan.id, a.targetId));
		if (p) {
			targetInfo = { status: p.status, total: p.totalHarga, dibuat: p.createdAt };
			terlapor = await infoUser(p.pelangganId === a.pelaporId ? p.jastiperId : p.pelangganId);
		}
	}
	return { terlapor, targetInfo };
}

export const load: PageServerLoad = async ({ params }) => {
	const [a] = await db.select().from(aduan).where(eq(aduan.id, params.id));
	if (!a) error(404, 'Aduan tidak ditemukan');

	const pelapor = await infoUser(a.pelaporId);
	const { terlapor, targetInfo } = await resolveTarget(a);

	await db
		.update(aduanPesan)
		.set({ dibaca: true })
		.where(and(eq(aduanPesan.aduanId, a.id), eq(aduanPesan.peran, 'pelapor'), eq(aduanPesan.dibaca, false)));

	const pesan = await db
		.select({
			id: aduanPesan.id,
			peran: aduanPesan.peran,
			isi: aduanPesan.isi,
			createdAt: aduanPesan.createdAt
		})
		.from(aduanPesan)
		.where(eq(aduanPesan.aduanId, a.id))
		.orderBy(aduanPesan.createdAt);

	const lampiran = await muatLampiran(a.id);

	return {
		aduan: a,
		pelapor,
		terlapor,
		targetInfo,
		pesan: pesan.map((p) => ({ ...p, lampiran: lampiran.filter((l) => l.pesanId === p.id) })),
		lampiranAduan: lampiran.filter((l) => !l.pesanId),
		tindakanBoleh: BOLEH[a.targetTipe]
	};
};

export const actions: Actions = {
	balas: async ({ request, params, locals }) => {
		const admin = locals.user;
		if (!admin || admin.role !== 'admin') error(403, 'Khusus admin');
		const isi = String((await request.formData()).get('isi') ?? '').trim();
		if (!isi) return fail(400, { pesan: 'Pesan tidak boleh kosong.' });
		if (isi.length > 1000) return fail(400, { pesan: 'Pesan maksimal 1000 karakter.' });

		const [a] = await db.select().from(aduan).where(eq(aduan.id, params.id));
		if (!a) error(404, 'Aduan tidak ditemukan');
		if (a.status === 'selesai' || a.status === 'ditolak')
			return fail(400, { pesan: 'Aduan ini sudah ditutup.' });

		await db.insert(aduanPesan).values({
			id: crypto.randomUUID(),
			aduanId: a.id,
			pengirimId: admin.id,
			peran: 'admin',
			isi
		});
		if (a.status === 'baru') {
			await db
				.update(aduan)
				.set({ status: 'diproses', ditanganiOleh: admin.id, updatedAt: new Date() })
				.where(eq(aduan.id, a.id));
		}
		return { sukses: true };
	},

	tindak: async ({ request, params, locals }) => {
		const admin = locals.user;
		if (!admin || admin.role !== 'admin') error(403, 'Khusus admin');

		const fd = await request.formData();
		const tindakan = String(fd.get('tindakan') ?? '');
		const alasan = String(fd.get('alasan') ?? '').trim();

		const [a] = await db.select().from(aduan).where(eq(aduan.id, params.id));
		if (!a) error(404, 'Aduan tidak ditemukan');
		if (a.status === 'selesai' || a.status === 'ditolak')
			return fail(400, { pesan: 'Aduan ini sudah ditutup.' });
		if (!BOLEH[a.targetTipe].includes(tindakan))
			return fail(400, { pesan: 'Tindakan tidak tersedia untuk jenis aduan ini.' });
		if (alasan.length < 5) return fail(400, { pesan: 'Isi alasan minimal 5 karakter.' });

		const { terlapor } = await resolveTarget(a);
		if ((tindakan === 'tegur' || tindakan === 'nonaktifkan_akun') && !terlapor)
			return fail(400, { pesan: 'Pihak yang dilaporkan tidak ditemukan.' });
		if (tindakan === 'nonaktifkan_akun' && (terlapor!.role === 'admin' || terlapor!.id === admin.id))
			return fail(400, { pesan: 'Akun admin tidak bisa dinonaktifkan dari sini.' });

		await db.transaction(async (tx) => {
			let targetTipe = 'aduan';
			let targetId = a.id;
			let targetNama = a.targetNama;

			if (tindakan === 'tegur') {
				targetTipe = 'user';
				targetId = terlapor!.id;
				targetNama = terlapor!.nama;
			} else if (tindakan === 'nonaktifkan_akun') {
				await tx.update(users).set({ aktif: false }).where(eq(users.id, terlapor!.id));
				targetTipe = 'user';
				targetId = terlapor!.id;
				targetNama = terlapor!.nama;
			} else if (tindakan === 'sembunyikan_produk') {
				await tx.update(produk).set({ aktif: false }).where(eq(produk.id, a.targetId!));
				targetTipe = 'produk';
				targetId = a.targetId!;
			}

			await tx
				.update(aduan)
				.set({
					status: tindakan === 'tolak' ? 'ditolak' : 'selesai',
					tindakan,
					catatanAdmin: alasan,
					ditanganiOleh: admin.id,
					updatedAt: new Date()
				})
				.where(eq(aduan.id, a.id));

			await tx.insert(logAdmin).values({
				id: crypto.randomUUID(),
				adminId: admin.id,
				aksi: tindakan,
				targetTipe,
				targetId,
				targetNama,
				alasan,
				aduanId: a.id
			});

			await tx.insert(aduanPesan).values({
				id: crypto.randomUUID(),
				aduanId: a.id,
				pengirimId: admin.id,
				peran: 'admin',
				isi: `${RINGKAS[tindakan]}\nCatatan admin: ${alasan}`
			});
		});

		return { sukses: true };
	}
};