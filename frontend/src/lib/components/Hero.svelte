<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const categories = [
    {
      bg: 'linear-gradient(135deg,#FF9B54 0%, #E8621F 55%, #C93712 100%)',
      accent: '#FFC64B',
      ctaColor: '#C93712',
      image: '/hero-images/jajanan.jpg',
      imageAlt: 'Jajanan khas',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3v18"/><path d="M7 3v6a2 2 0 0 0 4 0V3"/><path d="M17 3c-1 1-2 3-2 6s1 5 2 5 2-2 2-5-1-5-2-6z"/></svg>`,     
      sub: 'Nggak perlu ke luar kota buat dapetin jajanan, oleh-oleh, atau barang langka. Chat jastiper terdekat, deal harga, tinggal tunggu sampai.',
      cardTitle: 'Lumpia Basah Ny.Lin',
      cardMeta: 'Surabaya · mulai Rp15rb',
      jastiperName: 'Rina',
      jastiperLoc: 'Surabaya',
      jastiperMsg: '"Siap kak, otw ambil ya 🛵"'
    },
    {
      bg: 'linear-gradient(135deg,#FF7A3D 0%, #E24B22 55%, #A6300F 100%)',
      accent: '#FFD983',
      ctaColor: '#A6300F',
      image: '/hero-images/paket.jpg',
      imageAlt: 'Serah terima paket',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.11-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.79 0z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" x2="12" y2="11"/></svg>`,
      sub: 'Barang dari luar kota, dokumen, atau apapun yang mesti sampai cepat. Serahin ke jastiper terpercaya, pantau sampai tujuan.',
      cardTitle: 'Antar Kilat',
      cardMeta: 'Malang · mulai Rp10rb',
      jastiperName: 'Dinda',
      jastiperLoc: 'Malang',
      jastiperMsg: '"Oke kak, meluncur ya 🏍️"'

    },
    {
      bg: 'linear-gradient(135deg,#FFB454 0%, #D6390F 55%, #8C2408 100%)',
      accent: '#FFE29A',
      ctaColor: '#8C2408',
      image: '/hero-images/hampres.jpg',
      imageAlt: 'Oleh-oleh khas daerah',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
      sub: 'Pengen bawa pulang oleh-oleh khas daerah tanpa perlu ke sana? Jastiper lokal siap cariin yang paling otentik.',
      cardTitle: 'Hampers Custom',
      cardMeta: 'Jogja-Jatim · mulai Rp25rb',
      jastiperName: 'Bagas',
      jastiperLoc: 'Jogja',
      jastiperMsg: '"Udah dapet, kak. Otw kirim 📦"'


    },
    {
      bg: 'linear-gradient(135deg,#FF8A5C 0%, #E85A2A 55%, #B23A1D 100%)',
      accent: '#FFDDBF',
      ctaColor: '#B23A1D',
      image: '/hero-images/custom.jpg',
      imageAlt: 'Barang custom dan belanja',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      sub: 'Barang unik, edisi terbatas, atau susah dicari sendiri? Jastiper siap bantu buru sampai dapet, kamu tinggal terima.',
      cardTitle: 'Cari Semua Barang',
      cardMeta: 'Se-Jatim · nego harga',
      jastiperName: 'Sari',
      jastiperLoc: 'Kediri',
      jastiperMsg: '"Nemu barangnya kak, fix ya 👍"'
    }
  ];

  let current = $state(0);
  let timer: ReturnType<typeof setInterval> | undefined;

  function setActive(i: number, userTriggered: boolean) {
    current = i;
    if (userTriggered) {
      clearInterval(timer);
      startAutoplay();
    }
  }

  function startAutoplay() {
    timer = setInterval(() => {
      current = (current + 1) % categories.length;
    }, 4500);
  }

  onMount(() => {
    startAutoplay();
  });

  onDestroy(() => {
    clearInterval(timer);
  });

  let active = $derived(categories[current]);
</script>

