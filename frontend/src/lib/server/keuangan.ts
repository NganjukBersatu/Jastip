// Pengaturan keuangan. Ubah di sini kalau aturannya berubah.

// Persen dari total pesanan yang ditahan Nitip sebagai biaya platform (0 = tidak ada potongan).
export const POTONGAN_PLATFORM_PERSEN = 0;

// Ukuran maksimal file struk (byte)
export const MAKS_STRUK = 5 * 1024 * 1024;

// Rumus uang bersih yang diterima jastiper dari satu pesanan.
// Dipakai di query SQL; alias tabel pesanan harus `p`.
// Kalau ongkir bukan hak jastiper, ganti jadi: (p.total_harga - p.ongkir)
export const SQL_BERSIH = `FLOOR(p.total_harga * (100 - ${Number(POTONGAN_PLATFORM_PERSEN)}) / 100.0)::bigint`;

// Mengenali jenis file dari isinya (bukan dari nama/label yang dikirim browser)
export function deteksiTipe(b: Uint8Array): string | null {
	if (b.length < 4) return null;
	if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
	if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
	if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'application/pdf';
	return null;
}

export function bersihkanNama(nama: string): string {
	return nama.replace(/[\\/]/g, '_').replace(/[\r\n"]/g, '').trim().slice(0, 150) || 'struk';
}

// "1234567890" -> "•••• 7890"
export function topengRekening(no: string | null | undefined): string {
	const angka = (no ?? '').replace(/\D/g, '');
	return angka ? `•••• ${angka.slice(-4)}` : '';
}