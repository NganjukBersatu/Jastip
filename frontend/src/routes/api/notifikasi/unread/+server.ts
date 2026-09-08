import { json, error } from '@sveltejs/kit';
import { hitungPesanBelumDibaca } from '$lib/server/notifikasi';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Belum login.');
	const jumlah = await hitungPesanBelumDibaca(locals.user.id);
	return json({ jumlah });
};