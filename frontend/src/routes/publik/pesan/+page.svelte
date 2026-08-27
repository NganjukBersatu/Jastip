<script>
  /**
   * @typedef {{ id: string, nama: string, kota: string, online: boolean, avatarInisial: string, avatarWarna: string, pesanTerakhir: string, waktuTerakhir: string }} Percakapan
   * @typedef {{ emoji: string, img: string, title: string, harga: string, from: boolean }} ProdukDibahas
   * @typedef {{ dari: 'saya' | 'jastiper', tipe?: 'teks' | 'tawaran', teks?: string, nominal?: string, waktu: string }} Pesan
   */

  // ===== DATA (nanti diganti data asli dari backend / load function) =====

  /** @type {Percakapan[]} */
  const daftarPercakapan = [
    { id: 'rani', nama: 'Rani', kota: 'Malang', online: true, avatarInisial: 'R', avatarWarna: '#B5541F', pesanTerakhir: 'Oke deal kak Rp78.000, aku siapin ya', waktuTerakhir: '09.18' },
    { id: 'bayu', nama: 'Bayu', kota: 'Kediri', online: false, avatarInisial: 'B', avatarWarna: '#5F7A4A', pesanTerakhir: 'Tiketnya sudah dikirim ya', waktuTerakhir: 'Kemarin' },
    { id: 'sari', nama: 'Sari', kota: 'Surabaya', online: false, avatarInisial: 'S', avatarWarna: '#8A5A1E', pesanTerakhir: 'Boleh nego dikit ga kak?', waktuTerakhir: 'Kemarin' }
  ];

  /** @type {Record<string, ProdukDibahas>} */
  const produkPerPercakapan = {
    rani: { emoji: '🧴', img: 'bg-gradient-to-br from-bg-alt to-accent', title: 'Skincare lokal batch baru', harga: 'Rp85.000', from: true },
    bayu: { emoji: '🎟️', img: 'bg-gradient-to-br from-[#FFB199] to-primary-dark', title: 'Tiket festival kuliner', harga: 'Rp25.000', from: false },
    sari: { emoji: '👜', img: 'bg-gradient-to-br from-accent to-primary', title: 'Tas rajut handmade', harga: 'Rp120.000', from: true }
  };

  /** @type {Record<string, Pesan[]>} */
  const pesanPerPercakapan = {
    rani: [
      { dari: 'jastiper', tipe: 'teks', teks: 'Halo kak, ada yang bisa dibantu soal produk ini?', waktu: '09.12' },
      { dari: 'saya', tipe: 'teks', teks: 'Halo kak Rani, ini masih ready ga ya?', waktu: '09.13' },
      { dari: 'jastiper', tipe: 'teks', teks: 'Masih ready kak, stok tinggal 3 lagi', waktu: '09.14' },
      { dari: 'saya', tipe: 'tawaran', nominal: 'Rp70.000', waktu: '09.15' },
      { dari: 'jastiper', tipe: 'teks', teks: 'Waduh kalau segitu belum bisa kak, ongkos titipnya lumayan', waktu: '09.16' },
      { dari: 'saya', tipe: 'tawaran', nominal: 'Rp78.000', waktu: '09.17' },
      { dari: 'jastiper', tipe: 'teks', teks: 'Oke deal kak Rp78.000, aku siapin ya', waktu: '09.18' }
    ],
    bayu: [
      { dari: 'jastiper', tipe: 'teks', teks: 'Tiketnya sudah dikirim ya kak', waktu: 'Kemarin' }
    ],
    sari: [
      { dari: 'jastiper', tipe: 'teks', teks: 'Boleh nego dikit ga kak?', waktu: 'Kemarin' }
    ]
  };

  // id percakapan yang lagi dibuka. Di real app ini datang dari param URL (lihat "cara pemakaian" di bawah).
  let { percakapanAktifId = $bindable('rani') } = $props();

  // di mobile, sidebar & panel chat gantian tampil; state ini nentuin lagi di layar mana
  let tampilanMobile = $state('sidebar'); // 'sidebar' | 'chat'

  let draft = $state('');

  let percakapanAktif = $derived(daftarPercakapan.find((p) => p.id === percakapanAktifId));
  let produkDibahas = $derived(produkPerPercakapan[percakapanAktifId]);
  let pesan = $derived(pesanPerPercakapan[percakapanAktifId] ?? []);

  /** @param {string} id */
  function bukaPercakapan(id) {
    percakapanAktifId = id;
    tampilanMobile = 'chat';
  }

  function kembaliKeSidebar() {
    tampilanMobile = 'sidebar';
  }

  function kirimPesan() {
    if (!draft.trim()) return;
    pesanPerPercakapan[percakapanAktifId] = [
      ...pesan,
      { dari: 'saya', tipe: 'teks', teks: draft.trim(), waktu: 'Baru saja' }
    ];
    draft = '';
  }

  function ajukanTawaran() {
    const nominal = prompt('Masukkan nominal tawaran, misal: 75000');
    if (!nominal) return;
    const angka = Number(nominal.replace(/\D/g, ''));
    if (!angka) return;
    pesanPerPercakapan[percakapanAktifId] = [
      ...pesan,
      { dari: 'saya', tipe: 'tawaran', nominal: `Rp${angka.toLocaleString('id-ID')}`, waktu: 'Baru saja' }
    ];
  }
