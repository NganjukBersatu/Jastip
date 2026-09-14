<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }
</script>

<svelte:head>
  <title>Ongkir wilayah — Nitip</title>
</svelte:head>

<div class="w-full max-w-285 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <!-- Header -->
  <div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
    <h1 class="text-2xl sm:text-[30px] font-extrabold tracking-[-0.02em] text-ink">
      Ongkir wilayah
    </h1>

    <p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed max-w-155">
      Atur biaya kirim berbeda untuk tiap wilayah yang kamu layani.
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

  <!-- Form tambah wilayah -->
  <form
    method="POST"
    action="?/tambah"
    class="rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.025)] sm:p-6"
    use:enhance={() => {
      mengirim = true;

      return async ({ update }) => {
        await update({ reset: true });
        mengirim = false;
      };
    }}
  >
    <div class="mb-5">
      <h2 class="text-sm font-extrabold text-ink">Tambah wilayah</h2>
      <p class="mt-0.5 text-xs text-ink-soft">
        Tentukan wilayah dan biaya pengirimannya.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_220px_auto] sm:items-end">
      <!-- Nama wilayah -->
      <label class="flex min-w-0 flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">
          Nama wilayah
        </span>

        <input
          type="text"
          name="wilayah"
          placeholder="Contoh: Surabaya Timur"
          required
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>

      <!-- Biaya -->
      <label class="flex min-w-0 flex-col gap-2">
        <span class="text-[12.5px] font-bold text-ink-soft">
          Biaya (Rp)
        </span>

        <input
          type="number"
          name="biaya"
          min="0"
          placeholder="15000"
          required
          class="w-full rounded-xl border border-ink/15 bg-bg px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </label>

      <!-- Tombol -->
      <button
        type="submit"
        disabled={mengirim}
        class="inline-flex h-11.5 w-full items-center justify-center rounded-xl bg-ink px-6 text-sm font-bold text-bg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {mengirim ? 'Menambahkan...' : 'Tambah'}
      </button>
    </div>
  </form>

  <!-- Daftar wilayah -->
  <div class="mt-8 sm:mt-9">
    <div class="mb-3.5 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-extrabold text-ink">
          Wilayah yang dilayani
        </h2>

        {#if data.daftarOngkir.length > 0}
          <span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
            {data.daftarOngkir.length}
          </span>
        {/if}
      </div>
    </div>

    {#if data.daftarOngkir.length === 0}
      <!-- Empty state -->
      <div
        class="rounded-2xl border border-dashed border-ink/15 bg-white px-5 py-14 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] sm:px-10 sm:py-16"
      >
        <div
          class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
        >
          <svg
            class="w-7 h-7 text-primary-dark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 16V7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9" />
            <path d="M14 10h4.5a1 1 0 0 1 .9.55L21 14v2a1 1 0 0 1-1 1h-1" />
            <path d="M3 16a1 1 0 0 0 1 1h1" />
            <circle cx="7.5" cy="17.5" r="1.6" />
            <circle cx="17" cy="17.5" r="1.6" />
          </svg>
        </div>

        <div class="font-bold text-[15px] text-ink">
          Belum ada wilayah diatur
        </div>

        <div class="mx-auto mt-1.5 max-w-[320px] text-[13.5px] leading-relaxed text-ink-soft">
          Tambahkan wilayah pertama lewat form di atas untuk mulai mengatur
          biaya pengiriman.
        </div>
      </div>
    {:else}
      <!-- List -->
      <div
        class="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.025)]"
      >
        {#each data.daftarOngkir as o, index (o.id)}
          <div
            class:!border-b-0={index === data.daftarOngkir.length - 1}
            class="flex min-h-18 flex-col gap-3 border-b border-ink/10 px-4 py-4 transition hover:bg-bg/40 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            <!-- Informasi wilayah -->
            <div class="min-w-0">
              <div
                class="truncate text-sm font-bold text-ink sm:text-[14px]"
                title={o.wilayah}
              >
                {o.wilayah}
              </div>

              <div class="mt-1 text-[13px] font-medium text-ink-soft">
                Ongkir
              </div>
            </div>

            <!-- Harga + hapus -->
            <div class="flex items-center justify-between gap-4 sm:justify-end">
              <div class="whitespace-nowrap text-sm font-extrabold text-ink">
                {formatRupiah(o.biaya)}
              </div>

              <form method="POST" action="?/hapus" use:enhance>
                <input type="hidden" name="id" value={o.id} />

                <button
                  type="submit"
                  class="rounded-lg px-2.5 py-2 text-[13px] font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700 active:bg-red-100"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>