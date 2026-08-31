import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { keranjangItem, pengajuanHarga, pesanChat, users } from '$lib/server/db/schema';
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
			await db
				.update(keranjangItem)
				.set({ jumlah: itemLama.jumlah + 1 })
				.where(eq(keranjangItem.id, itemLama.id));
		} else {
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