import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, produk, jasa, users } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/jastiper/dashboard');

	const mentah = await db
		.select({
			id: pesanan.id,
			jumlah: pesanan.jumlah,
			hargaSatuan: pesanan.hargaSatuan,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			status: pesanan.status,
			alamatKirim: pesanan.alamatKirim,
			titikJemput: pesanan.titikJemput,
			jarakKm: pesanan.jarakKm,
			metodePembayaran: pesanan.metodePembayaran,
			pengajuanHargaId: pesanan.pengajuanHargaId,
			createdAt: pesanan.createdAt,
			produkNama: produk.nama,
			jasaNama: jasa.nama,
			jastiperNama: users.nama
		})
		.from(pesanan)
		.innerJoin(users, eq(pesanan.jastiperId, users.id))
		.leftJoin(produk, eq(pesanan.produkId, produk.id))
		.leftJoin(jasa, eq(pesanan.jasaId, jasa.id))
		.where(eq(pesanan.pelangganId, locals.user.id))
		.orderBy(desc(pesanan.createdAt));

	const daftarPesanan = mentah.map((p) => ({ ...p, namaItem: p.produkNama ?? p.jasaNama ?? 'Item' }));

	return { daftarPesanan };
};

export const actions: Actions = {
	batalkan: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID pesanan tidak ditemukan.' });

		// cuma boleh batalkan pesanan sendiri, dan cuma kalau masih menunggu konfirmasi
		// (kalau sudah mulai dibelanjakan/diantar, tidak bisa dibatalkan sepihak oleh pelanggan)
		const [row] = await db
			.select({ id: pesanan.id, status: pesanan.status })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.pelangganId, locals.user.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });
		if (row.status !== 'menunggu_konfirmasi') {
			return fail(400, { error: 'Pesanan ini sudah diproses, tidak bisa dibatalkan lagi.' });
		}

		await db
			.update(pesanan)
			.set({ status: 'dibatalkan', updatedAt: new Date() })
			.where(eq(pesanan.id, id));

		return { success: true };
	}
};