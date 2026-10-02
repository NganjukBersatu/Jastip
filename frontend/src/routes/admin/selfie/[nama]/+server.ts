import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import type { RequestHandler } from './$types';

const TIPE: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png' };

export const GET: RequestHandler = async ({ params, locals }) => {
	// hanya admin yang boleh melihat foto selfie
	if (locals.user?.role !== 'admin') throw error(403, 'Tidak diizinkan');

	const nama = basename(params.nama);
	const tipe = TIPE[extname(nama).toLowerCase()];
	if (!tipe) throw error(404, 'Foto tidak ditemukan');

	try {
		const isi = await readFile(join(process.cwd(), 'uploads', 'selfie', nama));
		return new Response(new Uint8Array(isi), {
			headers: { 'Content-Type': tipe, 'Cache-Control': 'private, max-age=3600' }
		});
	} catch {
		throw error(404, 'Foto tidak ditemukan');
	}
};