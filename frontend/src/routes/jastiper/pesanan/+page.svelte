<script>
  import { enhance } from '$app/forms';
  import { JASA_AKTIF } from '$lib/config';

  let { data, form } = $props();

  /** @type {string | null} */
  let pesananTerbuka = $state(null);

  /** @type {Record<string, string[]>} */
  let selectedByWilayah = $state({});

  let riwayatTerbuka = $state(false);

  /** @type {'produk' | 'jasa'} */
  let tab = $state('produk');

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

  /**
   * @param {string} status
   * @param {boolean} [isJasa]
   */
  function labelStatus(status, isJasa = false) {
    /** @type {Record<string, { teks: string, kelas: string }>} */
    const petaProduk = {
      menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-yellow-100 text-yellow-700' },
      dibelanjakan: { teks: 'Sedang dibelanjakan', kelas: 'bg-blue-100 text-blue-700' },
      dikirim: { teks: 'Sedang dikirim', kelas: 'bg-purple-100 text-purple-700' },
      selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-700' },
      dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-700' }
    };

    /** @type {Record<string, { teks: string, kelas: string }>} */
    const petaJasa = {
      menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-yellow-100 text-yellow-700' },
      dibelanjakan: { teks: 'Menuju titik jemput', kelas: 'bg-blue-100 text-blue-700' },
      dikirim: { teks: 'Sedang mengantar', kelas: 'bg-purple-100 text-purple-700' },
      selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-700' },
      dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-700' }
    };

    const peta = isJasa ? petaJasa : petaProduk;
    return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
  }

  /** @param {string} id */
  function togglePesanan(id) {
    pesananTerbuka = pesananTerbuka === id ? null : id;
  }

  /** @param {string} status */
  function bisaDipilih(status) {
    return status === 'menunggu_konfirmasi' || status === 'dibelanjakan' || status === 'dikirim';
  }

  /**
   * @param {string} wilayah
   * @param {string} id
   */
  function toggleSelect(wilayah, id) {
    const current = selectedByWilayah[wilayah] ?? [];
    if (current.includes(id)) {
      selectedByWilayah[wilayah] = current.filter((x) => x !== id);
    } else {
      selectedByWilayah[wilayah] = [...current, id];
    }
  }

  /**
   * @param {string} wilayah
   * @param {string[]} allIds
   */
  function toggleSelectAll(wilayah, allIds) {
    const current = selectedByWilayah[wilayah] ?? [];
    if (current.length === allIds.length) {
      selectedByWilayah[wilayah] = [];
    } else {
      selectedByWilayah[wilayah] = [...allIds];
    }
  }

  /** @param {string} wilayah */
  function getSelected(wilayah) {
    return selectedByWilayah[wilayah] ?? [];
  }

  /**
   * @param {{ id: string, status: string }[]} daftar
   * @param {string[]} selected
   * @param {'belanja' | 'antar' | 'selesai'} aksi
   */
  function hitungValid(daftar, selected, aksi) {
    return daftar.filter((p) => {
      if (!selected.includes(p.id)) return false;
      if (aksi === 'belanja') return p.status === 'menunggu_konfirmasi';
      if (aksi === 'antar') return p.status === 'dibelanjakan' || p.status === 'menunggu_konfirmasi';
      return p.status === 'menunggu_konfirmasi' || p.status === 'dibelanjakan' || p.status === 'dikirim';
    }).length;
  }

  /**
   * @param {SubmitEvent} e
   * @param {string} aksi
   * @param {number} jumlah
   */
  function confirmMassal(e, aksi, jumlah) {
    const ok = confirm(`Yakin ingin ${aksi} ${jumlah} pesanan sekaligus?`);
    if (!ok) {
      e.preventDefault();
    }
  }

  /** @param {string} wilayah */
  function enhanceMassal(wilayah) {
    return () => {
      return async (/** @type {any} */ { result, update }) => {
        await update();
        if (result.type === 'success') selectedByWilayah[wilayah] = [];
      };
    };
  }

  let kelompokSatuJalurTampil = $derived(tab === 'produk' ? data.kelompokSatuJalur : []);
  let pesananAktifTampil = $derived(
    data.pesananAktif.filter((p) => (tab === 'produk' ? !p.isJasa : p.isJasa))
  );
  let riwayatTampil = $derived(
    data.riwayat.filter((p) => (tab === 'produk' ? !p.isJasa : p.isJasa))
  );
