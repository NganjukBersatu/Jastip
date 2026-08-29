<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

  let totalHarga = $derived(
    data.items.reduce((sum, item) => sum + item.hargaSatuan * item.jumlah, 0)
  );

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
  <title>Keranjang — Nitip.</title>
</svelte:head>

<section class="max-w-[900px] mx-auto px-5 md:px-8 py-14">
  <h1 class="text-2xl md:text-3xl font-bold mb-8">Keranjang kamu</h1>

  {#if data.items.length === 0}
    <div class="text-center py-20 bg-bg-alt rounded-[26px]">
      <p class="text-lg font-semibold">Keranjang masih kosong</p>
      <p class="text-ink-soft text-sm mt-1">Yuk cari titipan di katalog dulu.</p>
      <a href="/publik/katalog" class="inline-block mt-6 px-6 py-3 rounded-full bg-ink text-bg font-bold text-sm">
        Lihat katalog
      </a>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data.items as item (item.id)}
        <div class="flex items-center gap-4 bg-white border border-ink/10 rounded-2xl p-4">
          <div class="w-16 h-16 rounded-xl bg-bg-alt flex items-center justify-center overflow-hidden shrink-0">
            {#if item.gambarUrl}
              <img src={item.gambarUrl} alt={item.namaProduk} class="w-full h-full object-cover" />
            {:else}
              <span class="text-2xl">🛍️</span>
            {/if}
          </div>

          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm truncate">{item.namaProduk}</div>
            <div class="text-xs text-ink-soft">{item.lokasi} · Jastiper {item.jastiperNama}</div>
            <div class="font-display font-semibold mt-1">{formatRupiah(item.hargaSatuan)}</div>
          </div>

<div class="flex items-center gap-2.5">
  <form method="POST" action="?/ubahJumlah" use:enhance>
    <input type="hidden" name="id" value={item.id} />
    <input type="hidden" name="jumlah" value={item.jumlah - 1} />
    <button
      type="submit"
      disabled={item.jumlah <= 1}
      aria-label="Kurangi jumlah"
      class="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center text-sm font-bold hover:bg-bg-alt transition disabled:opacity-30 disabled:cursor-not-allowed"
    >
      −
    </button>
  </form>

  <span class="w-5 text-center text-sm font-semibold">{item.jumlah}</span>

  <form method="POST" action="?/ubahJumlah" use:enhance>
    <input type="hidden" name="id" value={item.id} />
    <input type="hidden" name="jumlah" value={item.jumlah + 1} />
    <button
      type="submit"
      aria-label="Tambah jumlah"
      class="w-7 h-7 rounded-full border border-ink/15 flex items-center justify-center text-sm font-bold hover:bg-bg-alt transition"
    >
      +
    </button>
  </form>
</div>

          <form method="POST" action="?/hapus" use:enhance>
            <input type="hidden" name="id" value={item.id} />
            <button type="submit" class="text-ink-soft hover:text-red-600 text-sm font-semibold px-2">
              Hapus
            </button>
          </form>
        </div>
      {/each}
    </div>

    <div class="mt-10 flex justify-between items-center border-t border-ink/10 pt-6">
      <span class="font-bold text-lg">Total</span>
      <span class="font-display font-bold text-2xl">{formatRupiah(totalHarga)}</span>
    </div>
<a
  href="/pembayaran"
  class="block text-center w-full mt-6 py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
>
  Lanjut ke pembayaran
</a>
  {/if}
</section>