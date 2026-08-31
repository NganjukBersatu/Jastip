<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();

  /** @typedef {import('./$types').PageData['daftarProduk'][number]} Produk */

  const kategoriList = ['Semua', 'Makanan', 'Skincare', 'Tiket & Event', 'Fashion', 'Elektronik', 'Barang Langka'];
  const areaList = ['Semua Area', 'Surabaya', 'Malang', 'Kediri', 'Jember', 'Banyuwangi', 'Madiun'];

  let kategoriAktif = $state('Semua');
  let areaAktif = $state('Semua Area');
  let keyword = $state('');
  /** @type {Produk | null} */
  let produkDipilih = $state(null);

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }

  /** @param {Produk} p */
  function bukaDetail(p) {
    produkDipilih = p;
  }

  function tutupDetail() {
    produkDipilih = null;
  }

  function hubungiJastiper() {
    goto('/publik/pesan');
  }

  let hasilFilter = $derived(
    data.daftarProduk.filter((p) => {
      const cocokKategori = kategoriAktif === 'Semua' || p.kategori === kategoriAktif;
      const cocokArea = areaAktif === 'Semua Area' || p.area === areaAktif;
      const cocokKeyword = p.nama.toLowerCase().includes(keyword.toLowerCase());
      return cocokKategori && cocokArea && cocokKeyword;
    })
  );
</script>

<svelte:head>
  <title>Katalog — Nitip.</title>
</svelte:head>

<svelte:window onkeydown={(e) => produkDipilih && e.key === 'Escape' && tutupDetail()} />

