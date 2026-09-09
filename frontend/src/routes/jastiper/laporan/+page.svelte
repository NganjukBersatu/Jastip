<script>
  let { data } = $props();

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
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(tanggal));
  }

  const labelStatus = {
    menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-bg-alt text-primary-dark' },
    dibelanjakan: { teks: 'Dibelanjakan', kelas: 'bg-blue-50 text-blue-700' },
    dikirim: { teks: 'Dikirim', kelas: 'bg-amber-50 text-amber-700' },
    selesai: { teks: 'Selesai', kelas: 'bg-green-50 text-green-700' },
    dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-50 text-red-700' }
  };
</script>

<svelte:head>
  <title>Laporan — Nitip</title>
</svelte:head>

<div class="w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <div class="mb-6 sm:mb-8">
    <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
      Laporan penjualan
    </h1>
    <p class="text-ink-soft mt-1.5 text-sm sm:text-[15px] leading-relaxed">
      Pendapatan dihitung dari pesanan yang sudah berstatus selesai.
    </p>
  </div>

  <!-- STAT PENDAPATAN -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="rounded-2xl border border-ink/10 bg-white p-5">
      <p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Hari ini</p>
      <p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanHarian)}</p>
    </div>
    <div class="rounded-2xl border border-ink/10 bg-white p-5">
      <p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Minggu ini</p>
      <p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanMingguan)}</p>
    </div>
    <div class="rounded-2xl border border-ink/10 bg-white p-5">
      <p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Bulan ini</p>
      <p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanBulanan)}</p>
    </div>
  </div>

  <!-- PRODUK/JASA TERLARIS -->
  <section class="mb-8">
    <h2 class="text-lg font-display font-semibold text-ink mb-3">Produk/jasa terlaris</h2>

    {#if data.produkTerlaris.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-8 text-center">
        <p class="text-[13px] text-ink-soft">Belum ada pesanan selesai.</p>
      </div>
    {:else}
      <div class="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
        {#each data.produkTerlaris as p, i (p.produkId ?? p.jasaId)}
          <div class="flex justify-between items-center px-4 py-3.5">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-6 h-6 rounded-full bg-bg-alt text-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div class="min-w-0">
                <div class="font-semibold text-sm truncate">{p.nama}</div>
                <div class="text-xs text-ink-soft">{p.totalTerjual} terjual</div>
              </div>
            </div>
            <div class="font-display font-semibold text-sm shrink-0 ml-3">
              {formatRupiah(p.totalPendapatan)}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- RIWAYAT PESANAN -->
  <section>
    <h2 class="text-lg font-display font-semibold text-ink mb-1">Riwayat pesanan</h2>
    <p class="text-xs text-ink-soft mb-3">
      Semua pesanan ditampilkan di sini termasuk yang dibatalkan — pesanan dibatalkan
      tidak dihitung ke pendapatan di atas.
    </p>

    {#if data.riwayatPesanan.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-8 text-center">
        <p class="text-[13px] text-ink-soft">Belum ada riwayat pesanan.</p>
      </div>
    {:else}
      <div class="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
        {#each data.riwayatPesanan as p (p.id)}
          <div class="flex justify-between items-center px-4 py-3.5 gap-3">
            <div class="min-w-0">
              <div class="font-semibold text-sm truncate">{p.nama}</div>
              <div class="text-xs text-ink-soft">{formatTanggal(p.createdAt)} · {p.jumlah}x</div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full {labelStatus[p.status]?.kelas ?? 'bg-bg-alt text-ink-soft'}">
                {labelStatus[p.status]?.teks ?? p.status}
              </span>
              <span class="font-display font-semibold text-sm w-24 text-right">
                {formatRupiah(p.totalHarga)}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>