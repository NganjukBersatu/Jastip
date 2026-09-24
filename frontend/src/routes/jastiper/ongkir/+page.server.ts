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

		try {
			await db.insert(ongkirWilayah).values({
				id: randomUUID(),
				jastiperId: locals.user!.id,
				wilayah,
				biaya
			});
		} catch (err) {
			console.error('Gagal menambah wilayah:', err);
			return fail(500, { error: 'Gagal menambahkan wilayah. Coba lagi.' });
		}

		return { success: true };
	},

	hapus: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'ID tidak ditemukan.' });
		}

		try {
			// pastikan cuma bisa hapus milik sendiri
			const dihapus = await db
				.delete(ongkirWilayah)
				.where(and(eq(ongkirWilayah.id, id), eq(ongkirWilayah.jastiperId, locals.user!.id)))
				.returning({ id: ongkirWilayah.id });

			if (dihapus.length === 0) {
				return fail(404, { error: 'Wilayah tidak ditemukan atau bukan milik Anda.' });
			}
		} catch (err) {
			console.error('Gagal menghapus wilayah:', err);
			return fail(500, {
				error: 'Wilayah ini masih terpakai (misalnya ada pesanan terkait) sehingga tidak bisa dihapus.'
			});
		}

		return { success: true };
	},

	ubah: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		const wilayah = data.get('wilayah')?.toString().trim();
		const biayaRaw = data.get('biaya')?.toString();

		if (!id) return fail(400, { error: 'ID tidak ditemukan.' });
		if (!wilayah || !biayaRaw) {
			return fail(400, { error: 'Nama wilayah dan biaya wajib diisi.' });
		}

		const biaya = parseInt(biayaRaw, 10);
		if (isNaN(biaya) || biaya < 0) {
			return fail(400, { error: 'Biaya harus berupa angka yang valid.' });
		}

		try {
			// pastikan cuma bisa ubah milik sendiri
			const diubah = await db
				.update(ongkirWilayah)
				.set({ wilayah, biaya })
				.where(and(eq(ongkirWilayah.id, id), eq(ongkirWilayah.jastiperId, locals.user!.id)))
				.returning({ id: ongkirWilayah.id });

			if (diubah.length === 0) {
				return fail(404, { error: 'Wilayah tidak ditemukan atau bukan milik Anda.' });
			}
		} catch (err) {
			console.error('Gagal mengubah wilayah:', err);
			return fail(500, { error: 'Gagal menyimpan perubahan. Coba lagi.' });
		}

		return { success: true };
	}
};