<script>
  import { page } from '$app/stores';

  // Halaman aktif, dipakai untuk highlight menu — kirim dari parent, mis. active="katalog"
  let { active = '' } = $props();

  let user = $derived($page.data.user);
  let inisial = $derived(user?.nama?.charAt(0)?.toUpperCase() ?? '?');

  // Sembunyikan navbar di semua halaman jastiper
  let isJastiperPage = $derived($page.url.pathname.startsWith('/jastiper'));

  // State untuk buka/tutup menu mobile
  let menuTerbuka = $state(false);

  function toggleMenu() {
    menuTerbuka = !menuTerbuka;
  }

  function tutupMenu() {
    menuTerbuka = false;
  }
</script>

{#if !isJastiperPage}
  <nav class="sticky top-0 z-50 bg-bg border-b border-ink/10">
    <div class="max-w-[1180px] mx-auto px-5 sm:px-8 h-[68px] sm:h-[76px] flex items-center justify-between">
      <a href="/" class="font-display font-black text-xl sm:text-2xl text-primary-dark" onclick={tutupMenu}>
        Nitip<span class="text-ink">.</span>
      </a>

      <div class="hidden md:flex gap-9 font-semibold text-sm">
        <a
          href="/"
          class="opacity-75 hover:opacity-100 transition {active === 'home' ? 'opacity-100 text-primary-dark' : ''}"
        >
          Home
        </a>
        <a
          href="/publik/katalog"
          class="opacity-75 hover:opacity-100 transition {active === 'katalog' ? 'opacity-100 text-primary-dark' : ''}"
        >
          Katalog
        </a>
        <a
          href="/publik/cara-kerja"
          class="opacity-75 hover:opacity-100 transition {active === 'cara-kerja' ? 'opacity-100 text-primary-dark' : ''}"
        >
          Cara kerja
        </a>

        <!-- Menu khusus role pelanggan -->
        {#if user?.role === 'pelanggan'}
          <a
            href="/pelanggan/chat"
            class="opacity-75 hover:opacity-100 transition {active === 'chat' ? 'opacity-100 text-primary-dark' : ''}"
          >
            Chat jastiper
          </a>
        {/if}
      </div>

      <div class="flex items-center gap-3">
        {#if user?.role === 'pelanggan'}
          <a
            href="/keranjang"
            aria-label="Keranjang"
            class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </a>
        {/if}

        {#if user}
          {#if user.role === 'pelanggan'}
            <a
              href="/keranjang"
              aria-label="Keranjang"
              class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </a>
          {/if}

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
          <a href="/publik/masuk" class="hidden sm:inline-block font-bold text-sm opacity-80 hover:opacity-100 transition">
            Masuk
          </a>
          <a
            href="/publik/daftar"
            class="hidden sm:inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm px-6 py-3 transition hover:-translate-y-0.5"
          >
            Daftar
          </a>
        {/if}

        <!-- Tombol hamburger, cuma tampil di bawah md -->
        <button
          type="button"
          aria-label={menuTerbuka ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuTerbuka}
          onclick={toggleMenu}
          class="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition"
        >
          {#if menuTerbuka}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Panel menu mobile -->
    {#if menuTerbuka}
      <div class="md:hidden border-t border-ink/10 bg-bg">
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
              class="px-5 py-3 font-semibold text-sm {active === 'chat' ? 'text-primary-dark bg-primary/5' : 'opacity-80'}"
            >
              Chat jastiper
            </a>
          {/if}
        </div>

        <!-- Aksi akun, cuma tampil di panel mobile (sm:hidden di navbar sudah disembunyikan di atas) -->
        <div class="sm:hidden px-5 pb-4 pt-1 border-t border-ink/10">
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