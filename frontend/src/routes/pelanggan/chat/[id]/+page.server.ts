import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pengajuanHarga, produk, users, pesanChat } from '$lib/server/db/schema';
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
			produkNama: produk.nama,
			jastiperNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.innerJoin(users, eq(produk.jastiperId, users.id))
		.where(and(eq(pengajuanHarga.id, params.id), eq(pengajuanHarga.pelangganId, locals.user!.id)));

	if (!item) throw error(404, 'Percakapan tidak ditemukan.');

	const daftarPesan = await db
		.select()
		.from(pesanChat)
		.where(eq(pesanChat.pengajuanHargaId, params.id))
		.orderBy(asc(pesanChat.createdAt));

	return { item, daftarPesan, userId: locals.user!.id };
};

export const actions: Actions = {
	kirimPesan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const isi = data.get('isi')?.toString().trim();
		if (!isi) return fail(400, { error: 'Pesan tidak boleh kosong.' });

		const [row] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(and(eq(pengajuanHarga.id, params.id), eq(pengajuanHarga.pelangganId, locals.user!.id)));

		if (!row) return fail(404, { error: 'Percakapan tidak ditemukan.' });

		await db.insert(pesanChat).values({
			id: crypto.randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			isi
		});

		return { success: true };
	}
};