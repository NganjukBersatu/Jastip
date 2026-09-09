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
    let mengirim = $state(false);

    $effect(() => {
        if (hargaTipe === '') {
            hargaTipe = data.jasa.hargaTipe;
        }
    });
</script>

<svelte:head>
  <title>Edit Jasa — Nitip.</title>
</svelte:head>

<div class="w-full max-w-[1140px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- Back link -->
  
   <a href="/jastiper/jasa"
    class="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink transition"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    Jasa saya
  </a>

  <!-- Header -->
  <div class="mt-4 mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-[-0.02em] text-ink">
      Edit jasa
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed max-w-[620px]">
      Perbarui detail layanan jasa kamu.
    </p>
  </div>

  <!-- Pesan error -->
  {#if form?.error}
    <div
      class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-red-700"
    >
      <span
        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold"
      >
        !
      </span>

      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Form edit jasa -->
  <form
    method="POST"
    action="?/simpan"
    enctype="multipart/form-data"
    class="rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)] sm:p-6 flex flex-col gap-5"
    use:enhance={() => {
      mengirim = true;
      return async ({ update }) => {
        await update();
        mengirim = false;
      };
    }}
  >
    <div class="mb-1">
      <h2 class="text-sm font-extrabold text-ink">Detail jasa</h2>
      <p class="mt-0.5 text-xs text-ink-soft">
        Perbarui informasi layanan yang kamu tawarkan ke pelanggan.
      </p>
    </div>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Nama jasa</span>
      <input
        id="nama"
        name="nama"
        type="text"
        required
        value={data.jasa.nama}
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">
        Deskripsi <span class="font-normal text-ink-soft">(opsional)</span>
      </span>
      <textarea
        id="deskripsi"
        name="deskripsi"
        rows="3"
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
        >{data.jasa.deskripsi ?? ''}</textarea
      >
    </label>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label class="flex flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">Kategori</span>
        <select
          id="kategori"
          name="kategori"
          required
          value={data.jasa.kategori}
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          {#each kategoriList as kategori}
            <option value={kategori}>{kategori}</option>
          {/each}
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">
          Satuan <span class="font-normal text-ink-soft">(opsional)</span>
        </span>
        <input
          id="satuan"
          name="satuan"
          type="text"
          value={data.jasa.satuan ?? ''}
          placeholder="Misal: per trip, per jam"
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label class="flex flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">Tipe harga</span>
        <select
          id="hargaTipe"
          name="hargaTipe"
          bind:value={hargaTipe}
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="tetap">Harga tetap</option>
          <option value="nego">Bisa nego</option>
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">
          {hargaTipe === 'nego' ? 'Harga mulai dari (Rp)' : 'Harga (Rp)'}
        </span>
        <input
          id="harga"
          name="harga"
          type="number"
          min="1"
          required
          value={data.jasa.harga}
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>
    </div>

    <!-- Gambar: tampilkan yang lama, opsi ganti -->
    <div class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Gambar jasa</span>

      <div class="flex items-center gap-3 mb-1">
        <img
          src={data.jasa.gambarUrl}
          alt={data.jasa.nama}
          class="w-16 h-16 rounded-xl object-cover border border-ink/10"
        />
        <span class="text-xs text-ink-soft">Gambar saat ini</span>
      </div>

      <div class="inline-flex bg-bg rounded-full p-1 w-fit border border-ink/10">
        <button
          type="button"
          onclick={() => (modeGambar = 'lama')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'lama' ? 'bg-white shadow-sm text-ink' : 'text-ink-soft'}"
        >
          Tetap pakai ini
        </button>
        <button
          type="button"
          onclick={() => (modeGambar = 'url')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'url' ? 'bg-white shadow-sm text-ink' : 'text-ink-soft'}"
        >
          Ganti pakai URL
        </button>
        <button
          type="button"
          onclick={() => (modeGambar = 'upload')}
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                 {modeGambar === 'upload' ? 'bg-white shadow-sm text-ink' : 'text-ink-soft'}"
        >
          Upload baru
        </button>
      </div>

      {#if modeGambar === 'url'}
        <input
          name="gambarUrl"
          type="url"
          placeholder="https://..."
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      {:else if modeGambar === 'upload'}
        <input
          name="gambarFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10
                 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-ink file:text-bg file:text-xs file:font-bold"
        />
        <p class="text-[11.5px] text-ink-soft">Format JPG/PNG/WEBP, maksimal 5MB.</p>
      {/if}
    </div>

    <div class="flex gap-3 mt-2">
      
       <a href="/jastiper/jasa"
        class="flex-1 inline-flex h-[46px] items-center justify-center rounded-xl border border-ink/15 text-sm font-bold text-ink-soft transition hover:border-ink/30 hover:text-ink"
      >
        Batal
      </a>
      <button
        type="submit"
        disabled={mengirim}
        class="flex-1 inline-flex h-[46px] items-center justify-center rounded-xl bg-ink px-6 text-sm font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mengirim ? 'Menyimpan...' : 'Simpan perubahan'}
      </button>
    </div>
  </form>
</div>