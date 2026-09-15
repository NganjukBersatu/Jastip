import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, pesananItem, produk, jasa } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw error(401);

	const [data] = await db
		.select({
			id: pesanan.id,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			metodePembayaran: pesanan.metodePembayaran,
			pembayaranDikonfirmasi: pesanan.pembayaranDikonfirmasi,
			dibayarPada: pesanan.dibayarPada,
			createdAt: pesanan.createdAt,
			pelangganId: pesanan.pelangganId,
			jastiperId: pesanan.jastiperId
		})
		.from(pesanan)
		.where(eq(pesanan.id, params.id));

	if (!data) throw error(404, 'Pesanan tidak ditemukan.');
	if (data.pelangganId !== locals.user.id && data.jastiperId !== locals.user.id) {
		throw error(403);
	}

	// BARU: ambil semua item di dalam transaksi ini (dulu cuma 1 produk per pesanan)
	const itemMentah = await db
		.select({
			id: pesananItem.id,
			jumlah: pesananItem.jumlah,
			hargaSatuan: pesananItem.hargaSatuan,
			produkNama: produk.nama,
			jasaNama: jasa.nama
		})
		.from(pesananItem)
		.leftJoin(produk, eq(pesananItem.produkId, produk.id))
		.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
		.where(eq(pesananItem.pesananId, params.id));

	const items = itemMentah.map((it) => ({
		...it,
		nama: it.produkNama ?? it.jasaNama ?? 'Item'
	}));

	return { pesanan: data, items };
};