</script>

<svelte:head>
  <title>Pesanan — Nitip</title>
</svelte:head>

<div class="w-full max-w-285 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <div class="mb-6 sm:mb-7 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Pesanan</h1>
    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
      Pesanan yang masuk, perlu diantar ke mana, dan riwayatnya.
    </p>
  </div>

  <div class="flex gap-3 mb-8 sm:mb-10">
    <button
      type="button"
      onclick={() => (tab = 'produk')}
      class="px-6 py-3 rounded-full text-sm font-bold transition-colors flex items-center gap-2
      {tab === 'produk' ? 'bg-primary text-white shadow-md' : 'bg-white text-ink-soft border border-ink/10 hover:bg-bg-alt'}"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
      Produk
    </button>

{#if JASA_AKTIF}
<button
  type="button"
  onclick={() => (tab = 'jasa')}
  class="px-6 py-3 rounded-full text-sm font-bold transition-colors flex items-center gap-2
  {tab === 'jasa' ? 'bg-primary text-white shadow-md' : 'bg-white text-ink-soft border border-ink/10 hover:bg-bg-alt'}"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
    <path d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4z" />
  </svg>
  Jasa
</button>
{/if}
  </div>

  {#if form?.error}
    <div class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-red-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold">!</span>
      <span>{form.error}</span>
    </div>
  {:else if form?.pesan}
    <div class="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-green-700">
      <svg class="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{form.pesan}</span>
    </div>
  {/if}

  <!-- BISA DIBELI & DIANTAR BARENG -->
  {#if kelompokSatuJalurTampil.length > 0}
    <section class="mb-10">
      <div class="mb-3.5 flex items-start gap-2.5">
        <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
            <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
            <circle cx="7" cy="18" r="2" />
            <path d="M15 18H9" />
            <circle cx="17" cy="18" r="2" />
          </svg>
        </div>
        <div>
          <h2 class="font-bold text-[15px] text-ink">Bisa dibeli & diantar bareng</h2>
          <p class="text-[13px] text-ink-soft mt-0.5 leading-relaxed">
            Centang pesanan yang sudah siap, lalu proses bareng dalam 1 wilayah.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        {#each kelompokSatuJalurTampil as kelompok (kelompok.wilayah)}
          {@const selected = getSelected(kelompok.wilayah)}
          {@const idsBisaDipilih = kelompok.daftar.filter((p) => bisaDipilih(p.status)).map((p) => p.id)}
          {@const selectedCount = selected.length}
          {@const validBelanja = hitungValid(kelompok.daftar, selected, 'belanja')}
          {@const validAntar = hitungValid(kelompok.daftar, selected, 'antar')}
          {@const validSelesai = hitungValid(kelompok.daftar, selected, 'selesai')}
          {@const totalTerpilih = kelompok.daftar.filter((p) => selected.includes(p.id)).reduce((t, p) => t + p.totalHarga, 0)}

          <div class="bg-orange-50/80 border border-orange-200/70 rounded-2xl overflow-hidden">
            <div class="px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-200/50">
              <div class="font-bold text-[13.5px] capitalize flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                {kelompok.wilayah}
                <span class="font-normal text-ink-soft">· {kelompok.daftar.length} pesanan</span>
              </div>

              <button
                type="button"
                class="text-[12px] font-semibold text-ink-soft hover:text-ink transition disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={idsBisaDipilih.length === 0}
                onclick={() => toggleSelectAll(kelompok.wilayah, idsBisaDipilih)}
              >
                {selectedCount === idsBisaDipilih.length && idsBisaDipilih.length > 0 ? 'Batal pilih semua' : 'Pilih semua'}
              </button>
            </div>

            <div class="divide-y divide-orange-100">
              {#each kelompok.daftar as p (p.id)}
                {@const st = labelStatus(p.status)}
                {@const isChecked = selected.includes(p.id)}
                {@const aktifDipilih = bisaDipilih(p.status)}

                <label
                  class="flex items-start gap-3 px-4 py-3.5 sm:px-5 transition {aktifDipilih
                    ? 'cursor-pointer hover:bg-orange-50/60'
                    : 'opacity-55 cursor-not-allowed'}"
                >
                  <input
                    type="checkbox"
                    class="mt-1 accent-orange-500 disabled:cursor-not-allowed"
                    checked={isChecked}
                    disabled={!aktifDipilih}
                    onchange={() => toggleSelect(kelompok.wilayah, p.id)}
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div class="font-semibold text-[13.5px] text-ink">
                        {p.namaItem}
                        <span class="font-normal text-ink-soft">— {p.pelangganNama}</span>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[10.5px] font-bold px-2 py-0.5 rounded-full {st.kelas}">
                          {st.teks}
                        </span>
                        <span class="font-bold text-[13px]">{formatRupiah(p.totalHarga)}</span>
                      </div>
                    </div>
                    <div class="text-[12px] text-ink-soft mt-0.5">
                      {p.jumlah} pcs · {formatTanggal(p.createdAt)}
                    </div>
                  </div>
                </label>
              {/each}
            </div>

            {#if selectedCount > 0}
              <div class="px-4 py-3 sm:px-5 bg-orange-100/60 border-t border-orange-200/50 flex flex-col gap-2.5">
                <div class="flex items-center justify-between text-[12px] font-semibold text-ink-soft">
                  <span>{selectedCount} dipilih</span>
                  <span>Total {formatRupiah(totalTerpilih)}</span>
                </div>

                <div class="flex flex-col sm:flex-row gap-2.5">
                  <form
                    method="POST"
                    action="?/mulaiBelanjaMassal"
                    use:enhance={enhanceMassal(kelompok.wilayah)}
                    class="flex-1"
                    onsubmit={(e) => confirmMassal(e, 'mulai belanja', validBelanja)}
                  >
                    {#each selected as id}
                      <input type="hidden" name="ids" value={id} />
                    {/each}
                    <button
                      type="submit"
                      disabled={validBelanja === 0}
                      class="w-full min-h-10 rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      Mulai belanja ({validBelanja})
                    </button>
                  </form>

                  <form
                    method="POST"
                    action="?/mulaiAntarMassal"
                    use:enhance={enhanceMassal(kelompok.wilayah)}
                    class="flex-1"
                    onsubmit={(e) => confirmMassal(e, 'mulai antar', validAntar)}
                  >
                    {#each selected as id}
                      <input type="hidden" name="ids" value={id} />
                    {/each}
                    <button
                      type="submit"
                      disabled={validAntar === 0}
                      class="w-full min-h-10 rounded-xl border-2 border-ink/20 text-ink font-bold text-[13px] px-4 py-2.5 hover:border-ink/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mulai antar ({validAntar})
                    </button>
                  </form>

                  <form
                    method="POST"
                    action="?/selesaikanMassal"
                    use:enhance={enhanceMassal(kelompok.wilayah)}
                    class="flex-1"
                    onsubmit={(e) => confirmMassal(e, 'tandai selesai', validSelesai)}
                  >
                    {#each selected as id}
                      <input type="hidden" name="ids" value={id} />
                    {/each}
                    <button
                      type="submit"
                      disabled={validSelesai === 0}
                      class="w-full min-h-10 rounded-xl border-2 border-primary/30 text-primary-dark font-bold text-[13px] px-4 py-2.5 hover:border-primary/60 hover:bg-primary/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Tandai selesai ({validSelesai})
                    </button>
                  </form>
                </div>

                {#if validBelanja !== selectedCount || validAntar !== selectedCount || validSelesai !== selectedCount}
                  <p class="text-[11.5px] text-ink-soft leading-relaxed">
                    Angka di tiap tombol adalah jumlah pesanan yang statusnya cocok untuk aksi itu.
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- PESANAN AKTIF -->
  <section>
    <div class="mb-3.5 flex items-center gap-2">
      <h2 class="font-bold text-[15px] text-ink">Pesanan aktif</h2>
      {#if pesananAktifTampil.length > 0}
        <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
          {pesananAktifTampil.length}
        </span>
      {/if}
    </div>
    <p class="text-xs text-ink-soft -mt-3 mb-4">
      {#if kelompokSatuJalurTampil.length > 0}
        Pesanan lain yang perlu diproses satu per satu
      {:else}
        Pesanan yang masih perlu diproses
      {/if}
    </p>

    {#if pesananAktifTampil.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <svg class="w-7 h-7 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8.5V16a2 2 0 0 1-1.05 1.76l-6.5 3.5a2 2 0 0 1-1.9 0l-6.5-3.5A2 2 0 0 1 4 16V8.5" />
            <path d="M21 8.5 12 4 3 8.5 12 13l9-4.5Z" />
            <path d="M8.25 6.25 15.75 10.5" />
            <path d="M12 13v8" />
          </svg>
        </div>
        <div class="font-bold text-[15px] text-ink">
          {kelompokSatuJalurTampil.length > 0 ? 'Semua pesanan aktif sudah dikelompokkan' : `Belum ada pesanan ${tab} aktif`}
        </div>
        <div class="text-[13.5px] text-ink-soft mt-1.5 max-w-70 mx-auto leading-relaxed">
          {kelompokSatuJalurTampil.length > 0
            ? 'Proses lewat grup wilayah di atas.'
            : `Pesanan ${tab} baru dari pelanggan bakal langsung muncul di sini.`}
        </div>
      </div>
    {:else}
      <div class="flex flex-col gap-3 sm:gap-4">
        {#each pesananAktifTampil as p (p.id)}
          {@const st = labelStatus(p.status, p.isJasa)}

          <div class="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition hover:shadow-md hover:border-ink/15">
            <button type="button" class="w-full text-left p-4 sm:p-5" onclick={() => togglePesanan(p.id)}>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-bold text-sm text-ink truncate">{p.namaItem}</div>
                  <div class="text-[12.5px] text-ink-soft mt-1 leading-relaxed">
                    untuk <span class="font-semibold text-ink">{p.pelangganNama}</span> · {formatTanggal(p.createdAt)}
                  </div>
                </div>
                <span class="text-[10.5px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full {st.kelas} shrink-0">
                  {st.teks}
                </span>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3 sm:hidden">
                <div>
                  <div class="text-[11px] text-ink-soft">Total pesanan</div>
                  <div class="text-sm font-extrabold text-primary-dark mt-0.5">{formatRupiah(p.totalHarga)}</div>
                </div>
                <span class="flex items-center gap-1 text-[11px] font-bold text-ink-soft">
                  {pesananTerbuka === p.id ? 'Tutup' : 'Detail'}
                  <svg class="w-4 h-4 transition-transform {pesananTerbuka === p.id ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </button>

            <div class:hidden={pesananTerbuka !== p.id} class="px-4 pb-4 sm:block sm:px-5 sm:pb-5">
              <div class="border-t border-ink/10 pt-4">
                <!-- BARU: daftar item, atau info rute kalau jasa -->
                <div class="bg-bg rounded-xl px-4 py-3.5 text-[13px] flex flex-col gap-2.5">
                  {#if p.isJasa}
                    <div class="flex items-start justify-between gap-4">
                      <span class="text-ink-soft shrink-0">Titik jemput</span>
                      <span class="font-medium text-right max-w-[70%] wrap-break-word">{p.items[0]?.titikJemput ?? '—'}</span>
                    </div>
                    <div class="flex items-start justify-between gap-4">
                      <span class="text-ink-soft shrink-0">Titik tujuan</span>
                      <span class="font-medium text-right max-w-[70%] wrap-break-word">{p.alamatKirim ?? '—'}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-ink-soft">Jarak</span>
                      <span>{p.items[0]?.jarakKm ?? 0} km</span>
                    </div>
                  {:else}
                    {#each p.items as it (it.id)}
                      <div class="flex justify-between gap-4">
                        <span class="text-ink-soft">{it.nama} × {it.jumlah}</span>
                        <span>{formatRupiah(it.hargaSatuan * it.jumlah)}</span>
                      </div>
                    {/each}
                    <div class="flex items-start justify-between gap-4 pt-2 border-t border-ink/10">
                      <span class="text-ink-soft shrink-0">Antar ke</span>
                      <span class="font-medium text-right max-w-[70%] wrap-break-word">{p.alamatKirim ?? '—'}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-ink-soft">Ongkir</span>
                      <span>{formatRupiah(p.ongkir)}</span>
                    </div>
                  {/if}
                  <div class="flex justify-between gap-4 font-bold pt-2 border-t border-ink/10">
                    <span>Total</span>
                    <span class="text-primary-dark">{formatRupiah(p.totalHarga)}</span>
                  </div>
                </div>

                {#if (p.metodePembayaran === 'transfer_bank' || p.metodePembayaran === 'e_wallet') && !p.pembayaranDikonfirmasi}
                  <form method="POST" action="?/tandaiLunas" use:enhance class="mb-2.5 mt-4">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" class="w-full min-h-11 rounded-xl bg-green-600 text-white font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
                      Tandai pembayaran lunas
                    </button>
                  </form>
                {:else if p.pembayaranDikonfirmasi}
                  <span class="inline-flex items-center gap-1.5 mb-2.5 mt-4 text-[11.5px] font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Pembayaran diterima
                  </span>
                {/if}

                <div class="flex flex-col sm:flex-row gap-2.5 mt-4">
                  {#if p.status === 'menunggu_konfirmasi'}
                    <form method="POST" action="?/mulaiBelanja" use:enhance class="flex-1">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" class="w-full min-h-11 rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
                        {p.isJasa ? 'Mulai proses' : 'Mulai belanja'}
                      </button>
                    </form>
                    <form method="POST" action="?/batalkan" use:enhance class="flex-1">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" class="w-full min-h-11 rounded-xl border-2 border-ink/15 text-ink-soft font-bold text-[13px] px-4 py-2.5 hover:border-red-300 hover:text-red-500 transition">
                        Batalkan
                      </button>
                    </form>
                  {:else if p.status === 'dibelanjakan'}
                    <form method="POST" action="?/mulaiAntar" use:enhance class="flex-1">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" class="w-full min-h-11 rounded-xl bg-ink text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
                        Mulai antar
                      </button>
                    </form>
                  {:else if p.status === 'dikirim'}
                    <form method="POST" action="?/selesaikan" use:enhance class="flex-1">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" class="w-full min-h-11 rounded-xl bg-primary text-bg font-bold text-[13px] px-4 py-2.5 hover:-translate-y-0.5 hover:shadow-md transition">
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
  {#if riwayatTampil.length > 0}
    <section class="mt-10 sm:mt-12">
      <button
        type="button"
        class="w-full flex items-center justify-between gap-3 mb-3.5 text-left"
        onclick={() => (riwayatTerbuka = !riwayatTerbuka)}
      >
        <div>
          <h2 class="font-bold text-[15px] text-ink flex items-center gap-2">
            Riwayat
            <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
              {riwayatTampil.length}
            </span>
          </h2>
          <p class="text-xs text-ink-soft mt-0.5">Pesanan yang sudah selesai atau dibatalkan</p>
        </div>
        <svg
          class="w-5 h-5 text-ink-soft shrink-0 transition-transform {riwayatTerbuka ? 'rotate-180' : ''}"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {#if riwayatTerbuka}
      <div class="flex flex-col gap-2">
        {#each riwayatTampil as p (p.id)}
          {@const st = labelStatus(p.status, p.isJasa)}
          <div class="bg-white rounded-xl border border-ink/10 px-4 py-3.5 flex items-center justify-between gap-4 transition hover:border-ink/15">
            <div class="min-w-0">
              <div class="font-semibold text-[13.5px] truncate">{p.namaItem}</div>
              <div class="text-[12px] text-ink-soft mt-0.5 truncate">
                {p.pelangganNama} · {formatTanggal(p.createdAt)}
              </div>
            </div>
            <div class="text-right shrink-0">
              <div class="font-semibold text-[13px]">{formatRupiah(p.totalHarga)}</div>
              <span class="inline-block mt-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full {st.kelas}">
                {st.teks}
              </span>
            </div>
          </div>
        {/each}
      </div>
      {/if}
    </section>
  {/if}
</div>