import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem } from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import type { Actions } from './$types';

export const actions: Actions = {
	tambahKeranjang: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/publik/masuk');
		}
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa menambahkan ke keranjang.' });
		}

		const data = await request.formData();
		const namaProduk = data.get('namaProduk')?.toString();
		const hargaSatuanRaw = data.get('hargaSatuan')?.toString();
		const lokasi = data.get('lokasi')?.toString() ?? '';
		const jastiperNama = data.get('jastiperNama')?.toString() ?? '';
		const gambarUrl = data.get('gambarUrl')?.toString() ?? '';

		if (!namaProduk || !hargaSatuanRaw) {
			return fail(400, { error: 'Data produk tidak lengkap.' });
		}

		const hargaSatuan = parseInt(hargaSatuanRaw, 10);
		if (Number.isNaN(hargaSatuan)) {
			return fail(400, { error: 'Harga produk tidak valid.' });
		}

		// Cek dulu apakah produk yang sama (nama sama, pelanggan sama) sudah ada di keranjang
		const [itemLama] = await db
			.select()
			.from(keranjangItem)
			.where(
				and(
					eq(keranjangItem.pelangganId, locals.user.id),
					eq(keranjangItem.namaProduk, namaProduk)
				)
			);

		if (itemLama) {
			// Sudah ada -> tambah jumlahnya saja, tidak bikin baris baru
			await db
				.update(keranjangItem)
				.set({ jumlah: itemLama.jumlah + 1 })
				.where(eq(keranjangItem.id, itemLama.id));
		} else {
			// Belum ada -> insert baris baru
			await db.insert(keranjangItem).values({
				id: randomUUID(),
				pelangganId: locals.user.id,
				namaProduk,
				hargaSatuan,
				jumlah: 1,
				lokasi,
				jastiperNama,
				gambarUrl
			});
		}

		throw redirect(303, '/keranjang');
	}
};