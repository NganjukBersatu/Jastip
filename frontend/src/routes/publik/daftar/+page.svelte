<script>
  import { enhance } from '$app/forms';

  let { form } = $props();

  let nama = $state('');
  let email = $state('');
  let password = $state('');
  let role = $state('pelanggan'); // 'pelanggan' | 'jastiper'
  let mengirim = $state(false);
</script>

<svelte:head>
  <title>Daftar — Nitip</title>
</svelte:head>


<div class="grid md:grid-cols-2 min-h-[calc(100vh-76px)]">
  <div class="hidden md:flex relative flex-col justify-between bg-gradient-to-br from-primary to-primary-dark text-white p-14 overflow-hidden">
    <div class="relative z-10">
      <div class="font-display font-black text-2xl">
        Nitip<span class="text-accent">.</span>
      </div>

      <h1 class="mt-16 text-[38px] leading-[1.1] max-w-[380px]">
        Mulai titip atau mulai jadi jastiper hari ini.
      </h1>
      <p class="mt-4 text-white/80 max-w-[340px] text-[15px]">
        Satu akun buat dua peran — kamu bisa jadi pelanggan sekaligus buka lapak jastiper kapan pun.
      </p>
    </div>

    <div class="relative z-10 flex gap-8">
      <div>
        <b class="font-display text-3xl text-accent block">1.2rb+</b>
        <span class="text-[12.5px] text-white/70">jastiper aktif</span>
      </div>
      <div>
        <b class="font-display text-3xl text-accent block">38</b>
        <span class="text-[12.5px] text-white/70">kota &amp; kabupaten</span>
      </div>
    </div>

    <div class="absolute w-72 h-72 -bottom-16 -right-16 bg-accent/25 rounded-[44%_56%_62%_38%/48%_40%_60%_52%]"></div>
  </div>

  <div class="flex items-center justify-center bg-bg px-8 py-16">
    <div class="w-full max-w-[380px]">
      <div class="md:hidden font-display font-black text-2xl text-primary-dark mb-8">
        Nitip<span class="text-ink">.</span>
      </div>

      <h2 class="text-[30px]">Buat akun baru</h2>
      <p class="mt-2 text-ink-soft text-[15px]">
        Sudah punya akun?
        <a href="/publik/masuk" class="font-bold text-primary-dark hover:underline">Masuk di sini</a>
      </p>

      <!-- Pilihan daftar sebagai apa -->
      <div class="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onclick={() => (role = 'pelanggan')}
          class="rounded-2xl border-2 p-4 text-left transition {role === 'pelanggan'
            ? 'border-primary bg-bg-alt'
            : 'border-ink/10 bg-white'}"
        >
          <div class="font-bold text-sm">Pelanggan</div>
          <div class="text-[12.5px] text-ink-soft mt-0.5">Mau titip barang</div>
        </button>

        <button
          type="button"
          onclick={() => (role = 'jastiper')}
          class="rounded-2xl border-2 p-4 text-left transition {role === 'jastiper'
            ? 'border-primary bg-bg-alt'
            : 'border-ink/10 bg-white'}"
        >
          <div class="font-bold text-sm">Jastiper</div>
          <div class="text-[12.5px] text-ink-soft mt-0.5">Mau buka lapak titip</div>
        </button>
      </div>

      {#if form?.error}
        <div class="mt-6 bg-red-50 border border-red-200 text-red-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
          {form.error}
        </div>
      {/if}

      <form
        method="POST"
        class="mt-6 flex flex-col gap-4"
        use:enhance={() => {
          mengirim = true;
          return async ({ update }) => {
            await update();
            mengirim = false;
          };
        }}
      >
        <input type="hidden" name="role" value={role} />

        <label class="flex flex-col gap-2">
          <span class="text-[13.5px] font-bold text-ink">Nama lengkap</span>
          <input
            type="text"
            name="nama"
            bind:value={nama}
            placeholder="Nama kamu"
            required
            class="bg-white border border-ink/15 rounded-pill px-5 py-3.5 text-sm outline-none focus:border-primary transition placeholder:text-ink-soft/70"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-[13.5px] font-bold text-ink">Email</span>
          <input
            type="email"
            name="email"
            bind:value={email}
            placeholder="nama@email.com"
            required
            class="bg-white border border-ink/15 rounded-pill px-5 py-3.5 text-sm outline-none focus:border-primary transition placeholder:text-ink-soft/70"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-[13.5px] font-bold text-ink">Kata sandi</span>
          <input
            type="password"
            name="password"
            bind:value={password}
            placeholder="Minimal 8 karakter"
            minlength="8"
            required
            class="bg-white border border-ink/15 rounded-pill px-5 py-3.5 text-sm outline-none focus:border-primary transition placeholder:text-ink-soft/70"
          />
        </label>

        <button
          type="submit"
          disabled={mengirim}
          class="mt-2 inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[15px] py-3.5 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {mengirim ? 'Membuat akun...' : `Daftar sebagai ${role === 'jastiper' ? 'jastiper' : 'pelanggan'}`}
        </button>
      </form>

      <p class="mt-8 text-center text-[13px] text-ink-soft">
        Dengan daftar, kamu setuju sama
        <a href="/syarat" class="font-bold text-ink hover:underline">Syarat Layanan</a>
        dan
        <a href="/privasi" class="font-bold text-ink hover:underline">Kebijakan Privasi</a>
        Nitip.
      </p>
    </div>
  </div>
</div>