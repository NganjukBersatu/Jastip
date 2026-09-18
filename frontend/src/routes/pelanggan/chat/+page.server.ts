import { db } from '$lib/server/db';
import { pengajuanHarga, produk, jasa, users, pesanChat, tawaranHarga, pesananItem } from '$lib/server/db/schema';
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

		// pastikan pengajuan ini memang milik pelanggan yang sedang login
		const [milik] = await db
			.select({ id: pengajuanHarga.id })
			.from(pengajuanHarga)
			.where(and(eq(pengajuanHarga.id, id), eq(pengajuanHarga.pelangganId, pelangganId)));

		if (!milik) {
			return fail(404, { message: 'Percakapan tidak ditemukan' });
		}

		// cek dulu apakah pengajuan ini sudah jadi pesanan sungguhan
		// (artinya sudah pernah diterima jastiper) — kalau iya, jangan izinkan hapus,
		// karena itu bukan lagi sekadar draft nego, tapi riwayat transaksi nyata
		const [sudahJadiPesanan] = await db
			.select({ id: pesananItem.id })
			.from(pesananItem)
			.where(eq(pesananItem.pengajuanHargaId, id));

		if (sudahJadiPesanan) {
			return fail(400, {
				message: 'Percakapan ini sudah jadi pesanan, tidak bisa dihapus. Cek di halaman "Lihat pesanan".'
			});
		}

		try {
			await db.transaction(async (tx) => {
				// hapus semua data anak yang mereferensikan pengajuanHargaId
				await tx.delete(tawaranHarga).where(eq(tawaranHarga.pengajuanHargaId, id));
				await tx.delete(pesanChat).where(eq(pesanChat.pengajuanHargaId, id));

				const hasil = await tx
					.delete(pengajuanHarga)
					.where(and(eq(pengajuanHarga.id, id), eq(pengajuanHarga.pelangganId, pelangganId)))
					.returning({ id: pengajuanHarga.id });

				if (hasil.length === 0) {
					throw new Error('Percakapan tidak ditemukan saat proses hapus');
				}
			});
		} catch (err) {
			// ini yang bikin error asli kelihatan di terminal
			console.error('Gagal hapus percakapan:', err);
			return fail(500, { message: 'Gagal menghapus percakapan, coba lagi' });
		}

		return { success: true };
	}
};