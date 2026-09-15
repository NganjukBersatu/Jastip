import { db } from '$lib/server/db';
import { pesanan, pesananItem, produk, jasa } from '$lib/server/db/schema';
import { eq, and, gte, lt, desc, sql, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const UKURAN_HALAMAN = 10;

function hitungRentang(
	periode: string,
	sekarang: Date,
	dariParam: string | null,
	sampaiParam: string | null
) {
	const awalHari = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());
	const besok = new Date(awalHari);
	besok.setDate(besok.getDate() + 1);

	if (periode === 'minggu-ini') {
		const hari = sekarang.getDay();
		const offsetKeSenin = hari === 0 ? 6 : hari - 1;
		const awal = new Date(awalHari);
		awal.setDate(awal.getDate() - offsetKeSenin);
		return { awal, akhir: besok };
	}

	if (periode === 'bulan-ini') {
		const awal = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
		return { awal, akhir: besok };
	}

	if (periode === 'bulan-lalu') {
		const awal = new Date(sekarang.getFullYear(), sekarang.getMonth() - 1, 1);
		const akhir = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
		return { awal, akhir };
	}

	if (periode === 'kustom' && dariParam) {
		const awal = new Date(dariParam);
		const akhirDasar = sampaiParam ? new Date(sampaiParam) : sekarang;
		const akhir = new Date(
			akhirDasar.getFullYear(),
			akhirDasar.getMonth(),
			akhirDasar.getDate() + 1
		);
		return { awal, akhir };
	}

	// default: hari ini
	return { awal: awalHari, akhir: besok };
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const jastiperId = locals.user!.id;
	const sekarang = new Date();

	const periode = url.searchParams.get('periode') ?? 'bulan-ini';
	const dariParam = url.searchParams.get('dari');
	const sampaiParam = url.searchParams.get('sampai');
	const halaman = Math.max(1, Number(url.searchParams.get('halaman') ?? '1') || 1);

	const { awal: awalHari, akhir: akhirHari } = hitungRentang('hari-ini', sekarang, null, null);
	const { awal: awalMinggu } = hitungRentang('minggu-ini', sekarang, null, null);
	const { awal: awalBulan } = hitungRentang('bulan-ini', sekarang, null, null);
	const { awal: awalPeriode, akhir: akhirPeriode } = hitungRentang(
		periode,
		sekarang,
		dariParam,
		sampaiParam
	);

	async function hitungPendapatan(sejak: Date, sampai: Date) {
		const [baris] = await db
			.select({ total: sql<number>`coalesce(sum(${pesanan.totalHarga}), 0)` })
			.from(pesanan)
			.where(
				and(
					eq(pesanan.jastiperId, jastiperId),
					eq(pesanan.status, 'selesai'),
					gte(pesanan.createdAt, sejak),
					lt(pesanan.createdAt, sampai)
				)
			);
		return Number(baris?.total ?? 0);
	}

	const [pendapatanHarian, pendapatanMingguan, pendapatanBulanan, pendapatanPeriode] =
		await Promise.all([
			hitungPendapatan(awalHari, akhirHari),
			hitungPendapatan(awalMinggu, akhirHari),
			hitungPendapatan(awalBulan, akhirHari),
			hitungPendapatan(awalPeriode, akhirPeriode)
		]);

	// Produk/jasa terlaris — mengikuti periode yang dipilih
	const produkTerlarisMentah = await db
		.select({
			produkId: pesananItem.produkId,
			jasaId: pesananItem.jasaId,
			namaProduk: produk.nama,
			namaJasa: jasa.nama,
			totalTerjual: sql<number>`coalesce(sum(${pesananItem.jumlah}), 0)`,
			totalPendapatan: sql<number>`coalesce(sum(${pesananItem.hargaSatuan} * ${pesananItem.jumlah}), 0)`
		})
		.from(pesananItem)
		.innerJoin(pesanan, eq(pesananItem.pesananId, pesanan.id))
		.leftJoin(produk, eq(pesananItem.produkId, produk.id))
		.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
		.where(
			and(
				eq(pesanan.jastiperId, jastiperId),
				eq(pesanan.status, 'selesai'),
				gte(pesanan.createdAt, awalPeriode),
				lt(pesanan.createdAt, akhirPeriode)
			)
		)
		.groupBy(pesananItem.produkId, pesananItem.jasaId, produk.nama, jasa.nama)
		.orderBy(desc(sql`coalesce(sum(${pesananItem.jumlah}), 0)`))
		.limit(5);

	const produkTerlaris = produkTerlarisMentah.map((p) => ({
		...p,
		nama: p.namaProduk ?? p.namaJasa ?? 'Produk/jasa sudah dihapus'
	}));

	// Riwayat pesanan — mengikuti periode + dipaginasi
	const filterRiwayat = and(
		eq(pesanan.jastiperId, jastiperId),
		gte(pesanan.createdAt, awalPeriode),
		lt(pesanan.createdAt, akhirPeriode)
	);

	const [{ total: totalRiwayat }] = await db
		.select({ total: sql<number>`count(*)` })
		.from(pesanan)
		.where(filterRiwayat);

	const headerRiwayat = await db
		.select({
			id: pesanan.id,
			totalHarga: pesanan.totalHarga,
			status: pesanan.status,
			metodePembayaran: pesanan.metodePembayaran,
			createdAt: pesanan.createdAt
		})
		.from(pesanan)
		.where(filterRiwayat)
		.orderBy(desc(pesanan.createdAt))
		.limit(UKURAN_HALAMAN)
		.offset((halaman - 1) * UKURAN_HALAMAN);

	// BARU: ambil item untuk halaman riwayat ini saja, lalu gabungkan jadi
	// ringkasan nama + total pcs per transaksi
	const idHalamanIni = headerRiwayat.map((h) => h.id);

	const itemRiwayat = idHalamanIni.length
		? await db
				.select({
					pesananId: pesananItem.pesananId,
					jumlah: pesananItem.jumlah,
					produkNama: produk.nama,
					jasaNama: jasa.nama
				})
				.from(pesananItem)
				.leftJoin(produk, eq(pesananItem.produkId, produk.id))
				.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
				.where(inArray(pesananItem.pesananId, idHalamanIni))
		: [];

	const itemByPesanan: Record<string, typeof itemRiwayat> = {};
	for (const it of itemRiwayat) {
		(itemByPesanan[it.pesananId] ??= []).push(it);
	}

	const riwayatPesanan = headerRiwayat.map((h) => {
		const items = itemByPesanan[h.id] ?? [];
		const namaPertama = items[0]?.produkNama ?? items[0]?.jasaNama ?? 'Item';
		const nama = items.length > 1 ? `${namaPertama} & ${items.length - 1} lainnya` : namaPertama;
		const jumlah = items.reduce((s, it) => s + it.jumlah, 0);
		return { ...h, nama, jumlah };
	});
	
	const rentangAkhirTampil = new Date(akhirPeriode);
	rentangAkhirTampil.setDate(rentangAkhirTampil.getDate() - 1);

	return {
		pendapatanHarian,
		pendapatanMingguan,
		pendapatanBulanan,
		pendapatanPeriode,
		produkTerlaris,
		riwayatPesanan,
		periode,
		dari: dariParam,
		sampai: sampaiParam,
		halaman,
		totalHalaman: Math.max(1, Math.ceil(Number(totalRiwayat) / UKURAN_HALAMAN)),
		rentangAwal: awalPeriode.toISOString(),
		rentangAkhir: rentangAkhirTampil.toISOString()
	};
};