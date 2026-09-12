<script>
  import { page } from '$app/stores';
  import { fly, fade } from 'svelte/transition';
  import { notifikasiState } from '$lib/stores/notifikasi.svelte';
  import { heroThemeState } from '$lib/stores/heroTheme.svelte.js';

  let path = $derived($page.url.pathname);
  let user = $derived($page.data.user);

let active = $derived(
  path === '/' ? 'home' :
  path.startsWith('/publik/katalog') ? 'katalog' :
  path.startsWith('/publik/jadi-jastiper') ? 'jastiper' :
  path.startsWith('/publik/cara-kerja') ? 'cara-kerja' :
  path.startsWith('/pelanggan/chat') ? 'chat' :
  path.startsWith('/pesanan') ? 'pesanan' :
  path.startsWith('/jastiper/dashboard') ? 'dashboard' :
  (path === '/profile' && user?.role === 'jastiper') ? 'dashboard' :
  ''
);

  let inisial = $derived(user?.nama?.charAt(0)?.toUpperCase() ?? '?');

  const notifikasi = notifikasiState();
  const heroTheme = heroThemeState();

  let isJastiperPage = $derived($page.url.pathname.startsWith('/jastiper'));
  let isHomePage = $derived($page.url.pathname === '/');

  let menuTerbuka = $state(false);

  // Transparan & teks putih HANYA saat masih di atas Hero (Home page,
  // sebelum Hero terlewati). Di tempat lain (scroll lewat Hero, atau
  // halaman selain Home) navbar solid dengan teks gelap seperti biasa.
  let blendWithHero = $derived(isHomePage && heroTheme.overHero && !menuTerbuka);

  function toggleMenu() {
    menuTerbuka = !menuTerbuka;
  }

  function tutupMenu() {
    menuTerbuka = false;
  }

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuTerbuka ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

{#if !isJastiperPage}
  <nav
    class="sticky top-0 z-50 transition-colors duration-300 {blendWithHero
      ? 'bg-transparent text-ink -mb-17 sm:-mb-19'
      : 'bg-bg text-ink shadow-sm'}"
  >
   <div class="relative z-50 max-w-295 mx-auto px-5 sm:px-8 h-17 sm:h-19 flex items-center justify-between overflow-hidden">
      
    <!-- Logo -->
<div class="flex-1 flex items-center -ml-4">
  <a href="/" class="flex items-center" onclick={tutupMenu}>
    <img
      src="/images/logo.png"
      alt="Nitip"
      class="h-18 sm:h-22 w-auto"
    />
  </a>
