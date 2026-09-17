<script lang="ts">
  /**
   * Testimoni.svelte
   * Menampilkan testimoni campuran: jastiper dan pelanggan.
   * Layout: grid 3 kolom rapi (ukuran seragam per baris), kartu berwarna selang-seling.
   * Taruh file ini di: src/lib/components/Testimoni.svelte
   *
   * Cara pakai di Home (+page.svelte):
   * import Testimoni from '$lib/components/Testimoni.svelte';
   * lalu pakai <Testimoni />
   */

  type Testimonial = {
    name: string;
    area: string;
    initial: string;
    role: 'jastiper' | 'pelanggan';
    text: string;
    rating: number;
  };

  interface Props {
    title?: string;
    tag?: string;
    testimonials?: Testimonial[];
  }

  let {
    title = 'Kata mereka yang udah pakai Nitip',
    tag = 'DIPERCAYA DUA SISI',
    testimonials = [
      {
        name: 'Rina',
        area: 'Prambon',
        initial: 'R',
        role: 'jastiper',
        text: 'Nego harga langsung di chat, nggak ribet kayak isi form. Pembeli juga bisa pantau posisi pesanan.',
        rating: 5
      },
      {
        name: 'Ayu',
        area: 'Nganjuk',
        initial: 'A',
        role: 'pelanggan',
        text: 'Pesen jajanan dari kecamatan sebelah, sampai rapi dan harga sesuai yang dinego di chat.',
        rating: 5
      },
      {
        name: 'Dedi',
        area: 'Kertosono',
        initial: 'D',
        role: 'jastiper',
        text: 'Dashboard-nya rapi, pesanan masuk nggak ada yang kelewat lagi kayak dulu pas masih pakai chat WA biasa.',
        rating: 5
      },
      {
        name: 'Wahyu',
        area: 'Tanjunganom',
        initial: 'W',
        role: 'pelanggan',
        text: 'Suka bisa nego dulu sebelum deal, jadi nggak ada kejutan harga pas checkout.',
        rating: 4.5
      },
      {
        name: 'Putri',
        area: 'Kertosono',
        initial: 'P',
        role: 'pelanggan',
        text: 'Awalnya ragu titip barang ke orang asing, tapi profilnya jelas dan udah terverifikasi jadi tenang.',
        rating: 5
      },
      {
        name: 'Agus',
        area: 'Nganjuk',
        initial: 'A',
        role: 'jastiper',
        text: 'Area layanan bisa diatur sendiri, jadi nggak kejauhan pas nganter pesanan.',
        rating: 4.5
      },
      {
        name: 'Sinta',
        area: 'Prambon',
        initial: 'S',
        role: 'pelanggan',
        text: 'Nyari oleh-oleh khas daerah sini gampang banget, tinggal chat dan tunggu.',
        rating: 5
      },
      {
        name: 'Budi',
        area: 'Tanjunganom',
        initial: 'B',
        role: 'jastiper',
        text: 'Jadi jastiper sambil belanja ke pasar tiap pagi, lumayan buat tambahan penghasilan.',
        rating: 4.5
      },
      {
        name: 'Nadia',
        area: 'Kertosono',
        initial: 'N',
        role: 'pelanggan',
        text: 'Harga barang plus ongkir keliatan dari awal, nggak ada kejutan pas total belanjaan.',
        rating: 5
      }
    ]
  }: Props = $props();

  function starsFor(rating: number) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return { full, half, empty: 5 - full - (half ? 1 : 0) };
  }

  // Skema warna kartu, diputar berdasarkan urutan (bukan berdasarkan role)
  // supaya polanya konsisten dan tidak bergantung role mana yang lebih banyak.
  type CardScheme = {
    cardBg: string;
    border: string;
    textMain: string;
    textSoft: string;
    starFill: string;
    starEmpty: string;
    badgeBg: string;
    badgeText: string;
    avatarBg: string;
    avatarText: string;
  };

  const schemes: CardScheme[] = [
    {
      // Putih polos
      cardBg: 'bg-white',
      border: 'border border-[#F0E4CC]',
      textMain: 'text-ink',
      textSoft: 'text-ink-soft',
      starFill: 'text-accent',
      starEmpty: 'text-[#EADFC8]',
      badgeBg: 'bg-primary/15',
      badgeText: 'text-primary-dark',
      avatarBg: 'bg-primary',
      avatarText: 'text-white'
    },
    {
      // Primary solid
      cardBg: 'bg-primary',
      border: 'border border-primary',
      textMain: 'text-white',
      textSoft: 'text-[#FFE9C7]',
      starFill: 'text-accent',
      starEmpty: 'text-[#FF8F52]',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      avatarBg: 'bg-white',
      avatarText: 'text-primary-dark'
    },
    {
      // Primary-deep solid
      cardBg: 'bg-primary-deep',
      border: 'border border-primary-deep',
      textMain: 'text-white',
      textSoft: 'text-[#FFE9C7]',
      starFill: 'text-accent',
      starEmpty: 'text-[#B5673A]',
      badgeBg: 'bg-white/15',
      badgeText: 'text-white',
      avatarBg: 'bg-accent',
      avatarText: 'text-primary-deep'
    }
  ];

  const roleLabel = {
    jastiper: 'Jastiper',
    pelanggan: 'Pelanggan'
  } as const;

  // Rotasi diagonal, BUKAN i % 3 biasa.
  // Kalau cuma i % 3, di grid 3 kolom tiap kolom bakal SELALU dapet warna
  // yang sama di setiap baris (kolom 1 selalu putih, kolom 2 selalu oranye, dst)
  // -- itu yang bikin polanya kebaca terlalu rapi/mekanis.
  // Dengan menambahkan offset dari nomor baris (Math.floor(i / 3)), warnanya
  // jadi geser diagonal tiap baris, jadi tetap merata tapi tidak menempel
  // di kolom yang sama terus-menerus.
  function schemeFor(i: number) {
    const row = Math.floor(i / 3);
    return schemes[(i + row) % schemes.length];
  }
