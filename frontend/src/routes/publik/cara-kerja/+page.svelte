<script lang="ts">
const langkah = [
  {
    no: '01',
    judul: 'Titip pesanan',
    teks: 'Pilih barang di katalog, kasih alamatmu.'
  },
  {
    no: '02',
    judul: 'Dibelanjain',
    teks: 'Jastiper langsung belanjain pesananmu.'
  },
  {
    no: '03',
    judul: 'Otw kirim',
    teks: 'Barang meluncur ke alamatmu.'
  },
  {
    no: '04',
    judul: 'Nyampe',
    teks: 'Cek barang, beres.'
  }
];

const benefit = [
  {
    judul: 'Harga bisa nego',
    teks: 'Chat langsung sama jastiper buat samain harga.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.162-3.02-.46L3 21l1.51-3.775C3.555 15.947 3 14.02 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z'
  },
  {
    judul: 'Jastiper area kamu',
    teks: 'Lebih dekat, lebih cepat sampai.',
    icon: 'M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0ZM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
  },
  {
    judul: 'Pantau real-time',
    teks: 'Tau posisi pesanan kamu tiap saat.',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
  }
];

const sebelum = [
  'WA bolak-balik ke banyak orang',
  'Harga nggak jelas di awal',
  'Nggak tau posisi barang'
];

const sesudah = [
  'Semua obrolan di satu chat',
  'Harga transparan, bisa nego',
  'Tracking pesanan jelas'
];
</script>

<main class="bg-bg">
  <!-- Hero -->
  <section class="max-w-350 mx-auto px-8 pt-8 pb-8 text-center">
    <h1 class="font-display font-black text-4xl md:text-5xl text-ink leading-tight mb-4">
      Satu pesan, empat langkah,<br />sampai.
    </h1>
    <p class="text-ink/65 max-w-md mx-auto leading-relaxed">
      Nggak perlu keluar rumah atau macet-macetan ke pasar. Cukup titip lewat Nitip,
      jastiper di area kamu yang urus sisanya.
    </p>
  </section>

  <!-- Rute + Deskripsi langkah (satu container, lebar sama) -->
  <section class="max-w-350 mx-auto px-8 pb-4">
    <svg viewBox="0 0 640 160" class="w-full block">
      <path
        d="M80,100 C140,20 180,20 240,40 C300,70 340,150 400,120 C460,90 500,10 560,60"
        fill="none" stroke="currentColor" class="text-ink/10" stroke-width="10" stroke-linecap="round"
      />
      <path
        d="M80,100 C140,20 180,20 240,40 C300,70 340,150 400,120 C460,90 500,10 560,60"
        fill="none" stroke="currentColor" class="text-primary" stroke-width="2.5"
        stroke-dasharray="1 10" stroke-linecap="round"
      />

      {#each [{ x: 80, y: 84, tip: 100, no: '01', klas: 'text-primary' }, { x: 240, y: 24, tip: 40, no: '02', klas: 'text-primary-dark' }, { x: 400, y: 104, tip: 120, no: '03', klas: 'text-primary' }, { x: 560, y: 44, tip: 60, no: '04', klas: 'text-primary-dark' }] as p}
        <g class={p.klas} fill="currentColor">
          <circle cx={p.x} cy={p.y} r="16" />
          <path d="M{p.x - 9},{p.tip - 16} L{p.x},{p.tip} L{p.x + 9},{p.tip - 16} Z" />
        </g>
        <text x={p.x} y={p.y + 5} text-anchor="middle" class="fill-bg font-bold" style="font-size:13px">
          {p.no}
        </text>
      {/each}
    </svg>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center mt-2">
      {#each langkah as l}
        <div>
          <h3 class="font-bold text-sm text-ink mb-2">{l.judul}</h3>
          <p class="text-xs text-ink/65 leading-relaxed">{l.teks}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Kenapa pilih Nitip -->
  <section class="max-w-350 mx-auto px-8 pt-8 pb-16">
    <div class="text-center mb-8">
      <p class="text-xs font-bold text-primary-dark tracking-wide uppercase mb-2">Kenapa pilih Nitip</p>
      <h2 class="font-display font-semibold text-2xl md:text-3xl text-ink">Nggak cuma titip, tapi tenang</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each benefit as b}
        <div class="flex h-full flex-col items-center bg-white rounded-card p-6 text-center shadow-[0_1px_2px_rgba(44,36,22,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,36,22,0.08)]">
          <div class="w-11 h-11 rounded-full bg-bg-alt flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5 text-primary-dark">
              <path stroke-linecap="round" stroke-linejoin="round" d={b.icon} />
            </svg>
          </div>
          <h3 class="font-bold text-sm text-ink mb-1">{b.judul}</h3>
          <p class="text-xs text-ink/65 leading-relaxed">{b.teks}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Sebelum vs sesudah -->
  <section class="max-w-350 mx-auto px-8 pb-16">
    <h2 class="font-display font-semibold text-2xl md:text-3xl text-ink text-center mb-8">
      Sebelum vs sesudah pakai Nitip
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex h-full flex-col bg-white rounded-card p-6">
        <p class="text-xs font-bold text-ink-soft uppercase tracking-wide mb-4">Titip manual</p>
        <ul class="space-y-3 text-sm text-ink/70">
          {#each sebelum as item}
            <li class="flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mt-0.5 shrink-0 text-ink/30">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="flex h-full flex-col bg-primary rounded-card p-6">
        <p class="text-xs font-bold text-accent uppercase tracking-wide mb-4">Pakai Nitip</p>
        <ul class="space-y-3 text-sm text-white/90">
          {#each sesudah as item}
            <li class="flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mt-0.5 shrink-0 text-accent">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <!-- Penutup: Card ajakan buka katalog -->
  <section class="max-w-350 mx-auto px-8 pb-16">
    <div class="bg-ink rounded-card px-8 py-12 md:py-16 text-center relative overflow-hidden">
      <svg class="absolute -top-10 -right-10 w-40 h-40 text-white/5" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="50" />
      </svg>
      <svg class="absolute -bottom-14 -left-8 w-36 h-36 text-white/5" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="50" />
      </svg>

      <p class="text-xs font-bold text-accent tracking-wide uppercase mb-3 relative">Siap coba?</p>
      <h2 class="font-display font-semibold text-2xl md:text-3xl text-bg mb-3 relative">
        Titip belanjaanmu sekarang juga
      </h2>
      <p class="text-bg/65 max-w-md mx-auto leading-relaxed mb-8 relative">
        Pilih barang di katalog, kasih alamat, tinggal tunggu jastiper langganan kamu yang urus sisanya.
      </p>

      <a href="/publik/katalog"
        class="inline-flex items-center justify-center gap-2 rounded-pill bg-bg text-ink font-bold text-sm px-8 py-3 transition hover:-translate-y-0.5 relative"
      >
        Buka katalog
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  </section>

  <footer class="py-16 border-t border-ink/10">
    <div class="max-w-295 mx-auto px-8 flex justify-between flex-wrap gap-3 text-sm text-ink-soft">
      <span>© 2026 Nitip. Semua hak dilindungi.</span>
      <span>Dibuat untuk jastiper Jawa Timur</span>
    </div>
  </footer>
</main>