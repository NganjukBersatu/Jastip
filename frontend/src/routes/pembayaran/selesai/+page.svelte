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

  /** @param {string} noWa */
  function formatNomorWa(noWa) {
    const bersih = noWa.replace(/\D/g, '');
    return bersih.startsWith('0') ? '62' + bersih.slice(1) : bersih;
  }

  /**
   * @param {{ jastiperId: string, namaJastiper: string, noWa: string | null, total: number, perluWa: boolean }} k
   */
  function buatLinkWa(k) {
    const pesan = `Halo ${k.namaJastiper}, saya baru saja pesan di Nitip (total ${formatRupiah(k.total)}). Saya mau lanjut bayar, ini konfirmasi pesanan saya ya.`;
    return `https://wa.me/${formatNomorWa(k.noWa ?? '')}?text=${encodeURIComponent(pesan)}`;
  }
</script>

<svelte:head>
  <title>Pesanan Berhasil — Nitip.</title>
</svelte:head>

<section class="max-w-140 mx-auto px-5 md:px-8 py-24 text-center">
  <div class="w-16 h-16 mx-auto rounded-full bg-accent/40 flex items-center justify-center text-3xl mb-6">
    ✓
  </div>
  <h1 class="text-2xl md:text-3xl font-bold mb-3">Pesanan berhasil dibuat!</h1>
  <p class="text-ink-soft text-sm max-w-95 mx-auto">
    Terima kasih sudah nitip. Jastiper akan segera memproses pesanan kamu.
  </p>

  {#if data.kelompokJastiper.some((k) => k.perluWa)}
    <div class="mt-10 text-left space-y-3">
      <p class="text-xs font-bold uppercase tracking-wide text-ink-soft text-center mb-4">
        Lanjutkan pembayaran lewat WhatsApp jastiper
      </p>

{#each data.kelompokJastiper.filter((k) => k.perluWa) as k (k.jastiperId)}
  <div class="border border-ink/10 rounded-2xl px-4 py-4 bg-white">
    <div class="flex justify-between items-center mb-3">
      <span class="font-semibold text-sm">{k.namaJastiper}</span>
      <span class="font-display font-bold text-sm">{formatRupiah(k.total)}</span>
    </div>

    {#if k.noWa}
      <a
        href={buatLinkWa(k)}
        target="_blank"
        rel="noopener noreferrer"
        class="block text-center w-full py-3 rounded-full bg-green-600 text-white font-bold text-sm transition hover:-translate-y-0.5"
      >
        Chat via WhatsApp
      </a>
    {:else}
      <p class="text-xs text-red-600 leading-relaxed">
        Jastiper ini belum melengkapi nomor WhatsApp. Hubungi admin Nitip untuk bantuan pembayaran.
      </p>
    {/if}

    <!-- BARU: link struk per pesanan -->
    <div class="mt-3 flex flex-col gap-1.5">
      {#each k.pesananIds as pesananId}
        <a
          href="/pesanan/{pesananId}/struk"
          class="text-center text-[12.5px] text-ink-soft underline underline-offset-2"
        >
          Lihat struk pesanan {k.pesananIds.length > 1 ? `#${k.pesananIds.indexOf(pesananId) + 1}` : ''}
        </a>
      {/each}
    </div>
  </div>
{/each}
 </div>
  {/if}

  <a
    href="/publik/katalog"
    class="inline-block mt-8 px-7 py-3.5 rounded-full bg-ink text-bg font-bold text-sm transition hover:-translate-y-0.5"
  >
    Lanjut belanja
  </a>
</section>