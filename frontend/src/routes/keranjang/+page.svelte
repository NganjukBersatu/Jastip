<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

  // Simpan pilihan wilayah tiap jastiper di sini — key: jastiperId, value: id ongkir_wilayah yang dipilih.
  // Default-nya pilihan pertama kalau jastiper itu punya opsi ongkir.
  let wilayahTerpilih = $state(
    Object.fromEntries(
      // svelte-ignore state_referenced_locally
      data.kelompokJastiper.map((k) => [k.jastiperId, k.ongkirOptions[0]?.id ?? ''])
    )
  );

  // Id item keranjang yang TIDAK dicentang. Default kosong = semua item terpilih.
  /** @type {string[]} */
  let tidakDipilih = $state([]);

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  /** @param {string} id */
  function dipilih(id) {
    return !tidakDipilih.includes(id);
  }

  /** @param {string} id */
  function togglePilih(id) {
    tidakDipilih = tidakDipilih.includes(id)
      ? tidakDipilih.filter((x) => x !== id)
      : [...tidakDipilih, id];
  }

  /** @param {typeof data.kelompokJastiper[number]} kelompok */
  function adaTerpilih(kelompok) {
    return kelompok.items.some((item) => dipilih(item.id));
  }

  /** @param {typeof data.kelompokJastiper[number]} kelompok */
  function subtotalBarang(kelompok) {
    return kelompok.items
      .filter((item) => dipilih(item.id))
      .reduce((jumlah, item) => jumlah + item.hargaSatuan * item.jumlah, 0);
  }

  /** @param {typeof data.kelompokJastiper[number]} kelompok */
  function ongkirTerpilih(kelompok) {
    if (!adaTerpilih(kelompok)) return 0;
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

  // Checkout diblokir hanya kalau jastiper yang itemnya DIPILIH belum atur ongkir
  let adaJastiperBelumAturOngkir = $derived(
    data.kelompokJastiper.some((k) => adaTerpilih(k) && k.ongkirOptions.length === 0)
  );

  // Semua id item keranjang yang dicentang
  let idDipilih = $derived(
    data.kelompokJastiper.flatMap((k) =>
      k.items.filter((item) => dipilih(item.id)).map((item) => item.id)
    )
  );

  // Bawa pilihan wilayah tiap jastiper DAN item terpilih ke halaman pembayaran lewat URL,
  // format ongkir: "jastiperId1:wilayahId1,jastiperId2:wilayahId2"
  // format item: "idItem1,idItem2"
  let urlPembayaran = $derived(() => {
    const bagian = data.kelompokJastiper
      .filter((k) => adaTerpilih(k) && wilayahTerpilih[k.jastiperId])
      .map((k) => `${k.jastiperId}:${wilayahTerpilih[k.jastiperId]}`);
    return `/pembayaran?ongkir=${encodeURIComponent(bagian.join(','))}&item=${encodeURIComponent(idDipilih.join(','))}`;
  });
</script>

<svelte:head>
  <title>Keranjang — Nitip.</title>
</svelte:head>

<div class="w-full max-w-310 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- HEADER -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Keranjang kamu</h1>
  </div>

  {#if data.kelompokJastiper.length === 0}
    <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 text-primary"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      </div>

      <div class="font-bold text-[15px] text-ink">Keranjang masih kosong</div>
      <div class="text-[13.5px] text-ink-soft mt-1.5 max-w-75 mx-auto leading-relaxed">
        Yuk cari titipan di katalog dulu.
      </div>

      <a
        href="/publik/katalog"
        class="inline-block mt-6 px-6 py-3 rounded-full bg-ink text-bg font-bold text-sm hover:-translate-y-0.5 hover:shadow-md transition"
      >
        Lihat katalog
      </a>
    </div>
  {:else}
    <div class="space-y-6">
      {#each data.kelompokJastiper as kelompok (kelompok.jastiperId)}
        <div class="bg-white rounded-2xl border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-4 sm:p-5">
          <div class="text-[13px] font-bold text-ink-soft uppercase tracking-wide mb-3">
            Jastiper {kelompok.jastiperNama} · {kelompok.area ?? '—'}
          </div>

          <div class="space-y-3">
            {#each kelompok.items as item (item.id)}
              <div
                class="flex flex-wrap items-center gap-3 sm:gap-4 transition-opacity {dipilih(item.id) ? '' : 'opacity-55'}"
              >
                <label class="flex h-8 w-6 shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    class="h-5 w-5 cursor-pointer accent-orange-500"
                    checked={dipilih(item.id)}
                    onchange={() => togglePilih(item.id)}
                    aria-label="Pilih {item.namaProduk}"
                  />
                </label>

                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-bg-alt flex items-center justify-center overflow-hidden shrink-0">
                  {#if item.gambarUrl}
                    <img src={item.gambarUrl} alt={item.namaProduk} class="w-full h-full object-cover" />
                  {:else}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-6 h-6 text-ink-soft"
                    >
                      <path d="M6 2l1.5 4h9L18 2" />
                      <path d="M3.5 6h17l-1.2 12.5a2 2 0 01-2 1.5H6.7a2 2 0 01-2-1.5L3.5 6z" />
                      <line x1="9" y1="10" x2="9" y2="14" />
                      <line x1="15" y1="10" x2="15" y2="14" />
                    </svg>
                  {/if}
                </div>

                <div class="flex-1 min-w-37.5">
                  <div class="font-bold text-sm text-ink">{item.namaProduk}</div>
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
                Jastiper ini belum atur ongkir wilayah — item dari jastiper ini belum bisa di-checkout sampai diatur.
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
      <div>
        <span class="font-bold text-lg text-ink">Total</span>
        <div class="text-[12.5px] text-ink-soft mt-0.5">{idDipilih.length} item dipilih</div>
      </div>
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
    {:else if idDipilih.length === 0}
      <p class="text-center text-[13px] text-red-600 font-semibold mt-4">
        Pilih minimal 1 item untuk lanjut ke pembayaran.
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
</div>