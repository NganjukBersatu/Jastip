import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk, jasa, users, jastiperProfiles, pengajuanHarga, keranjangItem } from '$lib/server/db/schema';
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

	const daftarJasa = await db
		.select({
			id: jasa.id,
			nama: jasa.nama,
			deskripsi: jasa.deskripsi,
			kategori: jasa.kategori,
			hargaTipe: jasa.hargaTipe,
			harga: jasa.harga,
			satuan: jasa.satuan,
			gambarUrl: jasa.gambarUrl,
			jastiperNama: users.nama,
			area: jastiperProfiles.area
		})
		.from(jasa)
		.innerJoin(users, eq(jasa.jastiperId, users.id))
		.leftJoin(jastiperProfiles, eq(jasa.jastiperId, jastiperProfiles.userId))
		.where(eq(jasa.aktif, true));

	return { daftarProduk, daftarJasa };
};

export const actions: Actions = {
	chatJastiper: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa menghubungi jastiper.' });
		}

		const data = await request.formData();
		const produkId = data.get('produkId')?.toString();
		const jasaId = data.get('jasaId')?.toString();
		if (!produkId && !jasaId) return fail(400, { error: 'Item tidak ditemukan.' });

		let jastiperId: string;
		let harga: number;

		if (produkId) {
			const [produkAsli] = await db.select().from(produk).where(eq(produk.id, produkId));
			if (!produkAsli || !produkAsli.aktif) return fail(400, { error: 'Produk tidak tersedia.' });
			jastiperId = produkAsli.jastiperId;
			harga = produkAsli.harga;
		} else {
			const [jasaAsli] = await db.select().from(jasa).where(eq(jasa.id, jasaId!));
			if (!jasaAsli || !jasaAsli.aktif) return fail(400, { error: 'Jasa tidak tersedia.' });
			jastiperId = jasaAsli.jastiperId;
			harga = jasaAsli.harga;
		}

		const [pengajuanLama] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(
				and(
					produkId ? eq(pengajuanHarga.produkId, produkId) : eq(pengajuanHarga.jasaId, jasaId!),
					eq(pengajuanHarga.pelangganId, locals.user.id),
					eq(pengajuanHarga.status, 'menunggu')
				)
			);

		let pengajuanId = pengajuanLama?.id;

		if (!pengajuanId) {
			pengajuanId = randomUUID();
			await db.insert(pengajuanHarga).values({
				id: pengajuanId,
				produkId: produkId ?? null,
				jasaId: jasaId ?? null,
				pelangganId: locals.user.id,
				jastiperId,
				hargaDiajukan: harga,
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
			await db.update(keranjangItem).set({ jumlah: itemLama.jumlah + 1 }).where(eq(keranjangItem.id, itemLama.id));
		} else {
			await db.insert(keranjangItem).values({ id: randomUUID(), pelangganId: locals.user.id, produkId, jumlah: 1 });
		}

		throw redirect(303, '/keranjang');
	}
};