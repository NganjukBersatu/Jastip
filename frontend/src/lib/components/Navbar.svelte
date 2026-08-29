<script>
  import { page } from '$app/stores';

  // Halaman aktif, dipakai untuk highlight menu — kirim dari parent, mis. active="katalog"
  let { active = '' } = $props();

  let user = $derived($page.data.user);
  let inisial = $derived(user?.nama?.charAt(0)?.toUpperCase() ?? '?');

  // Sembunyikan navbar di semua halaman jastiper
  let isJastiperPage = $derived($page.url.pathname.startsWith('/jastiper'));
</script>

{#if !isJastiperPage}
  <nav class="sticky top-0 z-50 bg-bg border-b border-ink/10">
    <div class="max-w-[1180px] mx-auto px-8 h-[76px] flex items-center justify-between">
      <a href="/" class="font-display font-black text-2xl text-primary-dark">
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
        {#if user}
          <a
            href="/profile"
            class="flex items-center gap-2.5 font-bold text-sm opacity-90 hover:opacity-100 transition"
          >
            <span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {inisial}
            </span>
            {user.nama.split(' ')[0]}
          </a>
        {:else}
          <a href="/publik/masuk" class="font-bold text-sm opacity-80 hover:opacity-100 transition">Masuk</a>
          <a
            href="/publik/daftar"
            class="inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm px-6 py-3 transition hover:-translate-y-0.5"
          >
            Daftar
          </a>
        {/if}
      </div>
    </div>
  </nav>
{/if}