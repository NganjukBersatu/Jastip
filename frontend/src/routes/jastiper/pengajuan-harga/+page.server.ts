import { db } from '$lib/server/db';
import { pengajuanHarga, produk, users } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const daftarPengajuan = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			jumlah: pengajuanHarga.jumlah,
			catatan: pengajuanHarga.catatan,
			createdAt: pengajuanHarga.createdAt,
			produkNama: produk.nama,
			pelangganNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.innerJoin(users, eq(pengajuanHarga.pelangganId, users.id))
		.where(and(eq(produk.jastiperId, locals.user!.id), eq(pengajuanHarga.status, 'menunggu')))
		.orderBy(desc(pengajuanHarga.createdAt));

	return { daftarPengajuan };
};