import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa, pesanan, pesananItem, produk, users } from '$lib/server/db/schema';
import { and, count, desc, eq, ilike, inArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { PageServerLoad } from './$types';

const PER_HALAMAN = 20;
const STATUS_AKTIF = ['menunggu_konfirmasi', 'dibelanjakan', 'dikirim'] as const;
const FILTER_VALID = ['semua', 'aktif', 'selesai', 'dibatalkan'] as const;
type Filter = (typeof FILTER_VALID)[number];

function kondisiFilter(f: Filter) {
	if (f === 'aktif') return inArray(pesanan.status, [...STATUS_AKTIF]);
	if (f === 'selesai') return eq(pesanan.status, 'selesai');
	if (f === 'dibatalkan') return eq(pesanan.status, 'dibatalkan');
	return undefined;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	// Pengaman tambahan: jangan hanya mengandalkan layout
	if (locals.user?.role !== 'admin') throw error(403, 'Halaman ini hanya untuk admin.');

	const filterParam = url.searchParams.get('filter') ?? 'semua';
	const filter: Filter = (FILTER_VALID as readonly string[]).includes(filterParam)
		? (filterParam as Filter)
		: 'semua';
	const q = url.searchParams.get('q')?.trim() ?? '';
	const halaman = Math.max(1, parseInt(url.searchParams.get('halaman') ?? '1', 10) || 1);

	const pembeliU = alias(users, 'pembeli_u');
	const jastiperU = alias(users, 'jastiper_u');

	const kondisi = [];
	const kf = kondisiFilter(filter);
	if (kf) kondisi.push(kf);
	if (q) {
		const pola = `%${q.replace(/[%_\\]/g, (m) => '\\' + m)}%`;
		kondisi.push(
			or(ilike(pesanan.id, pola), ilike(pembeliU.nama, pola), ilike(jastiperU.nama, pola))
		);
	}
	const where = kondisi.length ? and(...kondisi) : undefined;

	const [total] = await db
		.select({ n: count() })
		.from(pesanan)
		.innerJoin(pembeliU, eq(pesanan.pelangganId, pembeliU.id))
		.innerJoin(jastiperU, eq(pesanan.jastiperId, jastiperU.id))
		.where(where);

	const baris = await db
		.select({
			id: pesanan.id,
			status: pesanan.status,
			totalHarga: pesanan.totalHarga,
			createdAt: pesanan.createdAt,
			pembeliNama: pembeliU.nama,
			jastiperNama: jastiperU.nama
		})
		.from(pesanan)
		.innerJoin(pembeliU, eq(pesanan.pelangganId, pembeliU.id))
		.innerJoin(jastiperU, eq(pesanan.jastiperId, jastiperU.id))
		.where(where)
		.orderBy(desc(pesanan.createdAt))
		.limit(PER_HALAMAN)
		.offset((halaman - 1) * PER_HALAMAN);

	// Nama item untuk pesanan di halaman ini
	const ids = baris.map((b) => b.id);
	const items = ids.length
		? await db
				.select({ pesananId: pesananItem.pesananId, produkNama: produk.nama, jasaNama: jasa.nama })
				.from(pesananItem)
				.leftJoin(produk, eq(pesananItem.produkId, produk.id))
				.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
				.where(inArray(pesananItem.pesananId, ids))
		: [];

	const daftar = baris.map((b) => {
		const milik = items.filter((i) => i.pesananId === b.id);
		const nama = milik[0] ? (milik[0].produkNama ?? milik[0].jasaNama ?? 'Item') : 'Item';
		return { ...b, namaItem: milik.length > 1 ? `${nama} & ${milik.length - 1} lainnya` : nama };
	});

	// Angka di chip (total per kategori, tidak terpengaruh pencarian)
	const perStatus = await db
		.select({ status: pesanan.status, n: count() })
		.from(pesanan)
		.groupBy(pesanan.status);
	const jml = (s: string) => Number(perStatus.find((r) => r.status === s)?.n ?? 0);
	const hitung = {
		semua: perStatus.reduce((t, r) => t + Number(r.n), 0),
		aktif: STATUS_AKTIF.reduce((t, s) => t + jml(s), 0),
		selesai: jml('selesai'),
		dibatalkan: jml('dibatalkan')
	};

	const totalBaris = Number(total?.n ?? 0);
	return {
		daftar,
		filter,
		q,
		halaman,
		totalBaris,
		totalHalaman: Math.max(1, Math.ceil(totalBaris / PER_HALAMAN)),
		hitung
	};
};