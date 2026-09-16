import { LOCATIONIQ_API_KEY } from '$env/static/private';

const BASE_URL = 'https://us1.locationiq.com/v1';
const VIEWBOX_JATIM = '110.9,-8.8,114.6,-6.7';
const BATAS_WAJAR_KM = 300;

interface Koordinat {
	lat: number;
	lon: number;
}

async function geocode(alamatDetail: string, kotaKabupaten: string): Promise<Koordinat> {
	// ... isi fungsi ini TIDAK berubah, tetap sama seperti sebelumnya
	const query = `${alamatDetail}, ${kotaKabupaten}, Jawa Timur, Indonesia`;

	const url =
		`${BASE_URL}/search?key=${LOCATIONIQ_API_KEY}` +
		`&q=${encodeURIComponent(query)}` +
		`&format=json&countrycodes=id&limit=1` +
		`&viewbox=${VIEWBOX_JATIM}&bounded=1`;

	const res = await fetch(url);

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error(
				`Alamat "${alamatDetail}" di ${kotaKabupaten} tidak ditemukan. ` +
					`Coba tulis lebih lengkap (nama jalan + nomor + kelurahan/desa).`
			);
		}
		throw new Error('Gagal menghubungi layanan peta. Coba lagi sebentar lagi.');
	}

	const data = await res.json();
	if (!data || data.length === 0) {
		throw new Error(
			`Alamat "${alamatDetail}" di ${kotaKabupaten} tidak ditemukan. ` +
				`Coba tulis lebih lengkap (nama jalan + nomor + kelurahan/desa).`
		);
	}

	return {
		lat: parseFloat(data[0].lat),
		lon: parseFloat(data[0].lon)
	};
}

/**
 * BARU: ubah koordinat GPS jadi teks alamat yang bisa dibaca jastiper.
 * Dipakai khusus untuk titik jemput hasil lokasi HP.
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
 * DIUBAH: parameter pertama sekarang bisa berupa koordinat GPS langsung
 * (dari titik jemput), atau tetap alamat teks (kalau pelanggan isi manual).
 * Titik tujuan tidak berubah — tetap selalu alamat teks.
 */
export async function hitungJarakKm(
	asal: Koordinat | { alamat: string; kota: string },
	alamatTujuan: string,
	kotaTujuan: string
): Promise<number> {
	// Kalau asal sudah berupa koordinat GPS, langsung pakai — tidak perlu geocode lagi
	const titikAsal: Koordinat = 'lat' in asal ? asal : await geocode(asal.alamat, asal.kota);
	const titikTujuan = await geocode(alamatTujuan, kotaTujuan);

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