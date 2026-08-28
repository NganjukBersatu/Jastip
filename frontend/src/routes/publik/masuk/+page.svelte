<script>
  import { enhance } from '$app/forms';

  let { form } = $props(); // berisi { error } kalau login gagal, dikirim dari +page.server.ts

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let mengirim = $state(false);
</script>

<svelte:head>
  <title>Masuk — Nitip</title>
</svelte:head>


<div class="grid md:grid-cols-2 min-h-[calc(100vh-76px)]">
  <!-- Panel kiri: ilustrasi, disembunyikan di mobile -->
  <div class="hidden md:flex relative flex-col justify-between bg-gradient-to-br from-primary to-primary-dark text-white p-14 overflow-hidden">
    <div class="relative z-10">
      <div class="font-display font-black text-2xl">
        Nitip<span class="text-accent">.</span>
      </div>

      <h1 class="mt-16 text-[38px] leading-[1.1] max-w-[380px]">
        Chat, nego, pantau pesanan — semua di satu tempat.
      </h1>
      <p class="mt-4 text-white/80 max-w-[340px] text-[15px]">
        Masuk buat lanjutin titipan kamu, atau cek pesanan yang lagi jalan.
      </p>
    </div>

    <div class="relative z-10 bg-white/10 border border-white/20 rounded-[22px] p-5 max-w-[320px] backdrop-blur-sm">
      <span class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-pill mb-3">
        Bisa nego
      </span>
      <div class="font-bold text-sm">Rujak Cingur Genteng</div>
      <div class="text-[13px] text-white/70 mt-1">Surabaya · mulai Rp18rb</div>
    </div>

    <!-- blob dekoratif -->
    <div class="absolute w-72 h-72 -bottom-16 -right-16 bg-accent/25 rounded-[44%_56%_62%_38%/48%_40%_60%_52%]"></div>
  </div>

  <!-- Panel kanan: form login -->
  <div class="flex items-center justify-center bg-bg px-8 py-16">
    <div class="w-full max-w-[380px]">
      <div class="md:hidden font-display font-black text-2xl text-primary-dark mb-8">
        Nitip<span class="text-ink">.</span>
      </div>

      <h2 class="text-[30px]">Masuk ke akun kamu</h2>
      <p class="mt-2 text-ink-soft text-[15px]">
        Belum punya akun?
        <a href="/publik/daftar" class="font-bold text-primary-dark hover:underline">Daftar dulu</a>
      </p>

      {#if form?.error}
        <div class="mt-6 bg-red-50 border border-red-200 text-red-700 text-[13.5px] font-semibold px-4 py-3 rounded-2xl">
          {form.error}
        </div>
      {/if}

      <form
        method="POST"
        class="mt-9 flex flex-col gap-4"
        use:enhance={() => {
          mengirim = true;
          return async ({ update }) => {
            await update();
            mengirim = false;
          };
        }}
      >
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
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              bind:value={password}
              placeholder="Minimal 8 karakter"
              required
              class="w-full bg-white border border-ink/15 rounded-pill px-5 py-3.5 text-sm outline-none focus:border-primary transition placeholder:text-ink-soft/70 pr-14"
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-soft hover:text-primary-dark transition"
            >
              {showPassword ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </label>

        <div class="flex justify-end -mt-1">
          <a href="/lupa-password" class="text-[13.5px] font-bold text-primary-dark hover:underline">
            Lupa kata sandi?
          </a>
        </div>

        <button
          type="submit"
          disabled={mengirim}
          class="mt-2 inline-flex items-center justify-center rounded-pill bg-ink text-bg font-bold text-[15px] py-3.5 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {mengirim ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div class="flex items-center gap-3 my-7">
        <div class="h-px bg-ink/10 flex-1"></div>
        <span class="text-xs text-ink-soft font-semibold">atau lanjutkan dengan</span>
        <div class="h-px bg-ink/10 flex-1"></div>
      </div>

      <button
        type="button"
        class="w-full inline-flex items-center justify-center gap-2.5 rounded-pill border border-ink/15 bg-white text-ink font-bold text-sm py-3.5 hover:-translate-y-0.5 transition"
      >
        <span>🔍</span> Masuk dengan Google
      </button>

      <p class="mt-8 text-center text-[13px] text-ink-soft">
        Dengan masuk, kamu setuju sama
        <a href="/syarat" class="font-bold text-ink hover:underline">Syarat Layanan</a>
        dan
        <a href="/privasi" class="font-bold text-ink hover:underline">Kebijakan Privasi</a>
        Nitip.
      </p>
    </div>
  </div>
</div>