<script>
  import { enhance } from '$app/forms';

  let { data } = $props();

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }

  /** @param {string | Date} tanggal */
  function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /** @param {string} status */
  function labelStatus(status) {
    /** @type {Record<string, { teks: string, kelas: string }>} */
    const peta = {
      menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-yellow-100 text-yellow-700' },
      dibelanjakan: { teks: 'Sedang dibelanjakan', kelas: 'bg-blue-100 text-blue-700' },
      dikirim: { teks: 'Sedang diantar', kelas: 'bg-purple-100 text-purple-700' },
      selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-700' },
      dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-700' }
    };
    return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
  }

  const STATUS_AKTIF = ['menunggu_konfirmasi', 'dibelanjakan', 'dikirim'];
  let pesananAktif = $derived(data.daftarPesanan.filter((p) => STATUS_AKTIF.includes(p.status)));
  let riwayat = $derived(data.daftarPesanan.filter((p) => !STATUS_AKTIF.includes(p.status)));
</script>

<svelte:head>
  <title>Pesanan saya — Nitip</title>
</svelte:head>

<section class="max-w-[720px] mx-auto px-5 md:px-8 py-14">
  <h1 class="text-2xl md:text-3xl font-bold">Pesanan saya</h1>
  <p class="text-ink-soft text-sm mt-1">Pantau titipan yang lagi jalan dan riwayat sebelumnya.</p>

  {#if data.daftarPesanan.length === 0}
    <div class="mt-8 text-center py-20 bg-bg-alt rounded-[26px]">
      <p class="font-semibold">Belum ada pesanan</p>
      <p class="text-ink-soft text-sm mt-1">Yuk cari titipan pertamamu di katalog.</p>
      <a href="/publik/katalog" class="inline-block mt-6 px-6 py-3 rounded-full bg-ink text-bg font-bold text-sm">
        Lihat katalog
      </a>
    </div>
  {:else}
    {#if pesananAktif.length > 0}
      <div class="mt-8">
        <h2 class="font-bold text-[15px]">Sedang berjalan</h2>
        <div class="flex flex-col gap-4 mt-3">
          {#each pesananAktif as p (p.id)}
            {@const st = labelStatus(p.status)}
            <div class="bg-white rounded-2xl border border-ink/10 p-5">
              <div class="flex justify-between items-start gap-4">
                <div>
                  <div class="font-bold text-sm">{p.produkNama}</div>
                  <div class="text-[13px] text-ink-soft mt-0.5">
                    dari <span class="font-semibold text-ink">{p.jastiperNama}</span> · {formatTanggal(p.createdAt)}
                  </div>
                </div>
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-full {st.kelas} shrink-0">{st.teks}</span>
              </div>

              <div class="mt-3 bg-bg rounded-xl px-4 py-3 text-[13.5px] flex flex-col gap-1">
                <div class="flex justify-between">
                  <span class="text-ink-soft">{formatRupiah(p.hargaSatuan)} × {p.jumlah} pcs</span>
                  <span>{formatRupiah(p.hargaSatuan * p.jumlah)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-ink-soft">Ongkir</span>
                  <span>{formatRupiah(p.ongkir)}</span>
                </div>
                <div class="flex justify-between font-bold pt-1 border-t border-ink/10 mt-1">
                  <span>Total</span>
                  <span class="text-primary-dark">{formatRupiah(p.totalHarga)}</span>
                </div>
              </div>

              {#if p.status === 'menunggu_konfirmasi'}
                <form method="POST" action="?/batalkan" use:enhance class="mt-3">
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    class="w-full rounded-pill border-2 border-ink/15 text-ink-soft font-bold text-[13px] py-2.5 hover:border-red-300 hover:text-red-500 transition"
                  >
                    Batalkan pesanan
                  </button>
                </form>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if riwayat.length > 0}
      <div class="mt-10">
        <h2 class="font-bold text-[15px]">Riwayat</h2>
        <div class="flex flex-col gap-2 mt-3">
          {#each riwayat as p (p.id)}
            {@const st = labelStatus(p.status)}
            <div class="bg-white rounded-xl border border-ink/10 px-4 py-3 flex justify-between items-center">
              <div>
                <div class="font-semibold text-[13.5px]">{p.produkNama}</div>
                <div class="text-[12px] text-ink-soft">{p.jastiperNama} · {formatTanggal(p.createdAt)}</div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-[13.5px]">{formatRupiah(p.totalHarga)}</div>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full {st.kelas}">{st.teks}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</section>