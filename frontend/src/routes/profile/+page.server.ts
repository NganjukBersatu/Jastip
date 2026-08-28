import { redirect } from '@sveltejs/kit';
import { hapusSesi } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Halaman ini wajib login — kalau belum, lempar ke halaman masuk
	if (!locals.user) {
		throw redirect(303, '/publik/masuk');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	keluar: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await hapusSesi(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/publik/masuk');
	}
};