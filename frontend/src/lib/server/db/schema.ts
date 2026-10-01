import { pgTable, text, timestamp, boolean, integer, doublePrecision, pgEnum } from 'drizzle-orm/pg-core';

// DIUBAH: tambah 'admin'
export const roleEnum = pgEnum('role', ['pelanggan', 'jastiper', 'admin']);
export const hargaTipeEnum = pgEnum('harga_tipe', ['tetap', 'nego']);
export const statusPengajuanEnum = pgEnum('status_pengajuan', ['menunggu', 'diterima', 'ditolak']);
export const statusPesananEnum = pgEnum('status_pesanan', [
	'menunggu_konfirmasi',
	'dibelanjakan',
	'dikirim',
	'selesai',
	'dibatalkan'
]);
export const jenisPesanEnum = pgEnum('jenis_pesan', ['teks', 'tawaran']);

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	nama: text('nama').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: roleEnum('role').notNull().default('pelanggan'),
	aktif: boolean('aktif').notNull().default(true), // BARU: akun dinonaktifkan admin = false
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const jastiperProfiles = pgTable('jastiper_profiles', {
	userId: text('user_id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	area: text('area').notNull(),
	alamat: text('alamat'),
	deskripsi: text('deskripsi'),
	noWa: text('no_wa'),
	terverifikasi: boolean('terverifikasi').notNull().default(false),
	statusAktif: boolean('status_aktif').notNull().default(true)
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	digunakan: boolean('digunakan').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const produk = pgTable('produk', {
	id: text('id').primaryKey(),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	nama: text('nama').notNull(),
	deskripsi: text('deskripsi'),
	kategori: text('kategori'),
	hargaTipe: hargaTipeEnum('harga_tipe').notNull().default('tetap'),
	harga: integer('harga').notNull(),
	gambarUrl: text('gambar_url').notNull(),
	aktif: boolean('aktif').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const jasa = pgTable('jasa', {
	id: text('id').primaryKey(),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	nama: text('nama').notNull(),
	deskripsi: text('deskripsi'),
	kategori: text('kategori'),
	hargaTipe: hargaTipeEnum('harga_tipe').notNull().default('tetap'),
	harga: integer('harga').notNull(),
	satuan: text('satuan'),
	gambarUrl: text('gambar_url').notNull(),
	aktif: boolean('aktif').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const ongkirWilayah = pgTable('ongkir_wilayah', {
	id: text('id').primaryKey(),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	wilayah: text('wilayah').notNull(),
	biaya: integer('biaya').notNull()
});

export const pengajuanHarga = pgTable('pengajuan_harga', {
	id: text('id').primaryKey(),
	produkId: text('produk_id').references(() => produk.id, { onDelete: 'cascade' }),
	jasaId: text('jasa_id').references(() => jasa.id, { onDelete: 'cascade' }),
	wilayahId: text('wilayah_id').references(() => ongkirWilayah.id),
	pelangganId: text('pelanggan_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	hargaDiajukan: integer('harga_diajukan').notNull(),
	jumlah: integer('jumlah').notNull().default(1),
	catatan: text('catatan'),
	status: statusPengajuanEnum('status').notNull().default('menunggu'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const pesanChat = pgTable('pesan_chat', {
	id: text('id').primaryKey(),
	pengajuanHargaId: text('pengajuan_harga_id')
		.notNull()
		.references(() => pengajuanHarga.id, { onDelete: 'cascade' }),
	pengirimId: text('pengirim_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	isi: text('isi').notNull(),
	jenis: jenisPesanEnum('jenis').notNull().default('teks'),
	nominal: integer('nominal'),
	dibaca: boolean('dibaca').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// pesanan = HEADER transaksi (1 checkout = 1 baris).
export const pesanan = pgTable('pesanan', {
	id: text('id').primaryKey(),
	pelangganId: text('pelanggan_id').notNull().references(() => users.id),
	jastiperId: text('jastiper_id').notNull().references(() => users.id),
	ongkir: integer('ongkir').notNull().default(0),
	totalHarga: integer('total_harga').notNull(), // jumlah semua item + ongkir
	alamatKirim: text('alamat_kirim'),
	wilayahId: text('wilayah_id').references(() => ongkirWilayah.id),
	metodePembayaran: text('metode_pembayaran'),
	pembayaranDikonfirmasi: boolean('pembayaran_dikonfirmasi').notNull().default(false),
	dibayarPada: timestamp('dibayar_pada', { withTimezone: true }),
	status: statusPesananEnum('status').notNull().default('menunggu_konfirmasi'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// item di dalam satu transaksi. Satu pesanan bisa punya banyak baris ini.
export const pesananItem = pgTable('pesanan_item', {
	id: text('id').primaryKey(),
	pesananId: text('pesanan_id')
		.notNull()
		.references(() => pesanan.id, { onDelete: 'cascade' }),
	produkId: text('produk_id').references(() => produk.id),
	jasaId: text('jasa_id').references(() => jasa.id),
	pengajuanHargaId: text('pengajuan_harga_id').references(() => pengajuanHarga.id),
	jumlah: integer('jumlah').notNull().default(1),
	hargaSatuan: integer('harga_satuan').notNull(),
	titikJemput: text('titik_jemput'), // khusus item jasa — alamat teks
	titikJemputLat: doublePrecision('titik_jemput_lat'),
	titikJemputLng: doublePrecision('titik_jemput_lng'),
	jarakKm: doublePrecision('jarak_km') // khusus item jasa
});

export const keranjangItem = pgTable('keranjang_item', {
	id: text('id').primaryKey(),
	pelangganId: text('pelanggan_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	produkId: text('produk_id')
		.notNull()
		.references(() => produk.id, { onDelete: 'cascade' }),
	jumlah: integer('jumlah').notNull().default(1),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const tawaranHarga = pgTable('tawaran_harga', {
	id: text('id').primaryKey(),
	pengajuanHargaId: text('pengajuan_harga_id').notNull().references(() => pengajuanHarga.id),
	pengirimId: text('pengirim_id').notNull().references(() => users.id),
	harga: integer('harga').notNull(),
	jumlah: integer('jumlah').notNull(),
	status: text('status').notNull().default('menunggu'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// BARU: jejak semua aksi admin (nonaktifkan akun, batalkan pesanan, dll.)
export const logAdmin = pgTable('log_admin', {
	id: text('id').primaryKey(),
	adminId: text('admin_id').notNull().references(() => users.id),
	aksi: text('aksi').notNull(), // contoh: 'nonaktifkan_akun', 'batalkan_pesanan'
	targetTipe: text('target_tipe').notNull(), // 'user' | 'produk' | 'jasa' | 'pesanan'
	targetId: text('target_id').notNull(),
	alasan: text('alasan'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// BARU: verifikasi jastiper oleh admin
export const statusVerifikasiEnum = pgEnum('status_verifikasi', [
	'menunggu',
	'disetujui',
	'ditolak'
]);

export const verifikasiJastiper = pgTable('verifikasi_jastiper', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	status: statusVerifikasiEnum('status').notNull().default('menunggu'),
	alasanPenolakan: text('alasan_penolakan'),
	dokumenKtpUrl: text('dokumen_ktp_url'),
	dokumenSelfieUrl: text('dokumen_selfie_url'),
	diprosesOleh: text('diproses_oleh').references(() => users.id),
	diprosesPada: timestamp('diproses_pada', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});