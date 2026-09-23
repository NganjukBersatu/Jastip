# Nitip

Nitip adalah aplikasi web marketplace jasa titip (jastip) yang menghubungkan **jastiper** (personal shopper/kurir) dengan **pelanggan**, lengkap dengan fitur nego harga langsung lewat chat.

## Tech Stack

- **Framework:** SvelteKit (Svelte 5 — runes mode, pakai `$state()` dan `onclick`, bukan `on:click`)
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Neon — serverless, shared antar tim)
- **Styling:** Tailwind CSS

## Fitur Utama

### Untuk Jastiper

| Halaman | Fungsi |
|---|---|
| **Dashboard** | Ringkasan penjualan |
| **Produk saya / Jasa saya** | Tambah produk/jasa ke katalog, edit, hapus |
| **Pengajuan harga** | Lihat pengajuan harga dari pelanggan, terima/tolak, balas chat nego |
| **Pesanan** | Lihat pesanan aktif & riwayat, bisa membatalkan pesanan |
| **Laporan** | Catat seluruh pemasukan, lihat produk paling laris |
| **Ongkir wilayah** | Input ongkir per wilayah operasi *(sedang dipertimbangkan pindah ke satuan per-km)* |
| **Pengaturan** | Simpan data profil (area, alamat, deskripsi, no. WhatsApp), nonaktifkan akun — saat nonaktif, produk otomatis hilang dari katalog utama |

### Untuk Pelanggan

| Halaman | Fungsi |
|---|---|
| **Home** | Hero + cuplikan katalog + penjelasan singkat web |
| **Katalog** | Lihat produk & jasa, tambah ke keranjang, beli langsung; harga nego untuk barang bernilai tinggi lewat chat |
| **Jadi jastiper / Cara kerja** | Halaman panduan standar |
| **Chat jastiper** | Inbox chat nego harga, terhubung ke halaman Pengajuan Harga di dashboard jastiper |
| **Lihat pesanan** | Riwayat pembelian + struk pembayaran |
| **Keranjang** | Kelola barang yang sudah ditambahkan sebelum checkout |

### Alur Pembelian

- **Beli langsung**: checkout satu produk, tidak masuk ke tabel keranjang.
- **+ Keranjang**: kumpulkan beberapa item dulu, checkout sekaligus lewat halaman Keranjang → Pembayaran.
- **Nego harga** (untuk produk/jasa dengan harga tidak tetap): klik "Hubungi Penjual" → diskusi harga lewat chat nego → pembeli mengajukan tawaran → jastiper menyetujui atau menolak. Kalau disetujui, lanjut ke pilih metode pembayaran dengan harga hasil nego; kalau ditolak, alur berhenti di situ.
- Pembayaran non-COD (transfer bank / e-wallet) **tidak menyimpan nomor rekening/e-wallet di sistem** — pelanggan diarahkan konfirmasi langsung ke WhatsApp pribadi jastiper untuk mengurangi risiko kebocoran data.

## Skema Database (ringkas)

- `users` — role: `pelanggan` / `jastiper`
- `jastiperProfiles` — area, alamat, deskripsi, `noWa`, status terverifikasi & status aktif
- `sessions`
- `produk` — punya `hargaTipe`: `tetap` / `nego`
- `jasa` — struktur mirip `produk`, tambahan kolom `satuan`
- `ongkirWilayah` — ongkir per wilayah per jastiper
- `pengajuanHarga` — pengajuan nego harga, relasi ke `produk` **atau** `jasa` (salah satu, nullable)
- `pesanChat` — chat nego, punya `jenis`/`nominal` (untuk tawaran harga) dan `dibaca`
- `tawaranHarga` — riwayat tawaran/counter-offer harga
- `pesanan` — order final, relasi ke `produk`/`jasa`, punya `titikJemput`/`jarakKm` khusus order jasa
- `keranjangItem` — isi keranjang pelanggan, relasi ke `produkId`

## Desain / Tema

Palet warna (Tailwind `@theme`):

| Token | Hex |
|---|---|
| `bg` | `#FFF8EC` |
| `bg-alt` | `#FFE9C7` |
| `primary` | `#FF6A1F` |
| `primary-dark` | `#C23B0A` |
| `primary-deep` | `#8F2B08` |
| `accent` | `#FFC93C` |
| `ink` | `#2A1A0E` |
| `ink-soft` | `#7A5E44` |

- **Font display/heading:** Fraunces
- **Font body:** Plus Jakarta Sans
- **Radius:** card `26px`, pill `100px`

## Status Proyek

Masih aktif dikembangkan. Beberapa hal yang masih berjalan/dipertimbangkan:
- Kategori filter di halaman katalog belum sinkron dengan opsi kategori di form "tambah produk"
- Ongkir wilayah sedang dipertimbangkan untuk pindah ke satuan per-km
- Ide fitur ke depan: deteksi pesanan dengan tujuan searah, supaya jastiper bisa belanja/antar sekaligus

## Tim

Dikembangkan oleh tim yang terdiri dari 4 orang: Ifaniaa, Shinta, Salsa, dan Sabela.