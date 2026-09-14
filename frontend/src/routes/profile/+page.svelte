<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  let { data } = $props();

  let user = $derived(data?.user ?? null);

  let displayNama = $state('');
  let displayEmail = $state('');
  let avatarUrl = $state<string | null>(null);

  let inisial = $derived((displayNama || '?').charAt(0).toUpperCase());

  const labelRole: Record<string, string> = {
    pelanggan: 'Pelanggan',
    jastiper: 'Jastiper'
  };

  let isEditing = $state(false);
  let editNama = $state('');
  let editEmail = $state('');
  let fileInput: HTMLInputElement | undefined = $state();

  onMount(() => {
    displayNama = user?.nama ?? '';
    displayEmail = user?.email ?? '';

    if (!user?.email) return;

    try {
      const savedAvatar = localStorage.getItem(`avatar_${user.email}`);
      if (savedAvatar) avatarUrl = savedAvatar;

      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed?.nama) displayNama = parsed.nama;
        if (parsed?.email) displayEmail = parsed.email;
      }
    } catch (e) {
      console.error(e);
    }
  });

  function mulaiEdit() {
    editNama = displayNama;
    editEmail = displayEmail;
    isEditing = true;
  }

  function batalEdit() {
    isEditing = false;
  }

  function simpanPerubahan() {
    if (!editNama.trim() || !editEmail.trim()) return;

    displayNama = editNama.trim();
    displayEmail = editEmail.trim();
    isEditing = false;

    if (!user?.email) return;

    try {
      localStorage.setItem(
        `profile_${user.email}`,
        JSON.stringify({ nama: displayNama, email: displayEmail })
      );
    } catch (e) {
      console.error(e);
    }
  }

  function handleGantiFoto() {
    fileInput?.click();
  }

  function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 1.5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      avatarUrl = base64;

      if (user?.email) {
        try {
          localStorage.setItem(`avatar_${user.email}`, base64);
        } catch (e) {
          console.error(e);
        }
      }
    };
    reader.readAsDataURL(file);
  }
</script>

<svelte:head>
  <title>Profil Saya — Nitip</title>
</svelte:head>

