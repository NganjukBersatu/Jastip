import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk, pesanan } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/publik/katalog');

	const items = await db
		.select({
			id: keranjangItem.id,
			produkId: keranjangItem.produkId,
			jumlah: keranjangItem.jumlah,
			namaProduk: produk.nama,
			hargaSatuan: produk.harga
		})
		.from(keranjangItem)
		.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
		.where(eq(keranjangItem.pelangganId, locals.user.id));

	if (items.length === 0) throw redirect(303, '/keranjang');

	return { items };
};

export const actions: Actions = {
	bayar: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const alamat = data.get('alamat')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();

		if (!alamat) {
			return fail(400, { error: 'Alamat pengiriman wajib diisi.' });
		}
		if (!metodePembayaran) {
			return fail(400, { error: 'Pilih metode pembayaran dulu.' });
		}

		// Ambil item keranjang berikut harga & pemilik produk yang asli
		const items = await db
			.select({
				produkId: keranjangItem.produkId,
				jumlah: keranjangItem.jumlah,
				hargaSatuan: produk.harga,
				jastiperId: produk.jastiperId
			})
			.from(keranjangItem)
			.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
			.where(eq(keranjangItem.pelangganId, locals.user.id));

		if (items.length === 0) {
			return fail(400, { error: 'Keranjang kamu kosong.' });
		}

		// Bikin satu baris pesanan untuk tiap item — produkId & jastiperId sekarang
		// diambil langsung dari produk aslinya (bukan dummy/jastiper default lagi)
		for (const item of items) {
			const totalHarga = item.hargaSatuan * item.jumlah;

			await db.insert(pesanan).values({
				id: randomUUID(),
				produkId: item.produkId,
				pelangganId: locals.user.id,
				jastiperId: item.jastiperId,
				pengajuanHargaId: null,
				jumlah: item.jumlah,
				hargaSatuan: item.hargaSatuan,
				ongkir: 0,
				totalHarga,
				alamatKirim: alamat,
				metodePembayaran,
				status: 'menunggu_konfirmasi'
			});
		}

		await db.delete(keranjangItem).where(eq(keranjangItem.pelangganId, locals.user.id));

		throw redirect(303, '/pembayaran/selesai');
	}
};