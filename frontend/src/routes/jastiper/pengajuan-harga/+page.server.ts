import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pengajuanHarga, produk, users, pesanan, ongkirWilayah } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

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

async function ubahStatus(id: string, jastiperId: string, statusBaru: 'diterima' | 'ditolak') {
	const [row] = await db
		.select({ id: pengajuanHarga.id })
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.where(and(eq(pengajuanHarga.id, id), eq(produk.jastiperId, jastiperId)));

	if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

	await db.update(pengajuanHarga).set({ status: statusBaru }).where(eq(pengajuanHarga.id, id));
}

export const actions: Actions = {
	terima: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });

		const jastiperId = locals.user!.id;

		const [row] = await db
			.select({
				id: pengajuanHarga.id,
				produkId: pengajuanHarga.produkId,
				pelangganId: pengajuanHarga.pelangganId,
				hargaDiajukan: pengajuanHarga.hargaDiajukan,
				jumlah: pengajuanHarga.jumlah,
				wilayahId: pengajuanHarga.wilayahId
			})
			.from(pengajuanHarga)
			.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
			.where(and(eq(pengajuanHarga.id, id), eq(produk.jastiperId, jastiperId)));

		if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

		if (!row.wilayahId) {
			return fail(400, {
				error: 'Pelanggan belum pilih wilayah pengiriman. Minta dia pilih dulu sebelum kamu terima.'
			});
		}

		const [wilayah] = await db
			.select({ biaya: ongkirWilayah.biaya })
			.from(ongkirWilayah)
			.where(eq(ongkirWilayah.id, row.wilayahId));

		const ongkirBiaya = wilayah?.biaya ?? 0;

		await db.update(pengajuanHarga).set({ status: 'diterima' }).where(eq(pengajuanHarga.id, id));

		await db.insert(pesanan).values({
			id: randomUUID(),
			produkId: row.produkId,
			pelangganId: row.pelangganId,
			jastiperId,
			pengajuanHargaId: row.id,
			jumlah: row.jumlah,
			hargaSatuan: row.hargaDiajukan,
			ongkir: ongkirBiaya,
			totalHarga: row.hargaDiajukan * row.jumlah + ongkirBiaya,
			status: 'menunggu_konfirmasi'
		});

		return { success: true };
	},
	tolak: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatus(id, locals.user!.id, 'ditolak');
	}
};