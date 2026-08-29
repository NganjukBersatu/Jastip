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

<div class="p-8 max-w-[720px]">
  <h1 class="text-[28px]">Pengajuan harga</h1>
  <p class="text-ink-soft mt-1 text-[15px]">Balas tawaran harga dari pelanggan yang lagi nego.</p>

  {#if data.daftarPengajuan.length === 0}
    <div class="mt-8 bg-white rounded-2xl border border-dashed border-ink/15 p-12 text-center">
      <svg class="w-9 h-9 mx-auto mb-3 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
      </svg>
      <div class="font-bold text-sm">Belum ada pengajuan masuk</div>
      <div class="text-[13.5px] text-ink-soft mt-1">Tawaran harga dari pelanggan bakal muncul di sini.</div>
    </div>
  {:else}
    <div class="mt-8 flex flex-col gap-4">
      {#each data.daftarPengajuan as p (p.id)}
        <div class="bg-white rounded-2xl border border-ink/10 p-5">
          <div class="flex justify-between items-start gap-4">
            <div>
              <div class="font-bold text-sm">{p.produkNama}</div>
              <div class="text-[13px] text-ink-soft mt-0.5">
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
      class="w-full inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[13.5px] py-2.5 hover:-translate-y-0.5 transition"
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