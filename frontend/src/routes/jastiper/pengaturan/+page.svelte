<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);
</script>

<svelte:head>
  <title>Pengaturan profil — Nitip</title>
</svelte:head>

<div class="w-full max-w-[820px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <!-- HEADER -->
  <div class="mb-6 sm:mb-8">
    <h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
      Lengkapi profil jastiper
    </h1>

    <p class="text-ink-soft mt-1.5 text-sm sm:text-[15px] leading-relaxed">
      Info ini yang bakal dilihat pelanggan buat percaya sama lapak titip kamu.
    </p>
  </div>

  <!-- MESSAGE -->
  {#if form?.error}
    <div class="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] font-semibold leading-relaxed text-red-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold">
        !
      </span>

      <span>{form.error}</span>
    </div>
  {/if}

  {#if form?.sukses}
    <div class="mb-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 text-[13px] font-semibold leading-relaxed text-green-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-extrabold">
        ✓
      </span>

      <span>Profil berhasil disimpan.</span>
    </div>
  {/if}

  <!-- FORM -->
  <form
    method="POST"
    class="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]"
    use:enhance={() => {
      mengirim = true;

      return async ({ update }) => {
        await update();
        mengirim = false;
      };
    }}
  >
    <div class="mb-6">
      <h2 class="text-sm font-extrabold text-ink">
        Informasi profil
      </h2>

      <p class="mt-0.5 text-xs text-ink-soft">
        Pastikan informasi yang kamu masukkan mudah dipahami pelanggan.
      </p>
    </div>

    <div class="flex flex-col gap-6">
      <!-- AREA -->
      <label class="flex flex-col gap-2">
        <span class="text-[13.5px] font-bold text-ink">
          Kota / wilayah utama
        </span>

        <span class="text-[12.5px] text-ink-soft leading-relaxed">
          Ini yang muncul di katalog, mis. "Surabaya" — untuk area layanan lebih
          detail per kecamatan, atur di menu Ongkir wilayah.
        </span>

        <input
          type="text"
          name="area"
          value={data.profil?.area ?? ''}
          placeholder="Surabaya"
          required
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>

      <!-- ALAMAT -->
      <label class="flex flex-col gap-2">
        <span class="text-[13.5px] font-bold text-ink">
          Alamat lengkap
        </span>

        <span class="text-[12.5px] text-ink-soft leading-relaxed">
          Buat referensi kamu sendiri saat ambil/kirim barang — tidak ditampilkan
          ke publik.
        </span>

        <textarea
          name="alamat"
          rows="3"
          value={data.profil?.alamat ?? ''}
          placeholder="Jl. Contoh No. 12, Kecamatan..., Kota..."
          class="w-full resize-none rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        ></textarea>
      </label>

      <!-- DESKRIPSI -->
      <label class="flex flex-col gap-2">
        <span class="text-[13.5px] font-bold text-ink">
          Jasa/barang yang ditawarkan
        </span>

        <span class="text-[12.5px] text-ink-soft leading-relaxed">
          Jelaskan singkat apa saja yang bisa pelanggan titipkan lewat kamu.
        </span>

        <textarea
          name="deskripsi"
          rows="5"
          value={data.profil?.deskripsi ?? ''}
          placeholder="Misal: Titip jajanan pasar, oleh-oleh khas Surabaya, dan belanja kebutuhan harian di area Rungkut."
          class="w-full resize-none rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        ></textarea>
      </label>
    </div>

    <button
      type="submit"
      disabled={mengirim}
      class="mt-7 w-full min-h-[48px] inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm sm:text-[15px] font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      {mengirim ? 'Menyimpan...' : 'Simpan profil'}
    </button>
  </form>

  <!-- WILAYAH -->
  <section class="mt-8 sm:mt-9">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h2 class="text-lg font-display font-semibold text-ink">
          Wilayah yang dilayani
        </h2>

        <p class="text-xs text-ink-soft mt-0.5">
          Area pengiriman yang tersedia di lapakmu
        </p>
      </div>

      <a
        href="/jastiper/ongkir"
        class="shrink-0 text-[12px] sm:text-[13px] font-bold text-primary-dark hover:underline"
      >
        Atur ongkir →
      </a>
    </div>

    {#if data.daftarWilayahLayanan.length === 0}
      <div class="mt-4 bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-8 text-center">
        <div class="text-[13px] text-ink-soft leading-relaxed max-w-[420px] mx-auto">
          Belum ada wilayah diatur. Tambahkan lewat menu "Ongkir wilayah" di sidebar.
        </div>
      </div>
    {:else}
      <div class="mt-4 flex flex-wrap gap-2">
        {#each data.daftarWilayahLayanan as w (w.id)}
          <span class="max-w-full bg-bg-alt text-primary-dark text-[12.5px] font-bold px-3.5 py-2 rounded-pill break-words">
            {w.wilayah}
          </span>
        {/each}
      </div>
    {/if}
  </section>
</div>