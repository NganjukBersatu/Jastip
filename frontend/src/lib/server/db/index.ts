import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL belum di-set di file .env');
}

const client = postgres(env.DATABASE_URL, {
	prepare: false,
	connect_timeout: 30,
	idle_timeout: 20,
	max: 10
});

export const db = drizzle(client, { schema });