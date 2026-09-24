import { db } from '$lib/server/db';
import { produk } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const daftarProduk = await db
		.select()
		.from(produk)
		.where(eq(produk.jastiperId, locals.user!.id))
		.orderBy(desc(produk.createdAt));

	return { daftarProduk };
};

export const actions: Actions = {
	// Menonaktifkan produk (bukan hapus permanen), supaya riwayat pesanan lama tetap aman
	hapus: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'ID produk tidak valid' });
		}

		const [produkTarget] = await db
			.select()
			.from(produk)
			.where(and(eq(produk.id, id), eq(produk.jastiperId, locals.user!.id)))
			.limit(1);

		if (!produkTarget) {
			return fail(404, { error: 'Produk tidak ditemukan' });
		}

		await db
			.update(produk)
			.set({ aktif: false })
			.where(and(eq(produk.id, id), eq(produk.jastiperId, locals.user!.id)));

		return { success: true };
	},

	// Baru: mengaktifkan kembali produk yang sebelumnya dinonaktifkan
	aktifkan: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'ID produk tidak valid' });
		}

		const [produkTarget] = await db
			.select()
			.from(produk)
			.where(and(eq(produk.id, id), eq(produk.jastiperId, locals.user!.id)))
			.limit(1);

		if (!produkTarget) {
			return fail(404, { error: 'Produk tidak ditemukan' });
		}

		await db
			.update(produk)
			.set({ aktif: true })
			.where(and(eq(produk.id, id), eq(produk.jastiperId, locals.user!.id)));

		return { success: true };
	}
};