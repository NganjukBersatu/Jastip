import { db } from '$lib/server/db';
import { pengajuanHarga, produk } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Cari pengajuan harga yang masih 'menunggu' antara pelanggan & produk ini.
 * Kalau belum ada, buat baru dengan harga default = harga produk.
 * Return: id pengajuan harga yang siap dipakai sebagai "ruang chat".
 */
export async function cariAtauBuatPengajuan(produkId: string, pelangganId: string): Promise<string> {
	// Cek dulu yang sudah ada, biar tidak bikin duplikat
	const [sudahAda] = await db
		.select({ id: pengajuanHarga.id })
		.from(pengajuanHarga)
		.where(
			and(
				eq(pengajuanHarga.produkId, produkId),
				eq(pengajuanHarga.pelangganId, pelangganId),
				eq(pengajuanHarga.status, 'menunggu')
			)
		);

	if (sudahAda) return sudahAda.id;

	// Ambil data produk + jastiperId
	const [item] = await db
		.select({
			harga: produk.harga,
			nama: produk.nama,
			jastiperId: produk.jastiperId
		})
		.from(produk)
		.where(eq(produk.id, produkId));

	if (!item) throw new Error('Produk tidak ditemukan.');

	const id = crypto.randomUUID();

	await db.insert(pengajuanHarga).values({
		id,
		produkId,
		namaProduk: item.nama,           // wajib
		pelangganId,
		jastiperId: item.jastiperId,     // wajib
		hargaDiajukan: item.harga,
		jumlah: 1,
		status: 'menunggu'
	});

	return id;
}