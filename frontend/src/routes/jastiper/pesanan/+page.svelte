<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

/** @type {string | null} */
let pesananTerbuka = $state(null);
	
  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  /** @param {string | Date} tanggal */
  function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /** @param {string} status */
  function labelStatus(status) {
    /** @type {Record<string, { teks: string, kelas: string }>} */
    const peta = {
      menunggu_konfirmasi: {
        teks: 'Menunggu konfirmasi',
        kelas: 'bg-yellow-100 text-yellow-700'
      },
      dibelanjakan: {
        teks: 'Sedang dibelanjakan',
        kelas: 'bg-blue-100 text-blue-700'
      },
      dikirim: {
        teks: 'Sedang diantar',
        kelas: 'bg-purple-100 text-purple-700'
      },
      selesai: {
        teks: 'Selesai',
        kelas: 'bg-green-100 text-green-700'
      },
      dibatalkan: {
        teks: 'Dibatalkan',
        kelas: 'bg-red-100 text-red-700'
      }
    };

    return peta[status] ?? {
      teks: status,
      kelas: 'bg-gray-100 text-gray-700'
    };
  }

  /** @param {string} id */
  function togglePesanan(id) {
    pesananTerbuka = pesananTerbuka === id ? null : id;
  }
</script>

<svelte:head>
  <title>Pesanan — Nitip</title>
</svelte:head>

