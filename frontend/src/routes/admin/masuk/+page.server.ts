import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role === 'admin') throw redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = data.get('password')?.toString() ?? '';

		// Satu pesan untuk semua kegagalan, supaya orang luar tidak bisa
		// menebak email mana yang admin
		const gagal = () => fail(400, { pesan: 'Email atau kata sandi salah', email });

		if (!email || !password) return gagal();

		const [user] = await db.select().from(users).where(eq(users.email, email));
		if (!user || user.role !== 'admin' || !user.aktif) return gagal();

		const cocok = await bcrypt.compare(password, user.passwordHash);
		if (!cocok) return gagal();

		const token = buatTokenSesi();
		const sesi = await buatSesi(token, user.id);

		cookies.set('session', token, {
			path: '/',
			expires: sesi.expiresAt,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		throw redirect(303, '/admin');
	}
};