</script>

<svelte:head>
  <title>Pesan — Nitip.</title>
</svelte:head>

<div class="h-screen flex bg-bg-alt overflow-hidden">
  <!-- ===== SIDEBAR DAFTAR PERCAKAPAN ===== -->
  <!-- Mobile: tampil penuh saat tampilanMobile === 'sidebar'. Desktop (md:): selalu tampil di kiri. -->
  <div
    class="w-full md:w-[280px] shrink-0 bg-white border-r border-ink/10 flex-col
           {tampilanMobile === 'sidebar' ? 'flex' : 'hidden'} md:flex"
  >
    <div class="px-4 py-4 border-b border-ink/10">
      <div class="font-bold text-lg">Pesan</div>
      <div class="mt-2.5 flex items-center gap-2 bg-bg-alt rounded-full px-3.5 py-2">
        <span class="text-ink-soft text-sm">🔍</span>
        <input
          type="text"
          placeholder="Cari jastiper"
          class="bg-transparent text-sm outline-none flex-1 placeholder:text-ink-soft"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      {#each daftarPercakapan as p}
        <button
          onclick={() => bukaPercakapan(p.id)}
          class="w-full text-left px-4 py-3 flex items-start gap-3 border-l-[3px] transition-colors
                 {p.id === percakapanAktifId
            ? 'bg-bg-alt border-l-primary-dark'
            : 'border-l-transparent hover:bg-bg-alt/60'}"
        >
          <div
            class="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shrink-0"
            style="background-color: {p.avatarWarna}"
          >
            {p.avatarInisial}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex justify-between items-baseline gap-2">
              <span class="text-sm font-bold truncate">{p.nama}</span>
              <span class="text-[10.5px] text-ink-soft shrink-0">{p.waktuTerakhir}</span>
            </div>
            <div class="text-xs text-ink-soft truncate mt-0.5">{p.pesanTerakhir}</div>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- ===== PANEL CHAT AKTIF ===== -->
  <!-- Mobile: tampil penuh saat tampilanMobile === 'chat'. Desktop (md:): selalu tampil di kanan. -->
  {#if percakapanAktif}
    <div class="flex-1 min-w-0 flex-col {tampilanMobile === 'chat' ? 'flex' : 'hidden'} md:flex">
      <!-- Header -->
      <div class="bg-white border-b border-ink/10 px-4 md:px-6 py-3.5 flex items-center gap-3 shrink-0">
        <button
          onclick={kembaliKeSidebar}
          aria-label="Kembali ke daftar pesan"
          class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg-alt shrink-0 md:hidden"
        >
          ←
        </button>

        <div
          class="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shrink-0"
          style="background-color: {percakapanAktif.avatarWarna}"
        >
          {percakapanAktif.avatarInisial}
        </div>

        <div class="min-w-0">
          <div class="font-bold text-[15px] truncate">{percakapanAktif.nama}</div>
          <div class="text-xs text-ink-soft flex items-center gap-1.5">
            {#if percakapanAktif.online}
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online · {percakapanAktif.kota}
            {:else}
              {percakapanAktif.kota}
            {/if}
          </div>
        </div>
      </div>

      <!-- Kartu produk yang sedang dibahas (pinned) -->
      {#if produkDibahas}
        <div class="bg-white border-b border-ink/10 px-4 md:px-6 py-3 shrink-0">
          <div class="flex items-center gap-3 bg-bg-alt rounded-2xl p-2.5">
            <div class="w-12 h-12 rounded-xl {produkDibahas.img} flex items-center justify-center text-2xl shrink-0">
              {produkDibahas.emoji}
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold truncate">{produkDibahas.title}</div>
              <div class="text-xs text-ink-soft">
                {produkDibahas.harga}
                {#if produkDibahas.from}<span>mulai dari</span>{/if}
              </div>
            </div>
            <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-accent text-ink shrink-0">
              Nego
            </span>
          </div>
        </div>
      {/if}

      <!-- Area pesan -->
      <div class="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex flex-col gap-3">
        {#each pesan as p}
          {#if p.dari === 'jastiper'}
            <div class="flex items-end gap-2 max-w-[78%]">
              <div
                class="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                style="background-color: {percakapanAktif.avatarWarna}"
              >
                {percakapanAktif.avatarInisial}
              </div>
              <div>
                <div class="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm shadow-[0_2px_8px_rgba(42,26,14,0.05)]">
                  {p.teks}
                </div>
                <div class="text-[10.5px] text-ink-soft mt-1 ml-1">{p.waktu}</div>
              </div>
            </div>
          {:else if p.tipe === 'tawaran'}
            <div class="self-end max-w-[78%]">
              <div class="bg-primary-dark text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_2px_8px_rgba(42,26,14,0.1)]">
                <div class="text-[10.5px] font-bold uppercase tracking-wide text-accent">Tawaran harga</div>
                <div class="font-display font-semibold text-lg mt-0.5">{p.nominal}</div>
              </div>
              <div class="text-[10.5px] text-ink-soft mt-1 mr-1 text-right">{p.waktu}</div>
            </div>
          {:else}
            <div class="self-end max-w-[78%]">
              <div class="bg-ink text-bg rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
                {p.teks}
              </div>
              <div class="text-[10.5px] text-ink-soft mt-1 mr-1 text-right">{p.waktu}</div>
            </div>
          {/if}
        {/each}
      </div>

      <!-- Input pesan -->
      <div class="bg-white border-t border-ink/10 px-4 md:px-6 py-3 shrink-0">
        <div class="flex items-center gap-2 mb-2.5 overflow-x-auto">
          <button
            onclick={ajukanTawaran}
            class="whitespace-nowrap text-xs font-bold px-3.5 py-2 rounded-full bg-accent text-ink shrink-0"
          >
            💰 Ajukan tawaran
          </button>
          <button class="whitespace-nowrap text-xs font-bold px-3.5 py-2 rounded-full bg-bg-alt text-ink-soft shrink-0">
            📷 Kirim foto
          </button>
          <button
            onclick={() => (draft = 'Masih ready ga kak?')}
            class="whitespace-nowrap text-xs font-bold px-3.5 py-2 rounded-full bg-bg-alt text-ink-soft shrink-0"
          >
            Masih ready ga kak?
          </button>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="text"
            bind:value={draft}
            onkeydown={(e) => e.key === 'Enter' && kirimPesan()}
            placeholder="Tulis pesan..."
            class="flex-1 rounded-full px-4 py-3 bg-bg-alt text-sm outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onclick={kirimPesan}
            aria-label="Kirim pesan"
            class="w-11 h-11 rounded-full bg-ink text-bg flex items-center justify-center font-bold shrink-0 disabled:opacity-40"
            disabled={!draft.trim()}
          >
            →
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>