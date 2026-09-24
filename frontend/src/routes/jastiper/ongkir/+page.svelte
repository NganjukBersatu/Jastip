<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);

  /** @type {string | null} */
  let sedangEdit = $state(null);

  const jumlahWilayah = $derived(data.daftarOngkir.length);
  const ongkirTermurah = $derived(
    data.daftarOngkir.length > 0 ? Math.min(...data.daftarOngkir.map((o) => o.biaya)) : 0
  );
  const ongkirTertinggi = $derived(
    data.daftarOngkir.length > 0 ? Math.max(...data.daftarOngkir.map((o) => o.biaya)) : 0
  );

  // Kartu statistik: gaya sama dengan dashboard
  const kartuStatistik = $derived([
    { label: 'Wilayah dilayani', nilai: String(jumlahWilayah), warna: 'bg-primary text-white' },
    { label: 'Ongkir termurah', nilai: formatRupiah(ongkirTermurah), warna: 'bg-accent text-ink' },
    { label: 'Ongkir tertinggi', nilai: formatRupiah(ongkirTertinggi), warna: 'bg-ink text-bg' }
  ]);

  /** @param {{ id: string, wilayah: string, biaya: number }} o */
  function mulaiEdit(o) {
    sedangEdit = o.id;
  }

  function batalEdit() {
    sedangEdit = null;
  }

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  const inputClass =
    'w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-base sm:text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10';
</script>