<div class="w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <!-- HEADER -->
  <div class="mb-7 sm:mb-8">
    <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
      Pesanan
    </h1>

    <p class="text-ink-soft mt-1.5 text-sm sm:text-[15px] leading-relaxed">
      Pesanan yang masuk, perlu diantar ke mana, dan riwayatnya.
    </p>
  </div>

  <!-- PESANAN SEARAH -->
  {#if data.kelompokSatuJalur.length > 0}
    <section class="mb-8">
      <div class="mb-3">
        <h2 class="font-bold text-[15px] text-ink">
          🛵 Bisa dibeli &amp; diantar bareng
        </h2>

        <p class="text-[13px] text-ink-soft mt-0.5 leading-relaxed">
          Pesanan-pesanan ini kelihatannya searah — cek dulu, siapa tahu bisa sekali jalan.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        {#each data.kelompokSatuJalur as kelompok (kelompok.wilayah)}
          <div class="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div class="font-bold text-[13.5px] capitalize">
              {kelompok.wilayah} · {kelompok.daftar.length} pesanan
            </div>

            <div class="flex flex-col gap-2 mt-3">
              {#each kelompok.daftar as p (p.id)}
                <div class="bg-white rounded-xl px-3.5 py-3 text-[13px] flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                  <span class="font-semibold">
                    {p.produkNama}
                    <span class="font-normal text-ink-soft">
                      — {p.pelangganNama}
                    </span>
                  </span>

                  <span class="font-bold shrink-0">
                    {formatRupiah(p.totalHarga)}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- PESANAN AKTIF -->
  <section>
    <div class="mb-3">
      <h2 class="font-bold text-[15px] text-ink">
        Pesanan aktif
      </h2>

      <p class="text-xs text-ink-soft mt-0.5">
        Pesanan yang masih perlu diproses
      </p>
    </div>

    {#if data.pesananAktif.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-10 sm:p-12 text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
          <span class="text-xl">📦</span>
        </div>

        <div class="font-bold text-sm">
          Belum ada pesanan aktif
        </div>

        <div class="text-[13px] text-ink-soft mt-1">
          Pesanan baru bakal muncul di sini.
        </div>
      </div>
    {:else}
      <div class="flex flex-col gap-3 sm:gap-4">
        {#each data.pesananAktif as p (p.id)}
          {@const st = labelStatus(p.status)}

          <div
            class="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition hover:shadow-md"
          >
            <!-- RINGKASAN -->
            <button
              type="button"
              class="w-full text-left p-4 sm:p-5"
              onclick={() => togglePesanan(p.id)}
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-bold text-sm text-ink truncate">
                    {p.produkNama}
                  </div>

                  <div class="text-[12.5px] text-ink-soft mt-1 leading-relaxed">
                    untuk
                    <span class="font-semibold text-ink">
                      {p.pelangganNama}
                    </span>
                    · {formatTanggal(p.createdAt)}
                  </div>
                </div>

                <span
                  class="text-[10.5px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full {st.kelas} shrink-0"
                >
                  {st.teks}
                </span>
              </div>

              <!-- Ringkasan total khusus mobile -->
              <div class="mt-4 flex items-center justify-between gap-3 sm:hidden">
                <div>
                  <div class="text-[11px] text-ink-soft">
                    Total pesanan
                  </div>

                  <div class="text-sm font-extrabold text-primary-dark mt-0.5">
                    {formatRupiah(p.totalHarga)}
                  </div>
                </div>

                <span class="flex items-center gap-1 text-[11px] font-bold text-ink-soft">
                  {pesananTerbuka === p.id ? 'Tutup detail' : 'Lihat detail'}

                  <svg
                    class="w-4 h-4 transition-transform {pesananTerbuka === p.id ? 'rotate-180' : ''}"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </button>

            <!-- DETAIL -->
            <div
              class:hidden={pesananTerbuka !== p.id}
              class="px-4 pb-4 sm:block sm:px-5 sm:pb-5"
            >
              <div class="border-t border-ink/10 pt-4">
                <div class="bg-bg rounded-xl px-4 py-3.5 text-[13px] flex flex-col gap-2.5">
                  <div class="flex items-start justify-between gap-4">
                    <span class="text-ink-soft shrink-0">
                      Antar ke
                    </span>

                    <span class="font-medium text-right max-w-[70%] break-words">
                      {p.alamatKirim ?? '—'}
                    </span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-ink-soft">Jumlah</span>
                    <span>{p.jumlah} pcs</span>
                  </div>

                  <div class="flex justify-between gap-4">
                    <span class="text-ink-soft">Ongkir</span>
                    <span>{formatRupiah(p.ongkir)}</span>
                  </div>

                  <div class="flex justify-between gap-4 font-bold pt-2 border-t border-ink/10">
                    <span>Total</span>

                    <span class="text-primary-dark">
                      {formatRupiah(p.totalHarga)}
                    </span>
                  </div>
                </div>

                <!-- ACTION -->
                <div class="flex flex-col sm:flex-row gap-2.5 mt-4">
                  {#if p.status === 'menunggu_konfirmasi'}
                    <form
                      method="POST"
                      action="?/mulaiBelanja"
                      use:enhance
                      class="flex-1"
                    >
                      <input type="hidden" name="id" value={p.id} />

                      <button
                        type="submit"
                        class="w-full min-h-[44px] rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition"
                      >
                        Mulai belanja
                      </button>
                    </form>

                    <form
                      method="POST"
                      action="?/batalkan"
                      use:enhance
                      class="flex-1"
                    >
                      <input type="hidden" name="id" value={p.id} />

                      <button
                        type="submit"
                        class="w-full min-h-[44px] rounded-xl border-2 border-ink/15 text-ink-soft font-bold text-[13px] px-4 py-2.5 hover:border-red-300 hover:text-red-500 transition"
                      >
                        Batalkan
                      </button>
                    </form>
                  {:else if p.status === 'dibelanjakan'}
                    <form
                      method="POST"
                      action="?/mulaiAntar"
                      use:enhance
                      class="flex-1"
                    >
                      <input type="hidden" name="id" value={p.id} />

                      <button
                        type="submit"
                        class="w-full min-h-[44px] rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition"
                      >
                        Mulai antar
                      </button>
                    </form>
                  {:else if p.status === 'dikirim'}
                    <form
                      method="POST"
                      action="?/selesaikan"
                      use:enhance
                      class="flex-1"
                    >
                      <input type="hidden" name="id" value={p.id} />

                      <button
                        type="submit"
                        class="w-full min-h-[44px] rounded-xl bg-primary text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition"
                      >
                        Tandai selesai
                      </button>
                    </form>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- RIWAYAT -->
  {#if data.riwayat.length > 0}
    <section class="mt-9 sm:mt-10">
      <div class="mb-3">
        <h2 class="font-bold text-[15px] text-ink">
          Riwayat
        </h2>

        <p class="text-xs text-ink-soft mt-0.5">
          Pesanan yang sudah selesai atau dibatalkan
        </p>
      </div>

      <div class="flex flex-col gap-2">
        {#each data.riwayat as p (p.id)}
          {@const st = labelStatus(p.status)}

          <div class="bg-white rounded-xl border border-ink/10 px-4 py-3.5 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="font-semibold text-[13.5px] truncate">
                {p.produkNama}
              </div>

              <div class="text-[12px] text-ink-soft mt-0.5 truncate">
                {p.pelangganNama} · {formatTanggal(p.createdAt)}
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="font-semibold text-[13px]">
                {formatRupiah(p.totalHarga)}
              </div>

              <span class="inline-block mt-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full {st.kelas}">
                {st.teks}
              </span>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>