import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, pesananItem, produk, jasa, users } from '$lib/server/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/jastiper/dashboard');

	const headerMentah = await db
		.select({
			id: pesanan.id,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			status: pesanan.status,
			pembayaranDikonfirmasi: pesanan.pembayaranDikonfirmasi,
			alamatKirim: pesanan.alamatKirim,
			metodePembayaran: pesanan.metodePembayaran,
			createdAt: pesanan.createdAt,
			jastiperNama: users.nama
		})
		.from(pesanan)
		.innerJoin(users, eq(pesanan.jastiperId, users.id))
		.where(eq(pesanan.pelangganId, locals.user.id))
		.orderBy(desc(pesanan.createdAt));

	if (headerMentah.length === 0) {
		return { daftarPesanan: [] };
	}

	const pesananIds = headerMentah.map((h) => h.id);

	const semuaItem = await db
		.select({
			id: pesananItem.id,
			pesananId: pesananItem.pesananId,
			jumlah: pesananItem.jumlah,
			hargaSatuan: pesananItem.hargaSatuan,
			titikJemput: pesananItem.titikJemput,
			jarakKm: pesananItem.jarakKm,
			pengajuanHargaId: pesananItem.pengajuanHargaId,
			produkNama: produk.nama,
			jasaNama: jasa.nama,
			jasaId: pesananItem.jasaId
		})
		.from(pesananItem)
		.leftJoin(produk, eq(pesananItem.produkId, produk.id))
		.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
		.where(inArray(pesananItem.pesananId, pesananIds));

	const itemByPesanan: Record<string, typeof semuaItem> = {};
	for (const it of semuaItem) {
		(itemByPesanan[it.pesananId] ??= []).push(it);
	}

	const daftarPesanan = headerMentah.map((h) => {
		const items = (itemByPesanan[h.id] ?? []).map((it) => ({
			...it,
			nama: it.produkNama ?? it.jasaNama ?? 'Item'
		}));
		const isJasa = items.some((it) => it.jasaId != null);
		const namaItem =
			items.length === 0
				? 'Item'
				: items.length === 1
					? items[0].nama
					: `${items[0].nama} & ${items.length - 1} lainnya`;

		return {
			...h,
			items,
			isJasa,
			namaItem,
			jarakKm: items[0]?.jarakKm ?? null,
			titikJemput: items[0]?.titikJemput ?? null,
			pengajuanHargaId: items[0]?.pengajuanHargaId ?? null
		};
	});

	return { daftarPesanan };
};

export const actions: Actions = {
	batalkan: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID pesanan tidak ditemukan.' });

		const [row] = await db
			.select({ id: pesanan.id, status: pesanan.status })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.pelangganId, locals.user.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });
		if (row.status !== 'menunggu_konfirmasi') {
			return fail(400, { error: 'Pesanan ini sudah diproses, tidak bisa dibatalkan lagi.' });
		}

		await db
			.update(pesanan)
			.set({ status: 'dibatalkan', updatedAt: new Date() })
			.where(eq(pesanan.id, id));

		return { success: true };
	},

	hapusRiwayat: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID pesanan tidak ditemukan.' });

		const [row] = await db
			.select({ id: pesanan.id, status: pesanan.status })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.pelangganId, locals.user.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });

		if (row.status !== 'selesai' && row.status !== 'dibatalkan') {
			return fail(400, { error: 'Pesanan yang masih berjalan tidak bisa dihapus dari riwayat.' });
		}

		await db.delete(pesanan).where(eq(pesanan.id, id));

		return { success: true };
	}
};