<div class="bg-bg min-h-[calc(100vh-76px)] flex items-center justify-center py-12 px-4">
  <div class="w-full max-w-[1100px]">
    {#if user}
      <div class="bg-[#FFF8EC] rounded-[28px] p-8 md:p-10 border border-[#FFE9C7] shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] gap-7">

          <!-- Card Kiri -->
          <div class="bg-white rounded-[26px] border border-[#FFE9C7] px-6 py-10 text-center flex flex-col items-center">
            <div class="relative w-[96px] h-[96px] mb-5">
              {#if avatarUrl}
                <img
                  src={avatarUrl}
                  alt="Foto profil"
                  class="w-[96px] h-[96px] rounded-full object-cover"
                />
              {:else}
                <div
                  class="w-[96px] h-[96px] rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-3xl font-semibold text-[#FFF8EC] font-display"
                >
                  {inisial}
                </div>
              {/if}

              <button
                type="button"
                aria-label="Ganti foto"
                onclick={handleGantiFoto}
                class="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-accent border-2 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 text-[#8F2B08]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
                  <circle cx="12" cy="13" r="3.2" />
                </svg>
              </button>

              <input
                type="file"
                accept="image/*"
                class="hidden"
                bind:this={fileInput}
                onchange={onFileChange}
              />
            </div>

            <p class="text-xl font-semibold mb-1.5 text-ink font-display">{displayNama || user?.nama}</p>
            <p class="text-sm text-ink-soft mb-5 break-all px-2">{displayEmail || user?.email}</p>
            <span class="inline-flex items-center gap-1.5 bg-[#FFE9C7] text-[#8F2B08] text-xs font-semibold px-4 py-2 rounded-pill">
              {labelRole[user?.role] ?? '-'}
            </span>
          </div>

          <!-- Card Kanan -->
          <div class="flex flex-col gap-5 min-w-0">
            {#if isEditing}
              <div class="bg-white rounded-[26px] border border-[#FFE9C7] px-6 py-6">
                <p class="text-sm text-ink-soft mb-5 font-semibold">Edit profil</p>

                <div class="space-y-5">
                  <div>
                    <label class="block text-xs text-ink-soft mb-1.5">Nama lengkap</label>
                    <input
                      type="text"
                      bind:value={editNama}
                      class="w-full px-4 py-2.5 rounded-xl border border-[#FFE9C7] bg-[#FFF8EC] text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-xs text-ink-soft mb-1.5">Email</label>
                    <input
                      type="email"
                      bind:value={editEmail}
                      class="w-full px-4 py-2.5 rounded-xl border border-[#FFE9C7] bg-[#FFF8EC] text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                      required
                    />
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button
                      type="button"
                      onclick={simpanPerubahan}
                      class="flex-1 py-2.5 text-sm font-semibold bg-gradient-to-br from-primary to-primary-dark text-white rounded-pill hover:opacity-95 transition-opacity"
                    >
                      Simpan perubahan
                    </button>
                    <button
                      type="button"
                      onclick={batalEdit}
                      class="flex-1 py-2.5 text-sm font-semibold bg-white text-primary-dark border border-[#FFE9C7] rounded-pill hover:bg-[#FFF8EC] transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            {:else}
              <div class="bg-white rounded-[26px] border border-[#FFE9C7] px-6 py-6">
                <p class="text-sm text-ink-soft mb-4 font-semibold">Informasi akun</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p class="text-xs text-ink-soft mb-1">Nama lengkap</p>
                    <p class="text-sm font-semibold text-ink">{displayNama || user?.nama}</p>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-ink-soft mb-1">Email</p>
                    <p class="text-sm font-semibold text-ink truncate">{displayEmail || user?.email}</p>
                  </div>
                  <div>
                    <p class="text-xs text-ink-soft mb-1">Peran</p>
                    <p class="text-sm font-semibold text-ink">{labelRole[user?.role] ?? '-'}</p>
                  </div>
                </div>
              </div>

              {#if user?.role === 'jastiper'}
                <a
                  href="/jastiper/dashboard"
                  class="bg-gradient-to-br from-primary to-primary-dark rounded-[26px] px-6 py-5 flex items-center gap-4 hover:opacity-95 transition-opacity"
                >
                  <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-[#FFF8EC]">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white m-0">Dashboard jastiper</p>
                    <p class="text-xs text-[#FFE9C7] m-0">Kelola produk, pesanan, dan chat pelanggan</p>
                  </div>
                  <span class="text-white shrink-0 text-lg">→</span>
                </a>
              {:else}
                <a
                  href="/pesanan"
                  class="bg-gradient-to-br from-primary to-primary-dark rounded-[26px] px-6 py-5 flex items-center gap-4 hover:opacity-95 transition-opacity"
                >
                  <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-[#FFF8EC]">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v4H4zM6 8v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8M9 12h6" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white m-0">Riwayat pesanan</p>
                    <p class="text-xs text-[#FFE9C7] m-0">Lihat titipan yang sedang dan sudah berjalan</p>
                  </div>
                  <span class="text-white shrink-0 text-lg">→</span>
                </a>
              {/if}

              <div class="flex flex-col sm:flex-row gap-3 mt-1">
                <button
                  type="button"
                  onclick={mulaiEdit}
                  class="flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 bg-[#FFE9C7] text-[#8F2B08] border border-accent rounded-pill hover:bg-[#FFE0B0] transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.5 3.5 4 4L7 21H3v-4Z" />
                  </svg>
                  Edit profil
                </button>

                <form method="POST" action="?/keluar" use:enhance class="flex-1">
                  <button
                    type="submit"
                    class="w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 bg-white text-primary-dark border border-[#FFE9C7] rounded-pill hover:bg-[#FFF8EC] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Keluar
                  </button>
                </form>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-20 text-ink-soft">
        <p class="mb-4 text-base">Kamu belum login.</p>
        <a
          href="/login"
          class="inline-flex items-center gap-1.5 bg-primary text-white px-6 py-2.5 rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Masuk ke akun
        </a>
      </div>
    {/if}
  </div>
</div>