import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, pesananItem, produk, jasa, users, ongkirWilayah } from '$lib/server/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

const STATUS_AKTIF = ['menunggu_konfirmasi', 'dibelanjakan', 'dikirim'] as const;

export const load: PageServerLoad = async ({ locals }) => {
	const jastiperId = locals.user!.id;

	const headerMentah = await db
		.select({
			id: pesanan.id,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			alamatKirim: pesanan.alamatKirim,
			metodePembayaran: pesanan.metodePembayaran,
			status: pesanan.status,
			createdAt: pesanan.createdAt,
			pelangganNama: users.nama,
			pembayaranDikonfirmasi: pesanan.pembayaranDikonfirmasi,
			wilayahNama: ongkirWilayah.wilayah
		})
		.from(pesanan)
		.innerJoin(users, eq(pesanan.pelangganId, users.id))
		.leftJoin(ongkirWilayah, eq(pesanan.wilayahId, ongkirWilayah.id))
		.where(eq(pesanan.jastiperId, jastiperId))
		.orderBy(desc(pesanan.createdAt));

	if (headerMentah.length === 0) {
		return { pesananAktif: [], riwayat: [], kelompokSatuJalur: [] };
	}

	const pesananIds = headerMentah.map((h) => h.id);

	// BARU: ambil item semua pesanan sekaligus, lalu kelompokkan per pesananId
	const semuaItem = await db
		.select({
			id: pesananItem.id,
			pesananId: pesananItem.pesananId,
			jumlah: pesananItem.jumlah,
			hargaSatuan: pesananItem.hargaSatuan,
			titikJemput: pesananItem.titikJemput,
			jarakKm: pesananItem.jarakKm,
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

	const denganItem = headerMentah.map((h) => {
		const items = (itemByPesanan[h.id] ?? []).map((it) => ({
			...it,
			nama: it.produkNama ?? it.jasaNama ?? 'Item'
		}));
		const totalPcs = items.reduce((s, it) => s + it.jumlah, 0);
		const isJasa = items.some((it) => it.jasaId != null);
		// Ringkasan nama untuk judul kartu — kalau lebih dari 1 item,
		// tampilkan item pertama + "& N lainnya"
		const namaItem =
			items.length === 0
				? 'Item'
				: items.length === 1
					? items[0].nama
					: `${items[0].nama} & ${items.length - 1} lainnya`;

		return { ...h, items, jumlah: totalPcs, isJasa, namaItem };
	});

	const semuaAktif = denganItem.filter((p) =>
		STATUS_AKTIF.includes(p.status as (typeof STATUS_AKTIF)[number])
	);
	const riwayat = denganItem.filter(
		(p) => !STATUS_AKTIF.includes(p.status as (typeof STATUS_AKTIF)[number])
	);

	// Grup satu jalur tetap dibentuk per wilayah, khusus non-jasa —
	// sekarang mengelompokkan TRANSAKSI (yang bisa berisi banyak item), bukan per item.
	const kelompokWilayah: Record<string, typeof semuaAktif> = {};
	for (const p of semuaAktif) {
		if (p.isJasa) continue;
		if (!p.wilayahNama) continue;
		(kelompokWilayah[p.wilayahNama] ??= []).push(p);
	}

	const kelompokSatuJalur = Object.entries(kelompokWilayah)
		.filter(([, daftar]) => daftar.length >= 2)
		.map(([wilayah, daftar]) => ({ wilayah, daftar }));

	const idDiGrup = new Set(kelompokSatuJalur.flatMap((k) => k.daftar.map((p) => p.id)));
	const pesananAktif = semuaAktif.filter((p) => !idDiGrup.has(p.id));

	return { pesananAktif, riwayat, kelompokSatuJalur };
};

async function ubahStatusBanyak(
	ids: string[],
	jastiperId: string,
	statusBaru: 'dibelanjakan' | 'dikirim'
) {
	if (ids.length === 0) return fail(400, { error: 'Tidak ada pesanan dipilih.' });

	const rows = await db
		.select({ id: pesanan.id, status: pesanan.status })
		.from(pesanan)
		.where(and(eq(pesanan.jastiperId, jastiperId), inArray(pesanan.id, ids)));

	if (rows.length === 0) return fail(404, { error: 'Pesanan tidak ditemukan.' });

	const validIds =
		statusBaru === 'dibelanjakan'
			? rows.filter((r) => r.status === 'menunggu_konfirmasi').map((r) => r.id)
			: rows
					.filter((r) => r.status === 'dibelanjakan' || r.status === 'menunggu_konfirmasi')
					.map((r) => r.id);

	const dilewati = rows.length - validIds.length;

	if (validIds.length === 0) {
		return fail(400, {
			error: 'Tidak ada pesanan yang bisa diubah statusnya (cek status masing-masing).'
		});
	}

	await db
		.update(pesanan)
		.set({ status: statusBaru, updatedAt: new Date() })
		.where(inArray(pesanan.id, validIds));

	const kata = statusBaru === 'dibelanjakan' ? 'mulai dibelanjakan' : 'mulai diantar';

	return {
		sukses: true,
		pesan:
			dilewati > 0
				? `${validIds.length} pesanan ${kata}. ${dilewati} dilewati karena statusnya tidak cocok.`
				: `${validIds.length} pesanan ${kata}.`
	};
}

async function ubahStatusSelesaiBanyak(ids: string[], jastiperId: string) {
	if (ids.length === 0) return fail(400, { error: 'Tidak ada pesanan dipilih.' });

	const rows = await db
		.select({ id: pesanan.id, status: pesanan.status, metodePembayaran: pesanan.metodePembayaran })
		.from(pesanan)
		.where(and(eq(pesanan.jastiperId, jastiperId), inArray(pesanan.id, ids)));

	if (rows.length === 0) return fail(404, { error: 'Pesanan tidak ditemukan.' });

	const valid = rows.filter((r) => STATUS_AKTIF.includes(r.status as (typeof STATUS_AKTIF)[number]));
	const dilewati = rows.length - valid.length;

	if (valid.length === 0) {
		return fail(400, {
			error: 'Tidak ada pesanan yang bisa ditandai selesai (cek status masing-masing).'
		});
	}

	const idsCod = valid.filter((r) => r.metodePembayaran === 'cod').map((r) => r.id);
	const idsNonCod = valid.filter((r) => r.metodePembayaran !== 'cod').map((r) => r.id);

	if (idsCod.length > 0) {
		await db
			.update(pesanan)
			.set({ status: 'selesai', pembayaranDikonfirmasi: true, dibayarPada: new Date(), updatedAt: new Date() })
			.where(inArray(pesanan.id, idsCod));
	}
	if (idsNonCod.length > 0) {
		await db
			.update(pesanan)
			.set({ status: 'selesai', updatedAt: new Date() })
			.where(inArray(pesanan.id, idsNonCod));
	}

	return {
		sukses: true,
		pesan:
			dilewati > 0
				? `${valid.length} pesanan ditandai selesai. ${dilewati} dilewati karena statusnya tidak cocok.`
				: `${valid.length} pesanan ditandai selesai.`
	};
}

export const actions: Actions = {
	mulaiBelanja: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatusBanyak([id], locals.user!.id, 'dibelanjakan');
	},

	mulaiBelanjaMassal: async ({ request, locals }) => {
		const data = await request.formData();
		const ids = data.getAll('ids').map((v) => v.toString()).filter(Boolean);
		return ubahStatusBanyak(ids, locals.user!.id, 'dibelanjakan');
	},

	tandaiLunas: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });

		const [row] = await db
			.select({ id: pesanan.id })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.jastiperId, locals.user!.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });

		await db
			.update(pesanan)
			.set({ pembayaranDikonfirmasi: true, dibayarPada: new Date() })
			.where(eq(pesanan.id, id));

		return { sukses: true, pesan: 'Pembayaran ditandai lunas.' };
	},

	mulaiAntar: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		return ubahStatusBanyak([id], locals.user!.id, 'dikirim');
	},

	mulaiAntarMassal: async ({ request, locals }) => {
		const data = await request.formData();
		const ids = data.getAll('ids').map((v) => v.toString()).filter(Boolean);
		return ubahStatusBanyak(ids, locals.user!.id, 'dikirim');
	},

	selesaikan: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });

		const [row] = await db
			.select({ id: pesanan.id, metodePembayaran: pesanan.metodePembayaran })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.jastiperId, locals.user!.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });

		await db
			.update(pesanan)
			.set({
				status: 'selesai',
				updatedAt: new Date(),
				...(row.metodePembayaran === 'cod'
					? { pembayaranDikonfirmasi: true, dibayarPada: new Date() }
					: {})
			})
			.where(eq(pesanan.id, id));

		return { sukses: true, pesan: 'Pesanan ditandai selesai.' };
	},

	selesaikanMassal: async ({ request, locals }) => {
		const data = await request.formData();
		const ids = data.getAll('ids').map((v) => v.toString()).filter(Boolean);
		return ubahStatusSelesaiBanyak(ids, locals.user!.id);
	},

	batalkan: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });

		const [row] = await db
			.select({ id: pesanan.id })
			.from(pesanan)
			.where(and(eq(pesanan.id, id), eq(pesanan.jastiperId, locals.user!.id)));

		if (!row) return fail(404, { error: 'Pesanan tidak ditemukan.' });

		await db
			.update(pesanan)
			.set({ status: 'dibatalkan', updatedAt: new Date() })
			.where(eq(pesanan.id, id));

		return { sukses: true, pesan: 'Pesanan dibatalkan.' };
	}
};