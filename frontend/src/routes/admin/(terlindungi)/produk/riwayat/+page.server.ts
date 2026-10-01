import { and, desc, eq, gte, ilike, lt, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { logAdmin, users, produk } from '$lib/server/db/schema';
import { wajibAdmin } from '$lib/server/admin';
import type { PageServerLoad } from './$types';

const JENIS_VALID = [
	'hapus_produk',
	'sembunyikan_produk',
	'tampilkan_produk',
	'tegur_produk',
	'selesai_tegur_produk'
];

// "YYYY-MM" untuk saat ini, dalam WIB (UTC+7)
function bulanSekarang() {
	const w = new Date(Date.now() + 7 * 3600 * 1000);
	return `${w.getUTCFullYear()}-${String(w.getUTCMonth() + 1).padStart(2, '0')}`;
}

// Awal dan akhir bulan dalam WIB
function rentang(bulan: string) {
	const [y, m] = bulan.split('-').map(Number);
	return {
		awal: new Date(Date.UTC(y, m - 1, 1, -7)),
		akhir: new Date(Date.UTC(y, m, 1, -7))
	};
}

export const load: PageServerLoad = async ({ locals, url }) => {
	wajibAdmin(locals);

	const bulanParam = url.searchParams.get('bulan') ?? '';
	const bulan = /^\d{4}-(0[1-9]|1[0-2])$/.test(bulanParam) ? bulanParam : bulanSekarang();
	const jenisParam = url.searchParams.get('jenis') ?? '';
	const jenis = JENIS_VALID.includes(jenisParam) ? jenisParam : '';
	const q = (url.searchParams.get('q') ?? '').trim();
	const { awal, akhir } = rentang(bulan);

	const dasar = and(
		eq(logAdmin.targetTipe, 'produk'),
		gte(logAdmin.createdAt, awal),
		lt(logAdmin.createdAt, akhir)
	);

	// Ringkasan: jumlah per jenis aksi pada bulan ini
	const hitung = await db
		.select({ aksi: logAdmin.aksi, jumlah: sql<number>`count(*)::int` })
		.from(logAdmin)
		.where(dasar)
		.groupBy(logAdmin.aksi);
	const ringkasan: Record<string, number> = {};
	let total = 0;
	for (const h of hitung) {
		ringkasan[h.aksi] = h.jumlah;
		total += h.jumlah;
	}

	// Daftar bulan untuk dropdown: yang punya data + bulan ini + bulan terpilih
	const bln = await db
		.selectDistinct({
			b: sql<string>`to_char(${logAdmin.createdAt} at time zone 'Asia/Jakarta', 'YYYY-MM')`
		})
		.from(logAdmin)
		.where(eq(logAdmin.targetTipe, 'produk'));
	const bulanList = [...new Set([...bln.map((x) => x.b), bulanSekarang(), bulan])].sort().reverse();

	// Daftar kejadian (dengan filter jenis dan kata kunci)
	const kataKunci = q.replace(/[%_\\]/g, '\\$&');
	const kondisi = and(
		dasar,
		jenis ? eq(logAdmin.aksi, jenis) : undefined,
		q
			? or(ilike(logAdmin.targetNama, `%${kataKunci}%`), ilike(logAdmin.alasan, `%${kataKunci}%`))
			: undefined
	);

	const baris = await db
		.select({
			id: logAdmin.id,
			aksi: logAdmin.aksi,
			alasan: logAdmin.alasan,
			createdAt: logAdmin.createdAt,
			namaTercatat: logAdmin.targetNama,
			namaSekarang: produk.nama,
			adminNama: users.nama
		})
		.from(logAdmin)
		.leftJoin(users, eq(users.id, logAdmin.adminId))
		.leftJoin(produk, eq(produk.id, logAdmin.targetId))
		.where(kondisi)
		.orderBy(desc(logAdmin.createdAt))
		.limit(300);

	return {
		bulan,
		jenis,
		q,
		bulanList,
		ringkasan,
		total,
		rows: baris.map((r) => ({
			id: r.id,
			aksi: r.aksi,
			alasan: r.alasan,
			createdAt: r.createdAt,
			namaProduk: r.namaTercatat ?? r.namaSekarang ?? null,
			adminNama: r.adminNama ?? '-'
		}))
	};
};