<section class="hero" style="background:{active.bg}">
  <div class="hero-left">
    <div class="badge"><span class="dot"></span>KHUSUS AREA JAWA TIMUR</div>

    <h1>
      Nitip apa aja,<br />
      <span class="accent" style="color:{active.accent}">ke mana aja.</span>
    </h1>

    <p class="sub">{active.sub}</p>

    <div class="picker-row">
      <span class="picker-label">TITIP:</span>
      {#each categories as c, i}
<button
  class="pick"
  class:active={i === current}
  onclick={() => setActive(i, true)}
  aria-label={c.imageAlt}
>
  {@html c.icon}
        </button>
      {/each}
    </div>

    <div class="cta-row">
      <button class="btn-primary" style="color:{active.ctaColor}">Lihat katalog</button>
      <button class="btn-outline">Jadi jastiper →</button>
    </div>
  </div>

  <div class="hero-right">
    <div class="blob">
      {#each categories as c, i}
        <div class="blob-img" class:active={i === current}>
          <img src={c.image} alt={c.imageAlt} />
        </div>
      {/each}
    </div>


    <div class="float-card card-a">
      <span class="pill-nego">Bisa nego</span>
      <div class="title">{active.cardTitle}</div>
      <div class="meta">{active.cardMeta}</div>
    </div>

<div class="float-card card-b">
  <div class="card-b-top">
    <div class="avatar"></div>
    <div>
      <div class="name">Jastiper · {active.jastiperName}</div>
      <div class="sub-role">{active.jastiperLoc}</div>
    </div>
  </div>
  <div class="msg">{active.jastiperMsg}</div>
</div>
</div>

  <div class="hero-curve">
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
      <path d="M0,40 C 240,90 420,0 720,20 C 1020,40 1200,90 1440,30 L1440,80 L0,80 Z" />
    </svg>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: 72px 64px 100px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 40px;
    align-items: center;
    min-height: 560px;
    transition: background 1.1s ease;
  }

  .hero-curve {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    z-index: 1;
    pointer-events: none;
  }
  .hero-curve svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .hero-curve path {
  fill: var(--color-bg, #FFF8EC);
}

  .hero-left {
    position: relative;
    z-index: 3;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.35);
    color: #ffe9d6;
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 22px;
  }
  .badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffc64b;
  }

  h1 {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 60px;
    line-height: 1.05;
    color: #fff;
    letter-spacing: -0.01em;
    margin: 0 0 20px;
  }
  h1 .accent {
    transition: color 0.8s ease;
  }

  .sub {
    color: #ffe4d2;
    font-size: 16.5px;
    line-height: 1.6;
    max-width: 440px;
    margin: 0 0 28px;
    min-height: 78px;
  }

  .picker-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
  }
  .picker-label {
    color: #ffe4d2;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-right: 4px;
  }
  .pick {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    padding: 0;
  }
  .pick:hover {
    transform: translateY(-3px);
  }
  .pick.active {
    border-color: #fff;
    background: rgba(255, 255, 255, 0.28);
    transform: translateY(-4px) scale(1.06);
  }

  .pick :global(svg) {
  width: 20px;
  height: 20px;
  color: #fff;
}

  .pick:focus-visible,
  .btn-primary:focus-visible,
  .btn-outline:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .cta-row {
    display: flex;
    gap: 14px;
  }
  .btn-primary {
    background: #fff;
    border: none;
    padding: 15px 28px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: color 0.8s ease;
  }
  .btn-outline {
    background: transparent;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.55);
    padding: 15px 26px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease;
  }
  .btn-outline:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.8);
  }

  .hero-right {
    position: relative;
    height: 460px;
    z-index: 2;
  }
  .blob {
    position: absolute;
    top: 50%;
    left: 52%;
    transform: translate(-50%, -50%);
    width: 380px;
    height: 380px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  }
  .blob-img {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 1s ease, transform 1.2s ease;
    transform: scale(1.06);
  }
  .blob-img.active {
    opacity: 1;
    transform: scale(1);
  }
  .blob-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

.float-card {
  position: absolute;
  background: #fff;
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  z-index: 4;
  animation: bob 5s ease-in-out infinite;
  will-change: transform;
  backface-visibility: hidden;
}
  .card-a {
    top: 14px;
    left: -14px;
    width: 206px;
  }
  .card-b {
    bottom: 26px;
    right: -18px;
    width: 210px;
    animation-duration: 5.6s;
    animation-direction: alternate-reverse;
  }
  @keyframes bob {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -8px, 0);
  }
}

  .pill-nego {
    display: inline-block;
    background: #fdecd9;
    color: #9a5a16;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 8px;
  }
  .card-a .title {
    font-weight: 700;
    font-size: 14.5px;
    color: #2b1b12;
  }
  .card-a .meta {
    font-size: 12px;
    color: #8a7a6c;
  }
  .card-b-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff7a3d, #ffc64b);
    flex-shrink: 0;
  }
  .card-b .name {
    font-weight: 700;
    font-size: 13px;
    color: #2b1b12;
  }
  .card-b .sub-role {
    font-size: 11px;
    color: #8a7a6c;
  }
  .card-b .msg {
    font-size: 12.5px;
    color: #4a3524;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
      padding: 48px 24px 60px;
    }
    h1 {
      font-size: 42px;
    }
    .hero-right {
      height: 340px;
    }
    .blob {
      width: 280px;
      height: 280px;
    }
  }
</style>