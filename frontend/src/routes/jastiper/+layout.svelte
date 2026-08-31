<script>
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';

  let { data, children } = $props();

  const menu = [
    {
      href: '/jastiper/dashboard',
      label: 'Dashboard',
      icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
    },
    {
      href: '/jastiper/produk',
      label: 'Produk saya',
      icon: '<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
    },
    {
      href: '/jastiper/pengajuan-harga',
      label: 'Pengajuan harga',
      icon: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>'
    },
    {
      href: '/jastiper/pesanan',
      label: 'Pesanan',
      icon: '<path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>'
    },
    {
      href: '/jastiper/ongkir',
      label: 'Ongkir wilayah',
      icon: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'
    },
    {
      href: '/jastiper/pengaturan',
      label: 'Pengaturan profil',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'
    }
  ];

  let inisial = $derived(data.user?.nama?.charAt(0)?.toUpperCase() ?? '?');
</script>

<div class="min-h-screen bg-bg flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r border-ink/10 flex flex-col shrink-0">
    <div class="p-6 border-b border-ink/10">
      <div class="text-[11px] font-bold text-ink-soft uppercase tracking-wide">
        Panel Jastiper
      </div>
    </div>

    <nav class="flex-1 p-4 flex flex-col gap-1">
      {#each menu as item}
        <a
          href={item.href}
          class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition
            {$page.url.pathname === item.href
              ? 'bg-primary text-white'
              : 'text-ink-soft hover:bg-bg-alt hover:text-ink'}"
        >
          <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            {@html item.icon}
          </svg>
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-ink/10">
      <a href="/profile
      " class="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-bg-alt transition">
        <span class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
          {inisial}
        </span>
        <div class="min-w-0">
          <div class="text-sm font-bold truncate">{data.user.nama}</div>
          <div class="text-[12px] text-ink-soft">Lihat profil</div>
        </div>
      </a>
    </div>
  </aside>

  <!-- Konten halaman -->
  <div class="flex-1 min-w-0">
    {@render children()}
  </div>
</div>