<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';

  /** @type {{ data: import('./$types').PageData, form: any }} */
  let { data, form } = $props();

  /** @typedef {import('./$types').PageData['daftarProduk'][number]} Produk */
  /** @typedef {import('./$types').PageData['daftarJasa'][number]} Jasa */

  const kategoriProduk = ['Semua', 'Makanan', 'Skincare', 'Tiket & Event', 'Fashion', 'Elektronik', 'Barang Langka'];
  const kategoriJasa = ['Semua', 'Jemputan', 'Antar Barang', 'Titip Antre', 'Belanja Kebutuhan', 'Jasa Lainnya'];
  const areaList = ['Semua Area', 'Surabaya', 'Malang', 'Kediri', 'Jember', 'Banyuwangi', 'Madiun'];

  /** @type {'produk' | 'jasa'} */
  let tampilan = $state('produk');
  let kategoriAktif = $state('Semua');
  let areaAktif = $state('Semua Area');
  let keyword = $state('');

  /** @typedef {(Produk & { tipe: 'produk' }) | (Jasa & { tipe: 'jasa', satuan?: string }) | null} ItemDipilih */
  /** @type {ItemDipilih} */
  let itemDipilih = $state(null);

  /** @param {'produk' | 'jasa'} t */
  function gantiTampilan(t) {
    tampilan = t;
    kategoriAktif = 'Semua';
  }

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }

/**
 * @param {Produk | Jasa} item
 * @param {'produk' | 'jasa'} tipe
 */
function bukaDetail(item, tipe) {
  itemDipilih = /** @type {ItemDipilih} */ ({ ...item, tipe });
}

  function tutupDetail() {
    itemDipilih = null;
  }

  function hubungiJastiper() {
    goto('/publik/pesan');
  }

  let kategoriList = $derived(tampilan === 'produk' ? kategoriProduk : kategoriJasa);

  let hasilProduk = $derived(
    data.daftarProduk.filter((p) => {
      const cocokKategori = kategoriAktif === 'Semua' || p.kategori === kategoriAktif;
      const cocokArea = areaAktif === 'Semua Area' || p.area === areaAktif;
      const cocokKeyword = p.nama.toLowerCase().includes(keyword.toLowerCase());
      return cocokKategori && cocokArea && cocokKeyword;
    })
  );

  let hasilJasa = $derived(
    data.daftarJasa.filter((j) => {
      const cocokKategori = kategoriAktif === 'Semua' || j.kategori === kategoriAktif;
      const cocokArea = areaAktif === 'Semua Area' || j.area === areaAktif;
      const cocokKeyword = j.nama.toLowerCase().includes(keyword.toLowerCase());
      return cocokKategori && cocokArea && cocokKeyword;
    })
  );

  let hasilFilter = $derived(tampilan === 'produk' ? hasilProduk : hasilJasa);
</script>

<svelte:head>
  <title>Katalog — Nitip.</title>
</svelte:head>

<svelte:window onkeydown={(e) => itemDipilih && e.key === 'Escape' && tutupDetail()} />

