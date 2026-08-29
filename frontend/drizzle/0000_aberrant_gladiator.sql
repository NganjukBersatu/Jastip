CREATE TYPE "public"."harga_tipe" AS ENUM('tetap', 'nego');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('pelanggan', 'jastiper');--> statement-breakpoint
CREATE TYPE "public"."status_pengajuan" AS ENUM('menunggu', 'diterima', 'ditolak');--> statement-breakpoint
CREATE TYPE "public"."status_pesanan" AS ENUM('menunggu_konfirmasi', 'dibelanjakan', 'dikirim', 'selesai', 'dibatalkan');--> statement-breakpoint
CREATE TABLE "jastiper_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"area" text NOT NULL,
	"deskripsi" text,
	"terverifikasi" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ongkir_wilayah" (
	"id" text PRIMARY KEY NOT NULL,
	"jastiper_id" text NOT NULL,
	"wilayah" text NOT NULL,
	"biaya" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pengajuan_harga" (
	"id" text PRIMARY KEY NOT NULL,
	"produk_id" text NOT NULL,
	"pelanggan_id" text NOT NULL,
	"harga_diajukan" integer NOT NULL,
	"jumlah" integer DEFAULT 1 NOT NULL,
	"catatan" text,
	"status" "status_pengajuan" DEFAULT 'menunggu' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pesan_chat" (
	"id" text PRIMARY KEY NOT NULL,
	"pengajuan_harga_id" text NOT NULL,
	"pengirim_id" text NOT NULL,
	"isi" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pesanan" (
	"id" text PRIMARY KEY NOT NULL,
	"produk_id" text NOT NULL,
	"pelanggan_id" text NOT NULL,
	"jastiper_id" text NOT NULL,
	"pengajuan_harga_id" text,
	"jumlah" integer DEFAULT 1 NOT NULL,
	"harga_satuan" integer NOT NULL,
	"ongkir" integer DEFAULT 0 NOT NULL,
	"total_harga" integer NOT NULL,
	"alamat_kirim" text,
	"metode_pembayaran" text,
	"status" "status_pesanan" DEFAULT 'menunggu_konfirmasi' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produk" (
	"id" text PRIMARY KEY NOT NULL,
	"jastiper_id" text NOT NULL,
	"nama" text NOT NULL,
	"deskripsi" text,
	"kategori" text,
	"harga_tipe" "harga_tipe" DEFAULT 'tetap' NOT NULL,
	"harga" integer NOT NULL,
	"gambar_url" text,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'pelanggan' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "jastiper_profiles" ADD CONSTRAINT "jastiper_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ongkir_wilayah" ADD CONSTRAINT "ongkir_wilayah_jastiper_id_users_id_fk" FOREIGN KEY ("jastiper_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD CONSTRAINT "pengajuan_harga_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD CONSTRAINT "pengajuan_harga_pelanggan_id_users_id_fk" FOREIGN KEY ("pelanggan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesan_chat" ADD CONSTRAINT "pesan_chat_pengajuan_harga_id_pengajuan_harga_id_fk" FOREIGN KEY ("pengajuan_harga_id") REFERENCES "public"."pengajuan_harga"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesan_chat" ADD CONSTRAINT "pesan_chat_pengirim_id_users_id_fk" FOREIGN KEY ("pengirim_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_pelanggan_id_users_id_fk" FOREIGN KEY ("pelanggan_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_jastiper_id_users_id_fk" FOREIGN KEY ("jastiper_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_pengajuan_harga_id_pengajuan_harga_id_fk" FOREIGN KEY ("pengajuan_harga_id") REFERENCES "public"."pengajuan_harga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produk" ADD CONSTRAINT "produk_jastiper_id_users_id_fk" FOREIGN KEY ("jastiper_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;