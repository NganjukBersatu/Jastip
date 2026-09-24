<script>
  const fitur = [
    {
      nomor: '01',
      label: 'NGOBROL LANGSUNG',
      judul: 'Nego harga sambil ngobrol biasa.',
      deskripsi:
        'Dari nanya stok sampai deal harga, semuanya kejadian di satu chat — kayak nge-chat temen, bukan isi form.',
      card: 'bg-primary-deep text-bg',
      eyebrow: 'opacity-75',
      pill: 'border-current',
      title: 'text-[20px] sm:text-[26px]',
      desc: 'opacity-80 max-w-[440px]'
    },
    {
      nomor: '02',
      label: 'TRANSPARAN',
      judul: 'Nggak ada kejutan pas checkout.',
      deskripsi:
        'Harga barang plus ongkir kelihatan dari awal, sama persis di akhir.',
      card: 'bg-white border border-[#F0E2CC] text-ink',
      eyebrow: 'text-ink-soft',
      pill: 'border-ink-soft',
      title: 'text-[20px] sm:text-[23px]',
      desc: 'text-ink-soft'
    },
    {
      nomor: '03',
      label: 'TERPANTAU',
      judul: 'Titipanmu, kamu yang pegang kendali.',
      deskripsi: 'Tinggal buka, langsung tahu titipanmu udah sejauh mana.',
      card: 'bg-accent text-ink',
      eyebrow: 'text-primary-deep',
      pill: 'border-primary-deep',
      title: 'text-[20px] sm:text-[23px] text-ink',
      desc: 'text-primary-deep'
    },
    {
      nomor: '04',
      label: 'TERVERIFIKASI',
      judul: 'Titip ke orang yang jelas identitasnya.',
      deskripsi:
        'Semua jastiper di sini udah lewat pengecekan profil dan area layanan.',
      card: 'bg-ink text-bg',
      eyebrow: 'opacity-60',
      pill: 'border-current',
      title: 'text-[20px] sm:text-[26px]',
      desc: 'opacity-75 max-w-[440px]'
    }
  ];

  const rows = [
    { cols: 'sm:grid-cols-[1.4fr_1fr]', items: fitur.slice(0, 2) },
    { cols: 'sm:grid-cols-[1fr_1.4fr]', items: fitur.slice(2, 4) }
  ];
</script>

<section class="py-10 sm:py-12 md:py-16 px-5 sm:px-8">
  <div class="max-w-295 mx-auto">

    <!-- EYEBROW -->
    <div class="flex items-center gap-2 text-primary-dark text-xs font-bold tracking-widest mb-3 sm:mb-4">
      <span class="w-2 h-2 rounded-full bg-primary"></span>
      BUKAN JASTIP BIASA
    </div>

    <!-- HEADING -->
    <div class="flex justify-between items-end gap-4 sm:gap-10 flex-wrap mb-8 sm:mb-12">
      <h2 class="font-display font-semibold text-[clamp(28px,4.2vw,52px)] leading-[1.05] max-w-140">
        Nitip itu, harusnya <span class="text-primary">secepat chat aja.</span>
      </h2>
      <div class="max-w-85 text-ink-soft leading-relaxed text-[14px] sm:text-[15px]">
        Capek scroll chat lama buat nego ulang harga? Di Nitip, semua ngumpul
        di satu tempat — nggak ada yang kelewat.
        <div class="mt-3 font-bold text-ink text-sm">
          ✦ Satu aplikasi, semua beres.
        </div>
      </div>
    </div>

    <!-- FEATURE ROWS -->
    {#each rows as row, i}
      <div class="grid grid-cols-1 {row.cols} gap-3 sm:gap-4 {i === 0 ? 'mb-3 sm:mb-4' : ''}">
        {#each row.items as f}
          <div class="{f.card} rounded-[20px] sm:rounded-card p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6 sm:min-h-57.5">
            <div class="flex justify-between items-center text-xs {f.eyebrow}">
              <span>{f.nomor}</span>
              <span class="border {f.pill} rounded-pill px-3 py-1.5 tracking-[0.06em] text-[10px] sm:text-[11px]">
                {f.label}
              </span>
            </div>
            <div>
              <div class="font-display font-semibold {f.title} mb-2">
                {f.judul}
              </div>
              <div class="text-[13.5px] sm:text-sm leading-relaxed {f.desc}">
                {f.deskripsi}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/each}

    <!-- BOTTOM NOTE -->
    <div class="flex items-center gap-4 mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#F0E2CC]">
      <span class="w-12 h-px bg-primary shrink-0"></span>
      <div class="text-ink-soft text-sm leading-snug">
        Titip barang itu harusnya sesantai
        <strong class="text-ink">minta tolong temen deket rumah.</strong>
      </div>
      <span class="ml-auto text-primary text-xl">✦</span>
    </div>

  </div>
</section>