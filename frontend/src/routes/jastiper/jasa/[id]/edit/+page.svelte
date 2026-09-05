<script lang="ts">
    import { enhance } from '$app/forms';

    /** @type {{ data: import('./$types').PageData, form: any }} */
    let { data, form } = $props();

    const kategoriList = [
        'Jemputan',
        'Antar Barang',
        'Titip Antre',
        'Belanja Kebutuhan',
        'Jasa Lainnya'
    ];

    let hargaTipe = $state('');
    let modeGambar = $state('lama'); // 'lama' | 'url' | 'upload'

    $effect(() => {
        if (hargaTipe === '') {
            hargaTipe = data.jasa.hargaTipe;
        }
    });
</script>

<svelte:head>
  <title>Edit Jasa — Nitip.</title>
</svelte:head>

<section class="max-w-[600px] mx-auto px-5 md:px-8 py-12">
  <a href="/jastiper/jasa" class="text-sm text-ink-soft hover:text-ink mb-4 inline-block">← Kembali ke Jasa saya</a>

  <h1 class="text-2xl font-bold font-display mb-1">Edit jasa</h1>
  <p class="text-ink-soft text-sm mb-8">Perbarui detail layanan jasa kamu.</p>

  {#if form?.error}
    <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 mb-6">
      {form.error}
    </div>
  {/if}

  <form
    method="POST"
    action="?/simpan"
    enctype="multipart/form-data"
    use:enhance
    class="bg-white rounded-[22px] shadow-[0_10px_30px_rgba(42,26,14,0.06)] p-6 space-y-5"
  >
    <div>
      <label for="nama" class="block text-sm font-bold mb-1.5">Nama jasa</label>
      <input
        id="nama"
        name="nama"
        type="text"
        required
        value={data.jasa.nama}
        class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
      />
    </div>

    <div>
      <label for="deskripsi" class="block text-sm font-bold mb-1.5">Deskripsi (opsional)</label>
      <textarea
        id="deskripsi"
        name="deskripsi"
        rows="3"
        class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent resize-none"
        >{data.jasa.deskripsi ?? ''}</textarea
      >
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label for="kategori" class="block text-sm font-bold mb-1.5">Kategori</label>
        <select
          id="kategori"
          name="kategori"
          required
          value={data.jasa.kategori}
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
          value={data.jasa.satuan ?? ''}
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
          value={data.jasa.harga}
          class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </div>

    <!-- Gambar: tampilkan yang lama, opsi ganti -->
    <div>
      <span class="block text-sm font-bold mb-1.5">Gambar jasa</span>

      <div class="flex items-center gap-3 mb-3">
        <img src={data.jasa.gambarUrl} alt={data.jasa.nama} class="w-16 h-16 rounded-xl object-cover border border-ink/10" />
        <span class="text-xs text-ink-soft">Gambar saat ini</span>
      </div>

      <div class="inline-flex bg-bg-alt rounded-full p-1 mb-3">
        <button
          type="button"
          onclick={() => (modeGambar = 'lama')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'lama' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
        >
          Tetap pakai ini
        </button>
        <button
          type="button"
          onclick={() => (modeGambar = 'url')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'url' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
        >
          Ganti pakai URL
        </button>
        <button
          type="button"
          onclick={() => (modeGambar = 'upload')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'upload' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
        >
          Upload baru
        </button>
      </div>

      {#if modeGambar === 'url'}
        <input
          name="gambarUrl"
          type="url"
          placeholder="https://..."
          class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      {:else if modeGambar === 'upload'}
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

    <div class="flex gap-3">
      <a
        href="/jastiper/jasa"
        class="flex-1 py-3.5 rounded-full font-bold text-[15px] bg-bg-alt text-ink-soft text-center hover:bg-bg-alt/70 transition-colors"
      >
        Batal
      </a>
      <button
        type="submit"
        class="flex-1 py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
      >
        Simpan perubahan
      </button>
    </div>
  </form>
</section>