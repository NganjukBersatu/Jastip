<script lang="ts">
  import ProductCard from './ProductCard.svelte';

  type Produk = {
    id: string;
    nama: string;
    harga: number;
    hargaTipe: 'tetap' | 'nego';
    gambarUrl: string;
    area: string | null;
  };

  let { produkPilihan = [] }: { produkPilihan: Produk[] } = $props();
</script>

<section class="bg-bg-alt py-24" id="katalog-preview">
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
      {#each produkPilihan as produk (produk.id)}
        <ProductCard {produk} />
      {/each}
    </div>
  </div>
</section>