import { error } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db';
import { logAdmin } from '$lib/server/db/schema';

/** Panggil di awal SETIAP form action dan load halaman admin. */
export function wajibAdmin(locals: App.Locals) {
	if (!locals.user || locals.user.role !== 'admin' || !locals.user.aktif) {
		throw error(403, 'Akses ditolak');
	}
	return locals.user;
}

/** Catat aksi admin ke tabel log_admin. */
export async function catatAdmin(data: {
	adminId: string;
	aksi: string;
	targetTipe: 'user' | 'produk' | 'jasa' | 'pesanan';
	targetId: string;
	targetNama?: string;
	alasan?: string;
}) {
	await db.insert(logAdmin).values({
		id: randomUUID(),
		adminId: data.adminId,
		aksi: data.aksi,
		targetTipe: data.targetTipe,
		targetId: data.targetId,
		targetNama: data.targetNama ?? null,
		alasan: data.alasan ?? null
	});
}