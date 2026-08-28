import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum di-set di .env');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dbCredentials: { url: process.env.DATABASE_URL },
	dialect: 'postgresql'
});