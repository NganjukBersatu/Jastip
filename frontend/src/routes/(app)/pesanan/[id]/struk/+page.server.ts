import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, produk, users } from '$lib/server/db/schema';
import { eq, and, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw error(401);

	const [data] = await db
		.select({
			id: pesanan.id,
			jumlah: pesanan.jumlah,
			hargaSatuan: pesanan.hargaSatuan,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			metodePembayaran: pesanan.metodePembayaran,
			pembayaranDikonfirmasi: pesanan.pembayaranDikonfirmasi,
			dibayarPada: pesanan.dibayarPada,
			createdAt: pesanan.createdAt,
			produkNama: produk.nama,
			pelangganId: pesanan.pelangganId,
			jastiperId: pesanan.jastiperId
		})
		.from(pesanan)
		.innerJoin(produk, eq(pesanan.produkId, produk.id))
		.where(eq(pesanan.id, params.id));

	if (!data) throw error(404, 'Pesanan tidak ditemukan.');
	if (data.pelangganId !== locals.user.id && data.jastiperId !== locals.user.id) {
		throw error(403);
	}

	return { pesanan: data };
};