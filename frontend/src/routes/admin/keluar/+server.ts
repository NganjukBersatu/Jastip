import { redirect } from '@sveltejs/kit';
import { hapusSesi } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('session');
	if (token) {
		await hapusSesi(token);
	}
	cookies.delete('session', { path: '/' });
	throw redirect(303, '/admin/masuk');
};