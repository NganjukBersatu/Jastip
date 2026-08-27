<script>
  // Halaman aktif, dipakai untuk highlight menu — kirim dari parent, mis. active="katalog"
  let { active = '' } = $props();
</script>

<nav class="sticky top-0 z-50 bg-bg border-b border-ink/10">
  <div class="max-w-[1180px] mx-auto px-8 h-[76px] flex items-center justify-between">
    <a href="/" class="font-display font-black text-2xl text-primary-dark">
      Nitip<span class="text-ink">.</span>
    </a>

    <div class="hidden md:flex gap-9 font-semibold text-sm">
      <a href="/publik/katalog" class="opacity-75 hover:opacity-100 transition {active === 'katalog' ? 'opacity-100 text-primary-dark' : ''}">
        Katalog
      </a>
      <a href="/jastiper" class="opacity-75 hover:opacity-100 transition {active === 'jastiper' ? 'opacity-100 text-primary-dark' : ''}">
        Jadi jastiper
      </a>
      <a href="/cara-kerja" class="opacity-75 hover:opacity-100 transition {active === 'cara-kerja' ? 'opacity-100 text-primary-dark' : ''}">
        Cara kerja
      </a>
    </div>

    <div class="flex items-center gap-3">
      <a href="/masuk" class="font-bold text-sm opacity-80 hover:opacity-100 transition">Masuk</a>
      <a
        href="/daftar"
        class="inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm px-6 py-3 transition hover:-translate-y-0.5"
      >
        Daftar
      </a>
    </div>
  </div>
</nav>