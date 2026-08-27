<script>
  import ProductCard from './ProductCard.svelte';

  /** @typedef {'tetap' | 'nego'} TipeHarga */

  const produkPilihan = /** @type {{ slug: string, nama: string, lokasi: string, emoji: string, tipeHarga: TipeHarga, harga: number, gradient: string }[]} */ ([
    { slug: 'lumpia-basah-ny-lin', nama: 'Lumpia Basah Ny. Lin', lokasi: 'Surabaya', emoji: '🥟', tipeHarga: 'tetap', harga: 32000, gradient: 'from-[#FFD08A] to-primary' },
    { slug: 'skincare-lokal-batch-baru', nama: 'Skincare lokal batch baru', lokasi: 'Malang', emoji: '🧴', tipeHarga: 'nego', harga: 85000, gradient: 'from-[#FFE9C7] to-accent' },
    { slug: 'tiket-festival-kuliner', nama: 'Tiket festival kuliner', lokasi: 'Kediri', emoji: '🎟️', tipeHarga: 'tetap', harga: 25000, gradient: 'from-[#FFB199] to-primary-dark' }
  ]);
</script>

<section class="bg-bg-alt py-24">
  <div class="max-w-[1180px] mx-auto px-8">
    <div class="flex justify-between items-end gap-6 flex-wrap mb-14">
      <h2 class="text-[30px] md:text-[42px] max-w-[560px]">
        Lagi rame dititipin minggu ini
      </h2>
      <a href="/publik/katalog" class="font-bold text-sm text-primary-dark hover:underline">
        Lihat semua katalog →
      </a>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each produkPilihan as produk (produk.slug)}
        <ProductCard {produk} />
      {/each}
    </div>
  </div>
</section>