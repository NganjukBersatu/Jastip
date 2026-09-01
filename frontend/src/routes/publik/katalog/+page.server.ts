import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk, users, jastiperProfiles, pengajuanHarga, keranjangItem } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const daftarProduk = await db
		.select({
			id: produk.id,
			nama: produk.nama,
			deskripsi: produk.deskripsi,
			kategori: produk.kategori,
			hargaTipe: produk.hargaTipe,
			harga: produk.harga,
			gambarUrl: produk.gambarUrl,
			jastiperNama: users.nama,
			area: jastiperProfiles.area
		})
		.from(produk)
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(produk.jastiperId, jastiperProfiles.userId))
		.where(eq(produk.aktif, true));

	return { daftarProduk };
};

export const actions: Actions = {
	chatJastiper: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa menghubungi jastiper.' });
		}

		const data = await request.formData();
		const produkId = data.get('produkId')?.toString();
		if (!produkId) return fail(400, { error: 'Produk tidak ditemukan.' });

		const [produkAsli] = await db.select().from(produk).where(eq(produk.id, produkId));
		if (!produkAsli || !produkAsli.aktif) {
			return fail(400, { error: 'Produk tidak tersedia.' });
		}

		const [pengajuanLama] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.produkId, produkId),
					eq(pengajuanHarga.pelangganId, locals.user.id),
					eq(pengajuanHarga.status, 'menunggu')
				)
			);

		let pengajuanId = pengajuanLama?.id;

		if (!pengajuanId) {
			pengajuanId = randomUUID();
			await db.insert(pengajuanHarga).values({
				id: pengajuanId,
				produkId,
				namaProduk: produkAsli.nama,
				pelangganId: locals.user.id,
				jastiperId: produkAsli.jastiperId,
				hargaDiajukan: produkAsli.harga,
				jumlah: 1,
				status: 'menunggu'
			});
		}

		throw redirect(303, `/pelanggan/chat/${pengajuanId}`);
	},

	tambahKeranjang: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa menambahkan ke keranjang.' });
		}

		const data = await request.formData();
		const produkId = data.get('produkId')?.toString();
		if (!produkId) return fail(400, { error: 'Produk tidak ditemukan.' });

		const [produkAsli] = await db.select().from(produk).where(eq(produk.id, produkId));
		if (!produkAsli || !produkAsli.aktif) {
			return fail(400, { error: 'Produk tidak tersedia.' });
		}

		const [itemLama] = await db
			.select()
			.from(keranjangItem)
			.where(and(eq(keranjangItem.pelangganId, locals.user.id), eq(keranjangItem.produkId, produkId)));

		if (itemLama) {
			await db
				.update(keranjangItem)
				.set({ jumlah: itemLama.jumlah + 1 })
				.where(eq(keranjangItem.id, itemLama.id));
		} else {
			await db.insert(keranjangItem).values({
				id: randomUUID(),
				pelangganId: locals.user.id,
				produkId,
				jumlah: 1
			});
		}

		throw redirect(303, '/keranjang');
	}
};