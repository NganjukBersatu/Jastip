<script lang="ts">
  import { page } from '$app/stores';
  import { invalidate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { notifikasiState } from '$lib/stores/notifikasi.svelte';
  import { JASA_AKTIF } from '$lib/config';

  let { data, children } = $props();

  const notifikasi = notifikasiState();

  // Nama & avatar yang ditampilkan (bisa override dari localStorage)
  // svelte-ignore state_referenced_locally
  let displayNama = $state(data.user?.nama ?? '');
  let avatarUrl = $state<string | null>(null);

  let inisial = $derived((displayNama || '?').charAt(0).toUpperCase());

  onMount(() => {
    if (!data.user?.email) return;

    try {
      const savedAvatar = localStorage.getItem(`avatar_${data.user.email}`);
      if (savedAvatar) avatarUrl = savedAvatar;

      const savedProfile = localStorage.getItem(`profile_${data.user.email}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed?.nama) displayNama = parsed.nama;
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Perbarui angka notifikasi pesanan tiap 15 detik selama tab sedang dilihat
  onMount(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') invalidate('app:pesanan-baru');
    }, 15000);
    return () => clearInterval(timer);
  });

  // ==========================================
  // Buka / tutup sidebar desktop (tersimpan di localStorage)
  // ==========================================

  let sidebarTutup = $state(false);

  onMount(() => {
    try {
      sidebarTutup = localStorage.getItem('sidebar_tutup') === '1';
    } catch (e) {
      console.error(e);
    }
  });

  function toggleSidebar() {
    sidebarTutup = !sidebarTutup;
    try {
      localStorage.setItem('sidebar_tutup', sidebarTutup ? '1' : '0');
    } catch (e) {
      console.error(e);
    }
  }

  // Jumlah notifikasi per menu (dipakai untuk titik notifikasi saat sidebar tertutup)
  function jumlahBadge(href: string): number {
    if (href === '/jastiper/pengajuan-harga') return notifikasi.jumlah ?? 0;
    if (href === '/jastiper/pesanan') return data.jumlahPesananBaru ?? 0;
    if (href === '/jastiper/pengaduan') return data.jumlahPengaduanBaru ?? 0;
    return 0;
  }

  const menu = [
    {
      href: '/jastiper/dashboard',
      label: 'Dashboard',
      icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
    },
    {
      href: '/jastiper/produk',
      label: 'Produk saya',
      icon: '<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
    },
    {
      href: '/jastiper/jasa',
      label: 'Jasa saya',
      icon: '<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
    },
    {
      href: '/jastiper/pengajuan-harga',
      label: 'Pengajuan harga',
      icon: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>'
    },
    {
      href: '/jastiper/pesanan',
      label: 'Pesanan',
      icon: '<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>'
    },
    {
      href: '/jastiper/laporan',
      label: 'Laporan',
      icon: '<path d="M3 3v18h18"/><path d="M18.5 9 13 14.5l-3-3L4 18"/>'
    },
    {
      href: '/jastiper/ongkir',
      label: 'Ongkir wilayah',
      icon: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'
    },
    {
      href: '/jastiper/pengaduan',
      label: 'Pengaduan',
      icon: '<path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/>'
    },
    {
      href: '/jastiper/pengaturan',
      label: 'Pengaturan profil',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'
    }
  ];

  const menuTampil = JASA_AKTIF ? menu : menu.filter((item) => item.href !== '/jastiper/jasa');

  // ==========================================
  // Menu aktif + tab mobile otomatis ke tengah
  // ==========================================

  const pathname = $derived($page.url.pathname);

  // Aktif untuk halaman itu sendiri maupun sub-halamannya (mis. /jastiper/produk/baru)
  function aktif(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  // Elemen <nav> mobile yang bisa di-scroll horizontal
  let navScrollEl = $state<HTMLElement | null>(null);
  let sudahRender = false;

  // Geser scroll <nav> supaya tab `el` berada tepat di tengah.
  // Hanya menggeser <nav> (bukan seluruh halaman), jadi tidak ikut menggulung ke atas/bawah.
  function pusatkan(el: HTMLElement, behavior: ScrollBehavior = 'smooth') {
    if (!navScrollEl) return;

    const navRect = navScrollEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const left =
      navScrollEl.scrollLeft + (elRect.left - navRect.left) - (navRect.width - elRect.width) / 2;

    navScrollEl.scrollTo({ left: Math.max(0, left), behavior });
  }

  // Dijalankan tiap halaman berganti (klik menu, tombol back, atau buka langsung lewat URL)
  $effect(() => {
    // Jadikan pathname sebagai dependensi
    pathname;

    if (!navScrollEl) return;

    const tabAktif = navScrollEl.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!tabAktif) return;

    // Saat pertama kali dibuka langsung loncat (tanpa animasi), berikutnya halus
    pusatkan(tabAktif, sudahRender ? 'smooth' : 'auto');
    sudahRender = true;
  });
</script>

<div class="min-h-screen bg-bg flex flex-col lg:flex-row">

  <!-- ========================= -->
  <!-- SIDEBAR DESKTOP -->
  <!-- ========================= -->

  <aside
    class="hidden lg:flex lg:h-screen lg:sticky lg:top-0
           flex-col shrink-0 overflow-hidden
           border-r border-[#FFE9C7] bg-white
           transition-[width] duration-200 ease-out
           {sidebarTutup ? 'lg:w-[76px]' : 'lg:w-64'}"
  >
    <div class="flex h-full min-h-0 flex-col {sidebarTutup ? 'p-4' : 'p-5'}">

      <!-- Judul panel + tombol buka/tutup -->
      <div
        class="mb-5 flex items-center justify-between gap-2
               {sidebarTutup ? 'flex-col justify-start gap-1.5' : ''}"
      >
        <a
          href="/profile"
          title="Kembali ke profil"
          class="flex min-w-0 items-center gap-3 rounded-xl transition hover:opacity-90"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                   bg-gradient-to-br from-[#FF6A1F] to-[#C23B0A]
                   text-lg font-bold text-white shadow-sm"
          >
            N
          </span>

          {#if !sidebarTutup}
            <span class="min-w-0 leading-tight">
              <span class="block text-lg font-bold text-[#C23B0A]">Nitip</span>
              <span class="block text-xs text-[#7A5E44]">Panel jastiper</span>
            </span>
          {/if}
        </a>

        <!-- Tombol buka / tutup sidebar -->
        <button
          type="button"
          onclick={toggleSidebar}
          aria-label={sidebarTutup ? 'Buka sidebar' : 'Tutup sidebar'}
          aria-expanded={!sidebarTutup}
          title={sidebarTutup ? 'Buka sidebar' : 'Tutup sidebar'}
          class="{sidebarTutup ? 'h-11 w-11 rounded-xl' : 'h-9 w-9 rounded-xl'}
                 flex shrink-0 cursor-pointer items-center justify-center
                 text-[#7A5E44] transition hover:bg-[#FFF3DF] hover:text-[#C23B0A]
                 focus-visible:outline-2 focus-visible:outline-[#FF6A1F]"
        >
          <svg
            class="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="M9 4v16" />
          </svg>
        </button>
      </div>

      <!-- Menu -->
      {#if !sidebarTutup}
        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#7A5E44]/70">
          Menu
        </p>
      {:else}
        <div class="mx-auto mb-2 h-px w-6 bg-[#FFE9C7]"></div>
      {/if}

      <nav
        class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden
               [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {#each menuTampil as item}
          <a
            href={item.href}
            title={sidebarTutup ? item.label : undefined}
            aria-label={sidebarTutup ? item.label : undefined}
            aria-current={aktif(item.href) ? 'page' : undefined}
            class="group flex shrink-0 items-center gap-3 rounded-xl text-sm transition
                   {sidebarTutup ? 'mx-auto h-11 w-11 justify-center gap-0' : 'px-3 py-2'}
                   {aktif(item.href)
              ? 'bg-[#FFE9C7] font-semibold text-[#C23B0A]'
              : 'text-[#7A5E44] hover:bg-[#FFF3DF] hover:text-[#2A1A0E]'}"
          >
            <!-- Ikon dalam kotak kecil -->
            <span
              class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition
                     {aktif(item.href)
                ? 'bg-gradient-to-br from-[#FF6A1F] to-[#C23B0A] text-white shadow-sm'
                : 'bg-[#FFF8EC] text-[#7A5E44] group-hover:bg-white group-hover:text-[#C23B0A]'}"
            >
              <svg
                class="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {@html item.icon}
              </svg>

              <!-- Titik notifikasi saat sidebar tertutup -->
              {#if sidebarTutup && jumlahBadge(item.href) > 0}
                <span
                  class="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full
                         bg-[#FF6A1F] ring-2 ring-white"
                ></span>
              {/if}
            </span>

            {#if !sidebarTutup}
              <span class="flex-1 truncate">{item.label}</span>

              {#if item.href === '/jastiper/pengajuan-harga' && notifikasi.jumlah > 0}
                <span
                  class="flex h-5 min-w-5 items-center justify-center
                         rounded-full bg-[#FF6A1F] px-1.5 text-[10px] font-bold text-white"
                >
                  {notifikasi.jumlah > 9 ? '9+' : notifikasi.jumlah}
                </span>
              {/if}

              {#if item.href === '/jastiper/pesanan' && data.jumlahPesananBaru > 0}
                <span
                  class="flex h-5 min-w-5 items-center justify-center
                         rounded-full bg-[#FF6A1F] px-1.5 text-[10px] font-bold text-white"
                >
                  {data.jumlahPesananBaru > 9 ? '9+' : data.jumlahPesananBaru}
                </span>
              {/if}

              {#if item.href === '/jastiper/pengaduan' && data.jumlahPengaduanBaru > 0}
                <span
                  class="flex h-5 min-w-5 items-center justify-center
                         rounded-full bg-[#FF6A1F] px-1.5 text-[10px] font-bold text-white"
                >
                  {data.jumlahPengaduanBaru > 9 ? '9+' : data.jumlahPengaduanBaru}
                </span>
              {/if}
            {/if}
          </a>
        {/each}
      </nav>

      <!-- Profil: menempel di bawah -->
      <div class="mt-auto shrink-0 border-t border-[#FFE9C7] pt-3">
        <a
          href="/profile"
          title={sidebarTutup ? (displayNama || data.user?.nama) : undefined}
          class="group flex items-center gap-2.5 rounded-2xl bg-[#FFF8EC] text-[#2A1A0E]
                 transition hover:bg-[#FFF3DF]
                 {sidebarTutup ? 'mx-auto h-11 w-11 justify-center' : 'p-2.5'}"
        >
          {#if avatarUrl}
            <img
              src={avatarUrl}
              alt="Foto profil"
              class="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
            />
          {:else}
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                     bg-gradient-to-br from-[#FF6A1F] to-[#FFC93C]
                     text-sm font-bold text-white ring-2 ring-white"
            >
              {inisial}
            </span>
          {/if}

          {#if !sidebarTutup}
            <div class="min-w-0 flex-1 leading-tight">
              <p class="truncate text-sm font-semibold group-hover:text-[#C23B0A]">
                {displayNama || data.user?.nama}
              </p>
              <p class="text-[11px] text-[#7A5E44]">Lihat profil</p>
            </div>

            <svg
              class="h-4 w-4 text-[#7A5E44]/60 transition group-hover:translate-x-0.5 group-hover:text-[#C23B0A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          {/if}
        </a>
      </div>
    </div>
  </aside>


  <!-- ========================= -->
  <!-- MOBILE HEADER -->
  <!-- ========================= -->

  <header
    class="lg:hidden sticky top-0 z-40 bg-white/95
           backdrop-blur border-b border-ink/10"
  >
    <div class="px-4 py-3 flex items-center justify-between gap-3">
      <a href="/profile" class="flex items-center gap-2.5 min-w-0">
        {#if avatarUrl}
          <img
            src={avatarUrl}
            alt="Foto profil"
            class="w-9 h-9 rounded-xl object-cover shrink-0"
          />
        {:else}
          <span
            class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white
                   flex items-center justify-center text-sm
                   font-extrabold shrink-0"
          >
            {inisial}
          </span>
        {/if}

        <div class="min-w-0">
          <div class="text-sm font-extrabold text-ink truncate">
            Panel Jastiper
          </div>
          <div class="text-[11px] text-ink-soft truncate">
            {displayNama || data.user?.nama}
          </div>
        </div>
      </a>

      <a
        href="/profile"
        class="shrink-0 text-[12px] font-bold text-primary-dark
               px-3 py-1.5 rounded-full bg-primary/10 transition hover:bg-primary/20"
      >
        Profil
      </a>
    </div>

    <!-- bind:this dipasang di sini supaya tab aktif bisa digeser ke tengah -->
    <nav bind:this={navScrollEl} class="px-3 pb-3 overflow-x-auto">
      <div class="flex gap-1.5 min-w-max">
        {#each menuTampil as item}
          <a
            href={item.href}
            aria-current={aktif(item.href) ? 'page' : undefined}
            onclick={(e) => pusatkan(e.currentTarget)}
            class="relative flex items-center gap-2 px-3.5 py-2.5
                   rounded-xl text-[12px] font-bold whitespace-nowrap
                   transition
                   {aktif(item.href)
              ? 'bg-primary text-white shadow-sm'
              : 'bg-bg text-ink-soft hover:bg-bg-alt hover:text-primary-dark'}"
          >
            <svg
              class="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {@html item.icon}
            </svg>

            {item.label}

            {#if item.href === '/jastiper/pengajuan-harga' && notifikasi.jumlah > 0}
              <span
                class="ml-1 text-[9px] font-bold
                       rounded-full min-w-4 h-4 px-1
                       flex items-center justify-center
                       {aktif(item.href)
                  ? 'bg-white text-primary-dark'
                  : 'bg-primary text-white'}"
              >
                {notifikasi.jumlah > 9 ? '9+' : notifikasi.jumlah}
              </span>
            {/if}

            {#if item.href === '/jastiper/pesanan' && data.jumlahPesananBaru > 0}
              <span
                class="ml-1 text-[9px] font-bold
                       rounded-full min-w-4 h-4 px-1
                       flex items-center justify-center
                       {aktif(item.href)
                  ? 'bg-white text-primary-dark'
                  : 'bg-primary text-white'}"
              >
                {data.jumlahPesananBaru > 9 ? '9+' : data.jumlahPesananBaru}
              </span>
            {/if}

            {#if item.href === '/jastiper/pengaduan' && data.jumlahPengaduanBaru > 0}
              <span
                class="ml-1 text-[9px] font-bold
                       rounded-full min-w-4 h-4 px-1
                       flex items-center justify-center
                       {aktif(item.href)
                  ? 'bg-white text-primary-dark'
                  : 'bg-primary text-white'}"
              >
                {data.jumlahPengaduanBaru > 9 ? '9+' : data.jumlahPengaduanBaru}
              </span>
            {/if}
          </a>
        {/each}
      </div>
    </nav>
  </header>


  <!-- ========================= -->
  <!-- CONTENT -->
  <!-- ========================= -->

  <main class="flex-1 min-w-0 w-full">
    {@render children()}
  </main>

</div>