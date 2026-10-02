import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifikasiJastiper, jastiperProfiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { join, basename } from 'node:path';
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

async function ambilVerifikasi(userId: string) {
	const [v] = await db
		.select()
		.from(verifikasiJastiper)
		.where(eq(verifikasiJastiper.userId, userId))
		.orderBy(desc(verifikasiJastiper.createdAt))
		.limit(1);
	return v;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/publik/masuk');
	if (locals.user.role !== 'jastiper') throw redirect(303, '/publik/katalog');

	const v = await ambilVerifikasi(locals.user.id);
	if (v?.status === 'disetujui') throw redirect(303, '/jastiper/dashboard');

	const [profil] = await db
		.select({ noWa: jastiperProfiles.noWa })
		.from(jastiperProfiles)
		.where(eq(jastiperProfiles.userId, locals.user.id));

	return {
		status: v?.status ?? 'menunggu',
		alasan: v?.alasanPenolakan ?? null,
		noWa: profil?.noWa ?? ''
	};
};

export const actions: Actions = {
	kirimUlang: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'jastiper') throw redirect(303, '/publik/masuk');
		const userId = locals.user.id;

		// Hanya pendaftaran yang berstatus ditolak yang boleh dikirim ulang
		const v = await ambilVerifikasi(userId);
		if (!v || v.status !== 'ditolak') {
			return fail(400, { error: 'Kirim ulang hanya bisa untuk pendaftaran yang ditolak.', noWa: '' });
		}

		const data = await request.formData();
		const noWaMentah = data.get('noWa')?.toString() ?? '';
		const selfie = data.get('selfie');
		const gagal = (error: string) => fail(400, { error, noWa: noWaMentah });

		// --- Validasi ---
		const noWa = rapikanWa(noWaMentah);
		if (!/^08\d{8,11}$/.test(noWa)) return gagal('Nomor WhatsApp tidak valid. Contoh: 081234567890.');

		if (!(selfie instanceof File) || selfie.size === 0) return gagal('Foto selfie baru wajib diupload.');
		if (selfie.size > MAKS_SELFIE) return gagal('Ukuran foto selfie maksimal 2 MB.');
		const buffer = Buffer.from(await selfie.arrayBuffer());
		const ext = deteksiGambar(buffer);
		if (!ext) return gagal('Foto selfie harus berformat JPG atau PNG.');

		// Nomor boleh sama dengan miliknya sendiri, tapi tidak boleh milik akun lain
		const [waLain] = await db
			.select({ userId: jastiperProfiles.userId })
			.from(jastiperProfiles)
			.where(eq(jastiperProfiles.noWa, noWa));
		if (waLain && waLain.userId !== userId) return gagal('Nomor WhatsApp ini sudah dipakai akun lain.');

		// --- Simpan foto baru, lalu perbarui data dalam satu transaksi ---
		await mkdir(FOLDER_SELFIE, { recursive: true });
		const namaFile = `${randomUUID()}.${ext}`;
		await writeFile(join(FOLDER_SELFIE, namaFile), buffer);

		try {
			await db.transaction(async (tx) => {
				const [profil] = await tx
					.select({ userId: jastiperProfiles.userId })
					.from(jastiperProfiles)
					.where(eq(jastiperProfiles.userId, userId));

				if (profil) {
					await tx.update(jastiperProfiles).set({ noWa }).where(eq(jastiperProfiles.userId, userId));
				} else {
					await tx.insert(jastiperProfiles).values({
						userId,
						area: 'Nganjuk',
						noWa,
						terverifikasi: false
					});
				}

				// Status kembali ke menunggu; alasan lama dan jejak keputusan lama dikosongkan.
				// created_at diperbarui supaya permintaan ini tampil sebagai pengajuan baru di admin.
				await tx
					.update(verifikasiJastiper)
					.set({
						status: 'menunggu',
						alasanPenolakan: null,
						dokumenSelfieUrl: `/admin/selfie/${namaFile}`,
						diprosesOleh: null,
						diprosesPada: null,
						createdAt: new Date()
					})
					.where(eq(verifikasiJastiper.id, v.id));
			});
		} catch (e) {
			console.error('Gagal kirim ulang verifikasi:', e);
			await unlink(join(FOLDER_SELFIE, namaFile)).catch(() => {});
			return gagal('Pengiriman gagal, silakan coba lagi.');
		}

		// Hapus selfie lama (basename mencegah keluar dari folder uploads)
		if (v.dokumenSelfieUrl) {
			await unlink(join(FOLDER_SELFIE, basename(v.dokumenSelfieUrl))).catch(() => {});
		}

		throw redirect(303, '/publik/menunggu-verifikasi');
	}
};