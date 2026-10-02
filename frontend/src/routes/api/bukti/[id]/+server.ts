import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { aduan, aduanLampiran } from '$lib/server/db/schema';
import { bacaBukti } from '$lib/server/bukti';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const user = locals.user;
	if (!user) error(401, 'Silakan masuk dulu');

	const [l] = await db
		.select({
			namaFile: aduanLampiran.namaFile,
			mime: aduanLampiran.mime,
			pelaporId: aduan.pelaporId
		})
		.from(aduanLampiran)
		.innerJoin(aduan, eq(aduan.id, aduanLampiran.aduanId))
		.where(eq(aduanLampiran.id, params.id));

	// hanya pelapor dan admin yang boleh melihat
	if (!l || (user.role !== 'admin' && l.pelaporId !== user.id)) error(404, 'Tidak ditemukan');

	let data: Buffer;
	try {
		data = await bacaBukti(l.namaFile);
	} catch {
		error(404, 'File tidak ditemukan');
	}

	return new Response(new Uint8Array(data), {
		headers: {
			'Content-Type': l.mime,
			'Cache-Control': 'private, max-age=3600',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};