<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let hargaTipe = $state(data.produk.hargaTipe);
  let kategori = $state(data.produk.kategori ?? 'Lainnya');
  let aktif = $state(data.produk.aktif);
  let mengirim = $state(false);

  const kategoriList = ['Jajanan & oleh-oleh', 'Skincare', 'Tiket event', 'Fashion', 'Barang langka', 'Lainnya'];

  $effect(() => {
    hargaTipe = data.produk.hargaTipe;
    kategori = data.produk.kategori ?? 'Lainnya';
    aktif = data.produk.aktif;
  });
</script>

<svelte:head>
  <title>Edit produk — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1140px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- Back link -->
  
   <a href="/jastiper/produk"
    class="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink transition"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    Produk saya
  </a>

  <!-- Header -->
  <div class="mt-4 mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-[-0.02em] text-ink">
      Edit produk
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed max-w-[620px]">
      Perbarui detail barang yang kamu tawarkan.
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

  <!-- Form edit produk -->
  <form
    method="POST"
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
      <h2 class="text-sm font-extrabold text-ink">Detail produk</h2>
      <p class="mt-0.5 text-xs text-ink-soft">
        Perbarui nama, kategori, harga, dan gambar produk.
      </p>
    </div>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Nama produk</span>
      <input
        type="text"
        name="nama"
        value={data.produk.nama}
        placeholder="Misal: Lumpia Basah Ny. Lin"
        required
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Kategori</span>
      <select
        name="kategori"
        bind:value={kategori}
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        {#each kategoriList as k}
          <option value={k}>{k}</option>
        {/each}
      </select>
    </label>

    <div class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Tipe harga</span>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          onclick={() => (hargaTipe = 'tetap')}
          class="rounded-xl border-2 p-3.5 text-left transition {hargaTipe === 'tetap' ? 'border-primary bg-bg-alt' : 'border-ink/10 bg-bg'}"
        >
          <div class="font-bold text-sm">Harga tetap</div>
          <div class="text-[12px] text-ink-soft mt-0.5">Langsung bisa dibeli</div>
        </button>
        <button
          type="button"
          onclick={() => (hargaTipe = 'nego')}
          class="rounded-xl border-2 p-3.5 text-left transition {hargaTipe === 'nego' ? 'border-primary bg-bg-alt' : 'border-ink/10 bg-bg'}"
        >
          <div class="font-bold text-sm">Bisa nego</div>
          <div class="text-[12px] text-ink-soft mt-0.5">Pelanggan chat dulu</div>
        </button>
      </div>
      <input type="hidden" name="hargaTipe" value={hargaTipe} />
    </div>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">
        {hargaTipe === 'nego' ? 'Harga mulai dari (Rp)' : 'Harga (Rp)'}
      </span>
      <input
        type="number"
        name="harga"
        min="0"
        value={data.produk.harga}
        placeholder="32000"
        required
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">
        Deskripsi <span class="font-normal text-ink-soft">(opsional)</span>
      </span>
      <textarea
        name="deskripsi"
        rows="3"
        placeholder="Ceritakan sedikit soal produk ini..."
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
      >{data.produk.deskripsi ?? ''}</textarea>
    </label>

    <div class="flex flex-col gap-2">
      <span class="text-[12.5px] font-bold text-ink-soft">Gambar produk</span>

      {#if data.produk.gambarUrl}
        <img
          src={data.produk.gambarUrl}
          alt={data.produk.nama}
          class="w-28 h-28 object-cover rounded-xl border border-ink/10"
        />
      {/if}

      <input
        type="url"
        name="gambarUrl"
        value={data.produk.gambarUrl}
        placeholder="https://..."
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      <span class="text-xs text-ink-soft text-center">atau ganti dengan file baru</span>

      <input
        type="file"
        name="gambarFile"
        accept="image/*"
        class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-2.5 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-ink file:text-bg file:text-xs file:font-bold"
      />

      <span class="text-[11.5px] text-ink-soft">Kosongkan kalau nggak mau ganti gambar. Kalau upload file baru, itu yang dipakai.</span>
    </div>

    <label class="flex items-center gap-2.5 cursor-pointer">
      <input type="checkbox" name="aktif" bind:checked={aktif} class="w-4 h-4 accent-primary" />
      <span class="text-[13.5px] font-bold text-ink">Produk aktif ditampilkan di katalog</span>
    </label>

    <button
      type="submit"
      disabled={mengirim}
      class="mt-2 inline-flex h-[46px] w-full items-center justify-center rounded-xl bg-ink px-6 text-sm font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {mengirim ? 'Menyimpan...' : 'Simpan perubahan'}
    </button>
  </form>
</div>