import { db } from '$lib/server/db';
import { jastiperProfiles, produk, pesanan } from '$lib/server/db/schema';
import { eq, and, gte, lt, desc, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const LABEL_STATUS: Record<string, string> = {
	menunggu_konfirmasi: 'Menunggu konfirmasi',
	dibelanjakan: 'Sedang dibelanjakan',
	dikirim: 'Dikirim',
	selesai: 'Selesai',
	dibatalkan: 'Dibatalkan'
};

export const load: PageServerLoad = async ({ locals }) => {
	const jastiperId = locals.user!.id;

	const [profil] = await db
		.select()
		.from(jastiperProfiles)
		.where(eq(jastiperProfiles.userId, jastiperId));

	// Batas bulan berjalan, dipakai buat hitung "selesai bulan ini"
	const sekarang = new Date();
	const awalBulan = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
	const awalBulanDepan = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 1);

	const [{ value: pesananBaru }] = await db
		.select({ value: count() })
		.from(pesanan)
		.where(and(eq(pesanan.jastiperId, jastiperId), eq(pesanan.status, 'menunggu_konfirmasi')));

	const sedangDiprosesRows = await db
		.select({ value: count() })
		.from(pesanan)
		.where(
			and(
				eq(pesanan.jastiperId, jastiperId),
				// gabungan dibelanjakan + dikirim = masih "diproses"
				and(eq(pesanan.status, 'dibelanjakan'))
			)
		);
	const [{ value: sedangDibelanjakan }] = sedangDiprosesRows;

	const [{ value: sedangDikirim }] = await db
		.select({ value: count() })
		.from(pesanan)
		.where(and(eq(pesanan.jastiperId, jastiperId), eq(pesanan.status, 'dikirim')));

	const [{ value: selesaiBulanIni }] = await db
		.select({ value: count() })
		.from(pesanan)
		.where(
			and(
				eq(pesanan.jastiperId, jastiperId),
				eq(pesanan.status, 'selesai'),
				gte(pesanan.updatedAt, awalBulan),
				lt(pesanan.updatedAt, awalBulanDepan)
			)
		);

	const [{ value: produkAktif }] = await db
		.select({ value: count() })
		.from(produk)
		.where(and(eq(produk.jastiperId, jastiperId), eq(produk.aktif, true)));

	const statistik = {
		pesananBaru,
		sedangDiproses: sedangDibelanjakan + sedangDikirim,
		selesaiBulanIni,
		produkAktif
	};

	const pesananTerbaruRaw = await db
		.select({
			id: pesanan.id,
			status: pesanan.status,
			createdAt: pesanan.createdAt,
			produkNama: produk.nama
		})
		.from(pesanan)
		.leftJoin(produk, eq(pesanan.produkId, produk.id))
		.where(eq(pesanan.jastiperId, jastiperId))
		.orderBy(desc(pesanan.createdAt))
		.limit(5);

	const pesananTerbaru = pesananTerbaruRaw.map((p) => ({
		id: p.id,
		nama: p.produkNama ?? 'Produk',
		status: LABEL_STATUS[p.status] ?? p.status
	}));

	return {
		profil,
		statistik,
		pesananTerbaru
	};
};