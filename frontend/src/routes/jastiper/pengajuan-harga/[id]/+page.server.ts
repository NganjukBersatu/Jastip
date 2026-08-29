import { error, fail, redirect } from '@sveltejs/kit';
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
			pelangganId: pengajuanHarga.pelangganId,
			pelangganNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.innerJoin(users, eq(pengajuanHarga.pelangganId, users.id))
		.where(and(eq(pengajuanHarga.id, params.id), eq(produk.jastiperId, locals.user!.id)));

	// kalau pengajuan nggak ada, atau bukan milik produk punya jastiper yang login -> 404
	// ini penting: tanpa cek ini, jastiper A bisa buka chat nego punya jastiper B cuma dengan ganti id di URL
	if (!item) throw error(404, 'Pengajuan tidak ditemukan.');

	const daftarPesan = await db
		.select()
		.from(pesanChat)
		.where(eq(pesanChat.pengajuanHargaId, params.id))
		.orderBy(asc(pesanChat.createdAt));

	return { item, daftarPesan, userId: locals.user!.id };
};

async function ubahStatus(id: string, jastiperId: string, statusBaru: 'diterima' | 'ditolak') {
	const [row] = await db
		.select({ id: pengajuanHarga.id })
		.from(pengajuanHarga)
		.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.where(and(eq(pengajuanHarga.id, id), eq(produk.jastiperId, jastiperId)));

	if (!row) return fail(404, { error: 'Pengajuan tidak ditemukan.' });

	await db.update(pengajuanHarga).set({ status: statusBaru }).where(eq(pengajuanHarga.id, id));
}

export const actions: Actions = {
	kirimPesan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const isi = data.get('isi')?.toString().trim();
		if (!isi) return fail(400, { error: 'Pesan tidak boleh kosong.' });

		// pastikan jastiper ini memang pemilik produk dari pengajuan ini
		const [row] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.innerJoin(produk, eq(pengajuanHarga.produkId, produk.id))
			.where(and(eq(pengajuanHarga.id, params.id), eq(produk.jastiperId, locals.user!.id)));

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
		const result = await ubahStatus(params.id, locals.user!.id, 'diterima');
		if (result) return result;
		throw redirect(303, '/jastiper/pengajuan-harga');
	},
	tolak: async ({ params, locals }) => {
		const result = await ubahStatus(params.id, locals.user!.id, 'ditolak');
		if (result) return result;
		throw redirect(303, '/jastiper/pengajuan-harga');
	}
};