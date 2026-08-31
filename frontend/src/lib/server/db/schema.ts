import { pgTable, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['pelanggan', 'jastiper']);
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
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const jastiperProfiles = pgTable('jastiper_profiles', {
	userId: text('user_id')
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade' }),
	area: text('area').notNull(),
	alamat: text('alamat'),
	deskripsi: text('deskripsi'),
	terverifikasi: boolean('terverifikasi').notNull().default(false)
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
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
	gambarUrl: text('gambar_url').notNull(), // wajib sekarang — url eksternal atau path hasil upload
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
	produkId: text('produk_id').references(() => produk.id, { onDelete: 'cascade' }), // nullable, produk masih dummy
	namaProduk: text('nama_produk').notNull(), // disalin langsung, karena produk masih dummy
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
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const pesanan = pgTable('pesanan', {
	id: text('id').primaryKey(),
	produkId: text('produk_id')
		.references(() => produk.id),
	pelangganId: text('pelanggan_id')
		.notNull()
		.references(() => users.id),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id),
	pengajuanHargaId: text('pengajuan_harga_id').references(() => pengajuanHarga.id),
	jumlah: integer('jumlah').notNull().default(1),
	hargaSatuan: integer('harga_satuan').notNull(),
	ongkir: integer('ongkir').notNull().default(0),
	totalHarga: integer('total_harga').notNull(),
	alamatKirim: text('alamat_kirim'),
	metodePembayaran: text('metode_pembayaran'),
	status: statusPesananEnum('status').notNull().default('menunggu_konfirmasi'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// Diubah: sekarang reference ke produk asli, bukan copy manual
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