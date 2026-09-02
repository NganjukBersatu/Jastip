<script>

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
</script>


<main class="bg-bg">
  <!-- Hero -->
<section class="max-w-[1180px] mx-auto px-8 pt-8 pb-8 text-center">
   <h1 class="font-display font-black text-4xl md:text-5xl text-ink leading-tight mb-4">
  Satu pesan, empat langkah,<br />sampai.
</h1>
    <p class="text-ink/65 max-w-md mx-auto leading-relaxed">
      Nggak perlu keluar rumah atau macet-macetan ke pasar. Cukup titip lewat Nitip,
      jastiper di area kamu yang urus sisanya.
    </p>
  </section>

<!-- Rute + Deskripsi langkah (satu container, lebar sama) -->
<section class="max-w-[900px] mx-auto px-8 pb-4">
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

  <div class="grid grid-cols-4 gap-4 text-center mt-2">
    {#each langkah as l}
      <div>
        <h3 class="font-bold text-sm text-ink mb-2">{l.judul}</h3>
        <p class="text-xs text-ink/65 leading-relaxed">{l.teks}</p>
      </div>
    {/each}
  </div>
</section>


  <p class="text-center text-sm text-ink/55 mt-8 pb-10">
  Gitu doang. Nggak pakai antri, nggak pakai ribet.
</p>

  <!-- CTA -->
  <section class="border-t border-ink/10">
    <div class="max-w-[1180px] mx-auto px-8 py-14 text-center">
      <a
        href="/publik/katalog"
        class="inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm px-8 py-3 transition hover:-translate-y-0.5"
      >
        Buka katalog
      </a>
    </div>
  </section>
</main>
