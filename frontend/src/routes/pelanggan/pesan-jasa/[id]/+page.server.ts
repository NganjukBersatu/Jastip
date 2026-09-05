import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa, users, pengajuanHarga, pesanan } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { hitungJarakKm } from '$lib/server/jarak';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'pelanggan') throw redirect(303, '/');

	const [jasaData] = await db
		.select({
			id: jasa.id,
			nama: jasa.nama,
			deskripsi: jasa.deskripsi,
			harga: jasa.harga,
			satuan: jasa.satuan,
			gambarUrl: jasa.gambarUrl,
			aktif: jasa.aktif,
			jastiperId: jasa.jastiperId,
			jastiperNama: users.nama
		})
		.from(jasa)
		.innerJoin(users, eq(jasa.jastiperId, users.id))
		.where(eq(jasa.id, params.id));

	if (!jasaData || !jasaData.aktif) throw error(404, 'Jasa tidak ditemukan.');

	return { jasa: jasaData };
};

export const actions: Actions = {
	buatPesanan: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa memesan jasa.' });
		}

		const data = await request.formData();

		const titikJemput = data.get('titikJemput')?.toString().trim();
		const kotaJemput = data.get('kotaJemput')?.toString().trim();
		const titikTujuan = data.get('titikTujuan')?.toString().trim();
		const kotaTujuan = data.get('kotaTujuan')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();

		if (!kotaJemput) return fail(400, { error: 'Pilih kabupaten/kota jemput.' });
		if (!titikJemput) return fail(400, { error: 'Alamat detail jemput wajib diisi.' });
		if (!kotaTujuan) return fail(400, { error: 'Pilih kabupaten/kota tujuan.' });
		if (!titikTujuan) return fail(400, { error: 'Alamat detail tujuan wajib diisi.' });
		if (!metodePembayaran) return fail(400, { error: 'Pilih metode pembayaran.' });

		const [jasaData] = await db.select().from(jasa).where(eq(jasa.id, params.id));
		if (!jasaData || !jasaData.aktif) return fail(400, { error: 'Jasa tidak tersedia.' });

		// Gabungkan supaya di database tetap readable
		const titikJemputLengkap = `${titikJemput}, ${kotaJemput}`;
		const titikTujuanLengkap = `${titikTujuan}, ${kotaTujuan}`;

		let jarakKm: number;
		try {
			jarakKm = await hitungJarakKm(titikJemput, kotaJemput, titikTujuan, kotaTujuan);
		} catch (e) {
			return fail(400, {
				error: e instanceof Error ? e.message : 'Gagal menghitung jarak.'
			});
		}

		const totalHarga = Math.round(jarakKm * jasaData.harga);

		const pengajuanId = randomUUID();
		await db.insert(pengajuanHarga).values({
			id: pengajuanId,
			jasaId: jasaData.id,
			pelangganId: locals.user.id,
			jastiperId: jasaData.jastiperId,
			hargaDiajukan: totalHarga,
			jumlah: 1,
			status: 'diterima'
		});

		const pesananId = randomUUID();
		await db.insert(pesanan).values({
			id: pesananId,
			jasaId: jasaData.id,
			pelangganId: locals.user.id,
			jastiperId: jasaData.jastiperId,
			pengajuanHargaId: pengajuanId,
			jumlah: 1,
			hargaSatuan: jasaData.harga,
			ongkir: 0,
			totalHarga,
			titikJemput: titikJemputLengkap, // sudah termasuk kota
			alamatKirim: titikTujuanLengkap, // sudah termasuk kota
			jarakKm,
			metodePembayaran,
			status: 'menunggu_konfirmasi'
		});

		throw redirect(303, '/pesanan');
	}
};