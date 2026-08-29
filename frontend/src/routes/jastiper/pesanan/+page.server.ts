import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, produk, users, ongkirWilayah } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

const STATUS_AKTIF = ['menunggu_konfirmasi', 'dibelanjakan', 'dikirim'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	const jastiperId = locals.user!.id;

	const semuaPesanan = await db
		.select({
			id: pesanan.id,
			jumlah: pesanan.jumlah,
			hargaSatuan: pesanan.hargaSatuan,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			alamatKirim: pesanan.alamatKirim,
			metodePembayaran: pesanan.metodePembayaran,
			status: pesanan.status,
			createdAt: pesanan.createdAt,
			produkNama: produk.nama,
			pelangganNama: users.nama
		})
		.from(pesanan)
		.innerJoin(produk, eq(pesanan.produkId, produk.id))
		.innerJoin(users, eq(pesanan.pelangganId, users.id))
		.where(eq(pesanan.jastiperId, jastiperId))
		.orderBy(desc(pesanan.createdAt));

	// wilayah yang jastiper ini layani -- dipakai buat "menebak" wilayah tiap pesanan
	// dari teks alamatKirim (lihat catatan di atas soal keterbatasannya)
	const daftarWilayah = await db
		.select()
		.from(ongkirWilayah)
		.where(eq(ongkirWilayah.jastiperId, jastiperId));

	function deteksiWilayah(alamat: string | null): string | null {
		if (!alamat) return null;
		const alamatLower = alamat.toLowerCase();
		const cocok = daftarWilayah.find((w) => alamatLower.includes(w.wilayah.toLowerCase()));
		return cocok?.wilayah ?? null;
	}

	const pesananAktif = semuaPesanan
		.filter((p) => STATUS_AKTIF.includes(p.status as (typeof STATUS_AKTIF)[number]))
		.map((p) => ({ ...p, wilayahTerdeteksi: deteksiWilayah(p.alamatKirim) }));

	const riwayat = semuaPesanan.filter(
		(p) => !STATUS_AKTIF.includes(p.status as (typeof STATUS_AKTIF)[number])
	);

	// kelompokkan pesanan aktif yang wilayahnya cocok -> kandidat "beli & antar bareng"
	const kelompokWilayah: Record<string, typeof pesananAktif> = {};
	for (const p of pesananAktif) {
		if (!p.wilayahTerdeteksi) continue;
		(kelompokWilayah[p.wilayahTerdeteksi] ??= []).push(p);
	}
	// cuma tampilkan kelompok yang beneran ada 2 pesanan atau lebih
	const kelompokSatuJalur = Object.entries(kelompokWilayah)
		.filter(([, daftar]) => daftar.length >= 2)
		.map(([wilayah, daftar]) => ({ wilayah, daftar }));

	return { pesananAktif, riwayat, kelompokSatuJalur };
};

async function ubahStatus(
	id: string,
	jastiperId: string,
	statusBaru: 'dibelanjakan' | 'dikirim' | 'selesai' | 'dibatalkan'
) {
	const [row] = await db
		.select({ id: pesanan.id })
		.from(pesanan)
		.where(and(eq(pesanan.id, id), eq(pesanan.jastiperId, jastiperId)));

	if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });

	await db
		.update(pesanan)
		.set({ status: statusBaru, updatedAt: new Date() })
		.where(eq(pesanan.id, id));
}

export const actions: Actions = {
	mulaiBelanja: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatus(id, locals.user!.id, 'dibelanjakan');
	},
	mulaiAntar: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatus(id, locals.user!.id, 'dikirim');
	},
	selesaikan: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatus(id, locals.user!.id, 'selesai');
	},
	batalkan: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatus(id, locals.user!.id, 'dibatalkan');
	}
};