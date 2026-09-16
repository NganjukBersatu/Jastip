<script lang="ts">
  /**
   * Testimoni.svelte
   * Menampilkan testimoni campuran: jastiper dan pelanggan.
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
      },
    ]
  }: Props = $props();

  function starsFor(rating: number) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return { full, half, empty: 5 - full - (half ? 1 : 0) };
  }

  // Warna badge beda tiap role, biar kebaca cepat tanpa baca teksnya
  const roleStyle = {
    jastiper: {
      label: 'Jastiper',
      badgeBg: 'bg-accent/40',
      badgeText: 'text-primary-deep',
      avatarBg: 'bg-accent',
      avatarText: 'text-primary-deep'
    },
    pelanggan: {
      label: 'Pelanggan',
      badgeBg: 'bg-primary/15',
      badgeText: 'text-primary-dark',
      avatarBg: 'bg-primary',
      avatarText: 'text-white'
    }
  } as const;
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {#each testimonials as t}
        {@const style = roleStyle[t.role]}
        <div class="relative bg-white border border-[#F0E4CC] rounded-card p-5 sm:p-6">
          <span
            class="absolute top-5 right-5 sm:top-6 sm:right-6 {style.badgeBg} {style.badgeText} text-[10px] font-bold px-2.5 py-1 rounded-pill"
          >
            {style.label}
          </span>

          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-9 h-9 rounded-full {style.avatarBg} {style.avatarText} flex items-center justify-center text-sm font-bold shrink-0"
            >
              {t.initial}
            </div>
            <div>
              <div class="text-sm font-bold text-ink">{t.name}</div>
              <div class="text-xs text-ink-soft">{t.area}</div>
            </div>
          </div>

          <p class="text-[13.5px] text-ink-soft leading-relaxed mb-3">
            {t.text}
          </p>

          <div class="text-accent text-xs flex gap-0.5" aria-label={`Rating ${t.rating} dari 5`}>
            {#each Array(starsFor(t.rating).full) as _}
              <span>★</span>
            {/each}
            {#if starsFor(t.rating).half}
              <span>⯨</span>
            {/if}
            {#each Array(starsFor(t.rating).empty) as _}
              <span class="text-[#EADFC8]">★</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>