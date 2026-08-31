<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);
</script>

<svelte:head>
  <title>Pengaturan profil — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[640px]">
  <h1 class="text-[28px]">Lengkapi profil jastiper</h1>
  <p class="text-ink-soft mt-1 text-[15px]">
    Info ini yang bakal dilihat pelanggan buat percaya sama lapak titip kamu.
  </p>

  {#if form?.error}
    <div class="mt-6 bg-red-50 border border-red-200 text-red-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
      {form.error}
    </div>
  {/if}

  {#if form?.sukses}
    <div class="mt-6 bg-green-50 border border-green-200 text-green-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
      Profil berhasil disimpan.
    </div>
  {/if}

  <form
    method="POST"
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
      <span class="text-[13.5px] font-bold text-ink">Kota / wilayah utama</span>
      <span class="text-[12.5px] text-ink-soft -mt-1">
        Ini yang muncul di katalog, mis. "Surabaya" — untuk area layanan lebih detail per kecamatan, atur di menu Ongkir wilayah.
      </span>
      <input
        type="text"
        name="area"
        value={data.profil?.area ?? ''}
        placeholder="Surabaya"
        required
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Alamat lengkap</span>
      <span class="text-[12.5px] text-ink-soft -mt-1">
        Buat referensi kamu sendiri saat ambil/kirim barang — tidak ditampilkan ke publik.
      </span>
      <textarea
        name="alamat"
        rows="2"
        value={data.profil?.alamat ?? ''}
        placeholder="Jl. Contoh No. 12, Kecamatan..., Kota..."
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition resize-none"
      ></textarea>
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-[13.5px] font-bold text-ink">Jasa/barang yang ditawarkan</span>
      <span class="text-[12.5px] text-ink-soft -mt-1">
        Jelaskan singkat apa saja yang bisa pelanggan titipkan lewat kamu.
      </span>
      <textarea
        name="deskripsi"
        rows="4"
        value={data.profil?.deskripsi ?? ''}
        placeholder="Misal: Titip jajanan pasar, oleh-oleh khas Surabaya, dan belanja kebutuhan harian di area Rungkut."
        class="bg-white border border-ink/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition resize-none"
      ></textarea>
    </label>

    <button
      type="submit"
      disabled={mengirim}
      class="mt-2 inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[15px] py-3.5 hover:-translate-y-0.5 transition disabled:opacity-60"
    >
      {mengirim ? 'Menyimpan...' : 'Simpan profil'}
    </button>
  </form>

  <!-- Ringkasan wilayah layanan (dari menu Ongkir, cukup ditampilkan di sini) -->
  <div class="mt-9">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-display font-semibold">Wilayah yang dilayani</h2>
      <a href="/jastiper/ongkir" class="text-[13px] font-bold text-primary-dark hover:underline">Atur ongkir →</a>
    </div>

    {#if data.daftarWilayahLayanan.length === 0}
      <div class="mt-3 bg-white rounded-2xl border border-dashed border-ink/15 p-6 text-center">
        <div class="text-[13.5px] text-ink-soft">
          Belum ada wilayah diatur. Tambahkan lewat menu "Ongkir wilayah" di sidebar.
        </div>
      </div>
    {:else}
      <div class="flex flex-wrap gap-2 mt-3">
        {#each data.daftarWilayahLayanan as w (w.id)}
          <span class="bg-bg-alt text-primary-dark text-[13px] font-bold px-3.5 py-2 rounded-pill">
            {w.wilayah}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>