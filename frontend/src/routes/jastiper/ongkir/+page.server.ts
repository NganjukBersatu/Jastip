import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { ongkirWilayah } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const daftarOngkir = await db
		.select()
		.from(ongkirWilayah)
		.where(eq(ongkirWilayah.jastiperId, locals.user!.id))
		.orderBy(ongkirWilayah.wilayah);

	return { daftarOngkir };
};

export const actions: Actions = {
	tambah: async ({ request, locals }) => {
		const data = await request.formData();
		const wilayah = data.get('wilayah')?.toString().trim();
		const biayaRaw = data.get('biaya')?.toString();

		if (!wilayah || !biayaRaw) {
			return fail(400, { error: 'Nama wilayah dan biaya wajib diisi.' });
		}

		const biaya = parseInt(biayaRaw, 10);
		if (isNaN(biaya) || biaya < 0) {
			return fail(400, { error: 'Biaya harus berupa angka yang valid.' });
		}

		await db.insert(ongkirWilayah).values({
			id: randomUUID(),
			jastiperId: locals.user!.id,
			wilayah,
			biaya
		});
	},

	hapus: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });

		// pastikan cuma bisa hapus milik sendiri
		await db
			.delete(ongkirWilayah)
			.where(and(eq(ongkirWilayah.id, id), eq(ongkirWilayah.jastiperId, locals.user!.id)));
	}
};