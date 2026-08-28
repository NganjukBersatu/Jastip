import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['pelanggan', 'jastiper']);

export const users = pgTable('users', {
	id: text('id').primaryKey(), // pakai UUID string, di-generate saat insert
	nama: text('nama').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: roleEnum('role').notNull().default('pelanggan'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// Profil tambahan khusus untuk user yang jadi jastiper (relasi 1-ke-1 ke users)
export const jastiperProfiles = pgTable('jastiper_profiles', {
	userId: text('user_id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	area: text('area').notNull(), // mis. "Surabaya"
	deskripsi: text('deskripsi'),
	terverifikasi: boolean('terverifikasi').notNull().default(false)
});

// Session login — token disimpan di cookie browser, cuma ID sesi ini yang tersimpan di sana
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(), // hash dari token yang dikirim ke cookie
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});