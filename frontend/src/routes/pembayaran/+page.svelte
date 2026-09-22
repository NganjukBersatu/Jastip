<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

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

  /**
   * @param {string} jastiperId
   * @param {string} wilayahId
   */
  function pilihWilayah(jastiperId, wilayahId) {
    const url = new URL($page.url);
    const existing = data.ongkirRaw
      ? Object.fromEntries(
          data.ongkirRaw.split(',').map((p) => {
            const [j, w] = p.split(':');
            return [j, w];
          })
        )
      : {};

    existing[jastiperId] = wilayahId;
    const baru = Object.entries(existing)
      .map(([j, w]) => `${j}:${w}`)
      .join(',');

    url.searchParams.set('ongkir', baru);
    goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
  }
</script>

<svelte:head>
  <title>Pembayaran — Nitip.</title>
</svelte:head>

<div class="w-full max-w-310 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Pembayaran</h1>
    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
      Cek ringkasan pesanan dan selesaikan pembayaranmu.
    </p>
  </div>

  {#if form?.error}
    <div
      class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-red-700"
    >
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold">!</span>
      <span>{form.error}</span>
    </div>
  {/if}

  <form method="POST" action="?/bayar" use:enhance class="space-y-8">
    <input type="hidden" name="ongkirRaw" value={data.ongkirRaw} />
    <input type="hidden" name="itemRaw" value={data.itemRaw} />
    <input type="hidden" name="mode" value={data.mode} />
    {#if data.mode === 'langsung'}
      <input type="hidden" name="produkId" value={data.produkIdLangsung} />
      <input type="hidden" name="jumlah" value={data.jumlahLangsung} />
    {/if}

<!-- Ringkasan + pilih wilayah (layout lebih rapi) -->
<div>
  <h2 class="font-bold text-[15px] text-ink mb-3">Ringkasan pesanan</h2>
  <div class="space-y-4">
    {#each data.kelompokJastiper as kelompok (kelompok.jastiperId)}
      <div class="bg-white border border-ink/10 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.025)] divide-y divide-ink/10 overflow-hidden">
        {#each kelompok.items as item (item.produkId)}
          <div class="flex justify-between items-center px-4 py-3">
            <div>
              <div class="font-semibold text-sm text-ink">{item.namaProduk}</div>
              <div class="text-xs text-ink-soft">{item.jumlah} × {formatRupiah(item.hargaSatuan)}</div>
            </div>
            <div class="font-display font-semibold text-sm">
              {formatRupiah(item.hargaSatuan * item.jumlah)}
            </div>
          </div>
        {/each}

        <!-- Pilih wilayah: dropdown kiri + ongkir kanan -->
        <div class="px-4 py-3.5 bg-bg-alt">
          {#if kelompok.daftarWilayah.length === 0}
            <p class="text-sm text-red-600 font-medium">Jastiper belum mengatur wilayah ongkir.</p>
          {:else}
            <div class="flex items-center gap-3">
              <!-- Dropdown di kiri (tidak full width) -->
              <div class="flex-1 min-w-0">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label class="block text-[11px] font-semibold text-ink-soft mb-1">Wilayah pengiriman</label>
                <select
                  class="w-full max-w-[220px] rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                  value={kelompok.wilayahIdTerpilih ?? ''}
                  onchange={(e) => {
                    const val = e.currentTarget.value;
                    if (val) pilihWilayah(kelompok.jastiperId, val);
                  }}
                >
                  <option value="" disabled selected={!kelompok.wilayahIdTerpilih}>
                    Pilih wilayah...
                  </option>
                  {#each kelompok.daftarWilayah as w}
                    <option value={w.id}>
                      {w.wilayah}
                    </option>
                  {/each}
                </select>
              </div>

              <!-- Ongkir di kanan -->
              <div class="text-right shrink-0 pt-5">
                {#if kelompok.wilayahIdTerpilih}
                  <div class="text-[11px] text-ink-soft">Ongkir</div>
                  <div class="font-semibold text-sm">{formatRupiah(kelompok.ongkir)}</div>
                {:else}
                  <div class="text-[11px] text-ink-soft">Ongkir</div>
                  <div class="font-semibold text-sm text-ink-soft">—</div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="flex justify-between items-center px-4 py-3.5 bg-ink text-bg rounded-2xl mt-3">
    <span class="font-bold text-sm">Total bayar</span>
    <span class="font-display font-bold text-lg">{formatRupiah(data.totalBayar)}</span>
  </div>
</div>

    <!-- Alamat -->
    <div>
      <label for="alamat" class="font-bold text-[15px] text-ink mb-3 block">Alamat pengiriman</label>
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
      <span class="font-bold text-[15px] text-ink mb-3 block">Metode pembayaran</span>
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
          Setelah pesanan dibuat, kamu akan diarahkan untuk chat langsung dengan jastiper lewat WhatsApp.
        </p>
      {/if}
    </div>

    <button
      type="submit"
      disabled={!data.semuaWilayahSudahDipilih}
      class="w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
             hover:-translate-y-0.5"
    >
      {#if data.semuaWilayahSudahDipilih}
        Bayar sekarang · {formatRupiah(data.totalBayar)}
      {:else}
        Pilih wilayah dulu
      {/if}
    </button>
  </form>
</div>