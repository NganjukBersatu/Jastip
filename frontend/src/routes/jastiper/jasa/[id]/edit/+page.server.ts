import { fail, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Actions, PageServerLoad } from './$types';

const KATEGORI_VALID = ['Jemputan', 'Antar Barang', 'Titip Antre', 'Belanja Kebutuhan', 'Jasa Lainnya'];
const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads', 'jasa');

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'jastiper') throw redirect(303, '/');

	const [jasaData] = await db
		.select()
		.from(jasa)
		.where(and(eq(jasa.id, params.id), eq(jasa.jastiperId, locals.user.id)));

	if (!jasaData) throw error(404, 'Jasa tidak ditemukan.');

	return { jasa: jasaData };
};

export const actions: Actions = {
	simpan: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'jastiper') {
			return fail(403, { error: 'Tidak diizinkan.' });
		}

		const [jasaLama] = await db
			.select()
			.from(jasa)
			.where(and(eq(jasa.id, params.id), eq(jasa.jastiperId, locals.user.id)));

		if (!jasaLama) return fail(404, { error: 'Jasa tidak ditemukan.' });

		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const kategori = data.get('kategori')?.toString();
		const hargaTipe = data.get('hargaTipe')?.toString();
		const hargaRaw = data.get('harga')?.toString();
		const satuan = data.get('satuan')?.toString().trim() || null;
		const gambarUrlInput = data.get('gambarUrl')?.toString().trim();
		const gambarFile = data.get('gambarFile');

		if (!nama) return fail(400, { error: 'Nama jasa wajib diisi.' });
		if (!kategori || !KATEGORI_VALID.includes(kategori)) {
			return fail(400, { error: 'Kategori tidak valid.' });
		}
		if (hargaTipe !== 'tetap' && hargaTipe !== 'nego') {
			return fail(400, { error: 'Tipe harga tidak valid.' });
		}
		const harga = Number(hargaRaw);
		if (!hargaRaw || Number.isNaN(harga) || harga <= 0) {
			return fail(400, { error: 'Harga harus berupa angka lebih dari 0.' });
		}

		// Gambar: pakai yang lama kecuali diganti lewat upload atau URL baru
		let gambarUrl = jasaLama.gambarUrl;

		if (gambarFile instanceof File && gambarFile.size > 0) {
			const ekstensi = gambarFile.name.split('.').pop()?.toLowerCase();
			const ekstensiValid = ['jpg', 'jpeg', 'png', 'webp'];
			if (!ekstensi || !ekstensiValid.includes(ekstensi)) {
				return fail(400, { error: 'Format gambar harus JPG, PNG, atau WEBP.' });
			}
			if (gambarFile.size > 5 * 1024 * 1024) {
				return fail(400, { error: 'Ukuran gambar maksimal 5MB.' });
			}

			await mkdir(UPLOAD_DIR, { recursive: true });
			const namaFile = `${randomUUID()}.${ekstensi}`;
			const buffer = Buffer.from(await gambarFile.arrayBuffer());
			await writeFile(path.join(UPLOAD_DIR, namaFile), buffer);
			gambarUrl = `/uploads/jasa/${namaFile}`;
		} else if (gambarUrlInput) {
			try {
				new URL(gambarUrlInput);
			} catch {
				return fail(400, { error: 'URL gambar tidak valid.' });
			}
			gambarUrl = gambarUrlInput;
		}

		await db
			.update(jasa)
			.set({ nama, deskripsi, kategori, hargaTipe, harga, satuan, gambarUrl })
			.where(and(eq(jasa.id, params.id), eq(jasa.jastiperId, locals.user.id)));

		throw redirect(303, '/jastiper/jasa');
	}
};