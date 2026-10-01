import { fail } from '@sveltejs/kit';
import { and, desc, eq, inArray, notInArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	produk,
	users,
	jastiperProfiles,
	pesananItem,
	pesanan,
	pengajuanHarga,
	tawaranHarga,
	logAdmin
} from '$lib/server/db/schema';
import { wajibAdmin, catatAdmin } from '$lib/server/admin';
import type { Actions, PageServerLoad } from './$types';

// 08xxx -> 628xxx, karena link wa.me hanya bekerja dengan format internasional
function normalWa(no: string | null) {
	if (!no) return '';
	let d = no.replace(/\D/g, '');
	if (d.startsWith('0')) d = '62' + d.slice(1);
	else if (d.startsWith('8')) d = '62' + d;
	return d;
}

// Satu-satunya tempat pesan "kenapa tidak bisa dihapus" disusun
function susunAlasan(k: { pesananAktif: number; pernahDipesan: boolean; adaNegosiasi: boolean }) {
	if (k.pesananAktif > 0) {
		return `Produk ini masih ada di ${k.pesananAktif} pesanan yang sedang berjalan. Tunggu pesanannya selesai atau dibatalkan, atau sembunyikan produknya dari katalog.`;
	}
	if (k.pernahDipesan) {
		return 'Produk ini sudah pernah dipesan, jadi tidak bisa dihapus agar riwayat pesanan tetap utuh. Gunakan Sembunyikan untuk menariknya dari katalog.';
	}
	if (k.adaNegosiasi) {
		return 'Produk ini punya riwayat negosiasi harga yang masih tersimpan, jadi tidak bisa dihapus. Gunakan Sembunyikan untuk menariknya dari katalog.';
	}
	return null;
}

export const load: PageServerLoad = async ({ locals }) => {
	wajibAdmin(locals);

	const daftar = await db
		.select({
			id: produk.id,
			nama: produk.nama,
			kategori: produk.kategori,
			harga: produk.harga,
			hargaTipe: produk.hargaTipe,
			gambarUrl: produk.gambarUrl,
			aktif: produk.aktif,
			jastiperNama: users.nama,
			noWa: jastiperProfiles.noWa,
			pesananAktif: sql<number>`(select count(*)::int from ${pesananItem} inner join ${pesanan} on ${pesanan.id} = ${pesananItem.pesananId} where ${pesananItem.produkId} = ${produk.id} and ${pesanan.status} not in ('selesai', 'dibatalkan'))`,
			pernahDipesan: sql<boolean>`exists (select 1 from ${pesananItem} where ${pesananItem.produkId} = ${produk.id})`,
			adaNegosiasi: sql<boolean>`exists (select 1 from ${pengajuanHarga} inner join ${tawaranHarga} on ${tawaranHarga.pengajuanHargaId} = ${pengajuanHarga.id} where ${pengajuanHarga.produkId} = ${produk.id})`
		})
		.from(produk)
		.innerJoin(users, eq(users.id, produk.jastiperId))
		.leftJoin(jastiperProfiles, eq(jastiperProfiles.userId, produk.jastiperId))
		.orderBy(desc(produk.createdAt));

	// Status teguran: catatan terbaru per produk menentukan.
	// Kalau yang terbaru "tegur_produk" -> masih ditegur. Kalau "selesai_tegur_produk" -> sudah beres.
	const log = await db
		.select({
			targetId: logAdmin.targetId,
			aksi: logAdmin.aksi,
			alasan: logAdmin.alasan
		})
		.from(logAdmin)
		.where(
			and(
				eq(logAdmin.targetTipe, 'produk'),
				inArray(logAdmin.aksi, ['tegur_produk', 'selesai_tegur_produk'])
			)
		)
		.orderBy(desc(logAdmin.createdAt));

	const teguran = new Map<string, string | null>();
	const sudahDicek = new Set<string>();
	for (const l of log) {
		if (sudahDicek.has(l.targetId)) continue;
		sudahDicek.add(l.targetId);
		if (l.aksi === 'tegur_produk') teguran.set(l.targetId, l.alasan);
	}

	return {
		produk: daftar.map((p) => ({
			...p,
			noWa: normalWa(p.noWa),
			ditegur: teguran.has(p.id),
			teguranTerakhir: teguran.get(p.id) ?? null,
			alasanTolakHapus: susunAlasan(p)
		}))
	};
};

// ---------- helper ----------

function bacaForm(data: FormData) {
	return {
		id: data.get('id')?.toString() ?? '',
		alasan: data.get('alasan')?.toString().trim() ?? ''
	};
}

async function ambilProduk(id: string) {
	const [p] = await db.select({ id: produk.id, nama: produk.nama }).from(produk).where(eq(produk.id, id));
	return p ?? null;
}