<svelte:head>
  <title>Ongkir wilayah — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1800px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-14">
  <!-- HEADER -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">
      Ongkir wilayah
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px]">
      Atur biaya kirim berbeda untuk tiap wilayah yang kamu layani.
    </p>
  </div>

  <!-- STATISTIK -->
  {#if data.daftarOngkir.length > 0}
    <section>
      <div class="mb-3.5">
        <h2 class="text-sm font-extrabold text-ink">Ringkasan ongkir</h2>
        <p class="text-xs text-ink-soft mt-0.5">Gambaran biaya kirim di wilayahmu</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {#each kartuStatistik as kartu, i}
          <div
            class="rounded-2xl p-4 sm:p-5 {kartu.warna} shadow-[0_2px_10px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:shadow-md {i === 0
              ? 'col-span-2 sm:col-span-1'
              : ''}"
          >
            <div class="font-display text-2xl sm:text-3xl font-semibold wrap-break-wordword">
              {kartu.nilai}
            </div>

            <div class="text-[12px] sm:text-[13px] font-semibold mt-1.5 leading-snug opacity-90">
              {kartu.label}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- PESAN ERROR -->
  {#if form?.error}
    <div
      class="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] sm:text-[13.5px] font-semibold leading-relaxed text-red-700"
    >
      <span
        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold"
      >
        !
      </span>

      <span class="min-w-0">{form.error}</span>
    </div>
  {/if}

  <!-- FORM TAMBAH WILAYAH -->
  <section class="mt-9 sm:mt-10">
    <div class="mb-3.5">
      <h2 class="text-sm font-extrabold text-ink">Tambah wilayah</h2>
      <p class="text-xs text-ink-soft mt-0.5">Tentukan wilayah dan biaya pengirimannya.</p>
    </div>

    <form
      method="POST"
      action="?/tambah"
      class="rounded-2xl border border-ink/10 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)]"
      use:enhance={() => {
        mengirim = true;

        return async ({ update }) => {
          await update({ reset: true });
          mengirim = false;
        };
      }}
    >
      <div
        class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,240px)_auto] md:items-end"
      >
        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[12.5px] font-bold text-ink-soft">Nama wilayah</span>
          <input
            type="text"
            name="wilayah"
            placeholder="Contoh: Surabaya Timur"
            required
            class={inputClass}
          />
        </label>

        <label class="flex min-w-0 flex-col gap-2">
          <span class="text-[12.5px] font-bold text-ink-soft">Biaya (Rp)</span>
          <input
            type="number"
            name="biaya"
            min="0"
            inputmode="numeric"
            placeholder="15000"
            required
            class={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={mengirim}
          class="inline-flex min-h-11.5 w-full md:w-auto items-center justify-center rounded-xl bg-ink px-6 text-[13px] sm:text-sm font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mengirim ? 'Menambahkan...' : 'Tambah'}
        </button>
      </div>
    </form>
  </section>

  <!-- DAFTAR WILAYAH -->
  <section class="mt-9 sm:mt-10">
    <div class="mb-3.5">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-extrabold text-ink">Wilayah yang dilayani</h2>

        {#if data.daftarOngkir.length > 0}
          <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
            {data.daftarOngkir.length}
          </span>
        {/if}
      </div>
      <p class="text-xs text-ink-soft mt-0.5">Biaya kirim untuk tiap wilayah</p>
    </div>

    {#if data.daftarOngkir.length === 0}
      <!-- EMPTY STATE -->
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
          Tambahkan wilayah pertama lewat form di atas untuk mulai mengatur biaya pengiriman.
        </div>
      </div>
    {:else}
      <!-- LIST -->
      <div class="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)]">
        {#each data.daftarOngkir as o, index (o.id)}
          <div
            class:border-b={index !== data.daftarOngkir.length - 1}
            class="border-ink/10 px-4 py-3.5 sm:px-5 hover:bg-bg/40 transition"
          >
            {#if sedangEdit === o.id}
              <!-- FORM EDIT INLINE -->
              <form
                method="POST"
                action="?/ubah"
                class="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_auto] md:items-end"
                use:enhance={() => {
                  return async ({ result, update }) => {
                    await update({ reset: false });
                    if (result.type === 'success') sedangEdit = null;
                  };
                }}
              >
                <input type="hidden" name="id" value={o.id} />

                <label class="flex min-w-0 flex-col gap-1.5">
                  <span class="text-[12px] font-bold text-ink-soft">Nama wilayah</span>
                  <input type="text" name="wilayah" value={o.wilayah} required class={inputClass} />
                </label>

                <label class="flex min-w-0 flex-col gap-1.5">
                  <span class="text-[12px] font-bold text-ink-soft">Biaya (Rp)</span>
                  <input
                    type="number"
                    name="biaya"
                    value={o.biaya}
                    min="0"
                    inputmode="numeric"
                    required
                    class={inputClass}
                  />
                </label>

                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="min-h-11.5 flex-1 md:flex-none rounded-xl bg-ink px-5 text-[13px] font-bold text-bg transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Simpan
                  </button>

                  <button
                    type="button"
                    onclick={batalEdit}
                    class="min-h-11.5 flex-1 md:flex-none rounded-xl border border-ink/10 px-4 text-[13px] font-bold text-ink-soft transition hover:bg-bg-alt"
                  >
                    Batal
                  </button>
                </div>
              </form>
            {:else}
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <!-- INFO WILAYAH -->
                <div class="flex min-w-0 items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-alt">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5 text-primary"
                    >
                      <path d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0ZM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </div>

                  <div class="min-w-0">
                    <div class="font-semibold text-sm truncate" title={o.wilayah}>
                      {o.wilayah}
                    </div>

                    <div class="text-[12px] text-ink-soft mt-0.5">Ongkir</div>
                  </div>
                </div>

                <!-- HARGA + AKSI -->
                <div class="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
                  <div class="whitespace-nowrap text-sm font-extrabold text-ink sm:mr-1">
                    {formatRupiah(o.biaya)}
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      onclick={() => mulaiEdit(o)}
                      class="min-h-11 rounded-lg px-3 text-[13px] font-bold text-ink-soft transition hover:bg-bg-alt"
                    >
                      Edit
                    </button>

                    <form method="POST" action="?/hapus" use:enhance>
                      <input type="hidden" name="id" value={o.id} />
                      <button
                        type="submit"
                        class="min-h-11 rounded-lg px-3 text-[13px] font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700 active:bg-red-100"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>