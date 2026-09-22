--
-- PostgreSQL database dump
--

\restrict NhplMDfBHgSJErESkPJmRHI15OFNOaGfeMrs2DN4In1HX0PSTGtqKJJ8baYkQx6

-- Dumped from database version 18.6 (6569466)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: harga_tipe; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.harga_tipe AS ENUM (
    'tetap',
    'nego'
);


ALTER TYPE public.harga_tipe OWNER TO neondb_owner;

--
-- Name: jenis_pesan; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.jenis_pesan AS ENUM (
    'teks',
    'tawaran'
);


ALTER TYPE public.jenis_pesan OWNER TO neondb_owner;

--
-- Name: role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.role AS ENUM (
    'pelanggan',
    'jastiper'
);


ALTER TYPE public.role OWNER TO neondb_owner;

--
-- Name: status_pengajuan; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.status_pengajuan AS ENUM (
    'menunggu',
    'diterima',
    'ditolak'
);


ALTER TYPE public.status_pengajuan OWNER TO neondb_owner;

--
-- Name: status_pesanan; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.status_pesanan AS ENUM (
    'menunggu_konfirmasi',
    'dibelanjakan',
    'dikirim',
    'selesai',
    'dibatalkan'
);


ALTER TYPE public.status_pesanan OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: jasa; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jasa (
    id text NOT NULL,
    jastiper_id text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    kategori text,
    harga_tipe public.harga_tipe DEFAULT 'tetap'::public.harga_tipe NOT NULL,
    harga integer NOT NULL,
    satuan text,
    gambar_url text NOT NULL,
    aktif boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.jasa OWNER TO neondb_owner;

--
-- Name: jastiper_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jastiper_profiles (
    user_id text NOT NULL,
    area text NOT NULL,
    alamat text,
    deskripsi text,
    terverifikasi boolean DEFAULT false NOT NULL,
    no_wa text,
    status_aktif boolean DEFAULT true NOT NULL
);


ALTER TABLE public.jastiper_profiles OWNER TO neondb_owner;

--
-- Name: keranjang_item; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.keranjang_item (
    id text NOT NULL,
    pelanggan_id text NOT NULL,
    produk_id text NOT NULL,
    jumlah integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.keranjang_item OWNER TO neondb_owner;

--
-- Name: ongkir_wilayah; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ongkir_wilayah (
    id text NOT NULL,
    jastiper_id text NOT NULL,
    wilayah text NOT NULL,
    biaya integer NOT NULL
);


ALTER TABLE public.ongkir_wilayah OWNER TO neondb_owner;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    digunakan boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- Name: pengajuan_harga; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pengajuan_harga (
    id text NOT NULL,
    produk_id text,
    pelanggan_id text NOT NULL,
    jastiper_id text NOT NULL,
    harga_diajukan integer NOT NULL,
    jumlah integer DEFAULT 1 NOT NULL,
    catatan text,
    status public.status_pengajuan DEFAULT 'menunggu'::public.status_pengajuan NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    jasa_id text,
    wilayah_id text
);


ALTER TABLE public.pengajuan_harga OWNER TO neondb_owner;

--
-- Name: pesan_chat; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pesan_chat (
    id text NOT NULL,
    pengajuan_harga_id text NOT NULL,
    pengirim_id text NOT NULL,
    isi text NOT NULL,
    jenis public.jenis_pesan DEFAULT 'teks'::public.jenis_pesan NOT NULL,
    nominal integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    dibaca boolean DEFAULT false NOT NULL
);


ALTER TABLE public.pesan_chat OWNER TO neondb_owner;

--
-- Name: pesanan; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pesanan (
    id text NOT NULL,
    pelanggan_id text NOT NULL,
    jastiper_id text NOT NULL,
    ongkir integer DEFAULT 0 NOT NULL,
    total_harga integer NOT NULL,
    alamat_kirim text,
    metode_pembayaran text,
    status public.status_pesanan DEFAULT 'menunggu_konfirmasi'::public.status_pesanan NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    pembayaran_dikonfirmasi boolean DEFAULT false NOT NULL,
    dibayar_pada timestamp with time zone,
    wilayah_id text
);


ALTER TABLE public.pesanan OWNER TO neondb_owner;

--
-- Name: pesanan_item; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.pesanan_item (
    id text NOT NULL,
    pesanan_id text NOT NULL,
    produk_id text,
    jasa_id text,
    pengajuan_harga_id text,
    jumlah integer DEFAULT 1 NOT NULL,
    harga_satuan integer NOT NULL,
    titik_jemput text,
    jarak_km double precision,
    titik_jemput_lat double precision,
    titik_jemput_lng double precision
);


ALTER TABLE public.pesanan_item OWNER TO neondb_owner;

--
-- Name: produk; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.produk (
    id text NOT NULL,
    jastiper_id text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    kategori text,
    harga_tipe public.harga_tipe DEFAULT 'tetap'::public.harga_tipe NOT NULL,
    harga integer NOT NULL,
    gambar_url text NOT NULL,
    aktif boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.produk OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: tawaran_harga; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tawaran_harga (
    id text NOT NULL,
    pengajuan_harga_id text NOT NULL,
    pengirim_id text NOT NULL,
    harga integer NOT NULL,
    jumlah integer NOT NULL,
    status text DEFAULT 'menunggu'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tawaran_harga OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role public.role DEFAULT 'pelanggan'::public.role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Data for Name: jasa; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jasa (id, jastiper_id, nama, deskripsi, kategori, harga_tipe, harga, satuan, gambar_url, aktif, created_at) FROM stdin;
fdc44a56-cc86-46a5-8045-94fec1f880cd	f686e7c7-db2d-4f8f-8f80-ff264918c929	jemput di stasiun	melayani jasa jemput di stasiun kertosono dan stasiun nganjuk	Jemputan	tetap	2000	per km	https://inforadar.disway.id/upload/2c415a4aa1aab4a729f953aae76fca0f.jpg	t	2026-09-04 02:41:15.224843+00
a7f3828a-33b8-477c-8c97-9f1f13848712	73bf8754-9a09-4748-87fd-d0d8a7df23e3	jemput dismk 1 kertosono	\N	Jemputan	tetap	10000	\N	/uploads/jasa/f170d16c-6227-469c-816e-b9b6a1d7970e.jpeg	t	2026-09-14 02:47:55.383389+00
8029f128-bd7d-4d8f-9b36-4375efc4afaa	73bf8754-9a09-4748-87fd-d0d8a7df23e3	jemput antar barang	\N	Antar Barang	tetap	7000	\N	/uploads/jasa/c05c2787-57a5-4cc2-9e9a-8ee0ffe41ff8.jpg	t	2026-09-14 03:12:47.775062+00
9113d9d9-0535-4439-8787-6003b17825e6	f686e7c7-db2d-4f8f-8f80-ff264918c929	Antar barang	antar barang seperti dokumen dan kado area nganjuk	Antar Barang	tetap	1500	per km	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCFZkBjGDQ8zhRjjalQeNDlowfNJYhshic3Fa0-yfkFA&s=10	t	2026-09-16 01:51:25.984937+00
66cd808b-326e-48a4-b004-e2b5683fce7e	17e7698e-afbd-494c-bafc-ac067e5a2941	anrat barang	antar barang area nganjuk	Antar Barang	tetap	1000	per km	data:image/jpeg;base64,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	t	2026-09-17 02:46:45.107083+00
\.


--
-- Data for Name: jastiper_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jastiper_profiles (user_id, area, alamat, deskripsi, terverifikasi, no_wa, status_aktif) FROM stdin;
6df07416-19b7-4bf8-974f-4ec437a00e18		\N	\N	f	\N	t
904b7fd0-a73e-4040-a75e-e2070ce7b366		\N	\N	f	\N	t
2d129e88-347c-44bd-a5a7-f2c38f475045		\N	\N	f	\N	t
73bf8754-9a09-4748-87fd-d0d8a7df23e3	kertosono	jl.kertosono	titip barang	f	087394724292	t
f686e7c7-db2d-4f8f-8f80-ff264918c929	kertosono	asdfghjk	qwertyui	f	081515972203	t
17e7698e-afbd-494c-bafc-ac067e5a2941	tanjunganom	Jl. Langsep No.24, Desa Pelem, Kecamatan Kertosono, Kabupaten Nganjuk, Jawa Timur, kode pos 64314	\N	f	085745484292	t
4d7fcd8a-49fb-4003-b850-f9bbb5bf8b7f		\N	\N	f	\N	t
\.


--
-- Data for Name: keranjang_item; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.keranjang_item (id, pelanggan_id, produk_id, jumlah, created_at) FROM stdin;
417de701-620d-4584-8684-3740022b0e39	d29443f6-5cd0-42f0-9bcd-2ac4bfc9cadd	1e7c01dc-f685-441d-885d-80e134ec6ed4	1	2026-09-14 01:13:41.698374+00
1e1989da-bcb6-4a8e-8f14-79379b19fe07	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	11f53d2c-27c8-4a58-aacb-4dd8a088b2a9	4	2026-09-14 02:02:35.960069+00
e858bd70-1b6c-4a98-9518-a1d2a2ec10d9	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	1e7c01dc-f685-441d-885d-80e134ec6ed4	4	2026-09-17 02:48:17.736914+00
6254203b-68f5-4275-b616-b04e3349f4ce	5a852025-49e6-4fda-b141-5e904170edd7	1e7c01dc-f685-441d-885d-80e134ec6ed4	1	2026-09-07 09:50:28.055831+00
961a8d7f-15e8-4aad-a19f-fbc9646e19df	d29443f6-5cd0-42f0-9bcd-2ac4bfc9cadd	a0c84dbb-babf-4242-b691-350e2a51ac8c	1	2026-09-14 01:12:59.197106+00
\.


--
-- Data for Name: ongkir_wilayah; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ongkir_wilayah (id, jastiper_id, wilayah, biaya) FROM stdin;
7736af4f-f55d-4e61-8dc3-df35946fb340	f686e7c7-db2d-4f8f-8f80-ff264918c929	kertosono	5000
80c659a7-6c67-4baa-b1a3-73722b1bca34	f686e7c7-db2d-4f8f-8f80-ff264918c929	tanjunganom	7000
47646c89-8f65-40a3-83e6-6729be332c26	17e7698e-afbd-494c-bafc-ac067e5a2941	kertosono	5000
e624fe49-f2dd-4979-9a77-d646e3aeceb7	17e7698e-afbd-494c-bafc-ac067e5a2941	tanjunganom	7000
db9910bd-97c9-4687-acc2-a903a4bd31a6	17e7698e-afbd-494c-bafc-ac067e5a2941	warujayeng	10000
14327665-6d24-41b2-87d5-f6b6ce2ac3a2	2d129e88-347c-44bd-a5a7-f2c38f475045	Tanjung Tani	10000
b557256e-8776-44bf-a219-f16a9178a55e	2d129e88-347c-44bd-a5a7-f2c38f475045	Prambon	20000
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, digunakan, created_at) FROM stdin;
a86d7ced-31c0-4c93-a1d0-f4c170cafd47	5a852025-49e6-4fda-b141-5e904170edd7	256140	2026-09-16 03:21:49.907+00	f	2026-09-16 03:11:47.276249+00
5ee3a569-c3d4-48f5-a431-eb7664a9484c	5a852025-49e6-4fda-b141-5e904170edd7	204895	2026-09-16 03:26:58.64+00	f	2026-09-16 03:16:56.005105+00
243d0ff5-655f-4dda-ae6d-ba4474c7826a	2d129e88-347c-44bd-a5a7-f2c38f475045	131593	2026-09-16 04:34:07.175+00	f	2026-09-16 04:24:04.634193+00
0e0a4ee4-2eb3-4226-865c-5858fd5a074d	980bccbc-f438-4590-a1be-d260392576f7	446344	2026-09-17 01:23:29.726+00	f	2026-09-17 01:13:30.52387+00
829f9793-9e67-4c12-98fb-dff8e8c3aeb5	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	315439	2026-09-17 01:26:02.692+00	f	2026-09-17 01:16:03.389538+00
7666f7f7-4be7-487f-90a4-059f71285e15	980bccbc-f438-4590-a1be-d260392576f7	975844	2026-09-17 01:26:18.44+00	f	2026-09-17 01:16:19.253873+00
fbcfe435-a31e-4024-9b7a-6b80bfb1bb24	980bccbc-f438-4590-a1be-d260392576f7	956850	2026-09-17 01:28:27.027+00	f	2026-09-17 01:18:27.837984+00
58c6af44-56cd-41d2-816c-8dada09a6a8a	980bccbc-f438-4590-a1be-d260392576f7	918509	2026-09-17 01:33:35.126+00	f	2026-09-17 01:23:35.934599+00
953343d0-47af-401e-8de9-e8f12b1c70db	5a852025-49e6-4fda-b141-5e904170edd7	134215	2026-09-17 01:34:23.832+00	f	2026-09-17 01:24:24.029738+00
d0852e9e-e9e6-4189-b37c-5b0c638f2f83	980bccbc-f438-4590-a1be-d260392576f7	262906	2026-09-17 01:41:30.073+00	f	2026-09-17 01:31:30.893015+00
3e88344d-6ed0-4b2b-a655-0290d602a41f	5a852025-49e6-4fda-b141-5e904170edd7	163863	2026-09-17 02:09:45.582+00	f	2026-09-17 01:59:45.822429+00
edac4b49-345a-44bf-b977-27e57f1422eb	5a852025-49e6-4fda-b141-5e904170edd7	491783	2026-09-17 02:24:57.478+00	f	2026-09-17 02:14:58.22573+00
\.


--
-- Data for Name: pengajuan_harga; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pengajuan_harga (id, produk_id, pelanggan_id, jastiper_id, harga_diajukan, jumlah, catatan, status, created_at, jasa_id, wilayah_id) FROM stdin;
aaa04d93-58c8-44ab-98e6-948791cedeb0	112d894f-8628-44d7-8e47-c9f9958daa55	5a852025-49e6-4fda-b141-5e904170edd7	17e7698e-afbd-494c-bafc-ac067e5a2941	1000000	1	\N	menunggu	2026-09-09 08:16:06.104436+00	\N	\N
61025d77-7e36-4e7a-874b-82846b49acc9	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	35200	1	\N	diterima	2026-09-16 01:26:44.66962+00	fdc44a56-cc86-46a5-8045-94fec1f880cd	\N
0bd6a0b9-2ef2-461a-9bae-3ee954c80d4b	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	26400	1	\N	diterima	2026-09-16 02:49:18.926384+00	9113d9d9-0535-4439-8787-6003b17825e6	\N
87034b19-02cf-4042-9c7f-e306c94fde5d	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	3600	1	\N	diterima	2026-09-16 03:04:43.364736+00	fdc44a56-cc86-46a5-8045-94fec1f880cd	\N
dfe22ff0-186f-4c24-9f57-03de77ae8b25	b3293753-9386-49ac-9bad-14b4cf6aa9e7	5a852025-49e6-4fda-b141-5e904170edd7	f686e7c7-db2d-4f8f-8f80-ff264918c929	600000	1	\N	ditolak	2026-09-08 08:20:01.390815+00	\N	\N
03538b49-2f8b-4d9f-8085-25802f8c1dad	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	176250	1	\N	diterima	2026-09-17 01:46:12.399156+00	9113d9d9-0535-4439-8787-6003b17825e6	\N
1a2fff74-51f3-402e-89b5-02bd2fb85301	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	176250	1	\N	diterima	2026-09-17 01:54:54.517531+00	9113d9d9-0535-4439-8787-6003b17825e6	\N
a1f1a616-da9e-4b38-9b1a-d491f561a4fe	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	26400	1	\N	diterima	2026-09-17 02:04:54.459202+00	9113d9d9-0535-4439-8787-6003b17825e6	\N
16756f1b-64ea-48cb-ba7d-915c3f4d16bf	\N	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	26400	1	\N	diterima	2026-09-17 02:11:02.615207+00	9113d9d9-0535-4439-8787-6003b17825e6	\N
33156ba6-42a1-4056-b376-041a4388c601	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	17600	1	\N	diterima	2026-09-17 02:52:35.684528+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
3a650dc1-0b8a-4026-a22d-cde9ba381b40	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	205600	1	\N	diterima	2026-09-17 02:54:58.703419+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
0451b3ab-2665-4b57-b2bc-eabc1b157069	\N	5a852025-49e6-4fda-b141-5e904170edd7	17e7698e-afbd-494c-bafc-ac067e5a2941	113600	1	\N	diterima	2026-09-17 03:01:55.362705+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
e17b2b2c-dca6-4ee7-b54d-748d6fba17aa	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	1800	1	\N	diterima	2026-09-17 03:04:10.756686+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
61649c8a-4a6b-421c-943f-9d48b2630292	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	1800	1	\N	diterima	2026-09-17 03:12:13.784916+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
99dbff20-77d7-444f-bf41-be78f75c07b8	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	1800	1	\N	diterima	2026-09-17 03:32:46.626184+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
108c12a0-3692-49d5-8ebb-f9e155bebf70	\N	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	1800	1	\N	diterima	2026-09-17 03:39:07.92024+00	66cd808b-326e-48a4-b004-e2b5683fce7e	\N
1695580f-7780-4420-92c3-afa67d6067b8	112d894f-8628-44d7-8e47-c9f9958daa55	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	90000	1	\N	diterima	2026-09-18 02:28:10.079958+00	\N	47646c89-8f65-40a3-83e6-6729be332c26
dd926a7d-d7ee-4296-a9c2-532b6b9e0d6c	112d894f-8628-44d7-8e47-c9f9958daa55	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	700000	1	\N	diterima	2026-09-14 01:39:12.809314+00	\N	47646c89-8f65-40a3-83e6-6729be332c26
d5f25ff2-4626-46c4-97aa-c8b967ce05d4	112d894f-8628-44d7-8e47-c9f9958daa55	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	800000	1	\N	diterima	2026-09-18 02:42:11.422817+00	\N	47646c89-8f65-40a3-83e6-6729be332c26
\.


--
-- Data for Name: pesan_chat; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pesan_chat (id, pengajuan_harga_id, pengirim_id, isi, jenis, nominal, created_at, dibaca) FROM stdin;
a4c84fef-4e43-428c-83d7-449d61edf470	61025d77-7e36-4e7a-874b-82846b49acc9	980bccbc-f438-4590-a1be-d260392576f7	udah sampai mana kak	teks	\N	2026-09-16 01:54:38.079195+00	f
9346759b-acd8-4238-b271-6ca9d7711dc1	1695580f-7780-4420-92c3-afa67d6067b8	17e7698e-afbd-494c-bafc-ac067e5a2941	oke kak done ya	teks	\N	2026-09-18 02:29:57.362236+00	f
3138d32e-e7d0-48d8-bab2-6402c2aa0798	1695580f-7780-4420-92c3-afa67d6067b8	980bccbc-f438-4590-a1be-d260392576f7	hai kak	teks	\N	2026-09-18 02:29:00.069922+00	t
30362879-7035-477f-81e6-c8abbf65f6e1	0451b3ab-2665-4b57-b2bc-eabc1b157069	5a852025-49e6-4fda-b141-5e904170edd7	segera di proses ya kak oengirimannya	teks	\N	2026-09-17 03:04:50.922718+00	f
0e94917f-f1cd-4d14-aecb-4eb4ddebba69	d5f25ff2-4626-46c4-97aa-c8b967ce05d4	17e7698e-afbd-494c-bafc-ac067e5a2941	bisa kak silahkan ajukan harga ya	teks	\N	2026-09-18 02:42:40.300889+00	t
5a95bd9b-37b1-40ea-b2ae-dd49550a2fdb	d5f25ff2-4626-46c4-97aa-c8b967ce05d4	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	bisa nego	teks	\N	2026-09-18 02:42:26.661869+00	t
79175581-bf26-47e7-8613-a520642dcc53	d5f25ff2-4626-46c4-97aa-c8b967ce05d4	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	sudah kak	teks	\N	2026-09-18 02:43:27.270062+00	t
\.


--
-- Data for Name: pesanan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pesanan (id, pelanggan_id, jastiper_id, ongkir, total_harga, alamat_kirim, metode_pembayaran, status, created_at, updated_at, pembayaran_dikonfirmasi, dibayar_pada, wilayah_id) FROM stdin;
6cbb070d-3fbc-4efe-b51d-a2339ef5d1b6	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	0	1800	Jalan Langsep, Desa Pelem, kertosono, Kabupaten Nganjuk	tunai	menunggu_konfirmasi	2026-09-17 03:32:47.191306+00	2026-09-17 03:32:47.191306+00	f	\N	\N
8e875231-660e-4df1-b7af-994016aab9b2	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	80000	pandanasri	cod	selesai	2026-09-18 01:30:37.453504+00	2026-09-18 01:32:23.507+00	t	2026-09-18 01:32:23.507+00	47646c89-8f65-40a3-83e6-6729be332c26
82e65ef7-11eb-4666-8e15-d54df6f2c444	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	805000	\N	\N	selesai	2026-09-18 02:44:51.286411+00	2026-09-18 02:45:22.961+00	f	\N	\N
4611ac28-8f7f-41f7-9e9a-e627af3ec1cf	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	7000	27000	mnbvcxzasdfghjk	cod	selesai	2026-09-15 00:42:18.795379+00	2026-09-15 00:52:01.173+00	t	2026-09-15 00:52:01.173+00	e624fe49-f2dd-4979-9a77-d646e3aeceb7
f4af8306-f07f-4ca5-ae80-ca664d503d40	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	20000	nganjuk	cod	selesai	2026-09-10 06:42:57.123373+00	2026-09-15 00:31:31.574+00	t	2026-09-15 00:31:31.574+00	\N
489d8d59-4117-426a-ba58-a3df8837e513	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	10000	30000	okokokokokok	cod	selesai	2026-09-15 00:43:21.976247+00	2026-09-15 01:02:35.49+00	t	2026-09-15 01:02:35.49+00	db9910bd-97c9-4687-acc2-a903a4bd31a6
cc16f276-b803-4372-8e13-d8dfec6f5b64	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	f686e7c7-db2d-4f8f-8f80-ff264918c929	5000	15000	kelurahan	cod	dibelanjakan	2026-09-10 06:56:16.653415+00	2026-09-11 06:10:02.013+00	f	\N	\N
2387133f-d836-4e0a-a24f-182bf3707145	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	5000	35000	poiuyhajhGUYP	cod	selesai	2026-09-11 06:07:58.793854+00	2026-09-11 06:10:17.536+00	t	2026-09-11 06:10:17.536+00	\N
f0361d64-1978-45ac-a571-17cedaf1669e	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	7000	67000	qwertyuiokjhgfds	cod	selesai	2026-09-14 04:48:07.331874+00	2026-09-14 05:01:34.689+00	t	2026-09-14 05:01:34.689+00	e624fe49-f2dd-4979-9a77-d646e3aeceb7
0bda3780-112f-4c65-a414-3cffbe7676b0	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	25000	asdfghjkl	cod	selesai	2026-09-14 04:33:13.459037+00	2026-09-14 05:01:37.199+00	t	2026-09-14 05:01:37.199+00	47646c89-8f65-40a3-83e6-6729be332c26
0c3ae609-3c0c-4442-baf0-3bcabed607a1	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	20000	jalan langsep kertosono	cod	selesai	2026-09-14 04:29:07.861488+00	2026-09-14 05:01:40.386+00	t	2026-09-14 05:01:40.386+00	47646c89-8f65-40a3-83e6-6729be332c26
8bc128d9-4f82-482f-b201-3ea9d9753668	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	7000	27000	qwertyhujikolp	cod	selesai	2026-09-15 00:42:46.5661+00	2026-09-15 00:51:51.714+00	t	2026-09-15 00:51:51.714+00	e624fe49-f2dd-4979-9a77-d646e3aeceb7
56481996-9b48-467a-b445-8d0388033d63	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	55000	poiuytrewq1234567890	cod	selesai	2026-09-15 00:41:45.386927+00	2026-09-15 01:02:17.622+00	t	2026-09-15 01:02:17.622+00	47646c89-8f65-40a3-83e6-6729be332c26
c45a42c8-48cc-4422-a909-3bf2dd185ca7	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	0	1800	jl merdeka, desa lambangkuning, kertosono, Kabupaten Nganjuk	tunai	menunggu_konfirmasi	2026-09-17 03:39:08.432207+00	2026-09-17 03:39:08.432207+00	f	\N	\N
7cf3a0ea-d262-42f0-a650-25d5ed021070	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	45000	smkn 1 kertosono	cod	selesai	2026-09-17 02:47:51.541393+00	2026-09-17 02:48:20.652+00	t	2026-09-17 02:48:20.652+00	47646c89-8f65-40a3-83e6-6729be332c26
8c6775a9-86f9-44ff-9f3e-8ba21c8abb7f	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	20000	qwertyuikjhgfdsxcvbnm	cod	selesai	2026-09-15 00:58:20.807045+00	2026-09-15 01:02:17.622+00	t	2026-09-15 01:02:17.622+00	47646c89-8f65-40a3-83e6-6729be332c26
fa12fea1-73ae-4b0f-a4aa-4b1a9eeabb09	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	0	20000	qwertyuikjhgfdsxcvbnm	cod	selesai	2026-09-15 00:58:21.312209+00	2026-09-15 01:02:17.622+00	t	2026-09-15 01:02:17.622+00	47646c89-8f65-40a3-83e6-6729be332c26
31ae2b06-0490-42f6-b732-3bb10ab33740	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	0	3600	Jalan Langsep No. 24, Desa Pelem, Kecamatan Kertosono, Kabupaten Nganjuk, Jawa Timur, Kabupaten Nganjuk	e-wallet	selesai	2026-09-16 03:04:43.860045+00	2026-09-16 03:05:47.313+00	f	\N	\N
194020c4-b795-473f-bfe8-6a3429d6680c	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	705000	\N	\N	dibatalkan	2026-09-18 01:33:51.870994+00	2026-09-18 01:38:27.422+00	f	\N	\N
837321f6-c863-42e1-bc1a-60f3569e1bd7	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	705000	\N	\N	dibatalkan	2026-09-18 01:33:49.263297+00	2026-09-18 01:38:36.333+00	f	\N	\N
fb9ef341-ab37-4357-b8fa-e82d8da900a5	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	95000	\N	\N	menunggu_konfirmasi	2026-09-18 02:30:27.340222+00	2026-09-18 02:30:27.340222+00	f	\N	\N
0b32dd72-e4f1-4a5a-9f5c-5a41bb2a7e7c	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	75000	qwertgsvb	cod	selesai	2026-09-15 03:22:43.793391+00	2026-09-15 03:24:07.532+00	t	2026-09-15 03:24:07.532+00	47646c89-8f65-40a3-83e6-6729be332c26
03e7283f-cf39-4cc1-accf-76569f3d062c	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	0	35200	Jalan Langsep No. 24, Desa Pelem, Kecamatan Kertosono, Kabupaten Nganjuk, Jawa Timur, Kabupaten Nganjuk	tunai	dibelanjakan	2026-09-16 01:26:45.272031+00	2026-09-16 01:29:38.125+00	f	\N	\N
d3346f9d-6578-455b-b0b3-87b696a30b6f	980bccbc-f438-4590-a1be-d260392576f7	f686e7c7-db2d-4f8f-8f80-ff264918c929	0	26400	Jalan Langsep No. 24, Desa Pelem, Kecamatan Kertosono, Kabupaten Nganjuk, Jawa Timur, Kabupaten Nganjuk	transfer	selesai	2026-09-16 02:49:19.448217+00	2026-09-16 02:50:51.081+00	f	\N	\N
41cc053e-27c2-4931-a094-68f3b8ef92b4	980bccbc-f438-4590-a1be-d260392576f7	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	40000	kjhgfd	cod	selesai	2026-09-15 01:55:57.061534+00	2026-09-17 02:47:57.4+00	t	2026-09-17 02:47:57.4+00	47646c89-8f65-40a3-83e6-6729be332c26
b7a49dcf-02dc-4905-ae6f-e70377ff64cb	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	17e7698e-afbd-494c-bafc-ac067e5a2941	5000	20000	alamat smkn 1 kertosono	cod	selesai	2026-09-17 02:47:05.696651+00	2026-09-17 02:47:57.4+00	t	2026-09-17 02:47:57.4+00	47646c89-8f65-40a3-83e6-6729be332c26
\.


--
-- Data for Name: pesanan_item; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pesanan_item (id, pesanan_id, produk_id, jasa_id, pengajuan_harga_id, jumlah, harga_satuan, titik_jemput, jarak_km, titik_jemput_lat, titik_jemput_lng) FROM stdin;
8894b039-d7b9-4bab-8311-0747f11591b0	41cc053e-27c2-4931-a094-68f3b8ef92b4	11f53d2c-27c8-4a58-aacb-4dd8a088b2a9	\N	\N	1	15000	\N	\N	\N	\N
50d6f8d1-b655-4867-bd2f-e88452e28dd2	41cc053e-27c2-4931-a094-68f3b8ef92b4	1e7c01dc-f685-441d-885d-80e134ec6ed4	\N	\N	1	20000	\N	\N	\N	\N
c3781256-704d-440d-82ac-bcde4e626226	0b32dd72-e4f1-4a5a-9f5c-5a41bb2a7e7c	8784e171-5815-4ff6-bd6a-586e74a1b2a4	\N	\N	1	50000	\N	\N	\N	\N
e94dab97-d998-4e5a-9d58-208590758921	0b32dd72-e4f1-4a5a-9f5c-5a41bb2a7e7c	b49cd102-afdb-41cc-a5d8-8b632af97155	\N	\N	1	20000	\N	\N	\N	\N
5902d90b-2481-4f5d-b430-e2f1871284d5	03e7283f-cf39-4cc1-accf-76569f3d062c	\N	fdc44a56-cc86-46a5-8045-94fec1f880cd	61025d77-7e36-4e7a-874b-82846b49acc9	1	2000	Sumberkepuh, Nganjuk, Jawa Timur, Jawa, 64483, Indonesia	17.6	\N	\N
ee5750f3-2462-46b1-9de1-84f594d40e7a	d3346f9d-6578-455b-b0b3-87b696a30b6f	\N	9113d9d9-0535-4439-8787-6003b17825e6	0bd6a0b9-2ef2-461a-9bae-3ee954c80d4b	1	1500	Sumberkepuh, Nganjuk, Jawa Timur, Jawa, 64483, Indonesia	17.6	\N	\N
a9a3f73b-a82d-4749-aa63-a5df152a8488	31ae2b06-0490-42f6-b732-3bb10ab33740	\N	fdc44a56-cc86-46a5-8045-94fec1f880cd	87034b19-02cf-4042-9c7f-e306c94fde5d	1	2000	stasiun kertosono, Kabupaten Nganjuk	1.8	\N	\N
06101154-d78e-41df-ad64-a435c325171f	b7a49dcf-02dc-4905-ae6f-e70377ff64cb	11f53d2c-27c8-4a58-aacb-4dd8a088b2a9	\N	\N	1	15000	\N	\N	\N	\N
2bda7c5b-f9c0-423d-9e76-983d1253ea1b	7cf3a0ea-d262-42f0-a650-25d5ed021070	1e7c01dc-f685-441d-885d-80e134ec6ed4	\N	\N	2	20000	\N	\N	\N	\N
afa0baab-787a-4f31-9562-d83ed21a7d1d	6cbb070d-3fbc-4efe-b51d-a2339ef5d1b6	\N	66cd808b-326e-48a4-b004-e2b5683fce7e	99dbff20-77d7-444f-bf41-be78f75c07b8	1	1000	Sumberkepuh, Nganjuk, Jawa Timur, Jawa, 64483, Indonesia	1.8	-7.66317996727011	111.99535353427275
a320c7ed-6af3-440a-9d5f-7ed5284af61a	c45a42c8-48cc-4422-a909-3bf2dd185ca7	\N	66cd808b-326e-48a4-b004-e2b5683fce7e	108c12a0-3692-49d5-8ebb-f9e155bebf70	1	1000	Sumberkepuh, Nganjuk, Jawa Timur, Jawa, 64483, Indonesia	1.8	-7.66317996727011	111.99535353427275
8784ebd1-596e-4496-ae09-c035f7cff89e	8e875231-660e-4df1-b7af-994016aab9b2	11f53d2c-27c8-4a58-aacb-4dd8a088b2a9	\N	\N	5	15000	\N	\N	\N	\N
e16758db-daca-4798-bb28-08c0a399047c	837321f6-c863-42e1-bc1a-60f3569e1bd7	112d894f-8628-44d7-8e47-c9f9958daa55	\N	dd926a7d-d7ee-4296-a9c2-532b6b9e0d6c	1	700000	\N	\N	\N	\N
60e89045-a32d-469e-a7dd-71822fcdc2c0	194020c4-b795-473f-bfe8-6a3429d6680c	112d894f-8628-44d7-8e47-c9f9958daa55	\N	dd926a7d-d7ee-4296-a9c2-532b6b9e0d6c	1	700000	\N	\N	\N	\N
9e05a572-da58-441f-9fa4-26da8015c67f	fb9ef341-ab37-4357-b8fa-e82d8da900a5	112d894f-8628-44d7-8e47-c9f9958daa55	\N	1695580f-7780-4420-92c3-afa67d6067b8	1	90000	\N	\N	\N	\N
3e880457-951e-4af3-b4bc-85a08b061d8a	82e65ef7-11eb-4666-8e15-d54df6f2c444	112d894f-8628-44d7-8e47-c9f9958daa55	\N	d5f25ff2-4626-46c4-97aa-c8b967ce05d4	1	800000	\N	\N	\N	\N
\.


--
-- Data for Name: produk; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.produk (id, jastiper_id, nama, deskripsi, kategori, harga_tipe, harga, gambar_url, aktif, created_at) FROM stdin;
11f53d2c-27c8-4a58-aacb-4dd8a088b2a9	17e7698e-afbd-494c-bafc-ac067e5a2941	toner omg	\N	Skincare	tetap	15000	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2R10bCFYje6nQjMGn-6xaQQv8mcAS1jcawjjGpl5aPQ&s=10	t	2026-09-07 06:00:54.929434+00
112d894f-8628-44d7-8e47-c9f9958daa55	17e7698e-afbd-494c-bafc-ac067e5a2941	tas ysl	\N	Fashion	nego	1000000	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF_9d9x-qcus_Yf8_uUJl8wNS5W46aiJSUrkJJZmU4ow&s=10	t	2026-09-07 06:04:39.203983+00
1e7c01dc-f685-441d-885d-80e134ec6ed4	17e7698e-afbd-494c-bafc-ac067e5a2941	dazzle me ink gloss lip tint 02	\N	Fashion	tetap	20000	https://down-id.img.susercontent.com/file/id-11134207-822wp-mmfs4zh3wcuge5	t	2026-09-07 09:46:16.43729+00
b49cd102-afdb-41cc-a5d8-8b632af97155	17e7698e-afbd-494c-bafc-ac067e5a2941	[FUN SIZE ORANGE] EMINA SUN BATTLE SPF 35 PA+++ 20ml - NEW PACKAGING SUNSCREEN	\N	Skincare	tetap	20000	https://down-id.img.susercontent.com/file/id-11134207-7r98o-lxmbstl1mn1a60	t	2026-09-14 01:37:33.148978+00
5e12254c-ac9d-4b31-8c8e-1b05a496a113	2d129e88-347c-44bd-a5a7-f2c38f475045	Scarlett Extrait De Parfum	Parfum yang wangi dengan ketahanan 5-8 jam	Fashion	tetap	52000	/uploads/7077dc0f-1e05-4d64-a60c-5abd5d302734.jpg	t	2026-09-14 03:19:13.66553+00
b570b5f1-eae6-4cf0-8565-a8e7c841f66d	73bf8754-9a09-4748-87fd-d0d8a7df23e3	basreng joss	\N	makanan	tetap	10000	/uploads/48d5074d-0a0b-47ca-b128-81948d659f89.jpg	t	2026-09-14 03:46:51.353493+00
d271d181-91d6-467a-90ee-5fb7abba3fde	73bf8754-9a09-4748-87fd-d0d8a7df23e3	cireng ayam kuah keju	\N	makanan	tetap	13000	/uploads/e43de235-cf40-4218-a2f1-ba1d71860d51.jpg	t	2026-09-14 03:48:47.813971+00
8784e171-5815-4ff6-bd6a-586e74a1b2a4	17e7698e-afbd-494c-bafc-ac067e5a2941	cardigan rajut	\N	Fashion	tetap	50000	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5aNDRL6LzTHYvEFyMsqLEbJtfXntbggAAv30NES4ykA&s=10	t	2026-09-09 06:42:32.650151+00
a0c84dbb-babf-4242-b691-350e2a51ac8c	73bf8754-9a09-4748-87fd-d0d8a7df23e3	catokan almara	Catokan Almara kondisi bagus, panas merata, kabel masih aman. Cocok buat lurusin atau bikin curly.	Elektronik	tetap	150000	/uploads/ce0d5496-6ce7-4551-bcd6-b174155710b3.jpg	t	2026-09-10 08:20:18.209499+00
92232d73-13cc-4b4b-8282-8d3caab02b1f	73bf8754-9a09-4748-87fd-d0d8a7df23e3	pasmina viscose	\N	Fashion	tetap	38000	/uploads/a4538a3b-6343-4be5-81c8-a20d7d99ee99.jpg	t	2026-09-14 03:52:42.148118+00
b3293753-9386-49ac-9bad-14b4cf6aa9e7	f686e7c7-db2d-4f8f-8f80-ff264918c929	Dumbleg Jenang tradisional khas nganjuk	\N	Jajanan & oleh-oleh	tetap	10000	https://assets.pikiran-rakyat.com/crop/0x0:0x0/720x0/webp/photo/2024/02/26/1559009274.jpg	f	2026-09-03 02:02:41.71146+00
ffca5fd1-72b6-4f9f-a57b-249679232b98	f686e7c7-db2d-4f8f-8f80-ff264918c929	wonton pedas kecamatan kertosono	\N	Jajanan & oleh-oleh	tetap	10000	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAzPlQvQVcnDGmaayE2kWwDm4RTy2_Nv6zGkbb3n9b3A&s=10	t	2026-09-03 02:03:24.933688+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (id, user_id, expires_at) FROM stdin;
3a8006b5fa71bf6a91799ee00e1693b23451a6d7f4486e44f0f699dc84ee67d2	980bccbc-f438-4590-a1be-d260392576f7	2026-10-18 01:12:15.33+00
0f59519c650b18c0c4d7fcccc3a02eafabeaafbc6cf8e854e7bfa09a7da263a8	17e7698e-afbd-494c-bafc-ac067e5a2941	2026-10-15 04:31:30.111+00
5b4bc83c91b5db0c0a3de3aa6efed3695de86b0ed8bd7aff3323388e1430c1e5	980bccbc-f438-4590-a1be-d260392576f7	2026-10-18 01:12:16.316+00
42e1add13d747ff45805297f3a1d6eb69635dc2ba993485843d70b8f6b37ac67	2d129e88-347c-44bd-a5a7-f2c38f475045	2026-10-14 00:59:08.616+00
1bf9a24c05d1a4466bf33465c4052f9477636e157c53ce1cfb6f55ea552f6a1b	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	2026-10-18 01:29:09.617+00
0d00792123e5254e32506643e2e221c51a16f9a6dff6325d4e9fb13ae1e94136	17e7698e-afbd-494c-bafc-ac067e5a2941	2026-10-18 02:29:26.868+00
173a1ece9c2a8c6929a629804b5e97eae68129a87056eb885a105473fafed7ce	17e7698e-afbd-494c-bafc-ac067e5a2941	2026-10-10 08:53:10.131+00
1ac2ffed03aaf8ab48489c44e874be726a9dff7dd31606d123822cb1df97ded0	f686e7c7-db2d-4f8f-8f80-ff264918c929	2026-10-16 02:50:04.421+00
7872c539e2256c6c7abcfc10ce2835c508d2b870c91536c3739647dcaa1df451	2d129e88-347c-44bd-a5a7-f2c38f475045	2026-10-11 05:20:39.066+00
852ebea9de1b5932032aab714ba74b24e458d3a3207ca1fe596ec6b64f6b05b8	980bccbc-f438-4590-a1be-d260392576f7	2026-10-14 04:42:52.791+00
c3710f4b1df8efdf6c5c7752d525a5b31c0c195ba284fc366de2b680286d7628	f686e7c7-db2d-4f8f-8f80-ff264918c929	2026-10-11 06:29:32.947+00
862e913dfe9e485b5aea4c71741b5ecfdbcc0c581f47092423add26b6ad2694a	73bf8754-9a09-4748-87fd-d0d8a7df23e3	2026-10-08 07:27:46.281+00
8212dbc691b6d63496fd37e801747d38771a046709eff8ef9661d8595ac93892	17e7698e-afbd-494c-bafc-ac067e5a2941	2026-10-08 07:43:36.354+00
ec6a42335e3de72e52add78550d1c7e8bddbe4d0f106cbbfac14ced5e8d5819d	980bccbc-f438-4590-a1be-d260392576f7	2026-10-08 09:09:03.039+00
80584aaa0e91a25126f1de456eb442d453014421a11fcdf0dbe6812876ee9291	980bccbc-f438-4590-a1be-d260392576f7	2026-10-17 01:14:08.41+00
8f447061dc27ca746d2e418e2c00f355ffa098a9efca392c391945db0813045d	980bccbc-f438-4590-a1be-d260392576f7	2026-10-09 06:15:51.784+00
9a57497f3a4a2e415501fab2607ab9e0e09d0e123bf4ddaa4ddd25343370ad3d	f686e7c7-db2d-4f8f-8f80-ff264918c929	2026-10-09 06:18:22.253+00
6fa66618f1b7527afd68e0647509c428a7be294983eef395762cffe6eff9bc8d	980bccbc-f438-4590-a1be-d260392576f7	2026-10-15 01:02:59.12+00
172fdd14708dd297290c1c20364528d0d85eeb35d6314a6f2a4746f218f3c785	f686e7c7-db2d-4f8f-8f80-ff264918c929	2026-10-09 07:03:30.568+00
d7c3b50b00916cb45b5130f02b1f52467db5253356d8c89f42594f236b778a97	980bccbc-f438-4590-a1be-d260392576f7	2026-10-15 01:59:04.756+00
a3111785ded2f7411a582a15415c8455834008b61f70a92f6ed2e682a3db4d83	980bccbc-f438-4590-a1be-d260392576f7	2026-10-15 02:05:26.723+00
4f4e57315bb2c0d4f96957ff8267e32be744902287cb01712567019e2712aca5	4d7fcd8a-49fb-4003-b850-f9bbb5bf8b7f	2026-10-18 00:24:25.157+00
\.


--
-- Data for Name: tawaran_harga; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tawaran_harga (id, pengajuan_harga_id, pengirim_id, harga, jumlah, status, created_at) FROM stdin;
a58dab81-684e-4490-9248-d01a2e0bfe14	dfe22ff0-186f-4c24-9f57-03de77ae8b25	5a852025-49e6-4fda-b141-5e904170edd7	600000	1	menunggu	2026-09-08 08:20:25.498156
a0f4b713-438b-4a50-821b-381cbfaded74	dd926a7d-d7ee-4296-a9c2-532b6b9e0d6c	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	700000	1	menunggu	2026-09-18 01:33:30.92947
fdac3017-bc82-4574-a2f5-aedf09fed37d	1695580f-7780-4420-92c3-afa67d6067b8	980bccbc-f438-4590-a1be-d260392576f7	90000	1	menunggu	2026-09-18 02:28:37.382831
b2830f0b-aa6e-4623-ad6f-97bfbab6a50a	d5f25ff2-4626-46c4-97aa-c8b967ce05d4	57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	800000	1	menunggu	2026-09-18 02:43:03.747144
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, nama, email, password_hash, role, created_at) FROM stdin;
980bccbc-f438-4590-a1be-d260392576f7	ifaniaa	ifaniaa.aa4@gmail.com	$2b$10$SGPwx2tOAuLvZr/MS38yvek72Ppe3LV.HZhcIi1EtFZT/OJ6aNj0K	pelanggan	2026-09-03 02:00:36.282895+00
f686e7c7-db2d-4f8f-8f80-ff264918c929	fania	kongytshortai1@gmail.com	$2b$10$RbsqkBOM6FpTV/Xh8qBOs.gy3QYYuXy6CIhEnPk.n6jgA3FDbbRPS	jastiper	2026-09-03 02:01:09.024186+00
6df07416-19b7-4bf8-974f-4ec437a00e18	ifaniaa	ifaniaa.aa@gmail.com	$2b$10$F14m17deEVzUEiYALEP4HetZf6yImM7bFv9jccriMgHLdJBrUW7Uq	jastiper	2026-09-07 05:52:59.653406+00
17e7698e-afbd-494c-bafc-ac067e5a2941	niaa	fania.ifania@gmail.com	$2b$10$tK8zd05FFgQBVRpN.yzIY.kfVybQtEarWNZtS.GNrF0BG9eWXfKy6	jastiper	2026-09-07 05:58:55.156286+00
73bf8754-9a09-4748-87fd-d0d8a7df23e3	aprilia salsabila	salsabila13@gmail.com	$2b$10$sTU2q8wT4h21DFzols1jPuYogmRU9RdsBNV/7QyA6wgOfdaQBUkPq	jastiper	2026-09-07 06:46:09.189151+00
56a74326-161a-41ad-9c8c-d41fdabf21f5	nurul	nurulifania06@gmail.com	$2b$10$HiSt7nXi5bRHLrzpgedg3.OJzXt17nqdGpc.5N8eQ0YI/MGFGTQaO	pelanggan	2026-09-07 06:54:21.268867+00
904b7fd0-a73e-4040-a75e-e2070ce7b366	Sabela aprilia elisa putri	nurulifania14@gmail.com	$2b$10$.EG5M6vc8ggP/EE7ucHBw.iLR/pqsmUPrCr1R6dQsjg2GbMn14DdG	jastiper	2026-09-11 05:19:16.580229+00
2d129e88-347c-44bd-a5a7-f2c38f475045	Sabela aprilia elisa putri	magangreddistric@gmail.com	$2b$10$I9uYF4N4XPiZ8rmonYsW.uYcwlLnwjMKEkQUrtsLig5wQwZnQ4li2	jastiper	2026-09-11 05:20:35.18913+00
57de21d4-63d8-4e02-8ab9-61bc10fe5cc8	salsa	sadiminsalsa@gmail.com	$2b$10$EV1afX4SoXOoJLqxk5QaJeERTuXA5dCMMt2KsybtSYJpnJhNpA5Ya	pelanggan	2026-09-07 08:05:20.492148+00
d29443f6-5cd0-42f0-9bcd-2ac4bfc9cadd	sabela aprilia elisa putri	apriliaelisa@gmail.com	$2b$10$8cyshLT2Fv08R.q1HsXfNO0Y.niC8OOTD/MRVw02lZJBTjlVXGj5y	pelanggan	2026-09-14 01:10:26.215145+00
5a852025-49e6-4fda-b141-5e904170edd7	Sabela aprilia elisa putri	naibaaa588@gmail.com	$2b$10$aMSorXLcUB8fVJyg20T/eegIstVtr.5lXJkbdh10M.LE3XR6r8kmm	pelanggan	2026-09-07 05:58:06.470041+00
4d7fcd8a-49fb-4003-b850-f9bbb5bf8b7f	sabela aprilia	sabelaaprilia0@gmail.com	$2b$10$CQuKYH75520YLIXX1wOuUueOo0Gk7UUzBojfTsO8DrnBKBuaizPBK	jastiper	2026-09-18 00:24:20.520704+00
\.


--
-- Name: jasa jasa_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jasa
    ADD CONSTRAINT jasa_pkey PRIMARY KEY (id);


--
-- Name: jastiper_profiles jastiper_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jastiper_profiles
    ADD CONSTRAINT jastiper_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: keranjang_item keranjang_item_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.keranjang_item
    ADD CONSTRAINT keranjang_item_pkey PRIMARY KEY (id);


--
-- Name: ongkir_wilayah ongkir_wilayah_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ongkir_wilayah
    ADD CONSTRAINT ongkir_wilayah_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: pengajuan_harga pengajuan_harga_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_pkey PRIMARY KEY (id);


--
-- Name: pesan_chat pesan_chat_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesan_chat
    ADD CONSTRAINT pesan_chat_pkey PRIMARY KEY (id);


--
-- Name: pesanan_item pesanan_item_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan_item
    ADD CONSTRAINT pesanan_item_pkey PRIMARY KEY (id);


--
-- Name: pesanan pesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan
    ADD CONSTRAINT pesanan_pkey PRIMARY KEY (id);


--
-- Name: produk produk_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.produk
    ADD CONSTRAINT produk_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: tawaran_harga tawaran_harga_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tawaran_harga
    ADD CONSTRAINT tawaran_harga_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: jasa jasa_jastiper_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jasa
    ADD CONSTRAINT jasa_jastiper_id_users_id_fk FOREIGN KEY (jastiper_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: jastiper_profiles jastiper_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jastiper_profiles
    ADD CONSTRAINT jastiper_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keranjang_item keranjang_item_pelanggan_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.keranjang_item
    ADD CONSTRAINT keranjang_item_pelanggan_id_users_id_fk FOREIGN KEY (pelanggan_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keranjang_item keranjang_item_produk_id_produk_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.keranjang_item
    ADD CONSTRAINT keranjang_item_produk_id_produk_id_fk FOREIGN KEY (produk_id) REFERENCES public.produk(id) ON DELETE CASCADE;


--
-- Name: ongkir_wilayah ongkir_wilayah_jastiper_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ongkir_wilayah
    ADD CONSTRAINT ongkir_wilayah_jastiper_id_users_id_fk FOREIGN KEY (jastiper_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pengajuan_harga pengajuan_harga_jasa_id_jasa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_jasa_id_jasa_id_fk FOREIGN KEY (jasa_id) REFERENCES public.jasa(id) ON DELETE CASCADE;


--
-- Name: pengajuan_harga pengajuan_harga_jastiper_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_jastiper_id_users_id_fk FOREIGN KEY (jastiper_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pengajuan_harga pengajuan_harga_pelanggan_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_pelanggan_id_users_id_fk FOREIGN KEY (pelanggan_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pengajuan_harga pengajuan_harga_produk_id_produk_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_produk_id_produk_id_fk FOREIGN KEY (produk_id) REFERENCES public.produk(id) ON DELETE CASCADE;


--
-- Name: pengajuan_harga pengajuan_harga_wilayah_id_ongkir_wilayah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pengajuan_harga
    ADD CONSTRAINT pengajuan_harga_wilayah_id_ongkir_wilayah_id_fk FOREIGN KEY (wilayah_id) REFERENCES public.ongkir_wilayah(id);


--
-- Name: pesan_chat pesan_chat_pengajuan_harga_id_pengajuan_harga_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesan_chat
    ADD CONSTRAINT pesan_chat_pengajuan_harga_id_pengajuan_harga_id_fk FOREIGN KEY (pengajuan_harga_id) REFERENCES public.pengajuan_harga(id) ON DELETE CASCADE;


--
-- Name: pesan_chat pesan_chat_pengirim_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesan_chat
    ADD CONSTRAINT pesan_chat_pengirim_id_users_id_fk FOREIGN KEY (pengirim_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pesanan_item pesanan_item_jasa_id_jasa_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan_item
    ADD CONSTRAINT pesanan_item_jasa_id_jasa_id_fk FOREIGN KEY (jasa_id) REFERENCES public.jasa(id);


--
-- Name: pesanan_item pesanan_item_pengajuan_harga_id_pengajuan_harga_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan_item
    ADD CONSTRAINT pesanan_item_pengajuan_harga_id_pengajuan_harga_id_fk FOREIGN KEY (pengajuan_harga_id) REFERENCES public.pengajuan_harga(id);


--
-- Name: pesanan_item pesanan_item_pesanan_id_pesanan_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan_item
    ADD CONSTRAINT pesanan_item_pesanan_id_pesanan_id_fk FOREIGN KEY (pesanan_id) REFERENCES public.pesanan(id) ON DELETE CASCADE;


--
-- Name: pesanan_item pesanan_item_produk_id_produk_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan_item
    ADD CONSTRAINT pesanan_item_produk_id_produk_id_fk FOREIGN KEY (produk_id) REFERENCES public.produk(id);


--
-- Name: pesanan pesanan_jastiper_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan
    ADD CONSTRAINT pesanan_jastiper_id_users_id_fk FOREIGN KEY (jastiper_id) REFERENCES public.users(id);


--
-- Name: pesanan pesanan_pelanggan_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan
    ADD CONSTRAINT pesanan_pelanggan_id_users_id_fk FOREIGN KEY (pelanggan_id) REFERENCES public.users(id);


--
-- Name: pesanan pesanan_wilayah_id_ongkir_wilayah_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.pesanan
    ADD CONSTRAINT pesanan_wilayah_id_ongkir_wilayah_id_fk FOREIGN KEY (wilayah_id) REFERENCES public.ongkir_wilayah(id);


--
-- Name: produk produk_jastiper_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.produk
    ADD CONSTRAINT produk_jastiper_id_users_id_fk FOREIGN KEY (jastiper_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tawaran_harga tawaran_harga_pengajuan_harga_id_pengajuan_harga_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tawaran_harga
    ADD CONSTRAINT tawaran_harga_pengajuan_harga_id_pengajuan_harga_id_fk FOREIGN KEY (pengajuan_harga_id) REFERENCES public.pengajuan_harga(id);


--
-- Name: tawaran_harga tawaran_harga_pengirim_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tawaran_harga
    ADD CONSTRAINT tawaran_harga_pengirim_id_users_id_fk FOREIGN KEY (pengirim_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict NhplMDfBHgSJErESkPJmRHI15OFNOaGfeMrs2DN4In1HX0PSTGtqKJJ8baYkQx6

