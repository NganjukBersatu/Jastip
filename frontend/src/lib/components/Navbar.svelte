<script>
  import { page } from '$app/stores';

  // Halaman aktif, dipakai untuk highlight menu — kirim dari parent, mis. active="katalog"
  let { active = '' } = $props();

  let user = $derived($page.data.user);
  let inisial = $derived(user?.nama?.charAt(0)?.toUpperCase() ?? '?');
</script>

<nav class="sticky top-0 z-50 bg-bg border-b border-ink/10">
  <div class="max-w-[1180px] mx-auto px-8 h-[76px] flex items-center justify-between">
    <a href="/" class="font-display font-black text-2xl text-primary-dark">
      Nitip<span class="text-ink">.</span>
    </a>

    <div class="hidden md:flex gap-9 font-semibold text-sm">
        <a href="/" class="opacity-75 hover:opacity-100 transition {active === 'home' ? 'opacity-100 text-primary-dark' : ''}">
    Home
  </a>
<a href="/publik/katalog" class="opacity-75 hover:opacity-100 transition {active === 'katalog' ? 'opacity-100 text-primary-dark' : ''}">
    Katalog
  </a>
  <a href="/publik/cara-kerja" class="opacity-75 hover:opacity-100 transition {active === 'cara-kerja' ? 'opacity-100 text-primary-dark' : ''}">
  Cara kerja
</a>
    </div>

    <div class="flex items-center gap-3">
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