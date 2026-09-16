import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa, users, pengajuanHarga, pesanan, pesananItem, jastiperProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { hitungJarakKm, reverseGeocode } from '$lib/server/jarak';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	// tidak berubah, tetap sama
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

		// hasil GPS, ada isinya kalau pelanggan pakai tombol "gunakan lokasi saya"
		const latMentah = data.get('titikJemputLat')?.toString().trim();
		const lngMentah = data.get('titikJemputLng')?.toString().trim();
		const titikJemputLat = latMentah ? parseFloat(latMentah) : null;
		const titikJemputLng = lngMentah ? parseFloat(lngMentah) : null;
		const pakaiGps =
			titikJemputLat !== null &&
			titikJemputLng !== null &&
			!isNaN(titikJemputLat) &&
			!isNaN(titikJemputLng);

		// Fallback manual (dipakai kalau pelanggan tidak pakai/gagal pakai GPS)
		const titikJemputManual = data.get('titikJemput')?.toString().trim();
		const kotaJemputManual = data.get('kotaJemput')?.toString().trim();

		const titikTujuan = data.get('titikTujuan')?.toString().trim();
		const kotaTujuan = data.get('kotaTujuan')?.toString().trim();
		const metodePembayaran = data.get('metodePembayaran')?.toString();

		// Titik jemput wajib salah satu: GPS ATAU manual lengkap
		if (!pakaiGps && (!kotaJemputManual || !titikJemputManual)) {
			return fail(400, {
				error: 'Pakai lokasi HP, atau isi kabupaten/kota + alamat jemput manual.'
			});
		}

		if (!kotaTujuan) return fail(400, { error: 'Pilih kabupaten/kota tujuan.' });
		if (!titikTujuan) return fail(400, { error: 'Alamat detail tujuan wajib diisi.' });
		if (!metodePembayaran) return fail(400, { error: 'Pilih metode pembayaran.' });

		const [jasaData] = await db.select().from(jasa).where(eq(jasa.id, params.id));
		if (!jasaData || !jasaData.aktif) return fail(400, { error: 'Jasa tidak tersedia.' });

		const titikTujuanLengkap = `${titikTujuan}, ${kotaTujuan}`;

		let jarakKm: number;
		let titikJemputTeks: string;

		try {
			if (pakaiGps) {
				// Koordinat langsung dari HP, tidak perlu ditebak dari teks lagi
				titikJemputTeks = await reverseGeocode(titikJemputLat!, titikJemputLng!);
				jarakKm = await hitungJarakKm(
					{ lat: titikJemputLat!, lon: titikJemputLng! },
					titikTujuan,
					kotaTujuan
				);
			} else {
				titikJemputTeks = `${titikJemputManual}, ${kotaJemputManual}`;
				jarakKm = await hitungJarakKm(
					{ alamat: titikJemputManual as string, kota: kotaJemputManual as string },
					titikTujuan,
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

		// DIUBAH: kalau bayar non-tunai, JANGAN langsung redirect ke WA.
		// Arahkan dulu ke halaman konfirmasi supaya pelanggan lihat totalnya,
		// baru dari sana pelanggan klik tombol untuk lanjut ke WA jastiper.
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
				const waLink = `https://wa.me/${nomorWa}?text=${teksWa}`;

				const paramsKonfirmasi = new URLSearchParams({
					total: String(totalHarga),
					nama: jasaData.nama,
					metode: metodePembayaran,
					jarak: jarakKm.toFixed(1),
					hargaKm: String(jasaData.harga),
					wa: waLink
				});

				throw redirect(
					303,
					`/pelanggan/pesan-jasa/${params.id}/konfirmasi?${paramsKonfirmasi.toString()}`
				);
			}
		}

		throw redirect(303, '/pesanan');
	}
};