import { Google, generateState, generateCodeVerifier } from 'arctic';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	'http://localhost:5173/auth/google/callback'
);

export const GET: RequestHandler = async ({ url, cookies }) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const roleParam = url.searchParams.get('role');
	const role = roleParam === 'jastiper' ? 'jastiper' : 'pelanggan';

	// TAMBAHAN: bedakan apakah user datang dari halaman Daftar atau Masuk
	const intentParam = url.searchParams.get('intent');
	const intent = intentParam === 'daftar' ? 'daftar' : 'masuk';

	const googleAuthUrl = google.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email']);

	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	cookies.set('google_pending_role', role, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	cookies.set('google_pending_intent', intent, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	throw redirect(302, googleAuthUrl.toString());
};