</div>

      <!-- Menu desktop -->
      <div class="hidden md:flex gap-9 font-semibold text-sm shrink-0">
        <a
          href="/"
          class="opacity-80 hover:opacity-100 transition {active === 'home' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
        >
          Home
        </a>

        <a
          href="/publik/katalog"
          class="opacity-80 hover:opacity-100 transition {active === 'katalog' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
        >
          Katalog
        </a>

        {#if user?.role !== 'jastiper'}
          <a
            href="/publik/jadi-jastiper"
            class="opacity-80 hover:opacity-100 transition {active === 'jastiper' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
          >
            Jadi jastiper
          </a>
        {/if}

        <a
          href="/publik/cara-kerja"
          class="opacity-80 hover:opacity-100 transition {active === 'cara-kerja' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
        >
          Cara kerja
        </a>

        {#if user?.role === 'pelanggan'}
          <a
            href="/pelanggan/chat"
            class="relative opacity-80 hover:opacity-100 transition {active === 'chat' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
          >
            Chat jastiper
            {#if notifikasi.jumlah > 0}
              <span
                class="absolute -top-2 -right-3 bg-primary text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center"
              >
                {notifikasi.jumlah > 9 ? '9+' : notifikasi.jumlah}
              </span>
            {/if}
          </a>

          <a
            href="/pesanan"
            class="opacity-80 hover:opacity-100 transition {active === 'pesanan' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
          >
            Lihat pesanan
          </a>
        {/if}

        {#if user?.role === 'jastiper'}
          <a
            href="/jastiper/dashboard"
            class="opacity-80 hover:opacity-100 transition {active === 'dashboard' ? (blendWithHero ? 'opacity-100' : 'opacity-100 text-primary-dark') : ''}"
          >
            Dashboard
          </a>
        {/if}
      </div>

      <!-- Kanan -->
      <div class="flex-1 flex items-center justify-end gap-3">
        {#if user?.role === 'pelanggan'}
          <a
            href="/keranjang"
            aria-label="Keranjang"
            class="w-9 h-9 rounded-full flex items-center justify-center transition {blendWithHero ? 'hover:bg-white/15' : 'hover:bg-ink/5'}"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </a>
        {/if}

        {#if user}
          <a
            href="/profile"
            class="hidden sm:flex items-center gap-2.5 font-bold text-sm opacity-90 hover:opacity-100 transition"
          >
            <span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {inisial}
            </span>
            {user.nama.split(' ')[0]}
          </a>
        {:else}
          <a
            href="/publik/masuk"
            class="hidden sm:inline-block font-bold text-sm opacity-85 hover:opacity-100 transition"
          >
            Masuk
          </a>

          <a
            href="/publik/daftar"
            class="hidden sm:inline-flex items-center justify-center rounded-pill font-bold text-sm px-6 py-3 transition hover:-translate-y-0.5 bg-ink text-bg"
          >
            Daftar
          </a>
        {/if}

        <button
          type="button"
          aria-label={menuTerbuka ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuTerbuka}
          onclick={toggleMenu}
          class="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition {blendWithHero ? 'hover:bg-white/15' : 'hover:bg-ink/5'}"
        >
          {#if menuTerbuka}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          {:else}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- ================= PANEL MENU MOBILE (revisi) =================
         Drawer mengambang ala referensi: sudut melengkung penuh, label
         grup "MENU" & "AKUN", badge rata kanan, baris profil jadi
         pill dengan chevron. Navbar desktop di atas TIDAK disentuh. -->
    {#if menuTerbuka}
      <!-- Backdrop gelap, klik untuk menutup -->
      <button
  type="button"
  aria-label="Tutup menu"
  onclick={tutupMenu}
  transition:fade={{ duration: 200 }}
  class="md:hidden fixed top-17 sm:top-19 left-0 right-0 bottom-0 z-40 bg-ink/40 border-0 p-0 cursor-default"
></button>

      <!-- Drawer mengambang, tinggi mengikuti isi -->
<div
  transition:fly={{ y: -12, duration: 250 }}
  class="md:hidden fixed top-17 sm:top-19 left-0 right-0 z-50 w-full max-h-[calc(100vh-68px)] sm:max-h-[calc(100vh-76px)] bg-bg text-ink shadow-md overflow-y-auto rounded-b-2xl"
>
       <p class="px-4 pt-1 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-soft/70">Menu</p>

        <div class="flex flex-col gap-1 py-1 px-2.5">
          <a
            href="/"
            onclick={tutupMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'home' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
              <path d="M3 11l9-8 9 8" />
              <path d="M5 10v10h14V10" />
            </svg>
            Home
          </a>

          <a
            href="/publik/katalog"
            onclick={tutupMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'katalog' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Katalog
          </a>

          {#if user?.role !== 'jastiper'}
            <a
              href="/publik/jadi-jastiper"
              onclick={tutupMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'jastiper' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
                <path d="M20 8v6M23 11h-6" />
                <path d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
                <path d="M1 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              </svg>
              Jadi jastiper
            </a>
          {/if}

          <a
            href="/publik/cara-kerja"
            onclick={tutupMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'cara-kerja' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5" />
              <line x1="12" y1="17" x2="12" y2="17.5" />
            </svg>
            Cara kerja
          </a>

          {#if user?.role === 'pelanggan'}
            <a
              href="/pelanggan/chat"
              onclick={tutupMenu}
              class="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'chat' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
            >
              <span class="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                Chat jastiper
              </span>
              {#if notifikasi.jumlah > 0}
                <span class="inline-flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 px-1">
                  {notifikasi.jumlah > 9 ? '9+' : notifikasi.jumlah}
                </span>
              {/if}
            </a>

            <a
              href="/pesanan"
              onclick={tutupMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'pesanan' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
                <path d="M6 2l1.5 4h9L18 2" />
                <path d="M3.5 6h17l-1.2 12.5a2 2 0 01-2 1.5H6.7a2 2 0 01-2-1.5L3.5 6z" />
                <line x1="9" y1="10" x2="9" y2="14" />
                <line x1="15" y1="10" x2="15" y2="14" />
              </svg>
              Lihat pesanan
            </a>
          {/if}

          {#if user?.role === 'jastiper'}
            <a
              href="/jastiper/dashboard"
              onclick={tutupMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition {active === 'dashboard' ? 'text-primary-dark bg-primary/10' : 'opacity-80 hover:bg-ink/5'}"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5 shrink-0">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              Dashboard
            </a>
          {/if}
        </div>

        <!-- Bagian akun: label grup + pill profil / tombol Masuk-Daftar -->
        <div class="sm:hidden border-t border-ink/10 px-2.5 pt-2 pb-3">
          <p class="px-1.5 pb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-soft/70">Akun</p>
          {#if user}
            <a
              href="/profile"
              onclick={tutupMenu}
              class="flex items-center justify-between gap-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 transition px-3 py-2.5"
            >
              <span class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {inisial}
                </span>
                <span class="text-sm font-bold">{user.nama.split(' ')[0]}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 opacity-50 shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          {:else}
            <div class="flex flex-col gap-2 px-1.5 mt-1">
              <a
                href="/publik/masuk"
                onclick={tutupMenu}
                class="w-full text-center font-bold text-sm border border-ink/25 rounded-pill py-2.5"
              >
                Masuk
              </a>

              <a
                href="/publik/daftar"
                onclick={tutupMenu}
                class="w-full text-center inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm py-2.5"
              >
                Daftar
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </nav>
{/if}