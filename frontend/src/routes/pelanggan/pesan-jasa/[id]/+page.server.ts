import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa, users, pengajuanHarga, pesanan, pesananItem, jastiperProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { hitungJarakKm, reverseGeocode } from '$lib/server/jarak';
import { JASA_AKTIF } from '$lib/config';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	// BARU: 404 kalau fitur jasa sedang dimatikan, sebelum query apa pun
	if (!JASA_AKTIF) throw error(404, 'Fitur jasa sedang tidak tersedia.');

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
		// BARU: tolak submit kalau fitur jasa sedang dimatikan
		if (!JASA_AKTIF) return fail(400, { error: 'Fitur jasa sedang tidak tersedia.' });

		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'pelanggan') {
			return fail(403, { error: 'Hanya pelanggan yang bisa memesan jasa.' });
		}

		const data = await request.formData();

		const latMentah = data.get('titikJemputLat')?.toString().trim();
		const lngMentah = data.get('titikJemputLng')?.toString().trim();
		const titikJemputLat = latMentah ? parseFloat(latMentah) : null;
		const titikJemputLng = lngMentah ? parseFloat(lngMentah) : null;
		const pakaiGps =
			titikJemputLat !== null &&
			titikJemputLng !== null &&
			!isNaN(titikJemputLat) &&
			!isNaN(titikJemputLng);

		const titikJemputManual = data.get('titikJemput')?.toString().trim();
		const kecamatanJemputManual = data.get('kecamatanJemput')?.toString().trim();
		const kotaJemputManual = data.get('kotaJemput')?.toString().trim();

		const titikTujuan = data.get('titikTujuan')?.toString().trim();
		const kecamatanTujuan = data.get('kecamatanTujuan')?.toString().trim();
		const kotaTujuan = data.get('kotaTujuan')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();

		if (!pakaiGps && (!kotaJemputManual || !titikJemputManual || !kecamatanJemputManual)) {
			return fail(400, {
				error: 'Pakai lokasi HP, atau isi kabupaten/kota + kecamatan + alamat jemput manual.'
			});
		}

		if (!kotaTujuan) return fail(400, { error: 'Pilih kabupaten/kota tujuan.' });
		if (!kecamatanTujuan) return fail(400, { error: 'Kecamatan tujuan wajib diisi.' });
		if (!titikTujuan) return fail(400, { error: 'Alamat detail tujuan wajib diisi.' });
		if (!metodePembayaran) return fail(400, { error: 'Pilih metode pembayaran.' });

		const [jasaData] = await db.select().from(jasa).where(eq(jasa.id, params.id));
		if (!jasaData || !jasaData.aktif) return fail(400, { error: 'Jasa tidak tersedia.' });

		const titikTujuanLengkap = `${titikTujuan}, ${kecamatanTujuan}, ${kotaTujuan}`;

		let jarakKm: number;
		let titikJemputTeks: string;

		try {
			if (pakaiGps) {
				titikJemputTeks = await reverseGeocode(titikJemputLat!, titikJemputLng!);
				jarakKm = await hitungJarakKm(
					{ lat: titikJemputLat!, lon: titikJemputLng! },
					titikTujuan,
					kecamatanTujuan,
					kotaTujuan
				);
			} else {
				titikJemputTeks = `${titikJemputManual}, ${kecamatanJemputManual}, ${kotaJemputManual}`;
				jarakKm = await hitungJarakKm(
					{
						alamat: titikJemputManual as string,
						kecamatan: kecamatanJemputManual as string,
						kota: kotaJemputManual as string
					},
					titikTujuan,
					kecamatanTujuan,
					kotaTujuan
				);
			}
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
			pelangganId: locals.user.id,
			jastiperId: jasaData.jastiperId,
			ongkir: 0,
			totalHarga,
			alamatKirim: titikTujuanLengkap,
			metodePembayaran,
			status: 'menunggu_konfirmasi'
		});

		await db.insert(pesananItem).values({
			id: randomUUID(),
			pesananId,
			jasaId: jasaData.id,
			pengajuanHargaId: pengajuanId,
			jumlah: 1,
			hargaSatuan: jasaData.harga,
			titikJemput: titikJemputTeks,
			titikJemputLat: pakaiGps ? titikJemputLat : null,
			titikJemputLng: pakaiGps ? titikJemputLng : null,
			jarakKm
		});

		const paramsKonfirmasi = new URLSearchParams({
			total: String(totalHarga),
			nama: jasaData.nama,
			metode: metodePembayaran,
			jarak: jarakKm.toFixed(1),
			hargaKm: String(jasaData.harga)
		});

		if (metodePembayaran === 'transfer' || metodePembayaran === 'e-wallet') {
			const [profil] = await db
				.select({ noWa: jastiperProfiles.noWa })
				.from(jastiperProfiles)
				.where(eq(jastiperProfiles.userId, jasaData.jastiperId));

			if (profil?.noWa) {
				const nomorWa = profil.noWa.replace(/^0/, '62').replace(/\D/g, '');
				const teksWa = encodeURIComponent(
					`Halo, saya sudah pesan jasa "${jasaData.nama}" via Nitip dengan total ${totalHarga}. Saya mau konfirmasi pembayaran ${
						metodePembayaran === 'transfer' ? 'transfer bank' : 'e-wallet'
					}.`
				);
				paramsKonfirmasi.set('wa', `https://wa.me/${nomorWa}?text=${teksWa}`);
			}
		}

		throw redirect(
			303,
			`/pelanggan/pesan-jasa/${params.id}/konfirmasi?${paramsKonfirmasi.toString()}`
		);
	}
};