import { db } from '$lib/server/db';
import { pesanan, produk, jasa } from '$lib/server/db/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const jastiperId = locals.user!.id;
	const sekarang = new Date();

	// Batas waktu untuk tiap periode
	const awalHari = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());

	const hariIni = sekarang.getDay(); // 0 = Minggu, 1 = Senin, dst.
	const offsetKeSenin = hariIni === 0 ? 6 : hariIni - 1;
	const awalMinggu = new Date(awalHari);
	awalMinggu.setDate(awalMinggu.getDate() - offsetKeSenin);

	const awalBulan = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);

	async function hitungPendapatan(sejak: Date) {
		const [baris] = await db
			.select({ total: sql<number>`coalesce(sum(${pesanan.totalHarga}), 0)` })
			.from(pesanan)
			.where(
				and(
					eq(pesanan.jastiperId, jastiperId),
					eq(pesanan.status, 'selesai'),
					gte(pesanan.createdAt, sejak)
				)
			);
		return Number(baris?.total ?? 0);
	}

	const [pendapatanHarian, pendapatanMingguan, pendapatanBulanan] = await Promise.all([
		hitungPendapatan(awalHari),
		hitungPendapatan(awalMinggu),
		hitungPendapatan(awalBulan)
	]);

	// Produk/jasa paling laku — hanya dari pesanan yang sudah selesai
	const produkTerlarisMentah = await db
		.select({
			produkId: pesanan.produkId,
			jasaId: pesanan.jasaId,
			namaProduk: produk.nama,
			namaJasa: jasa.nama,
			totalTerjual: sql<number>`coalesce(sum(${pesanan.jumlah}), 0)`,
			totalPendapatan: sql<number>`coalesce(sum(${pesanan.totalHarga}), 0)`
		})
		.from(pesanan)
		.leftJoin(produk, eq(pesanan.produkId, produk.id))
		.leftJoin(jasa, eq(pesanan.jasaId, jasa.id))
		.where(and(eq(pesanan.jastiperId, jastiperId), eq(pesanan.status, 'selesai')))
		.groupBy(pesanan.produkId, pesanan.jasaId, produk.nama, jasa.nama)
		.orderBy(desc(sql`coalesce(sum(${pesanan.jumlah}), 0)`))
		.limit(5);

	const produkTerlaris = produkTerlarisMentah.map((p) => ({
		...p,
		nama: p.namaProduk ?? p.namaJasa ?? 'Produk/jasa sudah dihapus'
	}));

	// Riwayat pesanan — SEMUA status termasuk dibatalkan, tidak masuk hitungan pendapatan
	const riwayatMentah = await db
		.select({
			id: pesanan.id,
			namaProduk: produk.nama,
			namaJasa: jasa.nama,
			jumlah: pesanan.jumlah,
			totalHarga: pesanan.totalHarga,
			status: pesanan.status,
			metodePembayaran: pesanan.metodePembayaran,
			createdAt: pesanan.createdAt
		})
		.from(pesanan)
		.leftJoin(produk, eq(pesanan.produkId, produk.id))
		.leftJoin(jasa, eq(pesanan.jasaId, jasa.id))
		.where(eq(pesanan.jastiperId, jastiperId))
		.orderBy(desc(pesanan.createdAt))
		.limit(30);

	const riwayatPesanan = riwayatMentah.map((p) => ({
		...p,
		nama: p.namaProduk ?? p.namaJasa ?? 'Produk/jasa sudah dihapus'
	}));

	return {
		pendapatanHarian,
		pendapatanMingguan,
		pendapatanBulanan,
		produkTerlaris,
		riwayatPesanan
	};
};