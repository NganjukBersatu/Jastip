import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { verifikasiJastiper, users, jastiperProfiles, logAdmin } from '$lib/server/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

// Penjaga ulang: form action tidak melewati load milik layout, jadi cek admin di sini juga.
function pastikanAdmin(locals: App.Locals) {
	if (!locals.user || locals.user.role !== 'admin' || locals.user.aktif === false) {
		throw redirect(303, '/admin/masuk');
	}
	return locals.user;
}

async function ambilPengajuan(id: string) {
	const [row] = await db
		.select({
			id: verifikasiJastiper.id,
			userId: verifikasiJastiper.userId,
			status: verifikasiJastiper.status,
			alasanPenolakan: verifikasiJastiper.alasanPenolakan,
			dokumenKtpUrl: verifikasiJastiper.dokumenKtpUrl,
			dokumenSelfieUrl: verifikasiJastiper.dokumenSelfieUrl,
			createdAt: verifikasiJastiper.createdAt,
			nama: users.nama,
			email: users.email,
			noWa: jastiperProfiles.noWa,
			area: jastiperProfiles.area,
			alamat: jastiperProfiles.alamat
		})
		.from(verifikasiJastiper)
		.innerJoin(users, eq(verifikasiJastiper.userId, users.id))
		.leftJoin(jastiperProfiles, eq(jastiperProfiles.userId, users.id))
		.where(eq(verifikasiJastiper.id, id));
	return row;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	pastikanAdmin(locals);
	const pengajuan = await ambilPengajuan(params.id);
	if (!pengajuan) throw error(404, 'Pengajuan tidak ditemukan');

	const nomorBersih = (pengajuan.noWa ?? '').replace(/[\s-]/g, '');
	const formatNomorValid = /^(08|62)\d{8,12}$/.test(nomorBersih);

	let nomorDipakaiLain = false;
	if (pengajuan.noWa) {
		const kembar = await db
			.select({ userId: jastiperProfiles.userId })
			.from(jastiperProfiles)
			.where(
				and(eq(jastiperProfiles.noWa, pengajuan.noWa), ne(jastiperProfiles.userId, pengajuan.userId))
			)
			.limit(1);
		nomorDipakaiLain = kembar.length > 0;
	}

	// Link WhatsApp: 08xxx menjadi 628xxx
	const digit = nomorBersih.replace(/\D/g, '');
	const nomorInternasional = digit.startsWith('0') ? '62' + digit.slice(1) : digit;
	const waLink = digit ? `https://wa.me/${nomorInternasional}` : null;

	return { pengajuan, formatNomorValid, nomorDipakaiLain, waLink };
};

export const actions: Actions = {
	setujui: async ({ params, locals }) => {
		const admin = pastikanAdmin(locals);
		const row = await ambilPengajuan(params.id);
		if (!row) throw error(404, 'Pengajuan tidak ditemukan');
		if (row.status !== 'menunggu') return fail(400, { pesan: 'Pengajuan ini sudah diproses.' });

		await db.transaction(async (tx) => {
			await tx
				.update(verifikasiJastiper)
				.set({
					status: 'disetujui',
					alasanPenolakan: null,
					diprosesOleh: admin.id,
					diprosesPada: new Date()
				})
				.where(eq(verifikasiJastiper.id, row.id));
			await tx
				.update(jastiperProfiles)
				.set({ terverifikasi: true })
				.where(eq(jastiperProfiles.userId, row.userId));
			await tx.insert(logAdmin).values({
				id: crypto.randomUUID(),
				adminId: admin.id,
				aksi: 'setujui_jastiper',
				targetTipe: 'user',
				targetId: row.userId
			});
		});

		throw redirect(303, '/admin/verifikasi-jastiper');
	},

	tolak: async ({ params, request, locals }) => {
		const admin = pastikanAdmin(locals);
		const form = await request.formData();
		const alasan = String(form.get('alasan') ?? '').trim();
		if (!alasan) return fail(400, { pesan: 'Alasan penolakan wajib diisi.', alasan });

		const row = await ambilPengajuan(params.id);
		if (!row) throw error(404, 'Pengajuan tidak ditemukan');
		if (row.status !== 'menunggu') return fail(400, { pesan: 'Pengajuan ini sudah diproses.', alasan });

		await db.transaction(async (tx) => {
			await tx
				.update(verifikasiJastiper)
				.set({
					status: 'ditolak',
					alasanPenolakan: alasan,
					diprosesOleh: admin.id,
					diprosesPada: new Date()
				})
				.where(eq(verifikasiJastiper.id, row.id));
			await tx
				.update(jastiperProfiles)
				.set({ terverifikasi: false })
				.where(eq(jastiperProfiles.userId, row.userId));
			await tx.insert(logAdmin).values({
				id: crypto.randomUUID(),
				adminId: admin.id,
				aksi: 'tolak_jastiper',
				targetTipe: 'user',
				targetId: row.userId,
				alasan
			});
		});

		throw redirect(303, '/admin/verifikasi-jastiper');
	}
};