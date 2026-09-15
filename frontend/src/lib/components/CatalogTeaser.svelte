<script lang="ts">
  import ProductCard from './ProductCard.svelte';

  type Produk = {
    id: string;
    nama: string;
    harga: number;
    hargaTipe: 'tetap' | 'nego';
    gambarUrl: string;
    area: string | null;
    kategori?: string | null;
    popularitas?: number | null;
    dibuatPada?: string | null;
    stokTerbatas?: boolean;
  };

  let { produkPilihan = [] }: { produkPilihan: Produk[] } = $props();

  type Urutan = 'rame' | 'terbaru' | 'termurah';
  let urutan = $state<Urutan>('rame');

  const tabOptions: { value: Urutan; label: string }[] = [
    { value: 'rame', label: 'Rame' },
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'termurah', label: 'Termurah' }
  ];

  let punyaDataUrutan = $derived(
    produkPilihan.some(
      (p) => typeof p.popularitas === 'number' || typeof p.dibuatPada === 'string'
    )
  );

  let produkTerurut = $derived(
    [...produkPilihan].sort((a, b) => {
      if (urutan === 'rame') return (b.popularitas ?? 0) - (a.popularitas ?? 0);
      if (urutan === 'termurah') return (a.harga ?? 0) - (b.harga ?? 0);
      return new Date(b.dibuatPada ?? 0).getTime() - new Date(a.dibuatPada ?? 0).getTime();
    })
  );

  const JUMLAH_TAMPIL = 7;
  let produkDitampilkan = $derived(produkTerurut.slice(0, JUMLAH_TAMPIL));
  let sisaProduk = $derived(Math.max(produkPilihan.length - JUMLAH_TAMPIL, 0));
</script>

<section class="bg-bg-alt py-16" id="katalog-preview">
  <div class="max-w-295 mx-auto px-8">
    <div class="flex justify-between items-end gap-6 flex-wrap mb-6">
      <h2 class="text-2xl md:text-3xl">
        Lagi rame dititipin minggu ini
      </h2>

      {#if punyaDataUrutan}
        <div class="flex gap-1.5" role="tablist" aria-label="Urutkan katalog">
          {#each tabOptions as opt}
            <button
              type="button"
              role="tab"
              aria-selected={urutan === opt.value}
              onclick={() => (urutan = opt.value)}
              class="text-[11px] px-2.5 py-1 rounded-pill border transition-colors"
              class:bg-ink={urutan === opt.value}
              class:text-bg={urutan === opt.value}
              class:border-ink={urutan === opt.value}
              class:border-ink-soft={urutan !== opt.value}
              class:text-ink-soft={urutan !== opt.value}
            >
              {opt.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    {#if produkPilihan.length === 0}
      <p class="text-ink-soft text-sm">Belum ada produk yang bisa ditampilkan.</p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {#each produkDitampilkan as produk (produk.id)}
          <ProductCard {produk} />
        {/each}

        <a
          href="/publik/katalog"
          class="flex flex-col items-center justify-center text-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-primary/40 p-4 hover:bg-white/50 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-primary-dark"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span class="font-bold text-xs">Lihat semua</span>
          {#if sisaProduk > 0}
            <span class="text-ink-soft text-[11px]">{sisaProduk} barang lainnya</span>
          {/if}
        </a>
      </div>
    {/if}
  </div>
</section>