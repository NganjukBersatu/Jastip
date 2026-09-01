import { db } from '$lib/server/db';
import { produk, users, jastiperProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
		.limit(3);

	return { produkPilihan };
};