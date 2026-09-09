<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }

  /** @param {string | Date} tanggal */
  function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
</script>

<svelte:head>
  <title>Pengajuan harga — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1140px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- HEADER -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">
      Pengajuan harga
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
      Balas tawaran harga dari pelanggan yang lagi nego.
    </p>
  </div>

  <div class="mb-3.5 flex items-center gap-2">
    <h2 class="font-bold text-[15px] text-ink">
      Pengajuan masuk
    </h2>

    {#if data.daftarPengajuan.length > 0}
      <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
        {data.daftarPengajuan.length}
      </span>
    {/if}
  </div>

  {#if data.daftarPengajuan.length === 0}
    <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
        <svg class="w-6 h-6 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
        </svg>
      </div>

      <div class="font-bold text-[15px] text-ink">Belum ada pengajuan masuk</div>
      <div class="text-[13.5px] text-ink-soft mt-1.5 max-w-[280px] mx-auto leading-relaxed">
        Tawaran harga dari pelanggan bakal muncul di sini.
      </div>
    </div>
  {:else}
    <div class="flex flex-col gap-3 sm:gap-4">
      {#each data.daftarPengajuan as p (p.id)}
        <div class="bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition hover:shadow-md hover:border-ink/15">
          <div class="flex justify-between items-start gap-4">
            <div class="min-w-0">
              <div class="font-bold text-sm text-ink truncate">{p.produkNama}</div>
              <div class="text-[12.5px] text-ink-soft mt-1 leading-relaxed">
                dari <span class="font-semibold text-ink">{p.pelangganNama}</span> · {formatTanggal(p.createdAt)}
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="font-display font-semibold text-lg text-primary-dark">{formatRupiah(p.hargaDiajukan)}</div>
              <div class="text-[12px] text-ink-soft">× {p.jumlah} pcs</div>
            </div>
          </div>

          {#if p.catatan}
            <div class="mt-3 bg-bg rounded-xl px-4 py-2.5 text-[13.5px] text-ink-soft italic">
              "{p.catatan}"
            </div>
          {/if}

          <div class="flex gap-3 mt-4">
            <a href="/jastiper/pengajuan-harga/{p.id}" class="flex-1">
              <button
                type="button"
                class="w-full min-h-[44px] inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[13.5px] py-2.5 hover:-translate-y-0.5 hover:shadow-md transition"
              >
                Buka chat
              </button>
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>