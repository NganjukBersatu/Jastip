<script>
  let { data } = $props();

  const kartuStatistik = $derived([
    { label: 'Pesanan baru', nilai: data.statistik.pesananBaru, warna: 'bg-primary text-white' },
    { label: 'Sedang diproses', nilai: data.statistik.sedangDiproses, warna: 'bg-accent text-ink' },
    { label: 'Selesai bulan ini', nilai: data.statistik.selesaiBulanIni, warna: 'bg-ink text-bg' },
    { label: 'Produk aktif', nilai: data.statistik.produkAktif, warna: 'bg-white text-ink border border-ink/10' }
  ]);

  const areaBelumDiisi = $derived(!data.profil?.area);
</script>

<svelte:head>
  <title>Dashboard — Titipa</title>
</svelte:head>

<div class="p-8 max-w-[1000px]">
  <h1 class="text-[28px] flex items-center gap-2.5">
    Halo, {data.user.nama.split(' ')[0]}
    <svg class="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </svg>
  </h1>
  <p class="text-ink-soft mt-1 text-[15px]">Ini ringkasan lapak titip kamu hari ini.</p>

  {#if areaBelumDiisi}
    <div class="mt-6 bg-bg-alt border border-primary/20 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div>
        <div class="font-bold text-sm">Profil kamu belum lengkap</div>
        <div class="text-[13.5px] text-ink-soft mt-0.5">
          Lengkapi area layanan supaya pelanggan bisa nemuin kamu di katalog.
        </div>
      </div>
      <a
        href="/jastiper/pengaturan"
        class="shrink-0 inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[13.5px] px-5 py-2.5 hover:-translate-y-0.5 transition"
      >
        Lengkapi sekarang
      </a>
    </div>
  {/if}

  <!-- Kartu statistik -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
    {#each kartuStatistik as kartu}
      <div class="rounded-[22px] p-5 {kartu.warna}">
        <div class="font-display text-3xl font-semibold">{kartu.nilai}</div>
        <div class="text-[13px] font-semibold mt-1 opacity-90">{kartu.label}</div>
      </div>
    {/each}
  </div>

  <!-- Aksi cepat -->
  <div class="grid md:grid-cols-3 gap-4 mt-8">
    <a href="/jastiper/produk/baru" class="bg-white rounded-2xl border border-ink/10 p-5 hover:border-primary transition">
      <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <div class="font-bold text-sm mt-3">Tambah produk</div>
      <div class="text-[13px] text-ink-soft mt-1">Buka katalog barang baru buat dititip</div>
    </a>
    <a href="/jastiper/ongkir" class="bg-white rounded-2xl border border-ink/10 p-5 hover:border-primary transition">
      <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
      </svg>
      <div class="font-bold text-sm mt-3">Atur ongkir</div>
      <div class="text-[13px] text-ink-soft mt-1">Set biaya kirim per wilayah</div>
    </a>
    <a href="/jastiper/pengajuan-harga" class="bg-white rounded-2xl border border-ink/10 p-5 hover:border-primary transition">
      <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
      </svg>
      <div class="font-bold text-sm mt-3">Cek pengajuan harga</div>
      <div class="text-[13px] text-ink-soft mt-1">Balas nego harga dari pelanggan</div>
    </a>
  </div>

  <!-- Pesanan terbaru -->
  <div class="mt-8">
    <h2 class="text-lg font-display font-semibold">Pesanan terbaru</h2>

    {#if data.pesananTerbaru.length === 0}
      <div class="mt-4 bg-white rounded-2xl border border-dashed border-ink/15 p-10 text-center">
        <svg class="w-8 h-8 mx-auto mb-2 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
        </svg>
        <div class="font-bold text-sm">Belum ada pesanan masuk</div>
        <div class="text-[13.5px] text-ink-soft mt-1">
          Pesanan dari pelanggan bakal muncul di sini begitu ada yang order.
        </div>
      </div>
    {:else}
      <div class="mt-4 bg-white rounded-2xl border border-ink/10 divide-y divide-ink/10">
        {#each data.pesananTerbaru as pesanan}
          <div class="p-4 flex justify-between items-center text-sm">
            <span class="font-semibold">{pesanan.nama}</span>
            <span class="text-ink-soft">{pesanan.status}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>