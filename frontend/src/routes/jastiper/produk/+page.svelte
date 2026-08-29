<script>
  let { data } = $props();

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }
</script>

<svelte:head>
  <title>Produk saya — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[1000px]">
  <div class="flex justify-between items-start gap-4">
    <div>
      <h1 class="text-[28px]">Produk saya</h1>
      <p class="text-ink-soft mt-1 text-[15px]">Kelola barang yang kamu tawarkan di katalog.</p>
    </div>
    <a
      href="/jastiper/produk/baru"
      class="shrink-0 inline-flex items-center gap-2 rounded-pill bg-ink text-bg font-bold text-sm px-5 py-3 hover:-translate-y-0.5 transition"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Tambah produk
    </a>
  </div>

  {#if data.daftarProduk.length === 0}
    <div class="mt-8 bg-white rounded-2xl border border-dashed border-ink/15 p-12 text-center">
      <svg class="w-9 h-9 mx-auto mb-3 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      <div class="font-bold text-sm">Belum ada produk</div>
      <div class="text-[13.5px] text-ink-soft mt-1">Mulai tambahkan barang pertama yang mau kamu titipkan.</div>
    </div>
  {:else}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {#each data.daftarProduk as p (p.id)}
        <div class="bg-white rounded-[22px] border border-ink/10 overflow-hidden">
          <div class="h-32 bg-gradient-to-br from-primary/70 to-primary-dark flex items-center justify-center">
            <span class="text-white/80 text-xs font-bold uppercase tracking-wide">{p.kategori ?? 'Produk'}</span>
          </div>
          <div class="p-4">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-pill {p.aktif ? 'bg-bg-alt text-primary-dark' : 'bg-ink/5 text-ink-soft'}">
                {p.aktif ? 'Aktif' : 'Nonaktif'}
              </span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-pill bg-bg text-ink-soft">
                {p.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
              </span>
            </div>
            <div class="font-bold text-sm mt-2.5">{p.nama}</div>
            <div class="font-display font-semibold text-lg mt-1">
              {formatRupiah(p.harga)}
              {#if p.hargaTipe === 'nego'}<span class="text-[11px] font-sans font-semibold text-ink-soft">mulai dari</span>{/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>