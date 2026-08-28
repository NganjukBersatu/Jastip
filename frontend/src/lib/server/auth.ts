import { db } from './db';
import { sessions, users } from './db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

const SESSION_DURASI_HARI = 30;

/** Bikin token acak untuk dikirim ke cookie browser (bukan yang disimpan di DB) */
export function buatTokenSesi() {
	return crypto.randomBytes(32).toString('hex');
}

/** Token di-hash dulu sebelum disimpan ke DB, supaya kalau DB bocor, token asli tetap aman */
function hashToken(token: string) {
	return crypto.createHash('sha256').update(token).digest('hex');
}

export async function buatSesi(token: string, userId: string) {
	const sessionId = hashToken(token);
	const expiresAt = new Date(Date.now() + SESSION_DURASI_HARI * 24 * 60 * 60 * 1000);

	await db.insert(sessions).values({ id: sessionId, userId, expiresAt });

	return { id: sessionId, userId, expiresAt };
}

export async function validasiSesi(token: string) {
	const sessionId = hashToken(token);

	const hasil = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId));

	if (hasil.length === 0) return { user: null, session: null };

	const { user, session } = hasil[0];

	// sesi sudah kedaluwarsa
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return { user: null, session: null };
	}

	return { user, session };
}

export async function hapusSesi(token: string) {
	const sessionId = hashToken(token);
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}