{#if form?.error}
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 shadow-lg">
    {form.error}
  </div>
{/if}

<!-- ===== HEADER KATALOG + PENCARIAN ===== -->
<section class="bg-gradient-to-br from-primary to-primary-dark text-white py-14">
  <div class="max-w-[1180px] mx-auto px-5 md:px-8">
    <h1 class="text-[32px] md:text-[46px] leading-tight">Katalog jastip Jawa Timur</h1>
    <p class="mt-3 text-white/85 max-w-[520px]">
      Temukan barang dan jasa yang kamu butuhkan, dari jastiper terpercaya di kotamu.
    </p>

    <!-- Tab Produk / Jasa -->
    <div class="mt-7 inline-flex bg-white/15 rounded-full p-1.5">
      <button
        onclick={() => gantiTampilan('produk')}
        class="px-6 py-2.5 rounded-full text-sm font-bold transition-colors
               {tampilan === 'produk' ? 'bg-white text-ink' : 'text-white/80 hover:text-white'}"
      >
        📦 Produk
      </button>
      <button
        onclick={() => gantiTampilan('jasa')}
        class="px-6 py-2.5 rounded-full text-sm font-bold transition-colors
               {tampilan === 'jasa' ? 'bg-white text-ink' : 'text-white/80 hover:text-white'}"
      >
        🛵 Jasa
      </button>
    </div>

    <div class="mt-6 flex gap-3 flex-wrap">
      <input
        type="text"
        bind:value={keyword}
        placeholder={tampilan === 'produk' ? 'Cari produk, misal: skincare, tiket...' : 'Cari jasa, misal: jemputan, titip antre...'}
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

<!-- ===== FILTER KATEGORI + GRID ===== -->
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
      Menampilkan {hasilFilter.length} {tampilan === 'produk' ? 'produk' : 'jasa'}
      {#if areaAktif !== 'Semua Area'}di {areaAktif}{/if}
    </p>

    <!-- Grid: auto-fill supaya kartu selalu punya ukuran wajar di semua layar -->
    {#if hasilFilter.length > 0}
      <div class="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
{#each hasilFilter as item}
  <div
    role="button"
    tabindex="0"
    onclick={() => bukaDetail(item, tampilan)}
    onkeydown={(e) => e.key === 'Enter' && bukaDetail(item, tampilan)}
    class="text-left block w-full bg-white rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(42,26,14,0.06)]
           transition-transform hover:-translate-y-1.5 cursor-pointer"
  >
    <div class="aspect-[4/3] relative overflow-hidden">
      <img src={item.gambarUrl} alt={item.nama} class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

      <span class="absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm
                   {item.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}">
        {item.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
      </span>
    </div>

    <div class="px-4 pt-4 pb-4.5">
      <div class="flex justify-between items-center gap-2">
        <span class="text-[11px] font-bold text-primary-dark uppercase tracking-wide truncate">{item.area ?? '-'}</span>
        <span class="text-[11px] text-ink-soft truncate">{item.jastiperNama}</span>
      </div>
      <div class="font-bold text-[15px] mt-1.5 line-clamp-2 min-h-[2.5em]">{item.nama}</div>

      <div class="flex justify-between items-center mt-3 gap-2">
        <div class="font-display font-semibold text-base">
          {formatRupiah(item.harga)}
          {#if item.hargaTipe === 'nego'}
            <span class="text-[11px] font-semibold text-ink-soft font-sans block">mulai dari</span>
          {:else if tampilan === 'jasa' && 'satuan' in item && item.satuan}
            <span class="text-[11px] font-semibold text-ink-soft font-sans block">{item.satuan}</span>
          {/if}
        </div>

        {#if tampilan === 'jasa'}
          <a
            href={`/pelanggan/pesan-jasa/${item.id}`}
            onclick={(e) => e.stopPropagation()}
            class="rounded-full bg-ink text-bg font-bold text-xs px-3.5 py-2 whitespace-nowrap
                   hover:bg-primary-dark transition-colors"
          >
            Pesan →
          </a>
        {:else if item.hargaTipe === 'nego'}
          <form method="POST" action="?/chatJastiper" use:enhance>
            <input type="hidden" name="produkId" value={item.id} />
            <button
              type="submit"
              onclick={(e) => e.stopPropagation()}
              class="rounded-full bg-ink text-bg font-bold text-xs px-3.5 py-2 whitespace-nowrap
                     hover:bg-primary-dark transition-colors"
            >
              💬 Chat
            </button>
          </form>
        {:else}
          <div class="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center text-base font-bold shrink-0">
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
        <p class="text-lg font-semibold">{tampilan === 'produk' ? 'Produk' : 'Jasa'} tidak ditemukan</p>
        <p class="text-ink-soft text-sm mt-1">Coba ganti kata kunci, kategori, atau area pencarian.</p>
      </div>
    {/if}
  </div>
</section>

<!-- ===== MODAL DETAIL ===== -->
{#if itemDipilih}
  {@const item = itemDipilih}
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
      aria-label={item.nama}
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="aspect-[16/10] relative overflow-hidden">
        <img src={item.gambarUrl} alt={item.nama} class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

        <span class="absolute top-3.5 left-3.5 text-[11.5px] font-extrabold px-3 py-1.5 rounded-full shadow-sm
                     {item.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}">
          {item.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
        </span>

        <button
          onclick={tutupDetail}
          aria-label="Tutup"
          class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 text-ink flex items-center justify-center font-bold shadow-sm hover:bg-white"
        >
          ✕
        </button>
      </div>

      <div class="px-6 pt-5 pb-6">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-primary-dark uppercase tracking-wide">{item.area ?? '-'}</span>
          <span class="text-xs text-ink-soft">Jastiper {item.jastiperNama}</span>
        </div>

        <h2 class="font-bold text-xl mt-1.5">{item.nama}</h2>

        <div class="font-display font-semibold text-2xl mt-2">
          {formatRupiah(item.harga)}
          {#if item.hargaTipe === 'nego'}
            <span class="text-sm font-semibold text-ink-soft font-sans">mulai dari</span>
          {:else if item.tipe === 'jasa' && 'satuan' in item && item.satuan}
            <span class="text-sm font-semibold text-ink-soft font-sans">{item.satuan}</span>
          {/if}
        </div>
        <p class="text-xs font-semibold mt-1 {item.hargaTipe === 'nego' ? 'text-primary-dark' : 'text-ink-soft'}">
          {item.hargaTipe === 'nego' ? 'Harga bisa dinego' : 'Harga pas, tanpa nego'}
        </p>

        <p class="text-sm text-ink-soft mt-4 leading-relaxed">
          {item.deskripsi ?? `Detail lengkap ${item.tipe === 'produk' ? 'produk' : 'jasa'} ini dari jastiper ${item.jastiperNama}.`}
        </p>

        <div class="mt-6">
          {#if item.tipe === 'jasa'}
            <a
              href={`/pelanggan/pesan-jasa/${item.id}`}
              class="block text-center w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
            >
              Pesan Jasa
            </a>
          {:else if item.hargaTipe === 'nego'}
            <button
              onclick={hubungiJastiper}
              class="w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
            >
              Hubungi Jastiper
            </button>
          {:else}
            <form method="POST" action="?/tambahKeranjang" use:enhance>
              <input type="hidden" name="produkId" value={item.id} />
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

<!-- footer sama seperti sebelumnya, tidak perlu diubah -->