import { db } from '$lib/server/db';
import { produk, users, jastiperProfiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Kalau user sudah login, jangan tampilin landing page lagi
	if (locals.user) {
		if (locals.user.role === 'pelanggan') {
			throw redirect(303, '/publik/katalog');
		}
		if (locals.user.role === 'jastiper') {
			throw redirect(303, '/jastiper/dashboard');
		}
	}

	// Kalau belum login, tampilkan landing page seperti biasa
	const produkPilihan = await db
		.select({
			id: produk.id,
			nama: produk.nama,
			harga: produk.harga,
			hargaTipe: produk.hargaTipe,
			gambarUrl: produk.gambarUrl,
			area: jastiperProfiles.area
		})
		.from(produk)
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(produk.jastiperId, jastiperProfiles.userId))
		.where(eq(produk.aktif, true))
		.orderBy(desc(produk.id))
		.limit(6);

	return { produkPilihan };
};