async function keterkaitan(id: string) {
	const [aktif] = await db
		.select({ n: sql<number>`count(*)::int` })
		.from(pesananItem)
		.innerJoin(pesanan, eq(pesanan.id, pesananItem.pesananId))
		.where(and(eq(pesananItem.produkId, id), notInArray(pesanan.status, ['selesai', 'dibatalkan'])));
	const [total] = await db
		.select({ n: sql<number>`count(*)::int` })
		.from(pesananItem)
		.where(eq(pesananItem.produkId, id));
	const [nego] = await db
		.select({ n: sql<number>`count(*)::int` })
		.from(pengajuanHarga)
		.innerJoin(tawaranHarga, eq(tawaranHarga.pengajuanHargaId, pengajuanHarga.id))
		.where(eq(pengajuanHarga.produkId, id));
	return { pesananAktif: aktif.n, pernahDipesan: total.n > 0, adaNegosiasi: nego.n > 0 };
}

const tidakAda = () => fail(404, { ok: false, judul: 'Produk tidak ditemukan', pesan: 'Produk ini sudah tidak ada. Muat ulang halaman.' });
const tidakLengkap = () => fail(400, { ok: false, judul: 'Data tidak lengkap', pesan: 'Muat ulang halaman lalu coba lagi.' });

// ---------- actions ----------

export const actions: Actions = {
	sembunyikan: async ({ request, locals }) => {
		const admin = wajibAdmin(locals);
		const { id, alasan } = bacaForm(await request.formData());
		if (!id) return tidakLengkap();
		if (!alasan) return fail(400, { ok: false, judul: 'Alasan wajib diisi', pesan: 'Tulis alasan singkat sebelum menyembunyikan produk.' });
		const p = await ambilProduk(id);
		if (!p) return tidakAda();

		await db.update(produk).set({ aktif: false }).where(eq(produk.id, id));
		await catatAdmin({ adminId: admin.id, aksi: 'sembunyikan_produk', targetTipe: 'produk', targetId: id, targetNama: p.nama, alasan });
		return { ok: true, judul: 'Produk disembunyikan', pesan: `"${p.nama}" tidak lagi tampil di katalog.` };
	},

	tampilkan: async ({ request, locals }) => {
		const admin = wajibAdmin(locals);
		const { id } = bacaForm(await request.formData());
		if (!id) return tidakLengkap();
		const p = await ambilProduk(id);
		if (!p) return tidakAda();

		await db.update(produk).set({ aktif: true }).where(eq(produk.id, id));
		await catatAdmin({ adminId: admin.id, aksi: 'tampilkan_produk', targetTipe: 'produk', targetId: id, targetNama: p.nama });
		return { ok: true, judul: 'Produk ditampilkan', pesan: `"${p.nama}" tampil kembali di katalog.` };
	},

	hapus: async ({ request, locals }) => {
		const admin = wajibAdmin(locals);
		const { id, alasan } = bacaForm(await request.formData());
		if (!id) return tidakLengkap();
		if (!alasan) return fail(400, { ok: false, judul: 'Alasan wajib diisi', pesan: 'Tulis alasan singkat sebelum menghapus produk.' });
		const p = await ambilProduk(id);
		if (!p) return tidakAda();

		// Dicek ulang di server, jangan hanya percaya tampilan
		const tolak = susunAlasan(await keterkaitan(id));
		if (tolak) return fail(409, { ok: false, judul: 'Produk tidak bisa dihapus', pesan: tolak });

		try {
			await db.delete(produk).where(eq(produk.id, id));
		} catch {
			return fail(409, {
				ok: false,
				judul: 'Produk tidak bisa dihapus',
				pesan: 'Produk ini masih terhubung dengan data lain. Gunakan Sembunyikan untuk menariknya dari katalog.'
			});
		}

		await catatAdmin({ adminId: admin.id, aksi: 'hapus_produk', targetTipe: 'produk', targetId: id, targetNama: p.nama, alasan });
		return { ok: true, judul: 'Produk dihapus', pesan: `"${p.nama}" dihapus permanen.` };
	},

	tegur: async ({ request, locals }) => {
		const admin = wajibAdmin(locals);
		const { id, alasan } = bacaForm(await request.formData());
		if (!id) return tidakLengkap();
		if (!alasan) return fail(400, { ok: false, judul: 'Isi teguran wajib diisi', pesan: 'Tulis masalah produknya dulu.' });
		const p = await ambilProduk(id);
		if (!p) return tidakAda();

		await catatAdmin({ adminId: admin.id, aksi: 'tegur_produk', targetTipe: 'produk', targetId: id, targetNama: p.nama, alasan });
		return { ok: true, judul: 'Teguran tercatat', pesan: 'Lanjutkan kirim pesannya di WhatsApp yang terbuka.' };
	},

	diperbaiki: async ({ request, locals }) => {
		const admin = wajibAdmin(locals);
		const { id, alasan } = bacaForm(await request.formData());
		if (!id) return tidakLengkap();
		const p = await ambilProduk(id);
		if (!p) return tidakAda();

		await catatAdmin({ adminId: admin.id, aksi: 'selesai_tegur_produk', targetTipe: 'produk', targetId: id, targetNama: p.nama, alasan });
		return { ok: true, judul: 'Ditandai sudah diperbaiki', pesan: `Tanda teguran pada "${p.nama}" sudah dicabut.` };
	}
};