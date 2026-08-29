<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let mengirim = $state(false);

  /** @param {number} angka */
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  }
</script>

<svelte:head>
  <title>Ongkir wilayah — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[640px]">
  <h1 class="text-[28px]">Ongkir wilayah</h1>
  <p class="text-ink-soft mt-1 text-[15px]">Atur biaya kirim berbeda untuk tiap wilayah yang kamu layani.</p>

  {#if form?.error}
    <div class="mt-6 bg-red-50 border border-red-200 text-red-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
      {form.error}
    </div>
  {/if}

  <!-- Form tambah wilayah -->
  <form
    method="POST"
    action="?/tambah"
    class="mt-7 bg-white rounded-2xl border border-ink/10 p-5 flex gap-3 items-end flex-wrap"
    use:enhance={() => {
      mengirim = true;
      return async ({ update }) => {
        await update({ reset: true });
        mengirim = false;
      };
    }}
  >
    <label class="flex flex-col gap-2 flex-1 min-w-[160px]">
      <span class="text-[12.5px] font-bold text-ink-soft">Nama wilayah</span>
      <input
        type="text"
        name="wilayah"
        placeholder="Surabaya Timur"
        required
        class="bg-bg border border-ink/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
      />
    </label>
    <label class="flex flex-col gap-2 w-[160px]">
      <span class="text-[12.5px] font-bold text-ink-soft">Biaya (Rp)</span>
      <input
        type="number"
        name="biaya"
        min="0"
        placeholder="15000"
        required
        class="bg-bg border border-ink/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition"
      />
    </label>
    <button
      type="submit"
      disabled={mengirim}
      class="inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-sm px-5 py-2.5 hover:-translate-y-0.5 transition disabled:opacity-60"
    >
      Tambah
    </button>
  </form>

  <!-- Daftar wilayah -->
  {#if data.daftarOngkir.length === 0}
    <div class="mt-6 bg-white rounded-2xl border border-dashed border-ink/15 p-10 text-center">
      <div class="font-bold text-sm">Belum ada wilayah diatur</div>
      <div class="text-[13.5px] text-ink-soft mt-1">Tambahkan wilayah pertama lewat form di atas.</div>
    </div>
  {:else}
    <div class="mt-6 bg-white rounded-2xl border border-ink/10 divide-y divide-ink/10">
      {#each data.daftarOngkir as o (o.id)}
        <div class="p-4 flex justify-between items-center">
          <div>
            <div class="font-bold text-sm">{o.wilayah}</div>
            <div class="text-[13px] text-ink-soft">{formatRupiah(o.biaya)}</div>
          </div>
          <form method="POST" action="?/hapus" use:enhance>
            <input type="hidden" name="id" value={o.id} />
            <button type="submit" class="text-[13px] font-bold text-red-500 hover:text-red-700 transition">
              Hapus
            </button>
          </form>
        </div>
      {/each}
    </div>
  {/if}
</div>