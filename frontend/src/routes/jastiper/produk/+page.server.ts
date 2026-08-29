import { db } from '$lib/server/db';
import { produk } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const daftarProduk = await db
		.select()
		.from(produk)
		.where(eq(produk.jastiperId, locals.user!.id))
		.orderBy(desc(produk.createdAt));

	return { daftarProduk };
};