<!-- ===== HEADER KATALOG + PENCARIAN ===== -->
<section class="bg-gradient-to-br from-primary to-primary-dark text-white py-14">
  <div class="max-w-[1180px] mx-auto px-5 md:px-8">
    <h1 class="text-[32px] md:text-[46px] leading-tight">Katalog jastip Jawa Timur</h1>
    <p class="mt-3 text-white/85 max-w-[520px]">
      Temukan barang yang kamu mau, dari jastiper terpercaya di kotamu.
    </p>

    <div class="mt-6 flex gap-3 flex-wrap">
      <input
        type="text"
        bind:value={keyword}
        placeholder="Cari produk, misal: skincare, tiket, lumpia..."
        class="flex-1 min-w-[240px] rounded-full px-5 py-3 bg-white text-ink text-[15px] outline-none
               focus:ring-2 focus:ring-accent"
      />
      <select
        bind:value={areaAktif}
        class="rounded-full px-5 py-3 bg-white text-ink text-[15px] font-semibold outline-none focus:ring-2 focus:ring-accent"
      >
        {#each areaList as area}
          <option value={area}>{area}</option>
        {/each}
      </select>
    </div>
  </div>
</section>

<!-- ===== FILTER KATEGORI + GRID PRODUK ===== -->
<section class="py-14">
  <div class="max-w-[1180px] mx-auto px-5 md:px-8">
    <!-- Filter kategori (chips) -->
    <div class="flex gap-2.5 flex-wrap mb-10 pt-1">
      {#each kategoriList as kategori}
        <button
          onclick={() => (kategoriAktif = kategori)}
          class="px-4 py-2 rounded-full text-sm font-bold transition-colors
                 {kategoriAktif === kategori
            ? 'bg-ink text-bg'
            : 'bg-bg-alt text-ink-soft hover:bg-accent/40'}"
        >
          {kategori}
        </button>
      {/each}
    </div>

    <!-- Info jumlah hasil -->
    <p class="text-ink-soft text-sm mb-6">
      Menampilkan {hasilFilter.length} produk
      {#if areaAktif !== 'Semua Area'}di {areaAktif}{/if}
    </p>

    <!-- Grid produk -->
    {#if hasilFilter.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {#each hasilFilter as p}
          <div
            role="button"
            tabindex="0"
            onclick={() => bukaDetail(p)}
            onkeydown={(e) => e.key === 'Enter' && bukaDetail(p)}
            class="text-left block w-full bg-white rounded-[26px] overflow-hidden shadow-[0_10px_30px_rgba(42,26,14,0.06)]
                   transition-transform hover:-translate-y-1.5 cursor-pointer"
          >
            <div class="h-[180px] relative overflow-hidden">
              <img src={p.gambarUrl} alt={p.nama} class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

              <span class="absolute top-3.5 left-3.5 text-[11.5px] font-extrabold px-3 py-1.5 rounded-full shadow-sm
                           {p.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}">
                {p.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
              </span>
            </div>

            <div class="px-5 pt-5 pb-5.5">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-primary-dark uppercase tracking-wide">{p.area ?? '-'}</span>
                <span class="text-xs text-ink-soft">Jastiper {p.jastiperNama}</span>
              </div>
              <div class="font-bold text-[17px] mt-1.5 line-clamp-2">{p.nama}</div>

              <div class="flex justify-between items-center mt-4 gap-3">
                <div class="font-display font-semibold text-lg">
                  {formatRupiah(p.harga)}
                  {#if p.hargaTipe === 'nego'}
                    <span class="text-xs font-semibold text-ink-soft font-sans">mulai dari</span>
                  {/if}
                </div>

                {#if p.hargaTipe === 'nego'}
                  <form method="POST" action="?/chatJastiper">
                    <input type="hidden" name="produkId" value={p.id} />
                    <button
                      type="submit"
                      onclick={(e) => e.stopPropagation()}
                      class="rounded-full bg-ink text-bg font-bold text-[13px] px-4 py-2 whitespace-nowrap
                             hover:bg-primary-dark transition-colors"
                    >
                      💬 Chat jastiper
                    </button>
                  </form>
                {:else}
                  <div class="w-[38px] h-[38px] rounded-full bg-ink text-white flex items-center justify-center text-base font-bold shrink-0">
                    →
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-20 bg-bg-alt rounded-[26px]">
        <p class="text-lg font-semibold">Produk tidak ditemukan</p>
        <p class="text-ink-soft text-sm mt-1">Coba ganti kata kunci, kategori, atau area pencarian.</p>
      </div>
    {/if}
  </div>
</section>

<!-- ===== MODAL DETAIL PRODUK ===== -->
{#if produkDipilih}
  {@const p = produkDipilih}
  <div
    class="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4"
    role="presentation"
    onclick={tutupDetail}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="bg-white w-full max-w-[440px] rounded-[26px] overflow-hidden shadow-[0_20px_60px_rgba(42,26,14,0.25)]"
      role="dialog"
      aria-modal="true"
      aria-label={p.nama}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Gambar/hero -->
      <div class="h-[220px] relative overflow-hidden">
        <img src={p.gambarUrl} alt={p.nama} class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

        <span class="absolute top-3.5 left-3.5 text-[11.5px] font-extrabold px-3 py-1.5 rounded-full shadow-sm
                     {p.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}">
          {p.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
        </span>

        <button
          onclick={tutupDetail}
          aria-label="Tutup"
          class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 text-ink flex items-center justify-center font-bold shadow-sm hover:bg-white"
        >
          ✕
        </button>
      </div>

      <!-- Detail -->
      <div class="px-6 pt-5 pb-6">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-primary-dark uppercase tracking-wide">{p.area ?? '-'}</span>
          <span class="text-xs text-ink-soft">Jastiper {p.jastiperNama}</span>
        </div>

        <h2 class="font-bold text-xl mt-1.5">{p.nama}</h2>

        <div class="font-display font-semibold text-2xl mt-2">
          {formatRupiah(p.harga)}
          {#if p.hargaTipe === 'nego'}
            <span class="text-sm font-semibold text-ink-soft font-sans">mulai dari</span>
          {/if}
        </div>
        <p class="text-xs font-semibold mt-1 {p.hargaTipe === 'nego' ? 'text-primary-dark' : 'text-ink-soft'}">
          {p.hargaTipe === 'nego' ? 'Harga bisa dinego' : 'Harga pas, tanpa nego'}
        </p>

        <p class="text-sm text-ink-soft mt-4 leading-relaxed">
          {p.deskripsi ?? `Detail lengkap produk atau layanan ini dari jastiper ${p.jastiperNama}.`}
        </p>

        <!-- Tombol aksi: beda tergantung tipe harga -->
        <div class="mt-6">
          {#if p.hargaTipe === 'nego'}
            <button
              onclick={hubungiJastiper}
              class="w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
            >
              Hubungi Jastiper
            </button>
          {:else}
            <form method="POST" action="?/tambahKeranjang" use:enhance>
              <input type="hidden" name="produkId" value={p.id} />
              <button
                type="submit"
                class="w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
              >
                Beli
              </button>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- ===== FOOTER ===== -->
<footer class="py-16 pb-10 border-t border-ink/10">
  <div class="max-w-[1180px] mx-auto px-5 md:px-8">
    <div class="flex justify-between items-start pb-12 border-b border-ink/10 flex-wrap gap-8">
      <div>
        <div class="font-display font-black text-2xl text-primary-dark">
          Nitip<span class="text-ink">.</span>
        </div>
        <p class="mt-3.5 max-w-[260px] text-sm text-ink-soft">
          Platform jasa titip untuk area Jawa Timur.
        </p>
      </div>

      <div class="flex gap-16 flex-wrap">
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wide mb-4 text-ink-soft">Produk</h4>
          <a href="/katalog" class="block text-sm mb-2.5 opacity-85">Katalog</a>
          <a href="/#jastiper" class="block text-sm mb-2.5 opacity-85">Jadi jastiper</a>
          <a href="/#cara-kerja" class="block text-sm mb-2.5 opacity-85">Cara kerja</a>
        </div>
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wide mb-4 text-ink-soft">Bantuan</h4>
          <a href="/bantuan" class="block text-sm mb-2.5 opacity-85">Pusat bantuan</a>
          <a href="/kontak" class="block text-sm mb-2.5 opacity-85">Hubungi kami</a>
        </div>
      </div>
    </div>

    <div class="flex justify-between pt-7 text-[13px] text-ink-soft flex-wrap gap-3">
      <span>© 2026 Nitip. Semua hak dilindungi.</span>
      <span>Dibuat untuk jastiper Jawa Timur</span>
    </div>
  </div>
</footer>