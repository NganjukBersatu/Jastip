import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { jastiperProfiles, ongkirWilayah } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [profil] = await db
		.select()
		.from(jastiperProfiles)
		.where(eq(jastiperProfiles.userId, locals.user!.id));

	const daftarWilayahLayanan = await db
		.select()
		.from(ongkirWilayah)
		.where(eq(ongkirWilayah.jastiperId, locals.user!.id))
		.orderBy(ongkirWilayah.wilayah);

	return { profil, daftarWilayahLayanan };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const area = data.get('area')?.toString().trim();
		const alamat = data.get('alamat')?.toString().trim() || null;
		const deskripsi = data.get('deskripsi')?.toString().trim() || null;
		const noWaRaw = data.get('noWa')?.toString().trim();

		if (!area) {
			return fail(400, { error: 'Kota/wilayah utama wajib diisi.' });
		}
		if (!noWaRaw) {
			return fail(400, { error: 'Nomor WhatsApp wajib diisi.' });
		}
		if (!/^0[0-9]{9,13}$/.test(noWaRaw)) {
			return fail(400, {
				error: 'Format nomor WhatsApp tidak valid. Contoh: 08123456789'
			});
		}

		await db
			.update(jastiperProfiles)
			.set({ area, alamat, deskripsi, noWa: noWaRaw })
			.where(eq(jastiperProfiles.userId, locals.user!.id));

		return { sukses: true };
	}
};