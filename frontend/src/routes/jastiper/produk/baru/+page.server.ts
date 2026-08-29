import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { produk } from '$lib/server/db/schema';
import { randomUUID } from 'node:crypto';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const kategori = data.get('kategori')?.toString();
		const hargaTipe = data.get('hargaTipe')?.toString() === 'nego' ? 'nego' : 'tetap';
		const hargaRaw = data.get('harga')?.toString();
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const gambarUrl = data.get('gambarUrl')?.toString().trim() || null;

		if (!nama || !hargaRaw) {
			return fail(400, { error: 'Nama dan harga wajib diisi.' });
		}

		const harga = parseInt(hargaRaw, 10);
		if (isNaN(harga) || harga <= 0) {
			return fail(400, { error: 'Harga harus berupa angka yang valid.' });
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