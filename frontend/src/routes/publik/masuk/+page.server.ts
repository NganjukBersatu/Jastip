import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString().trim();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, {
				error: 'Email dan kata sandi wajib diisi.'
			});
		}

		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (!user) {
			return fail(400, {
				error: 'Email atau kata sandi salah.'
			});
		}

		const passwordValid = await bcrypt.compare(password, user.passwordHash);

		if (!passwordValid) {
			return fail(400, {
				error: 'Email atau kata sandi salah.'
			});
		}

		// Bikin token acak buat cookie, lalu simpan sesi (versi hash-nya) ke tabel sessions
		const token = buatTokenSesi();
		await buatSesi(token, user.id);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30 // 30 hari, samain sama SESSION_DURASI_HARI di auth.ts
		});

		// Hormati ?redirectTo= kalau ada (misal user coba akses halaman jastiper duluan)
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(303, redirectTo);
		}

		if (user.role === 'jastiper') {
			throw redirect(303, '/jastiper/dashboard');
		}

		throw redirect(303, '/publik/katalog');
	}
};