</script>

<section class="py-14 sm:py-24">
  <div class="max-w-295 mx-auto px-5 sm:px-8">
    <div class="mb-8 sm:mb-10">
      <span class="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-pill mb-4">
        {tag}
      </span>
      <h2 class="text-[26px] sm:text-[28px] md:text-[40px] text-ink">
        {title}
      </h2>
    </div>

    <!--
      Grid biasa 3 kolom (bukan masonry). Semua kartu di satu baris
      punya tinggi sama (default perilaku grid), jadi ukurannya rapi dan
      seragam kayak referensi ukuran kamu -- tapi tetap pakai warna
      selang-seling putih / primary / primary-deep dan urutan
      rating -> teks -> profil dari versi berwarna.
    -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
      {#each testimonials as t, i}
        {@const scheme = schemeFor(i)}
        <div
          class="relative {scheme.cardBg} {scheme.border} rounded-card p-5 sm:p-6 flex flex-col"
        >
          <span
            class="absolute top-5 right-5 sm:top-6 sm:right-6 {scheme.badgeBg} {scheme.badgeText} text-[10px] font-bold px-2.5 py-1 rounded-pill"
          >
            {roleLabel[t.role]}
          </span>

          <div class="flex items-center gap-3 mb-3 pr-16 sm:pr-20">
            <div
              class="w-9 h-9 rounded-full {scheme.avatarBg} {scheme.avatarText} flex items-center justify-center text-sm font-bold shrink-0"
            >
              {t.initial}
            </div>
            <div>
              <div class="text-sm font-bold {scheme.textMain}">{t.name}</div>
              <div class="text-xs {scheme.textSoft}">{t.area}</div>
            </div>
          </div>

          <p class="text-[13.5px] sm:text-sm {scheme.textMain} leading-relaxed mb-4 flex-1">
            {t.text}
          </p>

          <div class="text-xs flex gap-0.5" aria-label={`Rating ${t.rating} dari 5`}>
            {#each Array(starsFor(t.rating).full) as _}
              <span class={scheme.starFill}>★</span>
            {/each}
            {#if starsFor(t.rating).half}
              <span class={scheme.starFill}>⯨</span>
            {/if}
            {#each Array(starsFor(t.rating).empty) as _}
              <span class={scheme.starEmpty}>★</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>