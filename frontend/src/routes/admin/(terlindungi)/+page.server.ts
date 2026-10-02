import { pool } from '$lib/server/pool';
import type { PageServerLoad } from './$types';

// Kalau satu query gagal, halaman tetap terbuka.
// Penyebabnya muncul di terminal `npm run dev` dengan awalan [dashboard].
async function aman<T>(nama: string, fn: () => Promise<T>, awal: T): Promise<T> {
	try {
		return await fn();
	} catch (e) {
		console.error(`[dashboard] query "${nama}" gagal:`, (e as Error).message);
		return awal;
	}
}

// { nilai: jumlah } (nilai dijadikan huruf kecil)
async function hitung(sql: string): Promise<Record<string, number>> {
	const { rows } = await pool.query(sql);
	const hasil: Record<string, number> = {};
	for (const r of rows) hasil[String(r.kunci ?? '').toLowerCase()] = Number(r.n);
	return hasil;
}

// [{ nama, n }] (urutan dan huruf asli dipertahankan)
async function daftar(sql: string): Promise<{ nama: string; n: number }[]> {
	const { rows } = await pool.query(sql);
	return rows.map((r) => ({ nama: String(r.kunci ?? 'Lainnya'), n: Number(r.n) }));
}

const jumlah = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
const cocok = (o: Record<string, number>, re: RegExp) =>
	Object.entries(o)
		.filter(([k]) => re.test(k))
		.reduce((a, [, v]) => a + v, 0);

export const load: PageServerLoad = async () => {
	const [
		role,
		statusPesanan,
		nilaiSelesai,
		pesananTerbaru,
		statusProduk,
		kategori,
		hargaTipe,
		hargaStat,
		produkTerbaru,
		jastiper
	] = await Promise.all([
		aman('akun per role', () => hitung(`SELECT role::text AS kunci, COUNT(*)::int AS n FROM users GROUP BY role`), {}),

		aman('pesanan per status', () => hitung(`SELECT status::text AS kunci, COUNT(*)::int AS n FROM pesanan GROUP BY status`), {}),

		aman(
			'nilai pesanan selesai',
			async () => {
				const { rows } = await pool.query(
					`SELECT COALESCE(SUM(total_harga), 0)::float8 AS n FROM pesanan WHERE status::text ILIKE '%selesai%'`
				);
				return Number(rows[0].n);
			},
			0
		),

		aman(
			'pesanan terbaru',
			async () => {
				try {
					const { rows } = await pool.query(
						`SELECT LEFT(p.id::text, 7) AS kode, u.nama AS pembeli, j.nama AS jastiper,
						        p.status::text AS status, p.total_harga AS total, p.created_at
						 FROM pesanan p
						 LEFT JOIN users u ON u.id = p.pelanggan_id
						 LEFT JOIN users j ON j.id = p.jastiper_id
						 ORDER BY p.created_at DESC LIMIT 5`
					);
					return rows;
				} catch (e) {
					console.error('[dashboard] join users (pesanan) gagal, pakai versi sederhana:', (e as Error).message);
					const { rows } = await pool.query(
						`SELECT LEFT(id::text, 7) AS kode, NULL AS pembeli, NULL AS jastiper,
						        status::text AS status, total_harga AS total, created_at
						 FROM pesanan ORDER BY created_at DESC LIMIT 5`
					);
					return rows;
				}
			},
			[] as any[]
		),

		aman(
			'produk tampil/disembunyikan',
			() =>
				hitung(
					`SELECT CASE WHEN aktif THEN 'tampil' ELSE 'disembunyikan' END AS kunci, COUNT(*)::int AS n
					 FROM produk GROUP BY 1`
				),
			{}
		),

		aman(
			'produk per kategori',
			() =>
				daftar(
					`SELECT COALESCE(NULLIF(TRIM(kategori::text), ''), 'Lainnya') AS kunci, COUNT(*)::int AS n
					 FROM produk GROUP BY 1 ORDER BY n DESC LIMIT 6`
				),
			[] as { nama: string; n: number }[]
		),

		aman(
			'produk per tipe harga',
			() =>
				daftar(
					`SELECT COALESCE(harga_tipe::text, '-') AS kunci, COUNT(*)::int AS n
					 FROM produk GROUP BY 1 ORDER BY n DESC`
				),
			[] as { nama: string; n: number }[]
		),

		aman(
			'statistik harga produk',
			async () => {
				const { rows } = await pool.query(
					`SELECT COALESCE(MIN(harga), 0)::float8 AS termurah,
					        COALESCE(MAX(harga), 0)::float8 AS termahal,
					        COALESCE(AVG(harga), 0)::float8 AS rata
					 FROM produk WHERE harga IS NOT NULL`
				);
				return {
					termurah: Number(rows[0].termurah),
					termahal: Number(rows[0].termahal),
					rata: Number(rows[0].rata)
				};
			},
			{ termurah: 0, termahal: 0, rata: 0 }
		),

		aman(
			'produk terbaru',
			async () => {
				try {
					const { rows } = await pool.query(
						`SELECT p.nama, p.kategori::text AS kategori, p.harga::float8 AS harga,
						        p.harga_tipe::text AS harga_tipe, p.aktif, p.gambar_url, p.created_at,
						        u.nama AS jastiper
						 FROM produk p
						 LEFT JOIN users u ON u.id = p.jastiper_id
						 ORDER BY p.created_at DESC LIMIT 5`
					);
					return rows;
				} catch (e) {
					console.error('[dashboard] join users (produk) gagal, pakai versi sederhana:', (e as Error).message);
					const { rows } = await pool.query(
						`SELECT nama, kategori::text AS kategori, harga::float8 AS harga,
						        harga_tipe::text AS harga_tipe, aktif, gambar_url, created_at,
						        NULL AS jastiper
						 FROM produk ORDER BY created_at DESC LIMIT 5`
					);
					return rows;
				}
			},
			[] as any[]
		),

		aman(
			'jastiper terverifikasi',
			() =>
				hitung(
					`SELECT CASE WHEN terverifikasi THEN 'ya' ELSE 'belum' END AS kunci, COUNT(*)::int AS n
					 FROM jastiper_profiles GROUP BY 1`
				),
			{}
		)
	]);

	const totalPesanan = jumlah(statusPesanan);
	const selesai = cocok(statusPesanan, /selesai/);
	const batal = cocok(statusPesanan, /batal/);

	return {
		akun: {
			total: jumlah(role),
			admin: role['admin'] ?? 0,
			jastiper: role['jastiper'] ?? 0,
			pelanggan: role['pelanggan'] ?? 0
		},
		pesanan: {
			total: totalPesanan,
			aktif: totalPesanan - selesai - batal,
			selesai,
			batal,
			nilaiSelesai,
			terbaru: pesananTerbaru
		},
		produk: {
			total: jumlah(statusProduk),
			tampil: statusProduk['tampil'] ?? 0,
			disembunyikan: statusProduk['disembunyikan'] ?? 0,
			kategori,
			hargaTipe,
			harga: hargaStat,
			terbaru: produkTerbaru
		},
		jastiper: {
			terverifikasi: jastiper['ya'] ?? 0,
			belum: jastiper['belum'] ?? 0
		}
	};
};