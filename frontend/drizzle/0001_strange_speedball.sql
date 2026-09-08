CREATE TYPE "public"."jenis_pesan" AS ENUM('teks', 'tawaran');--> statement-breakpoint
CREATE TABLE "jasa" (
	"id" text PRIMARY KEY NOT NULL,
	"jastiper_id" text NOT NULL,
	"nama" text NOT NULL,
	"deskripsi" text,
	"kategori" text,
	"harga_tipe" "harga_tipe" DEFAULT 'tetap' NOT NULL,
	"harga" integer NOT NULL,
	"satuan" text,
	"gambar_url" text NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keranjang_item" (
	"id" text PRIMARY KEY NOT NULL,
	"pelanggan_id" text NOT NULL,
	"produk_id" text NOT NULL,
	"jumlah" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tawaran_harga" (
	"id" text PRIMARY KEY NOT NULL,
	"pengajuan_harga_id" text NOT NULL,
	"pengirim_id" text NOT NULL,
	"harga" integer NOT NULL,
	"jumlah" integer NOT NULL,
	"status" text DEFAULT 'menunggu' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ALTER COLUMN "produk_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pesanan" ALTER COLUMN "produk_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "produk" ALTER COLUMN "gambar_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jastiper_profiles" ADD COLUMN "alamat" text;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD COLUMN "jasa_id" text;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD COLUMN "wilayah_id" text;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD COLUMN "jastiper_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pesan_chat" ADD COLUMN "jenis" "jenis_pesan" DEFAULT 'teks' NOT NULL;--> statement-breakpoint
ALTER TABLE "pesan_chat" ADD COLUMN "nominal" integer;--> statement-breakpoint
ALTER TABLE "pesan_chat" ADD COLUMN "dibaca" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pesanan" ADD COLUMN "jasa_id" text;--> statement-breakpoint
ALTER TABLE "pesanan" ADD COLUMN "titik_jemput" text;--> statement-breakpoint
ALTER TABLE "pesanan" ADD COLUMN "jarak_km" double precision;--> statement-breakpoint
ALTER TABLE "jasa" ADD CONSTRAINT "jasa_jastiper_id_users_id_fk" FOREIGN KEY ("jastiper_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keranjang_item" ADD CONSTRAINT "keranjang_item_pelanggan_id_users_id_fk" FOREIGN KEY ("pelanggan_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keranjang_item" ADD CONSTRAINT "keranjang_item_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tawaran_harga" ADD CONSTRAINT "tawaran_harga_pengajuan_harga_id_pengajuan_harga_id_fk" FOREIGN KEY ("pengajuan_harga_id") REFERENCES "public"."pengajuan_harga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tawaran_harga" ADD CONSTRAINT "tawaran_harga_pengirim_id_users_id_fk" FOREIGN KEY ("pengirim_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD CONSTRAINT "pengajuan_harga_jasa_id_jasa_id_fk" FOREIGN KEY ("jasa_id") REFERENCES "public"."jasa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD CONSTRAINT "pengajuan_harga_wilayah_id_ongkir_wilayah_id_fk" FOREIGN KEY ("wilayah_id") REFERENCES "public"."ongkir_wilayah"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengajuan_harga" ADD CONSTRAINT "pengajuan_harga_jastiper_id_users_id_fk" FOREIGN KEY ("jastiper_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_jasa_id_jasa_id_fk" FOREIGN KEY ("jasa_id") REFERENCES "public"."jasa"("id") ON DELETE no action ON UPDATE no action;