import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa, jastiperProfiles, pesanan, pesananItem, produk, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (locals.user?.role !== 'admin') throw error(403, 'Halaman ini hanya untuk admin.');

	const pembeliU = alias(users, 'pembeli_u');
	const jastiperU = alias(users, 'jastiper_u');

	const [p] = await db
		.select({
			id: pesanan.id,
			status: pesanan.status,
			ongkir: pesanan.ongkir,
			totalHarga: pesanan.totalHarga,
			alamatKirim: pesanan.alamatKirim,
			metodePembayaran: pesanan.metodePembayaran,
			pembayaranDikonfirmasi: pesanan.pembayaranDikonfirmasi,
			dibayarPada: pesanan.dibayarPada,
			createdAt: pesanan.createdAt,
			updatedAt: pesanan.updatedAt,
			pembeliNama: pembeliU.nama,
			pembeliEmail: pembeliU.email,
			jastiperId: pesanan.jastiperId,
			jastiperNama: jastiperU.nama,
			jastiperEmail: jastiperU.email
		})
		.from(pesanan)
		.innerJoin(pembeliU, eq(pesanan.pelangganId, pembeliU.id))
		.innerJoin(jastiperU, eq(pesanan.jastiperId, jastiperU.id))
		.where(eq(pesanan.id, params.id));

	if (!p) throw error(404, 'Pesanan tidak ditemukan.');

	const [profil] = await db
		.select({ noWa: jastiperProfiles.noWa })
		.from(jastiperProfiles)
		.where(eq(jastiperProfiles.userId, p.jastiperId));

	const items = await db
		.select({
			id: pesananItem.id,
			jumlah: pesananItem.jumlah,
			hargaSatuan: pesananItem.hargaSatuan,
			titikJemput: pesananItem.titikJemput,
			produkNama: produk.nama,
			jasaNama: jasa.nama
		})
		.from(pesananItem)
		.leftJoin(produk, eq(pesananItem.produkId, produk.id))
		.leftJoin(jasa, eq(pesananItem.jasaId, jasa.id))
		.where(eq(pesananItem.pesananId, p.id));

	return {
		pesanan: p,
		jastiperWa: profil?.noWa ?? null,
		items: items.map((i) => ({ ...i, nama: i.produkNama ?? i.jasaNama ?? 'Item' }))
	};
};