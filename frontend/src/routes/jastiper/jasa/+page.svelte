<script>
  import { enhance } from '$app/forms';

  /** @type {{ data: import('./$types').PageData, form: any }} */
  let { data, form } = $props();

  const kategoriList = ['Jemputan', 'Antar Barang', 'Titip Antre', 'Belanja Kebutuhan', 'Jasa Lainnya'];

  let hargaTipe = $state('tetap');
  let modeGambar = $state('url'); // 'url' | 'upload'
  let formVisible = $state(false);

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }
</script>

<svelte:head>
  <title>Kelola Jasa — Nitip.</title>
</svelte:head>

<section class="max-w-[1180px] mx-auto px-5 md:px-8 py-12">
  <div class="flex justify-between items-center mb-8 flex-wrap gap-3">
    <div>
      <h1 class="text-2xl font-bold font-display">Jasa saya</h1>
      <p class="text-ink-soft text-sm mt-1">Kelola layanan jasa yang kamu tawarkan, seperti jemputan atau titip antre.</p>
    </div>
    <button
      onclick={() => (formVisible = !formVisible)}
      class="rounded-full bg-ink text-bg font-bold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
    >
      {formVisible ? 'Tutup form' : '+ Tambah jasa'}
    </button>
  </div>

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 mb-6">
      {form.error}
    </div>
  {/if}

  {#if form?.success}
    <div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-3 mb-6">
      Berhasil disimpan.
    </div>
  {/if}

  <!-- ===== FORM TAMBAH JASA ===== -->
  {#if formVisible}
    <form
      method="POST"
      action="?/tambah"
      enctype="multipart/form-data"
      use:enhance={() => {
        return async ({ update }) => {
          await update();
        };
      }}
      class="bg-white rounded-[22px] shadow-[0_10px_30px_rgba(42,26,14,0.06)] p-6 mb-10 space-y-5 max-w-[600px]"
    >
      <div>
        <label for="nama" class="block text-sm font-bold mb-1.5">Nama jasa</label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          placeholder="Misal: Jemput di stasiun Madiun"
          class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label for="deskripsi" class="block text-sm font-bold mb-1.5">Deskripsi (opsional)</label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows="3"
          placeholder="Jelaskan detail jasa yang kamu tawarkan..."
          class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent resize-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label for="kategori" class="block text-sm font-bold mb-1.5">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            required
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
          >
            {#each kategoriList as kategori}
              <option value={kategori}>{kategori}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="satuan" class="block text-sm font-bold mb-1.5">Satuan (opsional)</label>
          <input
            id="satuan"
            name="satuan"
            type="text"
            placeholder="Misal: per trip, per jam"
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label for="hargaTipe" class="block text-sm font-bold mb-1.5">Tipe harga</label>
          <select
            id="hargaTipe"
            name="hargaTipe"
            bind:value={hargaTipe}
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="tetap">Harga tetap</option>
            <option value="nego">Bisa nego</option>
          </select>
        </div>

        <div>
          <label for="harga" class="block text-sm font-bold mb-1.5">
            {hargaTipe === 'nego' ? 'Harga mulai dari (Rp)' : 'Harga (Rp)'}
          </label>
          <input
            id="harga"
            name="harga"
            type="number"
            min="1"
            required
            placeholder="15000"
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <span class="block text-sm font-bold mb-1.5">Gambar jasa</span>
        <div class="inline-flex bg-bg-alt rounded-full p-1 mb-3">
          <button
            type="button"
            onclick={() => (modeGambar = 'url')}
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                   {modeGambar === 'url' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
          >
            Pakai URL
          </button>
          <button
            type="button"
            onclick={() => (modeGambar = 'upload')}
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                   {modeGambar === 'upload' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
          >
            Upload dari perangkat
          </button>
        </div>

        {#if modeGambar === 'url'}
          <input
            name="gambarUrl"
            type="url"
            placeholder="https://..."
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
          />
        {:else}
          <input
            name="gambarFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent
                   file:mr-3 file:rounded-full file:border-0 file:bg-ink file:text-bg file:px-4 file:py-1.5 file:text-xs file:font-bold"
          />
          <p class="text-xs text-ink-soft mt-1.5">Format JPG/PNG/WEBP, maksimal 5MB.</p>
        {/if}
      </div>

      <button
        type="submit"
        class="w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
      >
        Simpan jasa
      </button>
    </form>
  {/if}

  <!-- ===== GRID DAFTAR JASA (gaya sama dengan Produk saya) ===== -->
  {#if data.daftarJasa.length > 0}
    <div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {#each data.daftarJasa as j}
        <div class="bg-white rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(42,26,14,0.06)] {!j.aktif ? 'opacity-60' : ''}">
          <div class="aspect-[4/3] relative overflow-hidden">
            <img src={j.gambarUrl} alt={j.nama} class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

            <span class="absolute bottom-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-ink/85 text-white uppercase tracking-wide">
              {j.kategori}
            </span>

            <a
              href={`/jastiper/jasa/${j.id}/edit`}
              aria-label="Edit jasa"
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-ink flex items-center justify-center shadow-sm hover:bg-white"
            >
              ✏️
            </a>
          </div>

          <div class="px-4 pt-4 pb-4">
            <div class="flex gap-2 flex-wrap">
              <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full {j.aktif ? 'bg-primary/15 text-primary-dark' : 'bg-red-50 text-red-500'}">
                {j.aktif ? 'Aktif' : 'Nonaktif'}
              </span>
              <span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full {j.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-bg-alt text-ink-soft'}">
                {j.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
              </span>
            </div>

            <div class="flex justify-between items-start gap-2 mt-2">
              <span class="font-bold text-[15px] leading-snug">{j.nama}</span>
              <a href={`/jastiper/jasa/${j.id}/edit`} class="text-xs font-bold text-primary-dark shrink-0 hover:underline">Edit</a>
            </div>

            <p class="font-display font-semibold text-lg mt-1.5">
              {formatRupiah(j.harga)}
              {#if j.satuan}<span class="text-xs text-ink-soft font-sans"> / {j.satuan}</span>{/if}
            </p>

            <!-- Tombol aksi: tetap ada seperti sebelumnya -->
            <div class="flex gap-2 mt-4">
              <form method="POST" action="?/toggleAktif" use:enhance class="flex-1">
                <input type="hidden" name="id" value={j.id} />
                <button
                  type="submit"
                  class="w-full rounded-full bg-bg-alt text-ink-soft font-bold text-xs px-3 py-2 hover:bg-accent/40 transition-colors"
                >
                  {j.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </form>
              <form
                method="POST"
                action="?/hapus"
                use:enhance={() => {
                  if (!confirm('Yakin hapus jasa ini?')) return () => {};
                }}
              >
                <input type="hidden" name="id" value={j.id} />
                <button
                  type="submit"
                  class="rounded-full bg-red-50 text-red-500 font-bold text-xs px-3.5 py-2 hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-20 bg-bg-alt rounded-[26px]">
      <p class="text-lg font-semibold">Belum ada jasa</p>
      <p class="text-ink-soft text-sm mt-1">Tambahkan jasa pertamamu supaya muncul di katalog.</p>
    </div>
  {/if}
</section>