import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk, pesanan, pesananItem, ongkirWilayah } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';


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

	const mode = url.searchParams.get('mode') === 'langsung' ? 'langsung' : 'keranjang';

	let items: {
		produkId: string;
		jumlah: number;
		namaProduk: string;
		hargaSatuan: number;
		jastiperId: string;
	}[];
	let produkIdLangsung = '';
	let jumlahLangsung = 1;

	if (mode === 'langsung') {
		produkIdLangsung = url.searchParams.get('produkId') ?? '';
		const jumlahRaw = url.searchParams.get('jumlah');
		jumlahLangsung = jumlahRaw ? parseInt(jumlahRaw, 10) : 1;

		if (!produkIdLangsung || Number.isNaN(jumlahLangsung) || jumlahLangsung < 1) {
			throw redirect(303, '/publik/katalog');
		}

		const [produkAsli] = await db.select().from(produk).where(eq(produk.id, produkIdLangsung));
		if (!produkAsli || !produkAsli.aktif) throw redirect(303, '/publik/katalog');

		items = [
			{
				produkId: produkAsli.id,
				jumlah: jumlahLangsung,
				namaProduk: produkAsli.nama,
				hargaSatuan: produkAsli.harga,
				jastiperId: produkAsli.jastiperId
			}
		];
	} else {
		items = await db
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
	}

	const ongkirRaw = url.searchParams.get('ongkir');
	const pilihanWilayah = uraikanPilihanOngkir(ongkirRaw);

	const wilayahIdList = Object.values(pilihanWilayah);
	const daftarOngkirDipilih = wilayahIdList.length
		? await db.select().from(ongkirWilayah).where(inArray(ongkirWilayah.id, wilayahIdList))
		: [];

	const jastiperIdUnik = [...new Set(items.map((i) => i.jastiperId))];

	const semuaOngkirTersedia = jastiperIdUnik.length
		? await db
				.select()
				.from(ongkirWilayah)
				.where(inArray(ongkirWilayah.jastiperId, jastiperIdUnik))
		: [];

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
			wilayahIdTerpilih: ongkirRow?.id ?? null,
			daftarWilayah: semuaOngkirTersedia.filter((o) => o.jastiperId === jastiperId),
			subtotal: itemKelompok.reduce((s, i) => s + i.hargaSatuan * i.jumlah, 0)
		};
	});

	const totalBarang = kelompokJastiper.reduce((s, k) => s + k.subtotal, 0);
	const totalOngkir = kelompokJastiper.reduce((s, k) => s + k.ongkir, 0);
	const semuaWilayahSudahDipilih = kelompokJastiper.every((k) => k.wilayahIdTerpilih !== null);

	return {
		kelompokJastiper,
		totalBarang,
		totalOngkir,
		totalBayar: totalBarang + totalOngkir,
		ongkirRaw: ongkirRaw ?? '',
		mode,
		produkIdLangsung,
		jumlahLangsung,
		semuaWilayahSudahDipilih
	};
};

export const actions: Actions = {
	bayar: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const alamat = data.get('alamat')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();
		const ongkirRaw = data.get('ongkirRaw')?.toString() ?? '';
		const mode = data.get('mode')?.toString() === 'langsung' ? 'langsung' : 'keranjang';

		if (!alamat) return fail(400, { error: 'Alamat pengiriman wajib diisi.' });
		if (!metodePembayaran) return fail(400, { error: 'Pilih metode pembayaran dulu.' });

		let items: { produkId: string; jumlah: number; hargaSatuan: number; jastiperId: string }[];

		if (mode === 'langsung') {
			const produkId = data.get('produkId')?.toString();
			const jumlahRaw = data.get('jumlah')?.toString();
			const jumlah = jumlahRaw ? parseInt(jumlahRaw, 10) : NaN;

			if (!produkId || Number.isNaN(jumlah) || jumlah < 1) {
				return fail(400, { error: 'Data produk tidak valid.' });
			}

			const [produkAsli] = await db.select().from(produk).where(eq(produk.id, produkId));
			if (!produkAsli || !produkAsli.aktif) {
				return fail(400, { error: 'Produk tidak tersedia.' });
			}

			items = [
				{
					produkId: produkAsli.id,
					jumlah,
					hargaSatuan: produkAsli.harga,
					jastiperId: produkAsli.jastiperId
				}
			];
		} else {
			items = await db
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
		}

		const pilihanWilayah = uraikanPilihanOngkir(ongkirRaw);
		const wilayahIdList = Object.values(pilihanWilayah);
		const daftarOngkirDipilih = wilayahIdList.length
			? await db.select().from(ongkirWilayah).where(inArray(ongkirWilayah.id, wilayahIdList))
			: [];

		const jastiperIdUnik = [...new Set(items.map((i) => i.jastiperId))];

		for (const jastiperId of jastiperIdUnik) {
			const wilayahId = pilihanWilayah[jastiperId];
			const ongkirRow = daftarOngkirDipilih.find(
				(o) => o.id === wilayahId && o.jastiperId === jastiperId
			);
			if (!ongkirRow) {
				return fail(400, { error: 'Pilih wilayah pengiriman untuk semua jastiper dulu.' });
			}
		}

		// DIUBAH: sekarang 1 jastiper = 1 baris pesanan (header transaksi),
		// item-itemnya masuk ke pesananItem — bukan 1 baris pesanan per produk
		// seperti sebelumnya. Ongkir cukup ditulis sekali di header.
		const idPesananBaru: string[] = [];

		for (const jastiperId of jastiperIdUnik) {
			const itemKelompok = items.filter((i) => i.jastiperId === jastiperId);
			const wilayahId = pilihanWilayah[jastiperId];
			const ongkirRow = daftarOngkirDipilih.find(
				(o) => o.id === wilayahId && o.jastiperId === jastiperId
			)!;

			const subtotal = itemKelompok.reduce((s, i) => s + i.hargaSatuan * i.jumlah, 0);
			const idBaru = randomUUID();

			await db.insert(pesanan).values({
				id: idBaru,
				pelangganId: locals.user.id,
				jastiperId,
				ongkir: ongkirRow.biaya,
				totalHarga: subtotal + ongkirRow.biaya,
				alamatKirim: alamat,
				wilayahId: ongkirRow.id,
				metodePembayaran,
				status: 'menunggu_konfirmasi'
			});

			await db.insert(pesananItem).values(
				itemKelompok.map((item) => ({
					id: randomUUID(),
					pesananId: idBaru,
					produkId: item.produkId,
					jumlah: item.jumlah,
					hargaSatuan: item.hargaSatuan
				}))
			);

			idPesananBaru.push(idBaru);
		}

		if (mode === 'keranjang') {
			await db.delete(keranjangItem).where(eq(keranjangItem.pelangganId, locals.user.id));
		}

		throw redirect(303, `/pembayaran/selesai?ids=${idPesananBaru.join(',')}`);
	}
};