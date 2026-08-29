import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		// simpan halaman yang dituju, supaya setelah login bisa langsung balik ke sini
		throw redirect(303, `/publik/masuk?redirectTo=${url.pathname}`);
	}

	if (locals.user.role !== 'jastiper') {
		// user login tapi bukan jastiper — jangan biarkan masuk area ini
		throw redirect(303, '/profil');
	}

	return {
		user: locals.user
	};
};