import { db } from '$lib/server/db';
import { verifikasiJastiper, users, jastiperProfiles } from '$lib/server/db/schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const DAFTAR_STATUS = ['menunggu', 'disetujui', 'ditolak'] as const;
type Status = (typeof DAFTAR_STATUS)[number];

export const load: PageServerLoad = async ({ url }) => {
	const param = url.searchParams.get('status');
	const status: Status = DAFTAR_STATUS.includes(param as Status) ? (param as Status) : 'menunggu';
	const q = url.searchParams.get('q')?.trim() ?? '';

	const kondisi = [eq(verifikasiJastiper.status, status)];
	if (q) {
		kondisi.push(or(ilike(users.nama, `%${q}%`), ilike(users.email, `%${q}%`))!);
	}

	const daftar = await db
		.select({
			id: verifikasiJastiper.id,
			status: verifikasiJastiper.status,
			createdAt: verifikasiJastiper.createdAt,
			nama: users.nama,
			email: users.email,
			noWa: jastiperProfiles.noWa
		})
		.from(verifikasiJastiper)
		.innerJoin(users, eq(verifikasiJastiper.userId, users.id))
		.leftJoin(jastiperProfiles, eq(jastiperProfiles.userId, users.id))
		.where(and(...kondisi))
		.orderBy(desc(verifikasiJastiper.createdAt));

	const hitungan = await db
		.select({
			status: verifikasiJastiper.status,
			jumlah: sql<number>`count(*)::int`
		})
		.from(verifikasiJastiper)
		.groupBy(verifikasiJastiper.status);

	const ringkasan = { menunggu: 0, disetujui: 0, ditolak: 0 };
	for (const h of hitungan) ringkasan[h.status] = h.jumlah;

	return { daftar, ringkasan, status, q };
};