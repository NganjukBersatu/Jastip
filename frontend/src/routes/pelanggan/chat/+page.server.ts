import { db } from '$lib/server/db';
import { pengajuanHarga, produk, users, pesanChat } from '$lib/server/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const pelangganId = locals.user!.id;

	const daftarPercakapan = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			status: pengajuanHarga.status,
			createdAt: pengajuanHarga.createdAt,
			produkNama: produk.nama,
			jastiperNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.where(eq(pengajuanHarga.pelangganId, pelangganId))
		.orderBy(desc(pengajuanHarga.createdAt));

	if (daftarPercakapan.length === 0) {
		return { daftarPercakapan: [] };
	}

	// ambil semua pesan dari daftar percakapan di atas, urut TERBARU dulu --
	// lalu simpan cuma yang PERTAMA ditemukan per pengajuanHargaId.
	// karena urutannya sudah descending, "pertama ditemukan" = otomatis pesan paling baru.
	const semuaId = daftarPercakapan.map((p) => p.id);
	const semuaPesan = await db
		.select()
		.from(pesanChat)
		.where(inArray(pesanChat.pengajuanHargaId, semuaId))
		.orderBy(desc(pesanChat.createdAt));

	const pesanTerakhirPerId: Record<string, (typeof semuaPesan)[number]> = {};
	for (const pesan of semuaPesan) {
		if (!pesanTerakhirPerId[pesan.pengajuanHargaId]) {
			pesanTerakhirPerId[pesan.pengajuanHargaId] = pesan;
		}
	}

	const hasil = daftarPercakapan.map((p) => ({
		...p,
		pesanTerakhir: pesanTerakhirPerId[p.id] ?? null
	}));

	return { daftarPercakapan: hasil };
};