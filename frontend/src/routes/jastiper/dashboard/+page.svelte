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

<div class="w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <!-- HEADER -->
  <div class="mb-7 sm:mb-8">
    <div class="flex items-center gap-2.5">
      <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
        Halo, {data.user.nama.split(' ')[0]}
      </h1>

      <svg
        class="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
      </svg>
    </div>

    <p class="text-ink-soft mt-1.5 text-sm sm:text-[15px]">
      Ini ringkasan lapak titip kamu hari ini.
    </p>
  </div>

  <!-- PROFIL WARNING -->
  {#if areaBelumDiisi}
    <div class="mb-7 rounded-2xl border border-primary/20 bg-bg-alt p-4 sm:p-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <div class="font-bold text-sm text-ink">
            Profil kamu belum lengkap
          </div>

          <div class="text-[13px] sm:text-[13.5px] text-ink-soft mt-1 leading-relaxed">
            Lengkapi area layanan supaya pelanggan bisa nemuin kamu di katalog.
          </div>
        </div>

        <a
          href="/jastiper/pengaturan"
          class="shrink-0 inline-flex items-center justify-center rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-3 hover:-translate-y-0.5 hover:shadow-md transition"
        >
          Lengkapi sekarang
        </a>
      </div>
    </div>
  {/if}

  <!-- STATISTIK -->
  <section>
    <div class="mb-3">
      <h2 class="text-sm font-extrabold text-ink">Ringkasan lapak</h2>
      <p class="text-xs text-ink-soft mt-0.5">Aktivitas tokomu saat ini</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {#each kartuStatistik as kartu}
        <div
          class="rounded-2xl sm:rounded-[22px] p-4 sm:p-5 {kartu.warna} shadow-[0_2px_10px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="font-display text-2xl sm:text-3xl font-semibold">
            {kartu.nilai}
          </div>

          <div class="text-[12px] sm:text-[13px] font-semibold mt-1.5 leading-snug opacity-90">
            {kartu.label}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- AKSI CEPAT -->
  <section class="mt-8 sm:mt-9">
    <div class="mb-3">
      <h2 class="text-sm font-extrabold text-ink">Aksi cepat</h2>
      <p class="text-xs text-ink-soft mt-0.5">
        Kelola lapakmu dengan cepat
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      <a
        href="/jastiper/produk/baru"
        class="bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition"
      >
        <div class="w-10 h-10 rounded-xl bg-bg-alt flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>

        <div class="font-bold text-sm mt-4">Tambah produk</div>
        <div class="text-[13px] text-ink-soft mt-1 leading-relaxed">
          Buka katalog barang baru buat dititip
        </div>
      </a>

      <a
        href="/jastiper/ongkir"
        class="bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition"
      >
        <div class="w-10 h-10 rounded-xl bg-bg-alt flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M3 7h11v9H3z" />
            <path d="M14 10h4l3 3v3h-7z" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
        </div>

        <div class="font-bold text-sm mt-4">Atur ongkir</div>
        <div class="text-[13px] text-ink-soft mt-1 leading-relaxed">
          Set biaya kirim per wilayah
        </div>
      </a>

      <a
        href="/jastiper/pengajuan-harga"
        class="bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition"
      >
        <div class="w-10 h-10 rounded-xl bg-bg-alt flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
          </svg>
        </div>

        <div class="font-bold text-sm mt-4">Cek pengajuan harga</div>
        <div class="text-[13px] text-ink-soft mt-1 leading-relaxed">
          Balas nego harga dari pelanggan
        </div>
      </a>
    </div>
  </section>

  <!-- PESANAN TERBARU -->
  <section class="mt-8 sm:mt-9">
    <div class="mb-3">
      <h2 class="text-lg font-display font-semibold text-ink">
        Pesanan terbaru
      </h2>

      <p class="text-xs text-ink-soft mt-0.5">
        Aktivitas pesanan terakhir
      </p>
    </div>

    {#if data.pesananTerbaru.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-10 sm:p-10 text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
          <svg class="w-6 h-6 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M22 12h-6l-2 3h-4l-2-3H2" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
          </svg>
        </div>

        <div class="font-bold text-sm">Belum ada pesanan masuk</div>

        <div class="text-[13px] text-ink-soft mt-1 leading-relaxed">
          Pesanan dari pelanggan bakal muncul di sini begitu ada yang order.
        </div>
      </div>
    {:else}
      <div class="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
        {#each data.pesananTerbaru as pesanan, index}
          <div
            class:border-b={index !== data.pesananTerbaru.length - 1}
            class="min-h-[68px] px-4 py-3.5 sm:px-5 flex items-center justify-between gap-4 border-ink/10 hover:bg-bg/40 transition"
          >
            <div class="min-w-0">
              <div class="font-semibold text-sm truncate">
                {pesanan.nama}
              </div>

              <div class="text-[12px] text-ink-soft mt-0.5">
                Pesanan
              </div>
            </div>

            <span class="shrink-0 rounded-pill bg-bg-alt px-3 py-1.5 text-[11.5px] font-bold text-primary-dark">
              {pesanan.status}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>