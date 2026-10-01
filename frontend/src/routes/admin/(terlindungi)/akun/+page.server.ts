import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { pool } from '$lib/server/pool';
import type { Actions, PageServerLoad } from './$types';

const ROLE_VALID = ['admin', 'jastiper', 'pelanggan']; // samakan dengan isi enum di database

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const role = url.searchParams.get('role') ?? '';

	const { rows } = await pool.query(
		`SELECT id, nama, email, role, aktif, created_at
		 FROM users
		 WHERE (nama ILIKE $1 OR email ILIKE $1)
		   AND ($2 = '' OR role::text = $2)
		 ORDER BY created_at DESC`,
		[`%${q}%`, role]
	);

	return { akun: rows, q, role };
};

export const actions: Actions = {
	tambah: async ({ request }) => {
		const f = await request.formData();
		const nama = String(f.get('nama') ?? '').trim();
		const email = String(f.get('email') ?? '').trim();
		const password = String(f.get('password') ?? '');
		const role = String(f.get('role') ?? 'pelanggan');

		if (!nama || !email || !password) {
			return fail(400, { pesan: 'Nama, email, dan password wajib diisi', nama, email, role });
		}
		if (password.length < 6) {
			return fail(400, { pesan: 'Password minimal 6 karakter', nama, email, role });
		}
		if (!ROLE_VALID.includes(role)) {
			return fail(400, { pesan: 'Role tidak valid', nama, email, role });
		}

		try {
			const hash = await bcrypt.hash(password, 10);
			await pool.query(
				`INSERT INTO users (id, nama, email, password_hash, role, aktif)
				 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, true)`,
				[nama, email, hash, role]
			);
		} catch (e: any) {
			if (e.code === '23505') {
				return fail(409, { pesan: 'Email sudah dipakai', nama, email, role });
			}
			throw e;
		}

		return { sukses: `Akun "${nama}" berhasil dibuat` };
	},

	ubah: async ({ request, locals }) => {
		const f = await request.formData();
		const id = String(f.get('id') ?? '');
		const role = f.get('role') ? String(f.get('role')) : null;
		const aktif = f.get('aktif') === null ? null : f.get('aktif') === 'true';

		if (role && !ROLE_VALID.includes(role)) {
			return fail(400, { pesan: 'Role tidak valid' });
		}

		// Cegah admin menonaktifkan akunnya sendiri
		const adminId = (locals as any).admin?.id ?? (locals as any).user?.id;
		if (aktif === false && adminId !== undefined && String(adminId) === id) {
			return fail(400, { pesan: 'Tidak bisa menonaktifkan akun sendiri' });
		}

		await pool.query(
			`UPDATE users
			 SET role = COALESCE($1::text::role, role),
			     aktif = COALESCE($2::boolean, aktif)
			 WHERE id = $3`,
			[role, aktif, id]
		);
		return { sukses: 'Akun diperbarui' };
	},

	hapus: async ({ request, locals }) => {
		const f = await request.formData();
		const id = String(f.get('id') ?? '');

		const adminId = (locals as any).admin?.id ?? (locals as any).user?.id;
		if (adminId !== undefined && String(adminId) === id) {
			return fail(400, { pesan: 'Tidak bisa menghapus akun sendiri' });
		}

		await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
		return { sukses: 'Akun dihapus' };
	}
};