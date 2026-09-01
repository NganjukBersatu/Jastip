import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pengajuanHarga, users, pesanChat, tawaranHarga, pesanan } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
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
			produkId: pengajuanHarga.produkId,
			pelangganId: pengajuanHarga.pelangganId,
			pelangganNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.pelangganId, users.id))
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
			id: crypto.randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			isi
		});

		return { success: true };
	},

	terima: async ({ params, locals }) => {
		const jastiperId = locals.user!.id;

		const [row] = await db
			.select({
				id: pengajuanHarga.id,
				produkId: pengajuanHarga.produkId,
				pelangganId: pengajuanHarga.pelangganId,
				hargaDiajukan: pengajuanHarga.hargaDiajukan,
				jumlah: pengajuanHarga.jumlah
			})
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.jastiperId, jastiperId)
				)
			);

		if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

		// Update status pengajuan
		await db
			.update(pengajuanHarga)
			.set({ status: 'diterima' })
			.where(eq(pengajuanHarga.id, params.id));

		// Buat pesanan
		await db.insert(pesanan).values({
			id: randomUUID(),
			produkId: row.produkId,
			pelangganId: row.pelangganId,
			jastiperId,
			pengajuanHargaId: row.id,
			jumlah: row.jumlah,
			hargaSatuan: row.hargaDiajukan,
			ongkir: 0,
			totalHarga: row.hargaDiajukan * row.jumlah,
			status: 'menunggu_konfirmasi'
		});

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