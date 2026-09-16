<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

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

  const STATUS_URUTAN = ['menunggu_konfirmasi', 'dibelanjakan', 'dikirim', 'selesai'];
  const LABEL_TAHAP_PRODUK = ['Dipesan', 'Dibelanjakan', 'Diantar', 'Selesai'];
  const LABEL_TAHAP_JASA = ['Dipesan', 'Diproses', 'Diantar', 'Selesai'];

  /** @param {string} status */
  function tahapAktif(status) {
    const i = STATUS_URUTAN.indexOf(status);
    return i === -1 ? 0 : i;
  }

  /** @param {string} id */
  function kodePesanan(id) {
    return `#NTP-${id.slice(0, 8).toUpperCase()}`;
  }
</script>

<svelte:head>
  <title>Pesanan saya — Nitip</title>
</svelte:head>

{#snippet kotakIkon(jasa)}
  <div class="w-13 h-13 rounded-2xl bg-bg-alt flex items-center justify-center shrink-0">
    {#if jasa}
      <svg class="w-5.5 h-5.5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="6" width="14" height="10" rx="1" />
        <path d="M15 10h4l3 3v3h-7" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="17.5" cy="19" r="2" />
      </svg>
    {:else}
      <svg class="w-5.5 h-5.5 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
      </svg>
    {/if}
  </div>
{/snippet}

{#snippet avatarInisial(nama)}
  <div class="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[9px] font-bold text-primary-deep shrink-0">
    {(nama || '?').charAt(0).toUpperCase()}
  </div>
{/snippet}

{#snippet infoRute(p)}
  <div class="mt-3 bg-bg rounded-xl px-4 py-3 text-[13px] flex flex-col gap-1.5">
    <div class="flex justify-between gap-3">
      <span class="text-ink-soft shrink-0">Titik jemput</span>
      <span class="font-medium text-right">{p.titikJemput}</span>
    </div>
    <div class="flex justify-between gap-3">
      <span class="text-ink-soft shrink-0">Titik tujuan</span>
      <span class="font-medium text-right">{p.alamatKirim}</span>
    </div>
    <div class="flex justify-between pt-1 border-t border-ink/10 mt-0.5">
      <span class="text-ink-soft">Jarak</span>
      <span>{p.jarakKm ?? 0} km</span>
    </div>
  </div>
{/snippet}

<!-- BARU: sekarang loop p.items (bisa lebih dari 1 produk per transaksi) -->
{#snippet rincianHarga(p, jasa)}
  <div class="mt-3 bg-bg rounded-xl px-4 py-3 text-[13.5px] flex flex-col gap-1.5">
    {#if jasa}
      <div class="flex justify-between">
        <span class="text-ink-soft">{formatRupiah(p.items[0]?.hargaSatuan ?? 0)}/km × {p.jarakKm ?? 0} km</span>
        <span>{formatRupiah((p.items[0]?.hargaSatuan ?? 0) * (p.jarakKm ?? 0))}</span>
      </div>
    {:else}
      {#each p.items as it (it.id)}
        <div class="flex justify-between">
          <span class="text-ink-soft">{it.nama} — {formatRupiah(it.hargaSatuan)} × {it.jumlah} pcs</span>
          <span>{formatRupiah(it.hargaSatuan * it.jumlah)}</span>
        </div>
      {/each}
      <div class="flex justify-between">
        <span class="text-ink-soft">Ongkir</span>
        <span>{formatRupiah(p.ongkir)}</span>
      </div>
    {/if}
    <div class="flex justify-between font-bold pt-1.5 border-t border-dashed border-ink/15 mt-0.5">
      <span>Total</span>
      <span class="text-primary-dark">{formatRupiah(p.totalHarga)}</span>
    </div>
  </div>
{/snippet}

<div class="w-full max-w-310 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Pesanan saya</h1>
    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
      Pantau titipan yang lagi jalan dan riwayat sebelumnya.
    </p>
  </div>

  {#if data.daftarPesanan.length === 0}
    <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
        <svg class="w-6 h-6 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
        </svg>
      </div>
      <div class="font-bold text-[15px] text-ink">Belum ada pesanan</div>
      <div class="text-[13.5px] text-ink-soft mt-1.5 max-w-75 mx-auto leading-relaxed">
        Yuk cari titipan pertamamu di katalog.
      </div>
      <a
        href="/publik/katalog"
        class="inline-block mt-6 px-6 py-3 rounded-full bg-ink text-bg font-bold text-sm hover:-translate-y-0.5 hover:shadow-md transition"
      >
        Lihat katalog
      </a>
    </div>
  {:else}
    {#if pesananAktif.length > 0}
      <div class="mb-3.5 flex items-center gap-2">
        <h2 class="font-bold text-[15px] text-ink">Sedang berjalan</h2>
        <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
          {pesananAktif.length}
        </span>
      </div>
      <div class="flex flex-col gap-4 mb-10">
        {#each pesananAktif as p (p.id)}
          {@const st = labelStatus(p.status)}
          {@const labelTahap = p.isJasa ? LABEL_TAHAP_JASA : LABEL_TAHAP_PRODUK}
          {@const tahap = tahapAktif(p.status)}
          <div class="bg-white rounded-card border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-5 sm:p-6">
            <div class="flex justify-between items-start gap-3 mb-4">
              <div class="flex gap-3 min-w-0">
                {@render kotakIkon(p.isJasa)}
                <div class="min-w-0">
                  <div class="font-bold text-sm text-ink truncate">{p.namaItem}</div>
                  <div class="flex items-center gap-1.5 text-[12px] text-ink-soft mt-0.5">
                    {@render avatarInisial(p.jastiperNama)}
                    <span class="truncate">dari <span class="font-semibold text-ink">{p.jastiperNama}</span> · {formatTanggal(p.createdAt)}</span>
                  </div>
                  <div class="text-[11px] text-ink-soft mt-1">No. pesanan {kodePesanan(p.id)}</div>
                </div>
              </div>
              <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full {st.kelas} shrink-0 whitespace-nowrap">{st.teks}</span>
            </div>

            <div class="flex justify-between px-0.5 mb-1">
              {#each labelTahap as label, i}
                <div class="text-center flex-1">
                  <div class="w-5.5 h-5.5 rounded-full mx-auto mb-1 flex items-center justify-center {i <= tahap ? 'bg-primary text-white' : 'bg-bg-alt text-ink-soft'}">
                    {#if i === 0}
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {:else if i === 1}
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    {:else if i === 2}
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="10" rx="1" /><path d="M15 10h4l3 3v3h-7" /><circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" /></svg>
                    {:else}
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /></svg>
                    {/if}
                  </div>
                  <div class="text-[9.5px] font-semibold {i <= tahap ? 'text-ink' : 'text-ink-soft'}">{label}</div>
                </div>
                {#if i < labelTahap.length - 1}
                  <div class="flex-1 h-0.5 mt-2.5 {i < tahap ? 'bg-primary' : 'bg-bg-alt'}"></div>
                {/if}
              {/each}
            </div>

            {#if p.isJasa}
              {@render infoRute(p)}
            {/if}
            {@render rincianHarga(p, p.isJasa)}

            <div class="flex gap-2 mt-3">
              {#if p.pengajuanHargaId}
                <a href={`/pelanggan/chat/${p.pengajuanHargaId}`}
                  class="flex-1 flex items-center justify-center gap-1.5 text-center rounded-full border-2 border-ink/15 text-ink font-bold text-[13px] py-2.5 hover:border-ink/40 transition"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Chat jastiper
                </a>
              {/if}
              {#if p.status === 'menunggu_konfirmasi'}
                <form method="POST" action="?/batalkan" use:enhance class="flex-1">
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    class="w-full flex items-center justify-center gap-1.5 rounded-full border-2 border-ink/15 text-ink-soft font-bold text-[13px] py-2.5 hover:border-red-300 hover:text-red-500 transition"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="m15 9-6 6M9 9l6 6" />
                    </svg>
                    Batalkan pesanan
                  </button>
                </form>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if riwayat.length > 0}
      <div class="mb-3.5 flex items-center gap-2">
        <h2 class="font-bold text-[15px] text-ink">Riwayat</h2>
        <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
          {riwayat.length}
        </span>
      </div>
      <div class="flex flex-col gap-4">
        {#each riwayat as p (p.id)}
          {@const st = labelStatus(p.status)}
          <div class="bg-white rounded-card border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-5 sm:p-6">
            <div class="flex justify-between items-start gap-3 mb-1">
              <div class="flex gap-3 min-w-0">
                {@render kotakIkon(p.isJasa)}
                <div class="min-w-0">
                  <div class="font-bold text-sm text-ink truncate">{p.namaItem}</div>
                  <div class="flex items-center gap-1.5 text-[12px] text-ink-soft mt-0.5">
                    {@render avatarInisial(p.jastiperNama)}
                    <span class="truncate">dari <span class="font-semibold text-ink">{p.jastiperNama}</span> · {formatTanggal(p.createdAt)}</span>
                  </div>
                  <div class="text-[11px] text-ink-soft mt-1">No. pesanan {kodePesanan(p.id)}</div>
                </div>
              </div>
              <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full {st.kelas} shrink-0 whitespace-nowrap">{st.teks}</span>
            </div>

            {#if p.isJasa}
              {@render infoRute(p)}
            {/if}
            {@render rincianHarga(p, p.isJasa)}

            <div class="flex gap-2 mt-3">
              {#if p.pembayaranDikonfirmasi || (p.isJasa && p.status === 'selesai')}
                <a
                  href="/pesanan/{p.id}/struk"
                  class="flex-1 flex items-center justify-center gap-1.5 text-center rounded-full border-2 border-ink/15 text-ink font-bold text-[13px] py-2.5 hover:border-green-300 hover:text-green-600 transition"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 3h16v18l-3-2-2.5 2-2.5-2-2.5 2L7 19l-3 2V3Z" />
                    <path d="M8 8h8M8 12h8M8 16h4" />
                  </svg>
                  Lihat struk
                </a>
              {/if}

              <form
                method="POST"
                action="?/hapusRiwayat"
                use:enhance={() => {
                  if (!confirm('Hapus riwayat pesanan ini?')) return () => {};
                }}
                class="flex-1"
              >
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  class="w-full flex items-center justify-center gap-1.5 rounded-full border-2 border-ink/15 text-ink-soft font-bold text-[13px] py-2.5 hover:border-red-300 hover:text-red-500 transition"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Hapus riwayat
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>