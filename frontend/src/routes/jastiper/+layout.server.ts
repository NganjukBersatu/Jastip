import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pesanan, pesananItem } from '$lib/server/db/schema';
import { and, count, eq, isNotNull, notExists } from 'drizzle-orm';
import { JASA_AKTIF } from '$lib/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, depends }) => {
	if (!locals.user) {
		// simpan halaman yang dituju, supaya setelah login bisa langsung balik ke sini
		throw redirect(303, `/publik/masuk?redirectTo=${url.pathname}`);
	}

	if (locals.user.role !== 'jastiper') {
		// user login tapi bukan jastiper — jangan biarkan masuk area ini
		throw redirect(303, '/profil');
	}

	// BARU: kunci ini dipakai layout untuk memuat ulang angka notifikasi secara berkala
	depends('app:pesanan-baru');
	// BARU: membaca pathname membuat angka ikut diperbarui setiap pindah halaman
	void url.pathname;

	// BARU: jumlah pesanan yang masih menunggu konfirmasi jastiper ini
	const kondisi = [
		eq(pesanan.jastiperId, locals.user.id),
		eq(pesanan.status, 'menunggu_konfirmasi')
	];

	// Kalau fitur jasa dinonaktifkan, pesanan jasa tidak ditampilkan di halaman Pesanan,
	// jadi jangan ikut dihitung supaya angkanya tidak "nyangkut".
	if (!JASA_AKTIF) {
		kondisi.push(
			notExists(
				db
					.select({ id: pesananItem.id })
					.from(pesananItem)
					.where(and(eq(pesananItem.pesananId, pesanan.id), isNotNull(pesananItem.jasaId)))
			)
		);
	}

	const [row] = await db
		.select({ jumlah: count() })
		.from(pesanan)
		.where(and(...kondisi));

	return {
		user: locals.user,
		jumlahPesananBaru: Number(row?.jumlah ?? 0)
	};
};