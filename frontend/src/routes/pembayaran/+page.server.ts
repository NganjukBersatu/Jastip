import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/publik/katalog');

	const items = await db
		.select()
		.from(keranjangItem)
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

		// NOTE: ini belum bikin baris resmi di tabel 'pesanan' (produk masih dummy,
		// belum ada produkId/jastiperId asli). Untuk sekarang cuma kosongkan keranjang
		// sebagai simulasi "checkout berhasil".
		await db.delete(keranjangItem).where(eq(keranjangItem.pelangganId, locals.user.id));

		throw redirect(303, '/pembayaran/selesai');
	}
};