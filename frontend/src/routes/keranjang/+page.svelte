<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

  // Simpan pilihan wilayah tiap jastiper di sini — key: jastiperId, value: id ongkir_wilayah yang dipilih.
  // Default-nya pilihan pertama kalau jastiper itu punya opsi ongkir.
  let wilayahTerpilih = $state(
    Object.fromEntries(
      data.kelompokJastiper.map((k) => [k.jastiperId, k.ongkirOptions[0]?.id ?? ''])
    )
  );

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  /** @param {typeof data.kelompokJastiper[number]} kelompok */
  function subtotalBarang(kelompok) {
    return kelompok.items.reduce((jumlah, item) => jumlah + item.hargaSatuan * item.jumlah, 0);
  }

  /** @param {typeof data.kelompokJastiper[number]} kelompok */
  function ongkirTerpilih(kelompok) {
    const idTerpilih = wilayahTerpilih[kelompok.jastiperId];
    return kelompok.ongkirOptions.find((o) => o.id === idTerpilih)?.biaya ?? 0;
  }

  // Total keseluruhan = jumlah (subtotal barang + ongkir) dari semua kelompok jastiper
  let totalHarga = $derived(
    data.kelompokJastiper.reduce(
      (total, kelompok) => total + subtotalBarang(kelompok) + ongkirTerpilih(kelompok),
      0
    )
  );

  // Checkout diblokir kalau ada jastiper yang belum atur ongkir sama sekali
  let adaJastiperBelumAturOngkir = $derived(
    data.kelompokJastiper.some((k) => k.ongkirOptions.length === 0)
  );

  // Bawa pilihan wilayah tiap jastiper ke halaman pembayaran lewat URL,
  // format: "jastiperId1:wilayahId1,jastiperId2:wilayahId2"
  let urlPembayaran = $derived(() => {
    const bagian = data.kelompokJastiper
      .filter((k) => wilayahTerpilih[k.jastiperId])
      .map((k) => `${k.jastiperId}:${wilayahTerpilih[k.jastiperId]}`);
    return `/pembayaran?ongkir=${encodeURIComponent(bagian.join(','))}`;
  });
</script>

<svelte:head>
  <title>Keranjang — Nitip.</title>
</svelte:head>

<section class="max-w-[900px] mx-auto px-5 md:px-8 py-10 sm:py-14">
  <h1 class="text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Keranjang kamu</h1>

  {#if data.kelompokJastiper.length === 0}
    <div class="text-center py-20 bg-bg-alt rounded-[26px]">
      <p class="text-lg font-semibold">Keranjang masih kosong</p>
      <p class="text-ink-soft text-sm mt-1">Yuk cari titipan di katalog dulu.</p>
      <a href="/publik/katalog" class="inline-block mt-6 px-6 py-3 rounded-full bg-ink text-bg font-bold text-sm">
        Lihat katalog
      </a>
    </div>
  {:else}
    <div class="space-y-8">
      {#each data.kelompokJastiper as kelompok (kelompok.jastiperId)}
        <div class="bg-white border border-ink/10 rounded-[22px] p-4 sm:p-5">
          <div class="text-[13px] font-bold text-ink-soft uppercase tracking-wide mb-3">
            Jastiper {kelompok.jastiperNama} · {kelompok.area ?? '—'}
          </div>

          <div class="space-y-3">
            {#each kelompok.items as item (item.id)}
              <div class="flex flex-wrap items-center gap-4">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-bg-alt flex items-center justify-center overflow-hidden shrink-0">
                  {#if item.gambarUrl}
                    <img src={item.gambarUrl} alt={item.namaProduk} class="w-full h-full object-cover" />
                  {:else}
                    <span class="text-2xl">🛍️</span>
                  {/if}
                </div>

                <div class="flex-1 min-w-[150px]">
                  <div class="font-bold text-sm">{item.namaProduk}</div>
                  <div class="font-display font-semibold mt-1">{formatRupiah(item.hargaSatuan)}</div>
                </div>

                <div class="flex items-center justify-between gap-3 basis-full sm:basis-auto sm:ml-auto sm:justify-end sm:gap-6">
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
              </div>
            {/each}
          </div>

          <!-- Pilihan wilayah & ongkir untuk jastiper ini -->
          <div class="mt-4 pt-4 border-t border-ink/10">
            {#if kelompok.ongkirOptions.length === 0}
              <div class="bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold px-4 py-3 rounded-xl">
                Jastiper ini belum atur ongkir wilayah — checkout belum bisa dilakukan sampai diatur.
              </div>
            {:else}
              <div class="flex flex-wrap items-center justify-between gap-3">
                <label class="flex items-center gap-2.5">
                  <span class="text-[13px] font-semibold text-ink-soft">Kirim ke wilayah</span>
                  <select
                    bind:value={wilayahTerpilih[kelompok.jastiperId]}
                    class="bg-bg border border-ink/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition"
                  >
                    {#each kelompok.ongkirOptions as opsi (opsi.id)}
                      <option value={opsi.id}>{opsi.wilayah} — {formatRupiah(opsi.biaya)}</option>
                    {/each}
                  </select>
                </label>
                <div class="text-[13.5px]">
                  <span class="text-ink-soft">Subtotal + ongkir:</span>
                  <span class="font-bold">{formatRupiah(subtotalBarang(kelompok) + ongkirTerpilih(kelompok))}</span>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-10 flex justify-between items-center border-t border-ink/10 pt-6">
      <span class="font-bold text-lg">Total</span>
      <span class="font-display font-bold text-2xl">{formatRupiah(totalHarga)}</span>
    </div>

    {#if adaJastiperBelumAturOngkir}
      <p class="text-center text-[13px] text-red-600 font-semibold mt-4">
        Belum bisa lanjut — ada jastiper yang belum atur ongkir wilayah.
      </p>
      <div
        class="block text-center w-full mt-3 py-3.5 rounded-full font-bold text-[15px] bg-ink/30 text-bg cursor-not-allowed"
      >
        Lanjut ke pembayaran
      </div>
    {:else}
      <a
        href={urlPembayaran()}
        class="block text-center w-full mt-6 py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
      >
        Lanjut ke pembayaran
      </a>
    {/if}
  {/if}
</section>