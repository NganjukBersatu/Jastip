<script lang="ts">
  type Produk = {
    id: string;
    nama: string;
    harga: number;
    hargaTipe: 'tetap' | 'nego';
    gambarUrl: string;
    area: string | null;
    kategori?: string | null;
    popularitas?: number | null;
    stokTerbatas?: boolean;
  };

  let { produk }: { produk: Produk } = $props();
  let disimpan = $state(false);

  let badgeLabel = $derived(
    produk.stokTerbatas
      ? 'Stok terbatas'
      : (produk.kategori ?? (produk.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'))
  );

  let hargaFormatted = $derived(
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(produk.harga)
  );

  function toggleSimpan(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    disimpan = !disimpan;
  }
</script>

<a
  
  href="/publik/katalog"
  class="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_6px_16px_rgba(42,26,14,0.05)] border border-ink/10 transition hover:-translate-y-1"
>
  <div class="relative h-32 sm:h-36 bg-bg-alt overflow-hidden">
    <span
      class="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-pill z-10"
      class:bg-white={!produk.stokTerbatas}
      class:text-ink={!produk.stokTerbatas}
      class:bg-primary={produk.stokTerbatas}
      class:text-white={produk.stokTerbatas}
    >
      {badgeLabel}
    </span>

    <button
      type="button"
      onclick={toggleSimpan}
      aria-label={disimpan ? 'Hapus dari simpanan' : 'Simpan produk'}
      class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill={disimpan ? 'currentColor' : 'none'}
        stroke="currentColor"
        stroke-width="2"
        class="text-primary-dark"
      >
        <path
          d="M12 21s-6.7-4.35-9.3-8.1C.8 9.9 1.6 6.2 4.6 4.9c2.2-.95 4.6-.15 5.9 1.7l1.5 2 1.5-2c1.3-1.85 3.7-2.65 5.9-1.7 3 1.3 3.8 5 1.9 8-2.6 3.75-9.3 8.1-9.3 8.1z"
        />
      </svg>
    </button>

    <img
      src={produk.gambarUrl || '/img/placeholder-produk.svg'}
      alt={produk.nama}
      class="w-full h-full object-cover"
      loading="lazy"
      onerror={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/img/placeholder-produk.svg';
      }}
    />
  </div>

  <div class="flex flex-col flex-1 p-3">
    {#if produk.area}
      <div class="text-[10px] font-bold text-primary-dark uppercase tracking-wide">
        {produk.area}
      </div>
    {/if}

    <div class="font-bold text-sm mt-1 line-clamp-2 min-h-[2.4em] leading-snug">
      {produk.nama}
    </div>

    {#if typeof produk.popularitas === 'number' && produk.popularitas > 0}
      <div class="text-[10px] text-primary-dark mt-1 flex items-center gap-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2c1 3-1 4-1 6 0 1.5 1 2.5 2 2.5.8 0 1.5-.6 1.5-1.5 1.5 1.5 2.5 3.5 2.5 5.5C17 18.5 14.5 21 12 21s-5-2.5-5-6.5c0-2.5 1.5-4.5 3-6C10.5 7 10 4.5 12 2z"
          />
        </svg>
        {produk.popularitas} nitip minggu ini
      </div>
    {/if}

    <div class="mt-auto pt-2 flex items-center justify-between">
      <div class="font-display font-semibold text-sm">
        {hargaFormatted}
        {#if produk.hargaTipe === 'nego'}
          <div class="text-[10px] font-sans font-semibold text-ink-soft">mulai dari</div>
        {/if}
      </div>

      <div
        class="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold group-hover:bg-primary-dark transition-colors"
      >
        →
      </div>
    </div>
  </div>
</a>