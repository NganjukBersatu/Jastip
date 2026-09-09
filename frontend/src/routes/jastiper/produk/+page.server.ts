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
	hapus: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { error: 'ID produk tidak valid' });
		}

		// Pastikan produk milik user yang sedang login
		const [produkYangDihapus] = await db
			.select()
			.from(produk)
			.where(
				and(
					eq(produk.id, id),                    // ← tanpa Number()
					eq(produk.jastiperId, locals.user!.id)
				)
			)
			.limit(1);

		if (!produkYangDihapus) {
			return fail(404, { error: 'Produk tidak ditemukan' });
		}

		// Hapus produk
		await db
			.delete(produk)
			.where(
				and(
					eq(produk.id, id),                    // ← tanpa Number()
					eq(produk.jastiperId, locals.user!.id)
				)
			);

		return { success: true };
	}
};