import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk } from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Actions } from './$types';

const FOLDER_UPLOAD = path.join(process.cwd(), 'static', 'uploads');

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const kategori = data.get('kategori')?.toString();
		const hargaTipe = data.get('hargaTipe')?.toString() === 'nego' ? 'nego' : 'tetap';
		const hargaRaw = data.get('harga')?.toString();
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const gambarUrlInput = data.get('gambarUrl')?.toString().trim() || '';
		const gambarFile = data.get('gambarFile');

		if (!nama || !hargaRaw) {
			return fail(400, { error: 'Nama dan harga wajib diisi.' });
		}
		const harga = parseInt(hargaRaw, 10);
		if (isNaN(harga) || harga <= 0) {
			return fail(400, { error: 'Harga harus berupa angka yang valid.' });
		}

		let gambarUrl = gambarUrlInput;

		// Kalau ada file yang diupload, itu yang dipakai (lebih prioritas dari URL)
		if (gambarFile instanceof File && gambarFile.size > 0) {
			const ekstensi = path.extname(gambarFile.name) || '.jpg';
			const namaFile = `${randomUUID()}${ekstensi}`;
			await mkdir(FOLDER_UPLOAD, { recursive: true });
			const buffer = Buffer.from(await gambarFile.arrayBuffer());
			await writeFile(path.join(FOLDER_UPLOAD, namaFile), buffer);
			gambarUrl = `/uploads/${namaFile}`;
		}

		if (!gambarUrl) {
			return fail(400, { error: 'Gambar produk wajib diisi — pakai URL atau upload dari galeri.' });
		}

		await db.insert(produk).values({
			id: randomUUID(),
			jastiperId: locals.user!.id,
			nama,
			kategori: kategori || null,
			hargaTipe,
			harga,
			deskripsi,
			gambarUrl,
			aktif: true
		});

		throw redirect(303, '/jastiper/produk');
	}
};