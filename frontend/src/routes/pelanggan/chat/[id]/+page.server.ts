import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pengajuanHarga, produk, users, pesanChat, tawaranHarga } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [item] = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			jumlah: pengajuanHarga.jumlah,
			catatan: pengajuanHarga.catatan,
			status: pengajuanHarga.status,
			createdAt: pengajuanHarga.createdAt,
			produkNama: pengajuanHarga.namaProduk,
			jastiperNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.jastiperId, users.id))
		.where(
			and(
				eq(pengajuanHarga.id, params.id),
				eq(pengajuanHarga.pelangganId, locals.user!.id)
			)
		);

	if (!item) throw error(404, 'Percakapan tidak ditemukan.');

	const daftarPesan = await db
		.select()
		.from(pesanChat)
		.where(eq(pesanChat.pengajuanHargaId, params.id))
		.orderBy(asc(pesanChat.createdAt));

	const daftarTawaran = await db
		.select({
			id: tawaranHarga.id,
			harga: tawaranHarga.harga,
			jumlah: tawaranHarga.jumlah,
			status: tawaranHarga.status,
			createdAt: tawaranHarga.createdAt
		})
		.from(tawaranHarga)
		.where(eq(tawaranHarga.pengajuanHargaId, params.id))
		.orderBy(asc(tawaranHarga.createdAt));

	return {
		item,
		daftarPesan,
		daftarTawaran,
		userId: locals.user!.id
	};
};

export const actions: Actions = {
	kirimPesan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const isi = data.get('isi')?.toString().trim();
		if (!isi) return fail(400, { error: 'Pesan tidak boleh kosong.' });

		const [row] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.pelangganId, locals.user!.id)
				)
			);

		if (!row) return fail(404, { error: 'Percakapan tidak ditemukan.' });

		await db.insert(pesanChat).values({
			id: crypto.randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			isi
		});

		return { success: true };
	},

	ajukanTawaran: async ({ request, params, locals }) => {
		const data = await request.formData();
		const harga = Number(data.get('harga'));
		const jumlah = Number(data.get('jumlah'));

		if (!harga || harga < 1) {
			return fail(400, { error: 'Harga tidak valid.' });
		}
		if (!jumlah || jumlah < 1) {
			return fail(400, { error: 'Jumlah tidak valid.' });
		}

		const [row] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.pelangganId, locals.user!.id)
				)
			);

		if (!row) {
			return fail(404, { error: 'Percakapan tidak ditemukan.' });
		}

		// 1. Catat ke history tawaran
		await db.insert(tawaranHarga).values({
			id: crypto.randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			harga,
			jumlah,
			status: 'menunggu'
		});

		// 2. Update harga utama di pengajuan (ini yang dilihat jastiper)
		await db
			.update(pengajuanHarga)
			.set({
				hargaDiajukan: harga,
				jumlah: jumlah,
				status: 'menunggu' // pastikan status tetap menunggu
			})
			.where(eq(pengajuanHarga.id, params.id));

		return { success: true };
	}
};