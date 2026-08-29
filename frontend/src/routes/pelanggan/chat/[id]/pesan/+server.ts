import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { pengajuanHarga, pesanChat } from '$lib/server/db/schema';
import { eq, and, gt, asc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, locals }) => {
	const [row] = await db
		.select({ id: pengajuanHarga.id })
		.from(pengajuanHarga)
		.where(and(eq(pengajuanHarga.id, params.id), eq(pengajuanHarga.pelangganId, locals.user!.id)));

	if (!row) throw error(404, 'Percakapan tidak ditemukan.');

	const sejak = url.searchParams.get('sejak');

	const pesanBaru = await db
		.select()
		.from(pesanChat)
		.where(
			sejak
				? and(eq(pesanChat.pengajuanHargaId, params.id), gt(pesanChat.createdAt, new Date(sejak)))
				: eq(pesanChat.pengajuanHargaId, params.id)
		)
		.orderBy(asc(pesanChat.createdAt));

	return json({ pesan: pesanBaru });
};