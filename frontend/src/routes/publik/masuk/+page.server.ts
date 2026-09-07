import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/publik/katalog');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();

		// --- Validasi input ---
		if (!email || !password) {
			return fail(400, {
				error: 'Email dan kata sandi wajib diisi.'
			});
		}

		if (!email.includes('@')) {
			return fail(400, {
				error: 'Format email tidak valid.'
			});
		}

		// --- Cari user di database ---
		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (!user) {
			return fail(400, {
				error: 'Email atau kata sandi salah.'
			});
		}

		// --- Cek password ---
		const passwordValid = await bcrypt.compare(password, user.passwordHash);

		if (!passwordValid) {
			return fail(400, {
				error: 'Email atau kata sandi salah.'
			});
		}

		// --- Buat sesi login ---
		const token = buatTokenSesi();
		const session = await buatSesi(token, user.id);

		cookies.set('session', token, {
			path: '/',
			expires: session.expiresAt,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		// --- Redirect sesuai role ---
		throw redirect(303, user.role === 'jastiper' ? '/jastiper/dashboard' : '/publik/katalog');
	}
};