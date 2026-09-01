import { fail, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Actions, PageServerLoad } from './$types';

const FOLDER_UPLOAD = path.join(process.cwd(), 'static', 'uploads');

export const load: PageServerLoad = async ({ params, locals }) => {
	const [item] = await db.select().from(produk).where(eq(produk.id, params.id));

	// Produk nggak ada, atau bukan milik jastiper yang lagi login -> 404
	if (!item || item.jastiperId !== locals.user!.id) {
		throw error(404, 'Produk tidak ditemukan');
	}

	return { produk: item };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const [existing] = await db.select().from(produk).where(eq(produk.id, params.id));

		if (!existing || existing.jastiperId !== locals.user!.id) {
			throw error(404, 'Produk tidak ditemukan');
		}

		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const kategori = data.get('kategori')?.toString();
		const hargaTipe = data.get('hargaTipe')?.toString() === 'nego' ? 'nego' : 'tetap';
		const hargaRaw = data.get('harga')?.toString();
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const gambarUrlInput = data.get('gambarUrl')?.toString().trim() || '';
		const gambarFile = data.get('gambarFile');
		const aktif = data.get('aktif') === 'on';

		if (!nama || !hargaRaw) {
			return fail(400, { error: 'Nama dan harga wajib diisi.' });
		}
		const harga = parseInt(hargaRaw, 10);
		if (isNaN(harga) || harga <= 0) {
			return fail(400, { error: 'Harga harus berupa angka yang valid.' });
		}

		// Default: pertahankan gambar lama. Diganti kalau ada file baru,
		// atau kalau URL-nya diubah dari yang tersimpan sebelumnya.
		let gambarUrl = existing.gambarUrl;

		if (gambarFile instanceof File && gambarFile.size > 0) {
			const ekstensi = path.extname(gambarFile.name) || '.jpg';
			const namaFile = `${randomUUID()}${ekstensi}`;
			await mkdir(FOLDER_UPLOAD, { recursive: true });
			const buffer = Buffer.from(await gambarFile.arrayBuffer());
			await writeFile(path.join(FOLDER_UPLOAD, namaFile), buffer);
			gambarUrl = `/uploads/${namaFile}`;
		} else if (gambarUrlInput) {
			gambarUrl = gambarUrlInput;
		}

		if (!gambarUrl) {
			return fail(400, { error: 'Gambar produk wajib diisi — pakai URL atau upload dari galeri.' });
		}

		await db
			.update(produk)
			.set({
				nama,
				kategori: kategori || null,
				hargaTipe,
				harga,
				deskripsi,
				gambarUrl,
				aktif
			})
			.where(eq(produk.id, params.id));

		throw redirect(303, '/jastiper/produk');
	}
};