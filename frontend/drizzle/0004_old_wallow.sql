CREATE TABLE "pesanan_item" (
	"id" text PRIMARY KEY NOT NULL,
	"pesanan_id" text NOT NULL,
	"produk_id" text,
	"jasa_id" text,
	"pengajuan_harga_id" text,
	"jumlah" integer DEFAULT 1 NOT NULL,
	"harga_satuan" integer NOT NULL,
	"titik_jemput" text,
	"titik_jemput_lat" double precision,
	"titik_jemput_lng" double precision,
	"jarak_km" double precision
);
--> statement-breakpoint
ALTER TABLE "pesanan" DROP CONSTRAINT "pesanan_produk_id_produk_id_fk";
--> statement-breakpoint
ALTER TABLE "pesanan" DROP CONSTRAINT "pesanan_jasa_id_jasa_id_fk";
--> statement-breakpoint
ALTER TABLE "pesanan" DROP CONSTRAINT "pesanan_pengajuan_harga_id_pengajuan_harga_id_fk";
--> statement-breakpoint
ALTER TABLE "jastiper_profiles" ADD COLUMN "status_aktif" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "pesanan" ADD COLUMN "wilayah_id" text;--> statement-breakpoint
ALTER TABLE "pesanan" ADD COLUMN "dibayar_pada" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_pesanan_id_pesanan_id_fk" FOREIGN KEY ("pesanan_id") REFERENCES "public"."pesanan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_produk_id_produk_id_fk" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_jasa_id_jasa_id_fk" FOREIGN KEY ("jasa_id") REFERENCES "public"."jasa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_pengajuan_harga_id_pengajuan_harga_id_fk" FOREIGN KEY ("pengajuan_harga_id") REFERENCES "public"."pengajuan_harga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_wilayah_id_ongkir_wilayah_id_fk" FOREIGN KEY ("wilayah_id") REFERENCES "public"."ongkir_wilayah"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "produk_id";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "jasa_id";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "pengajuan_harga_id";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "jumlah";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "harga_satuan";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "titik_jemput";--> statement-breakpoint
ALTER TABLE "pesanan" DROP COLUMN "jarak_km";