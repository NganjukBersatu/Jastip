import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk } from '$lib/server/db/schema';
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

		const items = await db
			.select()
			.from(keranjangItem)
			.where(eq(keranjangItem.pelangganId, locals.user.id));

		if (items.length === 0) {
			return fail(400, { error: 'Keranjang kamu kosong.' });
		}

		// Sementara: pakai akun jastiper pertama yang terdaftar (mis. Nia) sebagai jastiperId,
		// karena produk masih dummy dan belum terikat ke jastiper aslinya masing-masing.
		const [jastiperDefault] = await db
			.select()
			.from(users)
			.where(eq(users.role, 'jastiper'));

		if (!jastiperDefault) {
			return fail(500, { error: 'Belum ada akun jastiper terdaftar di sistem.' });
		}

		// Bikin satu baris pesanan untuk tiap item di keranjang
		for (const item of items) {
			const totalHarga = item.hargaSatuan * item.jumlah;

			await db.insert(pesanan).values({
				id: randomUUID(),
				produkId: null, // produk masih dummy, belum ada produkId asli
				pelangganId: locals.user.id,
				jastiperId: jastiperDefault.id,
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

		// Kosongkan keranjang setelah pesanan dibuat
		await db.delete(keranjangItem).where(eq(keranjangItem.pelangganId, locals.user.id));

		throw redirect(303, '/pembayaran/selesai');
	}
};