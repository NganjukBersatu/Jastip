import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, produk, users, jastiperProfiles } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
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
			jastiperNama: users.nama,
			area: jastiperProfiles.area
		})
		.from(keranjangItem)
		.innerJoin(produk, eq(keranjangItem.produkId, produk.id))
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(produk.jastiperId, jastiperProfiles.userId))
		.where(eq(keranjangItem.pelangganId, locals.user.id));

	return { items };
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