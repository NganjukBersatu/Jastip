import { LOCATIONIQ_API_KEY } from '$env/static/private';

const BASE_URL = 'https://us1.locationiq.com/v1';
const VIEWBOX_JATIM = '110.9,-8.8,114.6,-6.7';
const BATAS_WAJAR_KM = 300;

interface Koordinat {
	lat: number;
	lon: number;
}

async function geocode(
	alamatDetail: string,
	kecamatan: string,
	kotaKabupaten: string
): Promise<Koordinat> {
	// DIUBAH LAGI: balik pakai free-text search ("q") alih-alih structured
	// search (street/city/county terpisah). Structured search sering
	// mengembalikan 0 hasil untuk alamat di desa kecil karena data OSM-nya
	// tidak selalu lengkap per-field, padahal alamatnya sendiri valid dan
	// ada. Free-text lebih toleran karena Nominatim boleh mem-parsing
	// hierarki alamat sendiri dari satu string.
	const query = `${alamatDetail}, Kecamatan ${kecamatan}, ${kotaKabupaten}, Jawa Timur, Indonesia`;

	const url =
		`${BASE_URL}/search?key=${LOCATIONIQ_API_KEY}` +
		`&q=${encodeURIComponent(query)}` +
		`&format=json&countrycodes=id&limit=5&addressdetails=1` +
		`&viewbox=${VIEWBOX_JATIM}&bounded=1&dedupe=1`;

	const res = await fetch(url);

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error(
				`Alamat "${alamatDetail}" di kecamatan ${kecamatan}, ${kotaKabupaten} tidak ditemukan. ` +
					`Coba tulis lebih lengkap (nama jalan + nomor + kelurahan/desa).`
			);
		}
		throw new Error('Gagal menghubungi layanan peta. Coba lagi sebentar lagi.');
	}

	const data = await res.json();
	if (!data || data.length === 0) {
		throw new Error(
			`Alamat "${alamatDetail}" di kecamatan ${kecamatan}, ${kotaKabupaten} tidak ditemukan. ` +
				`Coba tulis lebih lengkap (nama jalan + nomor + kelurahan/desa).`
		);
	}

	const kotaKunci = kotaKabupaten
		.replace(/^Kabupaten\s+/i, '')
		.replace(/^Kota\s+/i, '')
		.trim()
		.toLowerCase();
	const kecamatanKunci = kecamatan.trim().toLowerCase();

	// BARU: ambil "nama inti" dari alamat detail (bagian sebelum koma pertama,
	// tanpa prefix "Jalan"/"Jl"/"Gang") supaya bisa dicek apakah hasil
	// pencarian benar-benar menyebut nama jalan/tempat ini — bukan cuma
	// jatuh ke titik pusat kecamatan/kabupaten (itu sebabnya dua alamat
	// berbeda bisa menghasilkan jarak yang sama persis).
	const namaInti = alamatDetail
		.split(',')[0]
		.replace(/^\s*(jalan|jl\.?|gang|gg\.?)\s+/i, '')
		.trim()
		.toLowerCase();

	type Kandidat = { lat: string; lon: string; address?: Record<string, string>; display_name?: string };

	const cekKabupaten = (item: Kandidat) =>
		(item.address?.county ?? '').toLowerCase().includes(kotaKunci) ||
		(item.display_name ?? '').toLowerCase().includes(kotaKunci);

	const cekKecamatan = (item: Kandidat) =>
		[
			item.address?.city,
			item.address?.suburb,
			item.address?.village,
			item.address?.town,
			item.address?.city_district
		]
			.filter(Boolean)
			.some((v) => (v as string).toLowerCase().includes(kecamatanKunci));

	const cekNamaJalan = (item: Kandidat) =>
		!!namaInti &&
		((item.address?.road ?? '').toLowerCase().includes(namaInti) ||
			(item.display_name ?? '').toLowerCase().includes(namaInti));

	// DIUBAH: validasi bertingkat — utamakan kandidat yang nama jalan/tempatnya
	// benar-benar ketemu (bukti bukan sekadar titik pusat wilayah), baru
	// longgarkan bertahap kalau tidak ada. Ini mencegah dua alamat berbeda
	// diam-diam berakhir di titik yang sama.
	const kandidatCocok =
		data.find((item: Kandidat) => cekNamaJalan(item) && cekKecamatan(item) && cekKabupaten(item)) ??
		data.find((item: Kandidat) => cekNamaJalan(item) && cekKabupaten(item)) ??
		data.find((item: Kandidat) => cekKecamatan(item) && cekKabupaten(item)) ??
		data.find((item: Kandidat) => cekKabupaten(item));

	if (!kandidatCocok) {
		throw new Error(
			`Alamat "${alamatDetail}" tidak ditemukan persis di kecamatan ${kecamatan}, ${kotaKabupaten}. ` +
				`Coba tulis lebih spesifik (nama jalan + nomor + kelurahan/desa) ` +
				`atau periksa lagi kecamatan/kabupaten yang dipilih.`
		);
	}

	return {
		lat: parseFloat(kandidatCocok.lat),
		lon: parseFloat(kandidatCocok.lon)
	};
}

/**
 * Ubah koordinat GPS jadi teks alamat yang bisa dibaca jastiper.
 * Dipakai khusus untuk titik jemput hasil lokasi HP. Tidak berubah.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
	const url = `${BASE_URL}/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`;

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error('Gagal mengubah koordinat jadi alamat.');
	}

	const data = await res.json();
	if (!data?.display_name) {
		throw new Error('Alamat untuk lokasi ini tidak ditemukan.');
	}

	return data.display_name;
}

/**
 * DIUBAH: parameter alamat manual (asal maupun tujuan) sekarang wajib
 * menyertakan kecamatan, bukan cuma alamat detail + kabupaten/kota.
 * Titik jemput tetap bisa berupa koordinat GPS langsung (tidak berubah).
 */
export async function hitungJarakKm(
	asal: Koordinat | { alamat: string; kecamatan: string; kota: string },
	alamatTujuan: string,
	kecamatanTujuan: string,
	kotaTujuan: string
): Promise<number> {
	// Kalau asal sudah berupa koordinat GPS, langsung pakai — tidak perlu geocode lagi
	const titikAsal: Koordinat =
		'lat' in asal ? asal : await geocode(asal.alamat, asal.kecamatan, asal.kota);
	const titikTujuan = await geocode(alamatTujuan, kecamatanTujuan, kotaTujuan);

	const url =
		`${BASE_URL}/directions/driving/${titikAsal.lon},${titikAsal.lat};${titikTujuan.lon},${titikTujuan.lat}` +
		`?key=${LOCATIONIQ_API_KEY}&overview=false&annotations=false`;

	const res = await fetch(url);
	if (!res.ok) throw new Error('Gagal menghitung rute.');

	const data = await res.json();
	if (data.code !== 'Ok' || !data.routes?.[0]) {
		throw new Error('Rute antara dua titik ini tidak ditemukan.');
	}

	const meter = data.routes[0].distance;
	const km = Math.round((meter / 1000) * 10) / 10;

	if (km > BATAS_WAJAR_KM) {
		throw new Error(
			'Jarak yang terhitung terlalu jauh untuk area Jawa Timur — kemungkinan salah satu ' +
				'alamat kurang spesifik. Coba periksa lagi kota/kabupaten dan detail alamatnya.'
		);
	}

	return km;
}