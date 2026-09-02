import { db } from '$lib/server/db';
import { produk, users, jastiperProfiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Landing page sekarang tampil untuk semua role, termasuk jastiper.
	// (redirect otomatis ke /jastiper/dashboard dihapus)

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