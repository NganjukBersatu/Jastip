import { LOCATIONIQ_API_KEY } from '$env/static/private';

// Ganti 'us1' jadi 'eu1' kalau dashboard LocationIQ kamu menunjukkan server EU
const BASE_URL = 'https://us1.locationiq.com/v1';

// Kotak batas kasar wilayah Jawa Timur (termasuk Madura)
const VIEWBOX_JATIM = '110.9,-8.8,114.6,-6.7';

// Kalau hasil hitungan lebih jauh dari ini, kemungkinan besar geocoding salah
const BATAS_WAJAR_KM = 300;

interface Koordinat {
	lat: number;
	lon: number;
}

/**
 * Geocode alamat dengan konteks kota/kabupaten yang dipilih user.
 * Contoh query yang dihasilkan: "Jl. Diponegoro No.12, Nganjuk, Jawa Timur, Indonesia"
 */
async function geocode(alamatDetail: string, kotaKabupaten: string): Promise<Koordinat> {
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
 * Hitung jarak (km) antara dua titik.
 * Sekarang menerima kota/kabupaten terpisah agar geocoding lebih akurat.
 */
export async function hitungJarakKm(
	alamatAsal: string,
	kotaAsal: string,
	alamatTujuan: string,
	kotaTujuan: string
): Promise<number> {
	const asal = await geocode(alamatAsal, kotaAsal);
	const tujuan = await geocode(alamatTujuan, kotaTujuan);

	const url =
		`${BASE_URL}/directions/driving/${asal.lon},${asal.lat};${tujuan.lon},${tujuan.lat}` +
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