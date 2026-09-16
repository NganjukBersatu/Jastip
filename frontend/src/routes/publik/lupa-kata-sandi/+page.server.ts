import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, passwordResetTokens } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { kirimKodeOtp } from '$lib/server/email';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import type { Actions } from './$types';

export const actions: Actions = {
	// LANGKAH 1: user submit email, sistem kirim kode OTP
	kirimKode: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').toLowerCase().trim();

		if (!email) {
			return fail(400, { pesan: 'Email wajib diisi' });
		}

		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (user) {
			const kode = crypto.randomInt(100000, 999999).toString();
			const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

			await db.insert(passwordResetTokens).values({
				id: crypto.randomUUID(),
				userId: user.id,
				token: kode,
				expiresAt
			});

			await kirimKodeOtp(email, kode);
		}

		// tetap balas sukses walau email tidak ditemukan, biar tidak bisa ditebak
		return { tahap: 'kodeTerkirim', email };
	},

	// LANGKAH 2: user submit kode + password baru
	resetPassword: async ({ request }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').toLowerCase().trim();
		const kode = String(data.get('kode') ?? '').trim();
		const password = String(data.get('password') ?? '');
		const konfirmasi = String(data.get('konfirmasi') ?? '');

		if (password.length < 8) {
			return fail(400, { tahap: 'kodeTerkirim', email, pesan: 'Kata sandi minimal 8 karakter.' });
		}
		if (password !== konfirmasi) {
			return fail(400, { tahap: 'kodeTerkirim', email, pesan: 'Konfirmasi kata sandi tidak cocok.' });
		}

		const [user] = await db.select().from(users).where(eq(users.email, email));
		if (!user) {
			return fail(400, { tahap: 'kodeTerkirim', email, pesan: 'Kode tidak valid.' });
		}

		const [tokenData] = await db
			.select()
			.from(passwordResetTokens)
			.where(
				and(
					eq(passwordResetTokens.userId, user.id),
					eq(passwordResetTokens.token, kode),
					eq(passwordResetTokens.digunakan, false)
				)
			);

		if (!tokenData || tokenData.expiresAt < new Date()) {
			return fail(400, { tahap: 'kodeTerkirim', email, pesan: 'Kode salah atau sudah kadaluarsa.' });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
		await db
			.update(passwordResetTokens)
			.set({ digunakan: true })
			.where(eq(passwordResetTokens.id, tokenData.id));

		throw redirect(303, '/publik/masuk?reset_sukses=1');
	}
};