import { db } from '$lib/server/db';
import { pesanan, jastiperProfiles, users } from '$lib/server/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) return { kelompokJastiper: [] };

	const idsRaw = url.searchParams.get('ids');
	const ids = idsRaw ? idsRaw.split(',').filter(Boolean) : [];
	if (ids.length === 0) return { kelompokJastiper: [] };

	const daftarPesanan = await db
		.select({
			id: pesanan.id,
			jastiperId: pesanan.jastiperId,
			totalHarga: pesanan.totalHarga,
			metodePembayaran: pesanan.metodePembayaran,
			namaJastiper: users.nama,
			noWa: jastiperProfiles.noWa
		})
		.from(pesanan)
		.innerJoin(users, eq(pesanan.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(pesanan.jastiperId, jastiperProfiles.userId))
		.where(and(inArray(pesanan.id, ids), eq(pesanan.pelangganId, locals.user.id)));

	const jastiperIdUnik = [...new Set(daftarPesanan.map((p) => p.jastiperId))];

	const kelompokJastiper = jastiperIdUnik.map((jastiperId) => {
		const itemKelompok = daftarPesanan.filter((p) => p.jastiperId === jastiperId);
		const metode = itemKelompok[0].metodePembayaran;

		return {
			jastiperId,
			namaJastiper: itemKelompok[0].namaJastiper,
			noWa: itemKelompok[0].noWa,
			total: itemKelompok.reduce((jumlah, p) => jumlah + p.totalHarga, 0),
			perluWa: metode === 'transfer_bank' || metode === 'e_wallet',
			pesananIds: itemKelompok.map((p) => p.id)
		};
	});

	return { kelompokJastiper };
};