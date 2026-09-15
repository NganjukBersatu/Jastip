import { redirect } from '@sveltejs/kit';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';
import type { RequestHandler } from './$types';

const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5173/auth/google/callback'
);

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const storedState = cookies.get('google_oauth_state');
	const codeVerifier = cookies.get('google_code_verifier');

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		throw redirect(303, '/publik/masuk?error=google_gagal');
	}

	let tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		throw redirect(303, '/publik/masuk?error=google_gagal');
	}

	const respons = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
		headers: { Authorization: `Bearer ${tokens.accessToken()}` }
	});
	const profil: { email?: string; name?: string } = await respons.json();

	if (!profil.email) {
		throw redirect(303, '/publik/masuk?error=google_gagal');
	}

	const email = profil.email.toLowerCase();

	let [user] = await db.select().from(users).where(eq(users.email, email));

	if (!user) {
		const passwordAcak = crypto.randomBytes(32).toString('hex');
		const passwordHash = await bcrypt.hash(passwordAcak, 10);

		[user] = await db
			.insert(users)
			.values({
				id: crypto.randomUUID(),
				nama: profil.name ?? email,
				email,
				passwordHash,
				role: 'pelanggan'
			})
			.returning();
	}

	const token = buatTokenSesi();
	const session = await buatSesi(token, user.id);

	cookies.set('session', token, {
		path: '/',
		expires: session.expiresAt,
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});

	cookies.delete('google_oauth_state', { path: '/' });
	cookies.delete('google_code_verifier', { path: '/' });

	throw redirect(303, user.role === 'jastiper' ? '/jastiper/dashboard' : '/publik/katalog');
};