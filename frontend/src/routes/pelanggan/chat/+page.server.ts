import { db } from '$lib/server/db';
import { pengajuanHarga, produk, jasa, users, pesanChat } from '$lib/server/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const pelangganId = locals.user!.id;

	const mentah = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			status: pengajuanHarga.status,
			createdAt: pengajuanHarga.createdAt,
			produkNama: produk.nama,
			jasaNama: jasa.nama,
			jastiperNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.jastiperId, users.id))
		.leftJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.leftJoin(jasa, eq(pengajuanHarga.jasaId, jasa.id))
		.where(eq(pengajuanHarga.pelangganId, pelangganId))
		.orderBy(desc(pengajuanHarga.createdAt));

	const daftarPercakapan = mentah.map((p) => ({ ...p, namaItem: p.produkNama ?? p.jasaNama ?? 'Item' }));

	if (daftarPercakapan.length === 0) {
		return { daftarPercakapan: [] };
	}

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