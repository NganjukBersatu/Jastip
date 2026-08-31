<script>
  /**
   * @typedef {Object} Produk
   * @property {string} slug
   * @property {string} nama
   * @property {string} lokasi
   * @property {string} emoji
   * @property {'tetap' | 'nego'} tipeHarga
   * @property {number} harga
   * @property {string} gradient - kelas tailwind gradient background
   */

  /** @type {{ produk: Produk }} */
  let { produk } = $props();

  let badgeLabel = $derived(produk.tipeHarga === 'nego' ? 'Bisa nego' : 'Harga tetap');
  let hargaFormatted = $derived(
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(produk.harga)
  );
</script>

<a
  href="/produk/{produk.slug}"
  class="block bg-white rounded-card overflow-hidden shadow-[0_10px_30px_rgba(42,26,14,0.06)] border border-ink/10 transition hover:-translate-y-1.5"
>
  <div class="relative h-[140px] sm:h-[170px] flex items-center justify-center bg-gradient-to-br {produk.gradient}">
    <span class="absolute top-3.5 left-3.5 bg-white/90 text-ink text-[11px] font-extrabold px-3 py-1.5 rounded-pill">
      {badgeLabel}
    </span>
<span class="text-4xl sm:text-5xl">{produk.emoji}</span>
  </div>

  <div class="p-4.5 pb-5">
    <div class="text-[11.5px] font-bold text-primary-dark uppercase tracking-wide">
      {produk.lokasi}
    </div>
    <div class="font-bold text-base mt-1.5">{produk.nama}</div>

    <div class="flex justify-between items-center mt-3.5">
      <div class="font-display font-semibold text-lg">
        {hargaFormatted}
        {#if produk.tipeHarga === 'nego'}
          <span class="text-[11.5px] font-sans font-semibold text-ink-soft">mulai dari</span>
        {/if}
      </div>
      <div class="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center text-sm font-bold">
        →
      </div>
    </div>
  </div>
</a>