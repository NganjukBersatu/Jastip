<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let totalHarga = $derived(
    data.items.reduce((sum, item) => sum + item.hargaSatuan * item.jumlah, 0)
  );

  const metodePembayaranList = [
    { value: 'transfer_bank', label: 'Transfer Bank' },
    { value: 'e_wallet', label: 'E-Wallet (OVO/DANA/GoPay)' },
    { value: 'cod', label: 'Bayar di Tempat (COD)' }
  ];

  let metodeDipilih = $state('transfer_bank');

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
  <title>Pembayaran — Nitip.</title>
</svelte:head>

<section class="max-w-[700px] mx-auto px-5 md:px-8 py-14">
  <h1 class="text-2xl md:text-3xl font-bold mb-8">Pembayaran</h1>

  {#if form?.error}
    <div class="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      {form.error}
    </div>
  {/if}

  <form method="POST" action="?/bayar" use:enhance class="space-y-8">
    <!-- Ringkasan pesanan -->
    <div>
      <h2 class="font-bold text-sm uppercase tracking-wide text-ink-soft mb-3">Ringkasan pesanan</h2>
      <div class="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
        {#each data.items as item (item.id)}
          <div class="flex justify-between items-center px-4 py-3">
            <div>
              <div class="font-semibold text-sm">{item.namaProduk}</div>
              <div class="text-xs text-ink-soft">{item.jumlah} x {formatRupiah(item.hargaSatuan)}</div>
            </div>
            <div class="font-display font-semibold text-sm">
              {formatRupiah(item.hargaSatuan * item.jumlah)}
            </div>
          </div>
        {/each}
        <div class="flex justify-between items-center px-4 py-3.5 bg-bg-alt rounded-b-2xl">
          <span class="font-bold text-sm">Total</span>
          <span class="font-display font-bold text-lg">{formatRupiah(totalHarga)}</span>
        </div>
      </div>
    </div>

    <!-- Alamat pengiriman -->
    <div>
      <label for="alamat" class="font-bold text-sm uppercase tracking-wide text-ink-soft mb-3 block">
        Alamat pengiriman
      </label>
      <textarea
        id="alamat"
        name="alamat"
        rows="3"
        placeholder="Tulis alamat lengkap: nama jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos"
        class="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent resize-none"
        required
      ></textarea>
    </div>

    <!-- Metode pembayaran -->
    <div>
      <span class="font-bold text-sm uppercase tracking-wide text-ink-soft mb-3 block">
        Metode pembayaran
      </span>
      <div class="space-y-2.5">
        {#each metodePembayaranList as metode}
          <label
            class="flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition
                   {metodeDipilih === metode.value ? 'border-ink bg-bg-alt' : 'border-ink/15 hover:border-ink/30'}"
          >
            <input
              type="radio"
              name="metodePembayaran"
              value={metode.value}
              bind:group={metodeDipilih}
              class="accent-ink"
            />
            <span class="text-sm font-semibold">{metode.label}</span>
          </label>
        {/each}
      </div>
    </div>

    <button
      type="submit"
      class="w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
    >
      Bayar sekarang · {formatRupiah(totalHarga)}
    </button>
  </form>
</section>