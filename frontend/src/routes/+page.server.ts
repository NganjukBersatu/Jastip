import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Landing page sekarang tampil untuk semua role, termasuk jastiper.
	// (redirect otomatis ke /jastiper/dashboard dihapus)
};