import { validasiSesi } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (!token) {
		event.locals.user = null;
		return resolve(event);
	}

	const { user } = await validasiSesi(token);
	event.locals.user = user; // bisa diakses di semua +page.server.js lewat `locals.user`

	return resolve(event);
};