<script>
  import { enhance } from '$app/forms';

  let { form } = $props();

  let hargaTipe = $state('tetap');
  let mengirim = $state(false);

  const kategoriList = ['Jajanan & oleh-oleh', 'Skincare', 'Tiket event', 'Fashion', 'Barang langka', 'Lainnya'];
</script>

<svelte:head>
  <title>Tambah produk — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[640px]">
  <a href="/jastiper/produk" class="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink transition">
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    Produk saya
  </a>

  <h1 class="text-[26px] mt-4">Tambah produk baru</h1>
  <p class="text-ink-soft mt-1 text-[15px]">Isi detail barang yang mau kamu tawarkan.</p>

  {#if form?.error}
    <div class="mt-6 bg-red-50 border border-red-200 text-red-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
      {form.error}
    </div>
  {/if}

  <form
    method="POST"
    enctype="multipart/form-data"
    class="mt-7 flex flex-col gap-5"
    use:enhance={() => {
      mengirim = true;
      return async ({ update }) => {
        await update();
        mengirim = false;
      };
    }}
  >
    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Nama produk</span>
      <input
        type="text"
        name="nama"
        placeholder="Misal: Lumpia Basah Ny. Lin"
        required
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Kategori</span>
      <select name="kategori" class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition">
        {#each kategoriList as kategori}
          <option value={kategori}>{kategori}</option>
        {/each}
      </select>
    </label>

    <div class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Tipe harga</span>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          onclick={() => (hargaTipe = 'tetap')}
          class="rounded-2xl border-2 p-3.5 text-left transition {hargaTipe === 'tetap' ? 'border-primary bg-bg-alt' : 'border-ink/10 bg-white'}"
        >
          <div class="font-bold text-sm">Harga tetap</div>
          <div class="text-[12px] text-ink-soft mt-0.5">Langsung bisa dibeli</div>
        </button>
        <button
          type="button"
          onclick={() => (hargaTipe = 'nego')}
          class="rounded-2xl border-2 p-3.5 text-left transition {hargaTipe === 'nego' ? 'border-primary bg-bg-alt' : 'border-ink/10 bg-white'}"
        >
          <div class="font-bold text-sm">Bisa nego</div>
          <div class="text-[12px] text-ink-soft mt-0.5">Pelanggan chat dulu</div>
        </button>
      </div>
      <input type="hidden" name="hargaTipe" value={hargaTipe} />
    </div>

    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">
        {hargaTipe === 'nego' ? 'Harga mulai dari (Rp)' : 'Harga (Rp)'}
      </span>
      <input
        type="number"
        name="harga"
        min="0"
        placeholder="32000"
        required
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Deskripsi <span class="font-normal text-ink-soft">(opsional)</span></span>
      <textarea
        name="deskripsi"
        rows="3"
        placeholder="Ceritakan sedikit soal produk ini..."
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition resize-none"
      ></textarea>
    </label>

    <div class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Gambar produk <span class="text-red-500">*wajib</span></span>

      <input
        type="url"
        name="gambarUrl"
        placeholder="https://... (opsional kalau upload file)"
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition"
      />

      <span class="text-xs text-ink-soft text-center">atau</span>

      <input
        type="file"
        name="gambarFile"
        accept="image/*"
        class="bg-white border border-ink/15 rounded-2xl px-4 py-2.5 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-bg-alt file:text-xs file:font-bold"
      />

      <span class="text-[11.5px] text-ink-soft">Isi salah satu saja — kalau dua-duanya diisi, file upload yang dipakai.</span>
    </div>

    <button
      type="submit"
      disabled={mengirim}
      class="mt-2 inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[15px] py-3.5 hover:-translate-y-0.5 transition disabled:opacity-60"
    >
      {mengirim ? 'Menyimpan...' : 'Simpan produk'}
    </button>
  </form>
</div>