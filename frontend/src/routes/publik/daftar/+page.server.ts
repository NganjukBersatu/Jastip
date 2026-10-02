import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, jastiperProfiles, verifikasiJastiper } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { buatTokenSesi, buatSesi } from '$lib/server/auth';
import { KECAMATAN_NGANJUK, DESA_NGANJUK } from '$lib/data/kecamatan';
import type { Actions, PageServerLoad } from './$types';

const MAKS_SELFIE = 2 * 1024 * 1024; // 2 MB
const FOLDER_SELFIE = join(process.cwd(), 'uploads', 'selfie');

// Cek isi file (bukan cuma tipe dari browser) supaya yang masuk benar-benar gambar
function deteksiGambar(b: Buffer): 'jpg' | 'png' | null {
	if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
	if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
	return null;
}

// 0812..., +62812..., 62812... -> 0812...
function rapikanWa(x: string) {
	let n = x.replace(/[\s\-().]/g, '');
	if (n.startsWith('+62')) n = '0' + n.slice(3);
	else if (n.startsWith('62')) n = '0' + n.slice(2);
	return n;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role === 'jastiper') throw redirect(303, '/jastiper/dashboard');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const nama = data.get('nama')?.toString().trim();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();
		const role = data.get('role')?.toString() === 'jastiper' ? 'jastiper' : 'pelanggan';

		const noWaMentah = data.get('noWa')?.toString() ?? '';
		const kecamatan = data.get('kecamatan')?.toString() ?? '';
		const desa = data.get('desa')?.toString() ?? '';
        const detail = data.get('detail')?.toString().trim() ?? '';
		const setuju = data.get('setuju') === 'on';
		const selfie = data.get('selfie');

		// Semua kegagalan mengembalikan isian lama (kecuali kata sandi) supaya form tidak kosong lagi
		const gagal = (error: string) =>
	     fail(400, { error, nama: nama ?? '', email: email ?? '', noWa: noWaMentah, kecamatan, desa, detail, role });

		// --- Validasi akun ---
		if (!nama || !email || !password) return gagal('Semua kolom wajib diisi.');
		if (password.length < 8) return gagal('Kata sandi minimal 8 karakter.');

		const [emailSudahAda] = await db.select().from(users).where(eq(users.email, email));
		if (emailSudahAda) return gagal('Email ini sudah terdaftar. Coba masuk saja.');

		// --- Validasi tambahan khusus jastiper ---
		let noWa = '';
		let gambar: { buffer: Buffer; ext: 'jpg' | 'png' } | null = null;
		

		if (role === 'jastiper') {
			noWa = rapikanWa(noWaMentah);
			if (!/^08\d{8,11}$/.test(noWa)) return gagal('Nomor WhatsApp tidak valid. Contoh: 081234567890.');
			if (!KECAMATAN_NGANJUK.includes(kecamatan)) return gagal('Pilih kecamatan domisili.');
			if (!DESA_NGANJUK[kecamatan]?.includes(desa)) return gagal('Desa tidak sesuai dengan kecamatan yang dipilih.');
            if (detail.length < 5 || detail.length > 150) return gagal('Isi RT/RW dan detail jalan dengan lengkap (minimal 5 karakter).');

			if (!(selfie instanceof File) || selfie.size === 0) return gagal('Foto selfie wajib diupload.');
			if (selfie.size > MAKS_SELFIE) return gagal('Ukuran foto selfie maksimal 2 MB.');
			const buffer = Buffer.from(await selfie.arrayBuffer());
			const ext = deteksiGambar(buffer);
			if (!ext) return gagal('Foto selfie harus berformat JPG atau PNG.');
			gambar = { buffer, ext };

			if (!setuju) return gagal('Kamu harus menyetujui syarat dan ketentuan.');

			const [waSudahAda] = await db
				.select()
				.from(jastiperProfiles)
				.where(eq(jastiperProfiles.noWa, noWa));
			if (waSudahAda) return gagal('Nomor WhatsApp ini sudah terdaftar.');
		}

		// --- Simpan ---
		const passwordHash = await bcrypt.hash(password, 10);
		const userId = randomUUID();
		let namaFileSelfie: string | null = null;

		try {
			if (gambar) {
				await mkdir(FOLDER_SELFIE, { recursive: true });
				namaFileSelfie = `${randomUUID()}.${gambar.ext}`;
				await writeFile(join(FOLDER_SELFIE, namaFileSelfie), gambar.buffer);
			}

			// Satu transaksi: akun + profil + permintaan verifikasi berhasil bersama, atau batal bersama
			await db.transaction(async (tx) => {
				await tx.insert(users).values({ id: userId, nama, email, passwordHash, role });

				if (role === 'jastiper' && namaFileSelfie) {
					await tx.insert(jastiperProfiles).values({
						userId,
						area: 'Nganjuk',
						alamat: `${detail}, Desa ${desa}, Kec. ${kecamatan}, Kab. Nganjuk`,
						noWa,
						terverifikasi: false
					});
					await tx.insert(verifikasiJastiper).values({
						id: randomUUID(),
						userId,
						status: 'menunggu',
						dokumenSelfieUrl: `/admin/selfie/${namaFileSelfie}`
					});
				}
			});
		} catch (e) {
			console.error('Gagal mendaftar:', e);
			// database gagal -> hapus selfie yang terlanjur tersimpan
			if (namaFileSelfie) await unlink(join(FOLDER_SELFIE, namaFileSelfie)).catch(() => {});
			return gagal('Pendaftaran gagal, silakan coba lagi.');
		}

		// --- Login-kan user setelah daftar ---
		const token = buatTokenSesi();
		const session = await buatSesi(token, userId);

		cookies.set('session', token, {
			path: '/',
			expires: session.expiresAt,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production'
		});

		// Jastiper tidak langsung ke dashboard, harus menunggu keputusan admin
		throw redirect(303, role === 'jastiper' ? '/publik/menunggu-verifikasi' : '/publik/katalog');
	}
};