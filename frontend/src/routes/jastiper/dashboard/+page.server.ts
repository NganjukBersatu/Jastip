import { db } from '$lib/server/db';
import { jastiperProfiles, produk, jasa, pesanan, pesananItem } from '$lib/server/db/schema';
import { eq, and, gte, lt, desc, count, inArray } from 'drizzle-orm';
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

	const headerTerbaru = await db
		.select({
			id: pesanan.id,
			status: pesanan.status,
			createdAt: pesanan.createdAt
		})
		.from(pesanan)
		.where(eq(pesanan.jastiperId, jastiperId))
		.orderBy(desc(pesanan.createdAt))
		.limit(5);

	const idTerbaru = headerTerbaru.map((h) => h.id);

	const itemTerbaru = idTerbaru.length
		? await db
				.select({
					pesananId: pesananItem.pesananId,
					produkNama: produk.nama,
					jasaNama: jasa.nama
				})
				.from(pesananItem)
				.leftJoin(produk, eq(pesananItem.produkId, produk.id))
				.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
				.where(inArray(pesananItem.pesananId, idTerbaru))
		: [];

	const namaByPesanan: Record<string, string> = {};
	for (const it of itemTerbaru) {
		if (!namaByPesanan[it.pesananId]) {
			namaByPesanan[it.pesananId] = it.produkNama ?? it.jasaNama ?? 'Produk';
		}
	}

	const pesananTerbaru = headerTerbaru.map((h) => ({
		id: h.id,
		nama: namaByPesanan[h.id] ?? 'Produk',
		status: LABEL_STATUS[h.status] ?? h.status
	}));

	
	return {
		profil,
		statistik,
		pesananTerbaru
	};
};