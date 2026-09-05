import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jasa } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Actions, PageServerLoad } from './$types';

const KATEGORI_VALID = ['Jemputan', 'Antar Barang', 'Titip Antre', 'Belanja Kebutuhan', 'Jasa Lainnya'];
const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads', 'jasa');

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'jastiper') throw redirect(303, '/');

	const daftarJasa = await db
		.select()
		.from(jasa)
		.where(eq(jasa.jastiperId, locals.user.id))
		.orderBy(desc(jasa.createdAt));

	return { daftarJasa };
};

export const actions: Actions = {
	tambah: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'jastiper') {
			return fail(403, { error: 'Hanya jastiper yang bisa menambahkan jasa.' });
		}

		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const kategori = data.get('kategori')?.toString();
		const hargaTipe = data.get('hargaTipe')?.toString();
		const hargaRaw = data.get('harga')?.toString();
		const satuan = data.get('satuan')?.toString().trim() || null;
		const gambarUrlInput = data.get('gambarUrl')?.toString().trim();
		const gambarFile = data.get('gambarFile');

		// Validasi dasar
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

		// Gambar: wajib salah satu — URL atau file upload
		let gambarUrl: string;

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
		} else {
			return fail(400, { error: 'Gambar wajib diisi — pilih file atau masukkan URL.' });
		}

		await db.insert(jasa).values({
			id: randomUUID(),
			jastiperId: locals.user.id,
			nama,
			deskripsi,
			kategori,
			hargaTipe,
			harga,
			satuan,
			gambarUrl,
			aktif: true
		});

		return { success: true };
	},

	toggleAktif: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'jastiper') return fail(403, { error: 'Tidak diizinkan.' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'Jasa tidak ditemukan.' });

		const [jasaLama] = await db
			.select({ aktif: jasa.aktif })
			.from(jasa)
			.where(and(eq(jasa.id, id), eq(jasa.jastiperId, locals.user.id)));

		if (!jasaLama) return fail(404, { error: 'Jasa tidak ditemukan.' });

		await db
			.update(jasa)
			.set({ aktif: !jasaLama.aktif })
			.where(and(eq(jasa.id, id), eq(jasa.jastiperId, locals.user.id)));

		return { success: true };
	},

	hapus: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/publik/masuk');
		if (locals.user.role !== 'jastiper') return fail(403, { error: 'Tidak diizinkan.' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'Jasa tidak ditemukan.' });

		await db.delete(jasa).where(and(eq(jasa.id, id), eq(jasa.jastiperId, locals.user.id)));

		return { success: true };
	}
};