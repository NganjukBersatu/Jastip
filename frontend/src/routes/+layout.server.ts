import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { keranjangItem } from '$lib/server/db/schema';
import { eq, sum } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	let jumlahKeranjang = 0;

	if (locals.user?.role === 'pelanggan') {
		const [hasil] = await db
			.select({ total: sum(keranjangItem.jumlah) })
			.from(keranjangItem)
			.where(eq(keranjangItem.pelangganId, locals.user.id));
		jumlahKeranjang = Number(hasil?.total ?? 0);
	}

	return {
		user: locals.user, // null kalau belum login, atau data user kalau sudah
		jumlahKeranjang
	};
};