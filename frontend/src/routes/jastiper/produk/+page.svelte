<script>
  let { data } = $props();

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }
</script>

<svelte:head>
  <title>Produk saya — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <!-- HEADER -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="min-w-0">
      <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
        Produk saya
      </h1>

      <p class="text-ink-soft mt-1.5 text-sm sm:text-[15px] leading-relaxed">
        Kelola barang yang kamu tawarkan di katalog.
      </p>
    </div>

    <a
      href="/jastiper/produk/baru"
      class="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-ink text-bg font-bold text-sm px-5 py-3 hover:-translate-y-0.5 hover:shadow-md transition"
    >
      <svg
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>

      Tambah produk
    </a>
  </div>

  <!-- EMPTY -->
  {#if data.daftarProduk.length === 0}
    <div class="mt-7 sm:mt-8 bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-10 sm:p-12 text-center">
      <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
        <svg
          class="w-6 h-6 text-ink-soft"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      </div>

      <div class="font-bold text-sm">
        Belum ada produk
      </div>

      <div class="text-[13px] text-ink-soft mt-1 leading-relaxed max-w-[400px] mx-auto">
        Mulai tambahkan barang pertama yang mau kamu titipkan.
      </div>
    </div>

  {:else}

    <!-- PRODUCT GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mt-7 sm:mt-8">
      {#each data.daftarProduk as p (p.id)}
        <article
          class="bg-white rounded-2xl sm:rounded-[22px] border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:-translate-y-0.5 hover:shadow-md transition"
        >
          <!-- IMAGE -->
          <div class="relative h-44 sm:h-40 bg-ink/5 overflow-hidden">
            <img
              src={p.gambarUrl}
              alt={p.nama}
              class="w-full h-full object-cover transition duration-300 hover:scale-[1.02]"
            />

            {#if p.kategori}
              <span
                class="absolute bottom-2.5 left-2.5 text-white text-[10px] font-bold uppercase tracking-wide bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-pill"
              >
                {p.kategori}
              </span>
            {/if}

            <a
              href="/jastiper/produk/{p.id}/edit"
              aria-label="Edit produk"
              class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition"
            >
              <svg
                class="w-4 h-4 text-ink"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
              </svg>
            </a>
          </div>

          <!-- CONTENT -->
          <div class="p-4 sm:p-4.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-[10.5px] font-bold px-2.5 py-1 rounded-pill
                {p.aktif
                  ? 'bg-bg-alt text-primary-dark'
                  : 'bg-ink/5 text-ink-soft'}"
              >
                {p.aktif ? 'Aktif' : 'Nonaktif'}
              </span>

              <span class="text-[10.5px] font-bold px-2.5 py-1 rounded-pill bg-bg text-ink-soft">
                {p.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
              </span>
            </div>

            <div class="mt-3">
              <div class="flex items-start justify-between gap-3">
                <div class="font-bold text-sm text-ink line-clamp-2">
                  {p.nama}
                </div>

                <a
                  href="/jastiper/produk/{p.id}/edit"
                  class="shrink-0 text-[12px] font-bold text-primary-dark hover:underline"
                >
                  Edit
                </a>
              </div>

              <div class="font-display font-semibold text-lg mt-1.5">
                {formatRupiah(p.harga)}

                {#if p.hargaTipe === 'nego'}
                  <span class="text-[11px] font-sans font-semibold text-ink-soft ml-1">
                    mulai dari
                  </span>
                {/if}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>