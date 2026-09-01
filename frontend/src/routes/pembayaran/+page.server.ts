import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk, pesanan, ongkirWilayah } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

/** Ubah "jastiperId1:wilayahId1,jastiperId2:wilayahId2" jadi { jastiperId: wilayahId } */
function uraikanPilihanOngkir(raw: string | null): Record<string, string> {
	const hasil: Record<string, string> = {};
	if (!raw) return hasil;
	for (const bagian of decodeURIComponent(raw).split(',')) {
		const [jastiperId, wilayahId] = bagian.split(':');
		if (jastiperId && wilayahId) hasil[jastiperId] = wilayahId;
	}
	return hasil;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/publik/katalog');

	const items = await db
		.select({
			produkId: keranjangItem.produkId,
			jumlah: keranjangItem.jumlah,
			namaProduk: produk.nama,
			hargaSatuan: produk.harga,
			jastiperId: produk.jastiperId
		})
		.from(keranjangItem)
		.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
		.where(eq(keranjangItem.pelangganId, locals.user.id));

	if (items.length === 0) throw redirect(303, '/keranjang');

	const ongkirRaw = url.searchParams.get('ongkir');
	const pilihanWilayah = uraikanPilihanOngkir(ongkirRaw);

	const wilayahIdList = Object.values(pilihanWilayah);
	const daftarOngkirDipilih = wilayahIdList.length
		? await db.select().from(ongkirWilayah).where(inArray(ongkirWilayah.id, wilayahIdList))
		: [];

	const jastiperIdUnik = [...new Set(items.map((i) => i.jastiperId))];

	// Kelompokkan per jastiper — supaya di halaman keliatan mana ongkirnya buat siapa
	const kelompokJastiper = jastiperIdUnik.map((jastiperId) => {
		const itemKelompok = items.filter((i) => i.jastiperId === jastiperId);
		const wilayahId = pilihanWilayah[jastiperId];
		const ongkirRow = daftarOngkirDipilih.find(
			(o) => o.id === wilayahId && o.jastiperId === jastiperId
		);

		return {
			jastiperId,
			items: itemKelompok,
			wilayah: ongkirRow?.wilayah ?? null,
			ongkir: ongkirRow?.biaya ?? 0,
			subtotal: itemKelompok.reduce((jumlah, i) => jumlah + i.hargaSatuan * i.jumlah, 0)
		};
	});

	const totalBarang = kelompokJastiper.reduce((jumlah, k) => jumlah + k.subtotal, 0);
	const totalOngkir = kelompokJastiper.reduce((jumlah, k) => jumlah + k.ongkir, 0);

	return {
		kelompokJastiper,
		totalBarang,
		totalOngkir,
		totalBayar: totalBarang + totalOngkir,
		ongkirRaw: ongkirRaw ?? ''
	};
};

export const actions: Actions = {
	bayar: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const alamat = data.get('alamat')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();
		const ongkirRaw = data.get('ongkirRaw')?.toString() ?? '';

		if (!alamat) return fail(400, { error: 'Alamat pengiriman wajib diisi.' });
		if (!metodePembayaran) return fail(400, { error: 'Pilih metode pembayaran dulu.' });

		const items = await db
			.select({
				produkId: keranjangItem.produkId,
				jumlah: keranjangItem.jumlah,
				hargaSatuan: produk.harga,
				jastiperId: produk.jastiperId
			})
			.from(keranjangItem)
			.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
			.where(eq(keranjangItem.pelangganId, locals.user.id));

		if (items.length === 0) return fail(400, { error: 'Keranjang kamu kosong.' });

		const pilihanWilayah = uraikanPilihanOngkir(ongkirRaw);
		const wilayahIdList = Object.values(pilihanWilayah);
		const daftarOngkirDipilih = wilayahIdList.length
			? await db.select().from(ongkirWilayah).where(inArray(ongkirWilayah.id, wilayahIdList))
			: [];

		const jastiperIdUnik = [...new Set(items.map((i) => i.jastiperId))];

		for (const jastiperId of jastiperIdUnik) {
			const itemKelompok = items.filter((i) => i.jastiperId === jastiperId);
			const wilayahId = pilihanWilayah[jastiperId];
			const ongkirRow = daftarOngkirDipilih.find(
				(o) => o.id === wilayahId && o.jastiperId === jastiperId
			);
			const ongkirKelompok = ongkirRow?.biaya ?? 0;

			for (let i = 0; i < itemKelompok.length; i++) {
				const item = itemKelompok[i];
				// ongkir cuma ditaruh di baris pertama tiap jastiper, biar tidak dobel kehitung
				const ongkirBarisIni = i === 0 ? ongkirKelompok : 0;
				const totalHarga = item.hargaSatuan * item.jumlah + ongkirBarisIni;

				await db.insert(pesanan).values({
					id: randomUUID(),
					produkId: item.produkId,
					pelangganId: locals.user.id,
					jastiperId: item.jastiperId,
					pengajuanHargaId: null,
					jumlah: item.jumlah,
					hargaSatuan: item.hargaSatuan,
					ongkir: ongkirBarisIni,
					totalHarga,
					alamatKirim: alamat,
					metodePembayaran,
					status: 'menunggu_konfirmasi'
				});
			}
		}

		await db.delete(keranjangItem).where(eq(keranjangItem.pelangganId, locals.user.id));

		throw redirect(303, '/pembayaran/selesai');
	}
};