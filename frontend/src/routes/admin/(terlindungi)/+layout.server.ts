import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Penjaga: semua halaman di dalam folder (terlindungi) hanya untuk admin aktif.
export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin' || locals.user.aktif === false) {
		throw redirect(303, '/admin/masuk');
	}
	return { admin: { nama: locals.user.nama } };
};