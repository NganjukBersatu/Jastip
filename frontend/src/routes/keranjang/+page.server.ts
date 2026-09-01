import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk, users, jastiperProfiles, ongkirWilayah } from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/publik/katalog');

	const items = await db
		.select({
			id: keranjangItem.id,
			jumlah: keranjangItem.jumlah,
			namaProduk: produk.nama,
			hargaSatuan: produk.harga,
			gambarUrl: produk.gambarUrl,
			jastiperId: produk.jastiperId,
			jastiperNama: users.nama,
			area: jastiperProfiles.area
		})
		.from(keranjangItem)
		.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(produk.jastiperId, jastiperProfiles.userId))
		.where(eq(keranjangItem.pelangganId, locals.user.id));

	// Ambil daftar wilayah+ongkir milik tiap jastiper yang ada di keranjang ini
	const jastiperIdUnik = [...new Set(items.map((item) => item.jastiperId))];

	const semuaOngkir =
		jastiperIdUnik.length > 0
			? await db
					.select()
					.from(ongkirWilayah)
					.where(inArray(ongkirWilayah.jastiperId, jastiperIdUnik))
			: [];

	// Kelompokkan item + ongkir per jastiper, supaya di halaman tinggal di-loop
	const kelompokJastiper = jastiperIdUnik.map((jastiperId) => {
		const itemJastiperIni = items.filter((item) => item.jastiperId === jastiperId);
		const ongkirJastiperIni = semuaOngkir.filter((o) => o.jastiperId === jastiperId);

		return {
			jastiperId,
			jastiperNama: itemJastiperIni[0].jastiperNama,
			area: itemJastiperIni[0].area,
			items: itemJastiperIni,
			ongkirOptions: ongkirJastiperIni
		};
	});

	return { kelompokJastiper };
};

export const actions: Actions = {
	hapus: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID item tidak ditemukan.' });

		await db
			.delete(keranjangItem)
			.where(and(eq(keranjangItem.id, id), eq(keranjangItem.pelangganId, locals.user.id)));

		return { success: true };
	},

	ubahJumlah: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const id = data.get('id')?.toString();
		const jumlahRaw = data.get('jumlah')?.toString();
		const jumlah = jumlahRaw ? parseInt(jumlahRaw, 10) : NaN;

		if (!id || Number.isNaN(jumlah) || jumlah < 1) {
			return fail(400, { error: 'Jumlah tidak valid.' });
		}

		await db
			.update(keranjangItem)
			.set({ jumlah })
			.where(and(eq(keranjangItem.id, id), eq(keranjangItem.pelangganId, locals.user.id)));

		return { success: true };
	}
};