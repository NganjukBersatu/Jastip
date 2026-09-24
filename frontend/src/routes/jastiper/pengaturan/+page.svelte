<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);
  let mengubahStatus = $state(false);

  const inputClass =
    'w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-base sm:text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10';
</script>

<svelte:head>
  <title>Pengaturan profil — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1800px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-14">
  <!-- HEADER -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">
      Lengkapi profil jastiper
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px]">
      Info ini yang bakal dilihat pelanggan buat percaya sama lapak titip kamu.
    </p>
  </div>

  <!-- STATUS LAPAK -->
  <section>
    <div class="mb-3.5">
      <h2 class="text-sm font-extrabold text-ink">Status lapak</h2>
      <p class="text-xs text-ink-soft mt-0.5">Atur apakah lapakmu menerima pesanan</p>
    </div>

    <div class="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="font-bold text-sm text-ink">
            {data.profil?.statusAktif ? 'Lapak aktif' : 'Lapak nonaktif'}
          </div>

          <p class="text-[13px] sm:text-[13.5px] text-ink-soft mt-1 leading-relaxed">
            {#if data.profil?.statusAktif}
              Lapakmu terlihat di katalog dan bisa menerima pesanan baru.
            {:else}
              Lapakmu disembunyikan dari katalog dan tidak menerima pesanan baru.
            {/if}
          </p>
        </div>

        <form
          method="POST"
          action="?/ubahStatusAktif"
          use:enhance={() => {
            mengubahStatus = true;
            return async ({ update }) => {
              await update();
              mengubahStatus = false;
            };
          }}
          class="shrink-0"
        >
          <input type="hidden" name="statusAktif" value={!data.profil?.statusAktif} />

          <button
            type="submit"
            disabled={mengubahStatus}
            aria-pressed={data.profil?.statusAktif}
            aria-label="Ubah status aktif menerima pesanan"
            class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 disabled:opacity-60
              {data.profil?.statusAktif ? 'bg-green-500' : 'bg-ink/15'}"
          >
            <span
              class="inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200
                {data.profil?.statusAktif ? 'translate-x-7' : 'translate-x-1'}"
            ></span>
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- PESAN -->
  {#if form?.error}
    <div class="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-red-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold">
        !
      </span>

      <span class="min-w-0">{form.error}</span>
    </div>
  {/if}

  {#if form?.sukses}
    <div class="mt-8 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-green-700">
      <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-extrabold">
        ✓
      </span>

      <span class="min-w-0">Profil berhasil disimpan.</span>
    </div>
  {/if}

  <!-- FORM PROFIL -->
  <section class="mt-9 sm:mt-10">
    <div class="mb-3.5">
      <h2 class="text-sm font-extrabold text-ink">Informasi profil</h2>
      <p class="text-xs text-ink-soft mt-0.5">
        Pastikan informasi yang kamu masukkan mudah dipahami pelanggan.
      </p>
    </div>

    <form
      method="POST"
      action="?/simpanProfil"
      class="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 lg:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.025)]"
      use:enhance={() => {
        mengirim = true;

        return async ({ update }) => {
          await update({ reset: false });
          mengirim = false;
        };
      }}
    >
      <div class="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
        <!-- AREA -->
        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[13px] sm:text-[13.5px] font-bold text-ink">Kota / wilayah utama</span>

          <span class="text-[12px] sm:text-[12.5px] text-ink-soft leading-relaxed">
            Ini yang muncul di katalog, mis. "Surabaya" — untuk area layanan lebih detail per
            kecamatan, atur di menu Ongkir wilayah.
          </span>

          <input
            type="text"
            name="area"
            value={data.profil?.area ?? ''}
            placeholder="Surabaya"
            required
            class={inputClass}
          />
        </label>

        <!-- NOMOR WA -->
        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[13px] sm:text-[13.5px] font-bold text-ink">Nomor WhatsApp</span>

          <span class="text-[12px] sm:text-[12.5px] text-ink-soft leading-relaxed">
            Dipakai pelanggan untuk menghubungimu langsung saat bayar transfer bank / e-wallet.
            Wajib diisi.
          </span>

          <input
            type="tel"
            name="noWa"
            inputmode="tel"
            value={data.profil?.noWa ?? ''}
            placeholder="08123456789"
            required
            class={inputClass}
          />
        </label>

        <!-- ALAMAT -->
        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[13px] sm:text-[13.5px] font-bold text-ink">Alamat lengkap</span>

          <span class="text-[12px] sm:text-[12.5px] text-ink-soft leading-relaxed">
            Buat referensi kamu sendiri saat ambil/kirim barang — tidak ditampilkan ke publik.
          </span>

          <textarea
            name="alamat"
            rows="4"
            value={data.profil?.alamat ?? ''}
            placeholder="Jl. Contoh No. 12, Kecamatan..., Kota..."
            class="{inputClass} resize-none"
          ></textarea>
        </label>

        <!-- DESKRIPSI -->
        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[13px] sm:text-[13.5px] font-bold text-ink">
            Jasa/barang yang ditawarkan
          </span>

          <span class="text-[12px] sm:text-[12.5px] text-ink-soft leading-relaxed">
            Jelaskan singkat apa saja yang bisa pelanggan titipkan lewat kamu.
          </span>

          <textarea
            name="deskripsi"
            rows="4"
            value={data.profil?.deskripsi ?? ''}
            placeholder="Misal: Titip jajanan pasar, oleh-oleh khas Surabaya, dan belanja kebutuhan harian di area Rungkut."
            class="{inputClass} resize-none"
          ></textarea>
        </label>
      </div>

      <button
        type="submit"
        disabled={mengirim}
        class="mt-6 sm:mt-7 w-full sm:w-auto min-h-11.5 inline-flex items-center justify-center rounded-xl bg-ink px-8 py-3 text-[13px] sm:text-sm font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mengirim ? 'Menyimpan...' : 'Simpan profil'}
      </button>
    </form>
  </section>

  <!-- WILAYAH -->
  <section class="mt-9 sm:mt-10">
    <div class="mb-3.5 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-sm font-extrabold text-ink">Wilayah yang dilayani</h2>

          {#if data.daftarWilayahLayanan.length > 0}
            <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
              {data.daftarWilayahLayanan.length}
            </span>
          {/if}
        </div>

        <p class="text-xs text-ink-soft mt-0.5">Area pengiriman yang tersedia di lapakmu</p>
      </div>

      <a
        href="/jastiper/ongkir"
        class="shrink-0 inline-flex min-h-11 items-center text-[12px] sm:text-[13px] font-bold text-primary-dark hover:underline"
      >
        Atur ongkir →
      </a>
    </div>

    {#if data.daftarWilayahLayanan.length === 0}
      <div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
          <svg
            class="w-6 h-6 text-primary-dark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0ZM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>

        <div class="font-bold text-[15px] text-ink">Belum ada wilayah diatur</div>

        <div class="text-[13.5px] text-ink-soft mt-1.5 max-w-[320px] mx-auto leading-relaxed">
          Tambahkan lewat menu "Ongkir wilayah" di sidebar.
        </div>
      </div>
    {:else}
      <div class="bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)] flex flex-wrap gap-2">
        {#each data.daftarWilayahLayanan as w (w.id)}
          <span class="max-w-full bg-bg-alt text-primary-dark text-[12px] sm:text-[12.5px] font-bold px-3.5 py-2 rounded-pill wrap-break-word">
            {w.wilayah}
          </span>
        {/each}
      </div>
    {/if}
  </section>
</div>