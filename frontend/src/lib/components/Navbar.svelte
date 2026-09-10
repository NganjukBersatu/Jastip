<script>
  import { page } from '$app/stores';
  import { notifikasiState } from '$lib/stores/notifikasi.svelte';
import { heroThemeState } from '$lib/stores/heroTheme.svelte.js';

  let { active = '' } = $props();

  let user = $derived($page.data.user);
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
</script>

{#if !isJastiperPage}
  <nav
class="sticky top-0 z-50 transition-colors duration-300 {blendWithHero
  ? 'bg-transparent text-ink -mb-[68px] sm:-mb-[76px]'
  : 'bg-bg text-ink shadow-sm'}"
 >
    <div class="max-w-[1180px] mx-auto px-5 sm:px-8 h-[68px] sm:h-[76px] flex items-center justify-between overflow-hidden">
      <!-- Logo -->
      <div class="flex-1 flex items-center">
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

    <!-- Panel menu mobile: selalu solid + teks gelap, biar tetap kebaca
         apapun kondisi navbar-nya (transparan atau tidak) -->
    {#if menuTerbuka}
      <div class="md:hidden bg-bg text-ink">
        <div class="flex flex-col py-2">
          <a
            href="/"
            onclick={tutupMenu}
            class="px-5 py-3 font-semibold text-sm {active === 'home' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
          >
            Home
          </a>

          <a
            href="/publik/katalog"
            onclick={tutupMenu}
            class="px-5 py-3 font-semibold text-sm {active === 'katalog' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
          >
            Katalog
          </a>

          {#if user?.role !== 'jastiper'}
            <a
              href="/publik/jadi-jastiper"
              onclick={tutupMenu}
              class="px-5 py-3 font-semibold text-sm {active === 'jastiper' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
            >
              Jadi jastiper
            </a>
          {/if}

          <a
            href="/publik/cara-kerja"
            onclick={tutupMenu}
            class="px-5 py-3 font-semibold text-sm {active === 'cara-kerja' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
          >
            Cara kerja
          </a>

          {#if user?.role === 'pelanggan'}
            <a
              href="/pelanggan/chat"
              onclick={tutupMenu}
              class="relative px-5 py-3 font-semibold text-sm {active === 'chat' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
            >
              Chat jastiper
              {#if notifikasi.jumlah > 0}
                <span
                  class="ml-2 inline-flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1"
                >
                  {notifikasi.jumlah > 9 ? '9+' : notifikasi.jumlah}
                </span>
              {/if}
            </a>

            <a
              href="/pesanan"
              onclick={tutupMenu}
              class="px-5 py-3 font-semibold text-sm {active === 'pesanan' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
            >
              Lihat pesanan
            </a>
          {/if}

          {#if user?.role === 'jastiper'}
            <a
              href="/jastiper/dashboard"
              onclick={tutupMenu}
              class="px-5 py-3 font-semibold text-sm {active === 'dashboard' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
            >
              Dashboard
            </a>
          {/if}
        </div>

        <div class="sm:hidden px-5 pb-4 pt-1">
          {#if user}
            <a
              href="/profile"
              onclick={tutupMenu}
              class="flex items-center gap-2.5 font-bold text-sm py-2"
            >
              <span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {inisial}
              </span>
              {user.nama.split(' ')[0]}
            </a>
          {:else}
            <div class="flex flex-col gap-2 mt-2">
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