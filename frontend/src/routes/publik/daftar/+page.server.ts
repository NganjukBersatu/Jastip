import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, jastiperProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/publik/katalog');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();
		const role = data.get('role')?.toString() === 'jastiper' ? 'jastiper' : 'pelanggan';

		// --- Validasi dasar ---
		if (!nama || !email || !password) {
			return fail(400, { error: 'Semua kolom wajib diisi.' });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Kata sandi minimal 8 karakter.' });
		}

		const [emailSudahAda] = await db.select().from(users).where(eq(users.email, email));
		if (emailSudahAda) {
			return fail(400, { error: 'Email ini sudah terdaftar. Coba masuk saja.' });
		}

		// --- Simpan user baru ---
		const passwordHash = await bcrypt.hash(password, 10);
		const userId = randomUUID();

		await db.insert(users).values({
			id: userId,
			nama,
			email,
			passwordHash,
			role
		});

		// Kalau daftar sebagai jastiper, langsung buat baris profil jastiper juga
		if (role === 'jastiper') {
			await db.insert(jastiperProfiles).values({
				userId,
				area: '', // nanti dilengkapi user di halaman dashboard
				terverifikasi: false
			});
		}

		// --- Langsung login-kan user setelah daftar ---
		const token = buatTokenSesi();
		const session = await buatSesi(token, userId);

		cookies.set('session', token, {
			path: '/',
			expires: session.expiresAt,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		throw redirect(303, role === 'jastiper' ? '/jastiper/dashboard' : '/publik/katalog');
	}
};