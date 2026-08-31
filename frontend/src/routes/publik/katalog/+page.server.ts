import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk, users, jastiperProfiles, pengajuanHarga, keranjangItem } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
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

		const [itemLama] = await db
			.select()
			.from(keranjangItem)
			.where(
				and(
					eq(pengajuanHarga.produkId, produkId),
					eq(pengajuanHarga.pelangganId, locals.user.id),
					eq(pengajuanHarga.status, 'menunggu')
				)
			);

		if (itemLama) {
			await db
				.update(keranjangItem)
				.set({ jumlah: itemLama.jumlah + 1 })
				.where(eq(keranjangItem.id, itemLama.id));
		} else {
			await db.insert(keranjangItem).values({
				id: randomUUID(),
				pelangganId: locals.user.id,
				jastiperId: produkAsli.jastiperId,
				hargaDiajukan: produkAsli.harga, // default ke harga produk, bisa dinego lewat chat
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
			await db.insert(keranjangItem).values({ id: crypto.randomUUID(), pelangganId: locals.user.id, produkId, jumlah: 1 });
		}

		throw redirect(303, '/keranjang');
	},

	chatJastiper: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/publik/masuk');
		}
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa menghubungi jastiper.' });
		}

		const data = await request.formData();
		const namaProduk = data.get('namaProduk')?.toString();
		const hargaAngkaRaw = data.get('hargaAngka')?.toString();

		if (!namaProduk || !hargaAngkaRaw) {
			return fail(400, { error: 'Data produk tidak lengkap.' });
		}

		const hargaAngka = parseInt(hargaAngkaRaw, 10);
		if (Number.isNaN(hargaAngka)) {
			return fail(400, { error: 'Harga produk tidak valid.' });
		}

		// Cek dulu apakah sudah pernah ada percakapan/nego untuk produk yang sama
		const [percakapanLama] = await db
			.select()
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.pelangganId, locals.user.id),
					eq(pengajuanHarga.namaProduk, namaProduk)
				)
			);

		if (percakapanLama) {
			// Sudah pernah chat produk ini sebelumnya -> langsung buka lagi percakapan yang sama
			throw redirect(303, `/publik/pesan?percakapan=${percakapanLama.id}`);
		}

		// Sementara: pakai akun jastiper pertama yang terdaftar (mis. Nia), karena produk masih dummy
		const [jastiperDefault] = await db
			.select()
			.from(users)
			.where(eq(users.role, 'jastiper'));

		if (!jastiperDefault) {
			return fail(500, { error: 'Belum ada akun jastiper terdaftar di sistem.' });
		}

		const percakapanId = randomUUID();

		await db.insert(pengajuanHarga).values({
			id: percakapanId,
			produkId: null,
			namaProduk,
			pelangganId: locals.user.id,
			jastiperId: jastiperDefault.id,
			hargaDiajukan: hargaAngka,
			jumlah: 1,
			status: 'menunggu'
		});

		// Pesan pembuka otomatis dari pelanggan
		await db.insert(pesanChat).values({
			id: randomUUID(),
			pengajuanHargaId: percakapanId,
			pengirimId: locals.user.id,
			isi: `Halo kak, saya tertarik dengan produk "${namaProduk}" ini.`,
			jenis: 'teks'
		});

		throw redirect(303, `/publik/pesan?percakapan=${percakapanId}`);
	}
};