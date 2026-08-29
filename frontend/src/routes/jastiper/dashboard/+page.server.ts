import { db } from '$lib/server/db';
import { jastiperProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [profil] = await db
		.select()
		.from(jastiperProfiles)
		.where(eq(jastiperProfiles.userId, locals.user!.id));

	// TODO: ganti dengan query beneran begitu tabel produk & pesanan sudah dibuat
	const statistik = {
		pesananBaru: 0,
		sedangDiproses: 0,
		selesaiBulanIni: 0,
		produkAktif: 0
	};

	return {
		profil,
		statistik,
		pesananTerbaru: [] as Array<{ id: string; nama: string; status: string }>
	};
};