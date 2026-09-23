import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	pengajuanHarga,
	produk,
	users,
	pesanChat,
	tawaranHarga
} from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';
import { tandaiSudahDibaca } from '$lib/server/notifikasi';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [item] = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			jumlah: pengajuanHarga.jumlah,
			catatan: pengajuanHarga.catatan,
			status: pengajuanHarga.status,
			createdAt: pengajuanHarga.createdAt,
			produkNama: produk.nama,
			produkId: pengajuanHarga.produkId,
			pelangganId: pengajuanHarga.pelangganId,
			pelangganNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.pelangganId, users.id))
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.where(
			and(
				eq(pengajuanHarga.id, params.id),
				eq(pengajuanHarga.jastiperId, locals.user!.id)
			)
		);

	if (!item) throw error(404, 'Pengajuan tidak ditemukan.');

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
			createdAt: tawaranHarga.createdAt,
			pengirimId: tawaranHarga.pengirimId
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
					eq(pengajuanHarga.jastiperId, locals.user!.id)
				)
			);

		if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

		await db.insert(pesanChat).values({
			id: randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			isi
		});

		return { success: true };
	},

	tandaiDibaca: async ({ params, locals }) => {
		await tandaiSudahDibaca(params.id, locals.user!.id);
		return { success: true };
	},

	// DIUBAH: sekarang cuma mengubah status jadi 'diterima'. Pesanan
	// (wilayah, alamat, metode pembayaran) dibuat belakangan oleh
	// pelanggan sendiri lewat halaman konfirmasi di chat.
	terima: async ({ params, locals }) => {
		const jastiperId = locals.user!.id;

		const [row] = await db
			.select({
				id: pengajuanHarga.id,
				status: pengajuanHarga.status
			})
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.jastiperId, jastiperId)
				)
			);

		if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

		if (row.status !== 'menunggu') {
			throw redirect(303, '/jastiper/pengajuan-harga');
		}

		// update hanya berhasil kalau status masih 'menunggu' saat ini juga —
		// mencegah 2 request bersamaan sama-sama lolos
		const hasilUpdate = await db
			.update(pengajuanHarga)
			.set({ status: 'diterima' })
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.status, 'menunggu')
				)
			)
			.returning({ id: pengajuanHarga.id });

		if (hasilUpdate.length === 0) {
			throw redirect(303, '/jastiper/pengajuan-harga');
		}

		throw redirect(303, '/jastiper/pengajuan-harga');
	},

	tolak: async ({ params, locals }) => {
		const [row] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.jastiperId, locals.user!.id)
				)
			);

		if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

		await db
			.update(pengajuanHarga)
			.set({ status: 'ditolak' })
			.where(eq(pengajuanHarga.id, params.id));

		throw redirect(303, '/jastiper/pengajuan-harga');
	}
};