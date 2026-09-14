import { db } from '$lib/server/db';
import { pengajuanHarga, produk, jasa, users, pesanChat } from '$lib/server/db/schema';
import { eq, desc, inArray, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const pelangganId = locals.user!.id;

	const mentah = await db
		.select({
			id: pengajuanHarga.id,
			hargaDiajukan: pengajuanHarga.hargaDiajukan,
			status: pengajuanHarga.status,
			createdAt: pengajuanHarga.createdAt,
			produkNama: produk.nama,
			jasaNama: jasa.nama,
			jastiperNama: users.nama
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.jastiperId, users.id))
		.leftJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.leftJoin(jasa, eq(pengajuanHarga.jasaId, jasa.id))
		.where(eq(pengajuanHarga.pelangganId, pelangganId))
		.orderBy(desc(pengajuanHarga.createdAt));

	const daftarPercakapan = mentah.map((p) => ({ ...p, namaItem: p.produkNama ?? p.jasaNama ?? 'Item' }));

	if (daftarPercakapan.length === 0) {
		return { daftarPercakapan: [] };
	}

	const semuaId = daftarPercakapan.map((p) => p.id);
	const semuaPesan = await db
		.select()
		.from(pesanChat)
		.where(inArray(pesanChat.pengajuanHargaId, semuaId))
		.orderBy(desc(pesanChat.createdAt));

	const pesanTerakhirPerId: Record<string, (typeof semuaPesan)[number]> = {};
	for (const pesan of semuaPesan) {
		if (!pesanTerakhirPerId[pesan.pengajuanHargaId]) {
			pesanTerakhirPerId[pesan.pengajuanHargaId] = pesan;
		}
	}

	const hasil = daftarPercakapan.map((p) => ({
		...p,
		pesanTerakhir: pesanTerakhirPerId[p.id] ?? null
	}));

	return { daftarPercakapan: hasil };
};

export const actions: Actions = {
	hapus: async ({ request, locals }) => {
		const pelangganId = locals.user!.id;
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID tidak valid' });
		}

		// hapus dulu pesan chat yang terkait, baru pengajuan hargaanya
		// (skip baris ini kalau skema kamu sudah pakai onDelete: 'cascade')
		await db.delete(pesanChat).where(eq(pesanChat.pengajuanHargaId, id));

		const hasil = await db
			.delete(pengajuanHarga)
			.where(and(eq(pengajuanHarga.id, id), eq(pengajuanHarga.pelangganId, pelangganId)))
			.returning({ id: pengajuanHarga.id });

		if (hasil.length === 0) {
			return fail(404, { message: 'Percakapan tidak ditemukan' });
		}

		return { success: true };
	}
};