import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	pengajuanHarga,
	produk,
	jasa,
	users,
	pesanChat,
	tawaranHarga,
	ongkirWilayah,
	pesanan,
	pesananItem,
	jastiperProfiles
} from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
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
			jastiperId: pengajuanHarga.jastiperId,
			produkId: pengajuanHarga.produkId,
			jasaId: pengajuanHarga.jasaId,
			produkNama: produk.nama,
			jasaNama: jasa.nama,
			jastiperNama: users.nama,
			// BARU: nomor WA jastiper — dipakai buat arahkan pelanggan konfirmasi
			// pembayaran non-COD lewat WA, karena web tidak simpan no rekening/e-wallet.
			jastiperNoWa: jastiperProfiles.noWa
		})
		.from(pengajuanHarga)
		.innerJoin(users, eq(pengajuanHarga.jastiperId, users.id))
		.leftJoin(produk, eq(pengajuanHarga.produkId, produk.id))
		.leftJoin(jasa, eq(pengajuanHarga.jasaId, jasa.id))
		.leftJoin(jastiperProfiles, eq(jastiperProfiles.userId, pengajuanHarga.jastiperId))
		.where(
			and(
				eq(pengajuanHarga.id, params.id),
				eq(pengajuanHarga.pelangganId, locals.user!.id)
			)
		);

	if (!item) throw error(404, 'Percakapan tidak ditemukan.');

	const namaItem = item.produkNama ?? item.jasaNama ?? 'Item';

	const daftarWilayah = await db
		.select({
			id: ongkirWilayah.id,
			wilayah: ongkirWilayah.wilayah,
			biaya: ongkirWilayah.biaya
		})
		.from(ongkirWilayah)
		.where(eq(ongkirWilayah.jastiperId, item.jastiperId));

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

	const [pesananTerkait] = await db
		.select({
			id: pesananItem.pesananId,
			status: pesanan.status
		})
		.from(pesananItem)
		.innerJoin(pesanan, eq(pesananItem.pesananId, pesanan.id))
		.where(eq(pesananItem.pengajuanHargaId, params.id));

	return {
		item: { ...item, namaItem },
		daftarWilayah,
		daftarPesan,
		daftarTawaran,
		pesananId: pesananTerkait?.id ?? null,
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

	tandaiDibaca: async ({ params, locals }) => {
		await tandaiSudahDibaca(params.id, locals.user!.id);
		return { success: true };
	},

	hapusPesan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const pesanId = data.get('pesanId')?.toString();

		if (!pesanId) return fail(400, { error: 'ID pesan tidak valid.' });

		const [pesan] = await db
			.select({ id: pesanChat.id, pengirimId: pesanChat.pengirimId })
			.from(pesanChat)
			.where(
				and(
					eq(pesanChat.id, pesanId),
					eq(pesanChat.pengajuanHargaId, params.id)
				)
			);

		if (!pesan) return fail(404, { error: 'Pesan tidak ditemukan.' });

		if (pesan.pengirimId !== locals.user!.id) {
			return fail(403, { error: 'Tidak boleh menghapus pesan ini.' });
		}

		await db.delete(pesanChat).where(eq(pesanChat.id, pesanId));

		return { success: true };
	},

	editPesan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const pesanId = data.get('pesanId')?.toString();
		const isiBaru = data.get('isi')?.toString().trim();

		if (!pesanId) return fail(400, { error: 'ID pesan tidak valid.' });
		if (!isiBaru) return fail(400, { error: 'Pesan tidak boleh kosong.' });

		const [pesan] = await db
			.select({ id: pesanChat.id, pengirimId: pesanChat.pengirimId })
			.from(pesanChat)
			.where(
				and(
					eq(pesanChat.id, pesanId),
					eq(pesanChat.pengajuanHargaId, params.id)
				)
			);

		if (!pesan) return fail(404, { error: 'Pesan tidak ditemukan.' });

		if (pesan.pengirimId !== locals.user!.id) {
			return fail(403, { error: 'Tidak boleh mengedit pesan ini.' });
		}

		await db
			.update(pesanChat)
			.set({ isi: isiBaru })
			.where(eq(pesanChat.id, pesanId));

		return { success: true, pesanId, isiBaru };
	},

	ajukanTawaran: async ({ request, params, locals }) => {
		const data = await request.formData();
		const harga = Number(data.get('harga'));
		const jumlah = Number(data.get('jumlah'));

		if (!harga || harga < 1) return fail(400, { error: 'Harga tidak valid.' });
		if (!jumlah || jumlah < 1) return fail(400, { error: 'Jumlah tidak valid.' });

		const [row] = await db
			.select({ id: pengajuanHarga.id, status: pengajuanHarga.status })
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.pelangganId, locals.user!.id)
				)
			);

		if (!row) return fail(404, { error: 'Percakapan tidak ditemukan.' });

		if (row.status === 'diterima') {
			return fail(400, { error: 'Harga sudah disepakati dan tidak bisa diubah lagi.' });
		}

		await db.insert(tawaranHarga).values({
			id: crypto.randomUUID(),
			pengajuanHargaId: params.id,
			pengirimId: locals.user!.id,
			harga,
			jumlah,
			status: 'menunggu'
		});

		await db
			.update(pengajuanHarga)
			.set({
				hargaDiajukan: harga,
				jumlah: jumlah,
				status: 'menunggu'
			})
			.where(eq(pengajuanHarga.id, params.id));

		return { success: true };
	},

	konfirmasiPesanan: async ({ request, params, locals }) => {
		const data = await request.formData();
		const wilayahId = data.get('wilayahId')?.toString();
		const alamatLengkap = data.get('alamatLengkap')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();

		if (!wilayahId) return fail(400, { error: 'Pilih wilayah tujuan dulu.' });
		if (!alamatLengkap) return fail(400, { error: 'Alamat lengkap wajib diisi.' });
		if (!metodePembayaran || !['transfer_bank', 'e_wallet', 'cod'].includes(metodePembayaran)) {
			return fail(400, { error: 'Pilih metode pembayaran.' });
		}

		const [row] = await db
			.select({
				id: pengajuanHarga.id,
				status: pengajuanHarga.status,
				produkId: pengajuanHarga.produkId,
				jasaId: pengajuanHarga.jasaId,
				jastiperId: pengajuanHarga.jastiperId,
				hargaDiajukan: pengajuanHarga.hargaDiajukan,
				jumlah: pengajuanHarga.jumlah
			})
			.from(pengajuanHarga)
			.where(
				and(
					eq(pengajuanHarga.id, params.id),
					eq(pengajuanHarga.pelangganId, locals.user!.id)
				)
			);

		if (!row) return fail(404, { error: 'Percakapan tidak ditemukan.' });

		if (row.status !== 'diterima') {
			return fail(400, { error: 'Tawaran ini belum diterima jastiper.' });
		}

		const [sudahAda] = await db
			.select({ id: pesananItem.id })
			.from(pesananItem)
			.where(eq(pesananItem.pengajuanHargaId, params.id));

		if (sudahAda) {
			return fail(400, { error: 'Pesanan untuk tawaran ini sudah pernah dibuat.' });
		}

		const [wilayah] = await db
			.select({ id: ongkirWilayah.id, biaya: ongkirWilayah.biaya })
			.from(ongkirWilayah)
			.where(and(eq(ongkirWilayah.id, wilayahId), eq(ongkirWilayah.jastiperId, row.jastiperId)));

		if (!wilayah) return fail(400, { error: 'Wilayah tidak valid.' });

		const ongkirBiaya = wilayah.biaya;
		const totalHarga = row.hargaDiajukan * row.jumlah + ongkirBiaya;
		const pesananId = crypto.randomUUID();

		await db.insert(pesanan).values({
			id: pesananId,
			pelangganId: locals.user!.id,
			jastiperId: row.jastiperId,
			ongkir: ongkirBiaya,
			totalHarga,
			alamatKirim: alamatLengkap,
			wilayahId: wilayah.id,
			metodePembayaran,
			status: 'menunggu_konfirmasi'
		});

		await db.insert(pesananItem).values({
			id: crypto.randomUUID(),
			pesananId,
			produkId: row.produkId,
			jasaId: row.jasaId,
			pengajuanHargaId: row.id,
			jumlah: row.jumlah,
			hargaSatuan: row.hargaDiajukan
		});

		return { success: true, pesananId };
	}
};