export const TIPE_TARGET = ['akun', 'produk', 'pesanan', 'umum'] as const;
export type TipeTarget = (typeof TIPE_TARGET)[number];

export const STATUS_ADUAN = ['baru', 'diproses', 'selesai', 'ditolak'] as const;
export type StatusAduan = (typeof STATUS_ADUAN)[number];

export const TIPE_LABEL: Record<string, string> = {
	akun: 'Akun',
	produk: 'Produk',
	pesanan: 'Pesanan',
	umum: 'Hubungi admin (umum)'
};

export const KATEGORI_LABEL: Record<string, string> = {
	penipuan: 'Penipuan',
	barang_tidak_sesuai: 'Barang tidak sesuai',
	perilaku_buruk: 'Perilaku buruk / tidak sopan',
	produk_terlarang: 'Produk terlarang / menyesatkan',
	masalah_pesanan: 'Masalah pesanan',
	lainnya: 'Lainnya'
};

export const STATUS_LABEL: Record<string, string> = {
	baru: 'Baru',
	diproses: 'Diproses',
	selesai: 'Selesai',
	ditolak: 'Ditolak'
};

export const STATUS_WARNA: Record<string, string> = {
	baru: 'bg-accent/40 text-ink',
	diproses: 'bg-primary/15 text-primary-dark',
	selesai: 'bg-green-100 text-green-800',
	ditolak: 'bg-red-100 text-red-800'
};

export function fmtTgl(d: string | Date) {
	return new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

// 0812... atau +62812... -> 62812...
export function noWaIntl(no: string) {
	const angka = no.replace(/\D/g, '');
	return angka.startsWith('0') ? '62' + angka.slice(1) : angka;
}