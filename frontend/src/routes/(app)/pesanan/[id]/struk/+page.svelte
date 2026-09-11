<script>
  let { data } = $props();

  const p = data.pesanan;

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const nomorInvoice = `INV-${p.id.slice(0, 8).toUpperCase()}`;
  const subtotal = p.hargaSatuan * p.jumlah;

  function kembali() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/pesanan';
    }
  }
</script>

<svelte:head>
  <title>Struk Pesanan — Nitip</title>
</svelte:head>

<div class="w-full max-w-140 mx-auto px-4 py-8 sm:px-6 sm:py-10">
  <!-- TOMBOL KEMBALI -->
  <button
    type="button"
    onclick={kembali}
    class="flex items-center gap-1.5 text-[13.5px] font-bold text-ink-soft hover:text-ink transition mb-5"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
    Kembali
  </button>

  {#if !p.pembayaranDikonfirmasi}
    <!-- BELUM LUNAS -->
    <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
        <svg class="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      </div>
      <div class="font-bold text-[15px] text-ink">Menunggu konfirmasi pembayaran</div>
      <p class="text-[13.5px] text-ink-soft mt-1.5 max-w-80 mx-auto leading-relaxed">
        Struk akan muncul di sini setelah jastiper menandai pesananmu sebagai lunas.
      </p>
    </div>
  {:else}
    <!-- STRUK -->
    <div class="bg-white rounded-2xl border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] overflow-hidden">
      <!-- HEADER -->
      <div class="px-6 py-6 sm:px-7 sm:py-7 border-b border-dashed border-ink/15 text-center">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 class="font-extrabold text-lg text-ink">Pembayaran Diterima</h1>
        <p class="text-[12.5px] text-ink-soft mt-1">{nomorInvoice}</p>
      </div>

      <!-- DETAIL -->
      <div class="px-6 py-6 sm:px-7 sm:py-7 space-y-2.5 text-[13.5px]">
        <div class="flex justify-between gap-4">
          <span class="text-ink-soft">Tanggal pesan</span>
          <span class="font-medium">{formatTanggal(p.createdAt)}</span>
        </div>
        {#if p.dibayarPada}
          <div class="flex justify-between gap-4">
            <span class="text-ink-soft">Tanggal lunas</span>
            <span class="font-medium">{formatTanggal(p.dibayarPada)}</span>
          </div>
        {/if}
        <div class="flex justify-between gap-4">
          <span class="text-ink-soft">Metode pembayaran</span>
          <span class="font-medium capitalize">{p.metodePembayaran?.replace('_', ' ')}</span>
        </div>
      </div>

      <!-- ITEM -->
      <div class="px-6 sm:px-7 pb-2">
        <div class="border-t border-dashed border-ink/15 pt-4">
          <div class="flex justify-between items-start gap-4 text-[13.5px]">
            <div>
              <div class="font-semibold text-ink">{p.produkNama}</div>
              <div class="text-ink-soft text-xs mt-0.5">{p.jumlah} x {formatRupiah(p.hargaSatuan)}</div>
            </div>
            <div class="font-semibold shrink-0">{formatRupiah(subtotal)}</div>
          </div>
        </div>
      </div>

      <!-- TOTAL -->
      <div class="px-6 py-6 sm:px-7 sm:py-7 border-t border-dashed border-ink/15 space-y-2 text-[13.5px]">
        <div class="flex justify-between gap-4">
          <span class="text-ink-soft">Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-ink-soft">Ongkir</span>
          <span>{formatRupiah(p.ongkir)}</span>
        </div>
        <div class="flex justify-between items-center gap-4 pt-3 mt-1 border-t border-ink/10">
          <span class="font-bold text-ink">Total</span>
          <span class="font-display font-bold text-lg text-primary-dark">{formatRupiah(p.totalHarga)}</span>
        </div>
      </div>
    </div>

    <p class="text-center text-[11.5px] text-ink-soft mt-5">
      Struk ini dibuat otomatis oleh sistem Nitip berdasarkan data pesanan.
    </p>
  {/if}
</div>