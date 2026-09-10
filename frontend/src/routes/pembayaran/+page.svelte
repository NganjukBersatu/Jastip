<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

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

<div class="w-full max-w-310 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- HEADER -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Pembayaran</h1>
    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
      Cek ringkasan pesanan dan selesaikan pembayaranmu.
    </p>
  </div>

  {#if form?.error}
    <div class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-red-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold">
        !
      </span>
      <span>{form.error}</span>
    </div>
  {/if}

  <form method="POST" action="?/bayar" use:enhance class="space-y-8">
    <input type="hidden" name="ongkirRaw" value={data.ongkirRaw} />

    <!-- Ringkasan pesanan, dikelompokkan per jastiper (ongkir beda-beda tiap jastiper) -->
    <div>
      <h2 class="font-bold text-[15px] text-ink mb-3">Ringkasan pesanan</h2>
      <div class="space-y-4">
        {#each data.kelompokJastiper as kelompok (kelompok.jastiperId)}
          <div class="bg-white border border-ink/10 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.025)] divide-y divide-ink/10 overflow-hidden">
            {#each kelompok.items as item (item.produkId)}
              <div class="flex justify-between items-center px-4 py-3">
                <div>
                  <div class="font-semibold text-sm text-ink">{item.namaProduk}</div>
                  <div class="text-xs text-ink-soft">{item.jumlah} x {formatRupiah(item.hargaSatuan)}</div>
                </div>
                <div class="font-display font-semibold text-sm">
                  {formatRupiah(item.hargaSatuan * item.jumlah)}
                </div>
              </div>
            {/each}
            <div class="flex justify-between items-center px-4 py-3 text-sm bg-bg-alt">
              <span class="text-ink-soft">Ongkir {kelompok.wilayah ? `(${kelompok.wilayah})` : ''}</span>
              <span class="font-semibold">{formatRupiah(kelompok.ongkir)}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="flex justify-between items-center px-4 py-3.5 bg-ink text-bg rounded-2xl mt-3">
        <span class="font-bold text-sm">Total bayar</span>
        <span class="font-display font-bold text-lg">{formatRupiah(data.totalBayar)}</span>
      </div>
    </div>

    <!-- Alamat pengiriman -->
    <div>
      <label for="alamat" class="font-bold text-[15px] text-ink mb-3 block">
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
      <span class="font-bold text-[15px] text-ink mb-3 block">
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

      {#if metodeDipilih === 'transfer_bank' || metodeDipilih === 'e_wallet'}
        <p class="mt-3 text-xs text-ink-soft leading-relaxed bg-bg-alt rounded-xl px-4 py-3">
          Setelah pesanan dibuat, kamu akan diarahkan untuk chat langsung dengan
          jastiper lewat WhatsApp untuk menyelesaikan pembayaran.
        </p>
      {/if}
    </div>

    <button
      type="submit"
      class="w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
    >
      Bayar sekarang · {formatRupiah(data.totalBayar)}
    </button>
  </form>
</div>