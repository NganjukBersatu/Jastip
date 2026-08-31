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

// Katalog produk milik tiap jastiper
export const produk = pgTable('produk', {
	id: text('id').primaryKey(),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	nama: text('nama').notNull(),
	deskripsi: text('deskripsi'),
	kategori: text('kategori'), // mis. "Jajanan & oleh-oleh", "Skincare"
	hargaTipe: hargaTipeEnum('harga_tipe').notNull().default('tetap'),
	harga: integer('harga').notNull(), // dalam rupiah; kalau hargaTipe='nego', ini dianggap "harga mulai dari"
	gambarUrl: text('gambar_url'),
	aktif: boolean('aktif').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// Biaya ongkir per wilayah, diatur masing-masing jastiper
export const ongkirWilayah = pgTable('ongkir_wilayah', {
	id: text('id').primaryKey(),
	jastiperId: text('jastiper_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	wilayah: text('wilayah').notNull(), // mis. "Surabaya Timur"
	biaya: integer('biaya').notNull() // dalam rupiah
});

// Pengajuan harga — dipakai kalau produk hargaTipe='nego'.
// Pelanggan ajukan harga hasil chat, jastiper terima/tolak.
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

// Pesan chat untuk negosiasi harga — terikat ke satu pengajuanHarga
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
	nominal: integer('nominal'), // diisi kalau jenis = 'tawaran'
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// Pesanan — dibuat langsung (untuk produk harga tetap) atau setelah pengajuan harga diterima
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
	pengajuanHargaId: text('pengajuan_harga_id').references(() => pengajuanHarga.id), // null kalau harga tetap
	jumlah: integer('jumlah').notNull().default(1),
	hargaSatuan: integer('harga_satuan').notNull(), // harga final yang disepakati
	ongkir: integer('ongkir').notNull().default(0),
	totalHarga: integer('total_harga').notNull(),
	alamatKirim: text('alamat_kirim'),
	metodePembayaran: text('metode_pembayaran'),
	status: statusPesananEnum('status').notNull().default('menunggu_konfirmasi'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// Keranjang belanja pelanggan — belum terikat ke tabel produk (masih dummy di frontend),
// jadi data produk disalin langsung ke sini
export const keranjangItem = pgTable('keranjang_item', {
	id: text('id').primaryKey(),
	pelangganId: text('pelanggan_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	namaProduk: text('nama_produk').notNull(),
	hargaSatuan: integer('harga_satuan').notNull(),
	jumlah: integer('jumlah').notNull().default(1),
	lokasi: text('lokasi'),
	jastiperNama: text('jastiper_nama'),
	gambarUrl: text('gambar_url'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});