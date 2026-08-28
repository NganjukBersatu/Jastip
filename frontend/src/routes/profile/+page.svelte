<script>
  import { enhance } from '$app/forms';
  import Footer from '$lib/components/Footer.svelte';

  let { data } = $props();
  let user = $derived(data.user);
  let inisial = $derived(user?.nama?.charAt(0)?.toUpperCase() ?? '?');

  const labelRole = { pelanggan: 'Pelanggan', jastiper: 'Jastiper' };
</script>

<svelte:head>
  <title>Profil Saya — Nitip</title>
</svelte:head>


<div class="bg-bg min-h-[calc(100vh-76px)] py-16">
  <div class="max-w-[720px] mx-auto px-8">
    <!-- Kartu identitas -->
    <div class="bg-gradient-to-br from-primary to-primary-dark rounded-[28px] p-8 md:p-10 text-white relative overflow-hidden">
      <div class="absolute w-52 h-52 -top-14 -right-14 bg-accent/20 rounded-[44%_56%_62%_38%/48%_40%_60%_52%]"></div>

      <div class="relative z-10 flex items-center gap-5">
        <div class="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-display font-semibold">
          {inisial}
        </div>
        <div>
          <h1 class="text-2xl">{user.nama}</h1>
          <p class="text-white/80 text-sm mt-1">{user.email}</p>
          <span class="inline-block mt-2.5 bg-white/20 text-xs font-bold px-3 py-1 rounded-pill uppercase tracking-wide">
            {labelRole[user.role]}
          </span>
        </div>
      </div>
    </div>

    <!-- Info akun -->
    <div class="bg-white rounded-[22px] border border-ink/10 mt-6 divide-y divide-ink/10">
      <div class="p-5 flex justify-between items-center">
        <span class="text-sm text-ink-soft">Nama lengkap</span>
        <span class="font-bold text-sm">{user.nama}</span>
      </div>
      <div class="p-5 flex justify-between items-center">
        <span class="text-sm text-ink-soft">Email</span>
        <span class="font-bold text-sm">{user.email}</span>
      </div>
      <div class="p-5 flex justify-between items-center">
        <span class="text-sm text-ink-soft">Peran</span>
        <span class="font-bold text-sm">{labelRole[user.role]}</span>
      </div>
    </div>

    <!-- Menu tergantung role -->
    {#if user.role === 'jastiper'}
      <a
        href="/jastiper/dashboard"
        class="mt-5 flex items-center justify-between bg-white rounded-[18px] border border-ink/10 p-5 hover:border-primary transition"
      >
        <div>
          <div class="font-bold text-sm">Dashboard jastiper</div>
          <div class="text-[13px] text-ink-soft mt-0.5">Kelola produk, pesanan, dan chat pelanggan</div>
        </div>
        <span class="text-lg">→</span>
      </a>
    {:else}
      <a
        href="/publik/katalog"
        class="mt-5 flex items-center justify-between bg-white rounded-[18px] border border-ink/10 p-5 hover:border-primary transition"
      >
        <div>
          <div class="font-bold text-sm">Riwayat pesanan</div>
          <div class="text-[13px] text-ink-soft mt-0.5">Lihat titipan yang sedang dan sudah berjalan</div>
        </div>
        <span class="text-lg">→</span>
      </a>
    {/if}

    <!-- Tombol keluar -->
    <form method="POST" action="?/keluar" use:enhance class="mt-6">
      <button
        type="submit"
        class="w-full inline-flex items-center justify-center rounded-pill border-2 border-ink/15 text-ink font-bold text-sm py-3.5 hover:border-primary-dark hover:text-primary-dark transition"
      >
        Keluar
      </button>
    </form>
  </div>
</div>

<Footer />