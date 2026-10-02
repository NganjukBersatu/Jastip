import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { aduan, aduanPesan, users } from '$lib/server/db/schema';
import { STATUS_ADUAN, TIPE_TARGET } from '$lib/aduan';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const status = url.searchParams.get('status') ?? 'baru';
	const tipe = url.searchParams.get('tipe') ?? 'semua';

	const kondisi = [];
	if ((STATUS_ADUAN as readonly string[]).includes(status))
		kondisi.push(eq(aduan.status, status as (typeof STATUS_ADUAN)[number]));
	if ((TIPE_TARGET as readonly string[]).includes(tipe))
		kondisi.push(eq(aduan.targetTipe, tipe as (typeof TIPE_TARGET)[number]));

	const daftar = await db
		.select({
			id: aduan.id,
			targetTipe: aduan.targetTipe,
			targetNama: aduan.targetNama,
			kategori: aduan.kategori,
			status: aduan.status,
			createdAt: aduan.createdAt,
			pelaporNama: users.nama
		})
		.from(aduan)
		.innerJoin(users, eq(users.id, aduan.pelaporId))
		.where(kondisi.length ? and(...kondisi) : undefined)
		.orderBy(desc(aduan.createdAt))
		.limit(100);

	const belum = daftar.length
		? await db
				.select({ aduanId: aduanPesan.aduanId, n: sql<number>`count(*)::int` })
				.from(aduanPesan)
				.where(
					and(
						inArray(aduanPesan.aduanId, daftar.map((d) => d.id)),
						eq(aduanPesan.peran, 'pelapor'),
						eq(aduanPesan.dibaca, false)
					)
				)
				.groupBy(aduanPesan.aduanId)
		: [];
	const peta = new Map(belum.map((b) => [b.aduanId, b.n]));

	const hitung = await db
		.select({ status: aduan.status, n: sql<number>`count(*)::int` })
		.from(aduan)
		.groupBy(aduan.status);
	const jumlah: Record<string, number> = {};
	for (const h of hitung) jumlah[h.status] = h.n;

	return {
		status,
		tipe,
		jumlah,
		daftar: daftar.map((d) => ({ ...d, pesanBaru: peta.get(d.id) ?? 0 }))
	};
};