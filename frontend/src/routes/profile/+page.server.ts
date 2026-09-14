import { fail, redirect } from '@sveltejs/kit';
import { hapusSesi } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';
// npm install bcryptjs
// npm install -D @types/bcryptjs

export const load: PageServerLoad = async ({ locals }) => {
	// Halaman ini wajib login — kalau belum, lempar ke halaman masuk
	if (!locals.user) {
		throw redirect(303, '/publik/masuk');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	keluar: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await hapusSesi(token);
			cookies.delete('session', { path: '/' });
		}
		throw redirect(303, '/publik/masuk');
	},

	gantiSandi: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { gantiSandiError: 'Kamu harus login untuk mengganti kata sandi.' });
		}

		const formData = await request.formData();
		const sandiLama = String(formData.get('sandiLama') ?? '');
		const sandiBaru = String(formData.get('sandiBaru') ?? '');
		const sandiKonfirmasi = String(formData.get('sandiKonfirmasi') ?? '');

		if (!sandiLama.trim() || !sandiBaru.trim() || !sandiKonfirmasi.trim()) {
			return fail(400, { gantiSandiError: 'Semua kolom wajib diisi.' });
		}

		const polaValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
		if (!polaValid.test(sandiBaru)) {
			return fail(400, {
				gantiSandiError: 'Kata sandi baru minimal 8 karakter dengan kombinasi huruf dan angka.'
			});
		}

		if (sandiBaru !== sandiKonfirmasi) {
			return fail(400, { gantiSandiError: 'Konfirmasi kata sandi tidak cocok.' });
		}

		const [row] = await db
			.select({ passwordHash: users.passwordHash })
			.from(users)
			.where(eq(users.id, locals.user.id))
			.limit(1);

		if (!row) {
			return fail(404, { gantiSandiError: 'Akun tidak ditemukan.' });
		}

		const cocok = await bcrypt.compare(sandiLama, row.passwordHash);
		if (!cocok) {
			return fail(400, { gantiSandiError: 'Kata sandi saat ini salah.' });
		}

		const sandiBaruSamaDenganLama = await bcrypt.compare(sandiBaru, row.passwordHash);
		if (sandiBaruSamaDenganLama) {
			return fail(400, {
				gantiSandiError: 'Kata sandi baru tidak boleh sama dengan kata sandi lama.'
			});
		}

		const hashBaru = await bcrypt.hash(sandiBaru, 10);

		await db.update(users).set({ passwordHash: hashBaru }).where(eq(users.id, locals.user.id));

		return { gantiSandiSukses: true };
	}
};