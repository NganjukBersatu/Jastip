<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
import { heroThemeState } from '$lib/stores/heroTheme.svelte.js';

  const heroTheme = heroThemeState();


  // =========================================================
  // DATA HERO
  // =========================================================
  //
  // Untuk menambah gambar hero:
  //
  // 1. Masukkan gambar ke:
  //    static/hero-images/
  //
  // 2. Tambahkan object baru di bawah.
  //
  // =========================================================

  const categories = [
    {
      id: 1,
      image: '/hero-images/jajanan.jpg',
      imageAlt: 'Jajanan khas daerah',
      bg: 'linear-gradient(90deg, #FFE4C7 0%, #FFD9B0 28%, #FF8C4D 65%, #D84317 100%)',
      accent: '#FFD36A',
      solid: '#D84317',
      sub: 'Nggak perlu ke luar kota buat dapetin jajanan, oleh-oleh, atau barang langka. Chat jastiper terdekat, deal harga, tinggal tunggu sampai.',
      cardTitle: 'Lumpia Basah Ny. Lin',
      cardMeta: 'Prambon · mulai Rp15rb',
      jastiperName: 'Rina',
      jastiperLoc: 'Prambon',
      jastiperMsg: '"Siap kak, otw ambil ya 🛵"',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 3v18"/>
          <path d="M7 3v6a2 2 0 0 0 4 0V3"/>
          <path d="M17 3c-1 1-2 3-2 6s1 5 2 5 2-2 2-5-1-5-2-6z"/>
        </svg>
      `
    },
    {
      id: 2,
      image: '/hero-images/paket.jpg',
      imageAlt: 'Serah terima paket',
      bg: 'linear-gradient(90deg, #FFE2C0 0%, #FFD3A3 28%, #F05420 65%, #C63711 100%)',
      accent: '#FFD983',
      solid: '#C63711',
      sub: 'Barang dari luar kota, dokumen, atau apapun yang mesti sampai cepat. Serahin ke jastiper terpercaya, pantau sampai tujuan.',
      cardTitle: 'Antar Kilat',
      cardMeta: 'Malang · mulai Rp10rb',
      jastiperName: 'Dinda',
      jastiperLoc: 'Malang',
      jastiperMsg: '"Oke kak, meluncur ya 🏍️"',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.11-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.79 0z"/>
          <polyline points="2.32 6.16 12 11 21.68 6.16"/>
          <line x1="12" y1="22.76" x2="12" y2="11"/>
        </svg>
      `
    },
    {
      id: 3,
      image: '/hero-images/hampres.jpg',
      imageAlt: 'Hampers dan oleh-oleh',
      bg: 'linear-gradient(90deg, #FFE3C3 0%, #FFD6A8 28%, #F26329 65%, #C53A12 100%)',
      accent: '#FFE29A',
      solid: '#C53A12',
      sub: 'Pengen bawa pulang oleh-oleh khas daerah tanpa perlu ke sana? Jastiper lokal siap cariin yang paling otentik.',
      cardTitle: 'Hampers Custom',
      cardMeta: 'Kediri-Nganjuk · mulai Rp25rb',
      jastiperName: 'Bagas',
      jastiperLoc: 'Nganjuk',
      jastiperMsg: '"Udah dapet, kak. Otw kirim 📦"',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      `
    },
    {
      id: 4,
      image: '/hero-images/custom.jpg',
      imageAlt: 'Barang custom dan belanja',
     bg: 'linear-gradient(90deg, #FFDFBC 0%, #FFD0A0 28%, #EF5A25 65%, #C53A14 100%)',
      accent: '#FFD9A0',
      solid: '#C53A14',
      sub: 'Barang unik, edisi terbatas, atau susah dicari sendiri? Jastiper siap bantu buru sampai dapet, kamu tinggal terima.',
      cardTitle: 'Cari Semua Barang',
      cardMeta: 'Se-Jatim · nego harga',
      jastiperName: 'Sari',
      jastiperLoc: 'Kediri',
      jastiperMsg: '"Nemu barangnya kak, fix ya 👍"',
      icon: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      `
    }
  ];

  // =========================================================
  // SLIDER
  // =========================================================

  let current = $state(0);
  let timer: ReturnType<typeof setInterval> | undefined;

  function setActive(index: number, userTriggered = true) {
    current = index;
    if (userTriggered) {
      clearInterval(timer);
      startAutoplay();
    }
  }

  function startAutoplay() {
    clearInterval(timer);
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

let heroEl: HTMLElement | undefined = $state();

$effect(() => {
  if (!heroEl) return;
  const el = heroEl;

  function cekPosisi() {
    const tinggiHero = el.offsetHeight;
    const tinggiNavbar = 76;
    heroTheme.setOverHero(window.scrollY < tinggiHero - tinggiNavbar);
  }

  cekPosisi();
  window.addEventListener('scroll', cekPosisi, { passive: true });
  window.addEventListener('resize', cekPosisi, { passive: true });

  return () => {
    window.removeEventListener('scroll', cekPosisi);
    window.removeEventListener('resize', cekPosisi);
  };
});
</script>

<!-- =========================================================
     HERO
========================================================= -->

<section class="hero" bind:this={heroEl} style={`background: ${active.bg};`}>

  <!-- Decorative glow -->
  <div class="orange-glow glow-one"></div>
  <div class="orange-glow glow-two"></div>

  <div class="hero-container">

    <!-- =====================================================
         LEFT
    ====================================================== -->

    <div class="hero-left">

      <!-- Badge -->
      <div class="badge">
        <span class="badge-dot"></span>
        KHUSUS AREA NGANJUK DAN SEKITARNYA
      </div>

      <!-- Heading -->
      <h1>
        Nitip apa aja,
        <br />
        <span style={`color: ${active.solid};`}>ke mana aja.</span>
      </h1>

      <!-- Description -->
      <p class="hero-description">
        {active.sub}
      </p>

      <!-- Category picker -->
      <div class="picker-row">
        <span class="picker-label">TITIP:</span>

        {#each categories as category, index}
          <button
            class:active={index === current}
            class="pick"
            style={`--cat-color: ${category.solid};`}
            onclick={() => setActive(index)}
            aria-label={category.imageAlt}
          >
            {@html category.icon}
          </button>
        {/each}
      </div>

      <!-- CTA -->
      <div class="cta-row" style={`--btn-color: ${active.solid};`}>
        <a href="#katalog-preview" class="btn-primary">
          Lihat katalog
          <span>→</span>
        </a>

        <a href="#jadi-jastiper" class="btn-outline">
          Jadi jastiper
          <span>→</span>
        </a>
      </div>

    </div>

    <!-- =====================================================
         RIGHT
    ====================================================== -->

    <div class="hero-right">

      <!-- Decorative orange/yellow shapes -->
      <div class="visual-bg visual-bg-one"></div>
      <div class="visual-bg visual-bg-two"></div>
      <div class="visual-line"></div>

      <!-- Main image -->
      <div class="hero-photo">
        {#each categories as category, index}
          <div class:active={index === current} class="photo-slide">
            <img src={category.image} alt={category.imageAlt} />
          </div>
        {/each}
      </div>

      <!-- Top floating card -->
      <div class="float-card card-a">
        <div class="nego-pill">
          <span class="nego-icon">✦</span>
          Bisa nego
        </div>
        <div class="card-title">{active.cardTitle}</div>
        <div class="card-meta">{active.cardMeta}</div>
        <div class="card-arrow" style={`background: ${active.bg};`}>→</div>
      </div>

      <!-- Testimonial card -->
      <div class="float-card card-b">
        <div class="card-b-top">
          <div class="avatar">{active.jastiperName.charAt(0)}</div>
          <div>
            <div class="name">Jastiper · {active.jastiperName}</div>
            <div class="sub-role">{active.jastiperLoc}</div>
          </div>
        </div>
        <div class="msg">{active.jastiperMsg}</div>
      </div>

      <!-- Decorative dots -->
      <div class="dots">
        {#each Array(12) as _}
          <span></span>
        {/each}
      </div>

    </div>

  </div>

  <!-- =======================================================
       BOTTOM WAVE
  ======================================================== -->

  <div class="hero-wave">
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path d="
        M0 65
        C150 105 300 100 470 72
        C650 42 760 35 920 62
        C1100 94 1260 98 1440 45
        L1440 120
        L0 120
        Z
      " />
    </svg>
  </div>

</section>

<style>

  /* =========================================================
     HERO
  ========================================================= */

  .hero {
  position: relative;
  width: 100%;
  min-height: 590px;
  overflow: hidden;
  color: #2a1a10;
  transition: background 0.8s ease;
}

.hero h1,
.hero-description,
.badge,
.picker-label {
  text-shadow: none;
}

.hero h1 {
  color: #1f1208;
}

/* Teks deskripsi & label dibuat lebih gelap + lebih tebal
   agar tidak "kalah" dengan area krem/putih di sisi kiri. */
.hero-description {
  color: #3b2716;
  font-weight: 600;
}

.badge {
  color: #C2410C;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(194, 65, 12, 0.3);
}

.badge-dot {
  background: #FF6B1A;
}

.picker-label {
  color: #3b2716;
  font-weight: 700;
}

.btn-outline {
  color: #2a1a10;
  border: 1.5px solid rgba(42, 26, 16, 0.35);
  background: transparent;
}



  /* =========================================================
     CONTAINER
  ========================================================= */

  .hero-container {
    width: min(1180px, calc(100% - 100px));
    min-height: 590px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 30px;
    position: relative;
    z-index: 5;
  }

  /* =========================================================
     DECORATIVE GLOW
  ========================================================= */

  .orange-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }

  .glow-one {
    width: 330px;
    height: 330px;
    top: -170px;
    right: 20%;
    background: rgba(255, 194, 76, .35);
  }

  .glow-two {
    width: 280px;
    height: 280px;
    bottom: -160px;
    left: 5%;
    background: rgba(255, 184, 74, .22);
  }

  /* =========================================================
     LEFT
  ========================================================= */

  .hero-left {
    position: relative;
    z-index: 10;
    padding: 145px 0 100px;
  }

  /* =========================================================
     BADGE
  ========================================================= */

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 15px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .04em;
    margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FFD04A;
  }

  /* =========================================================
     HEADING
  ========================================================= */

  .hero h1 {
    margin: 0;
    max-width: 620px;
    font-family: "Fraunces", Georgia, serif;
    font-size: clamp(58px, 6.2vw, 84px);
    line-height: 1.03;
    letter-spacing: -2px;
    font-weight: 600;
  }

  .hero h1 span {
    transition: color .7s ease;
  }

  /* =========================================================
     DESCRIPTION
  ========================================================= */

  .hero-description {
    max-width: 480px;
    min-height: 88px;
    margin: 24px 0 28px;
    font-size: 18.5px;
    max-width: 500px;   
    line-height: 1.65;
  }

  /* =========================================================
     PICKER
  ========================================================= */

  .picker-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .picker-label {
    margin-right: 5px;
    font-size: 12.5px;
    font-weight: 700;
  }

  /* Tombol bulat kategori: setiap kategori punya warna sendiri
     lewat --cat-color, sehingga saat pindah kategori, tombol
     yang aktif langsung terasa berbeda satu sama lain. */
  .pick {
    width: 49px;
    height: 49px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, .55);
    background: rgba(255, 255, 255, .18);
    color: #ffffff;
    transition: transform .3s ease, background .3s ease, border-color .3s ease, color .3s ease, box-shadow .3s ease;
  }

  .pick:hover {
  background: rgba(255, 255, 255, .85);
  border-color: var(--cat-color);
}
.pick.active {
  background: #ffffff;
  border-color: #ffffff;
  color: var(--cat-color);
  box-shadow: 0 10px 22px rgba(0,0,0,.18), 0 0 0 4px rgba(255,255,255,.55);
  transform: translateY(-4px) scale(1.08);
}

  .pick:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
  }

  .pick :global(svg) {
    width: 19px;
    height: 19px;
  }

  /* =========================================================
     BUTTONS
  ========================================================= */

  .cta-row {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .btn-primary,
  .btn-outline {
    min-height: 53px;
    padding: 0 25px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
    transition: all .25s ease;
  }

  /* Tombol utama: latar solid warna kategori aktif + shadow,
     supaya jelas terlihat sebagai tombol, bukan sekadar teks. */
  .btn-primary {
    background: var(--btn-color);
    color: #ffffff;
    border: none;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25);
  }

  .btn-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 34px rgba(0, 0, 0, .32);
  }

  .btn-primary span {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, .25);
    font-size: 13px;
  }

  .btn-outline {
  color: var(--btn-color);
  border: 2px solid var(--btn-color);
  background: rgba(255, 255, 255, .65);
}

.btn-outline:hover {
  background: var(--btn-color);
  color: #ffffff;
  border-color: var(--btn-color);
  transform: translateY(-4px);
}

  .btn-primary:focus-visible,
  .btn-outline:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
  }

  /* =========================================================
     RIGHT
  ========================================================= */

  .hero-right {
    position: relative;
    height: 530px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
  }

  /* =========================================================
     BACKGROUND ORGANIC SHAPES
  ========================================================= */

  .visual-bg {
    position: absolute;
    pointer-events: none;
  }

  .visual-bg-one {
    width: 500px;
    height: 440px;
    right: -20px;
    top: 40px;
    background: rgba(255,196,75,.34);
    border-radius: 55% 45% 62% 38% / 45% 58% 42% 55%;
    transform: rotate(-8deg);
  }

  .visual-bg-two {
    width: 220px;
    height: 190px;
    right: -65px;
    bottom: 30px;
    background: rgba(255,211,103,.34);
    border-radius: 65% 35% 55% 45% / 45% 55% 40% 60%;
    transform: rotate(18deg);
  }

  /* =========================================================
     DECORATIVE LINE
  ========================================================= */

  .visual-line {
    position: absolute;
    width: 120px;
    height: 120px;
    right: 35px;
    top: 45px;
    border: 18px solid rgba(255,210,93,.6);
    border-left-color: transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    transform: rotate(25deg);
    z-index: 1;
  }

  /* =========================================================
     MAIN IMAGE
  ========================================================= */

  .hero-photo {
    position: relative;
    width: 455px;
    height: 430px;
    z-index: 3;
    overflow: hidden;
    border-radius: 45% 55% 32% 68% / 58% 42% 65% 35%;
    transform: rotate(1deg);
    box-shadow: 0 25px 55px rgba(72,28,10,.28);
  }

  /* =========================================================
     IMAGE SLIDES
  ========================================================= */

  .photo-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: scale(1.08);
    transition: opacity .8s ease, transform 1.1s ease;
  }

  .photo-slide.active {
    opacity: 1;
    transform: scale(1);
  }

  .photo-slide img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  /* =========================================================
     FLOATING CARD
  ========================================================= */

  .float-card {
    position: absolute;
    z-index: 8;
    background: rgba(255,255,255,.98);
    color: #302017;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(60,20,5,.20);
    animation: floating 5s ease-in-out infinite;
  }

  /* =========================================================
     CARD A
  ========================================================= */

  .card-a {
    width: 210px;
    top: 48px;
    left: -5px;
    padding: 15px 17px;
  }

  .nego-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    margin-bottom: 8px;
    border-radius: 999px;
    background: #fff0dc;
    color: #9c5b19;
    font-size: 10px;
    font-weight: 700;
  }

  .nego-icon {
    font-size: 10px;
  }

  .card-title {
    padding-right: 32px;
    font-size: 14px;
    font-weight: 800;
  }

  .card-meta {
    color: #958378;
    font-size: 11.5px;
    margin-top: 2px;
  }

  .card-arrow {
    position: absolute;
    right: 13px;
    bottom: 13px;
    width: 31px;
    height: 31px;
    border-radius: 50%;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }

  /* =========================================================
     CARD B
  ========================================================= */

  .card-b {
    width: 215px;
    right: -8px;
    bottom: 68px;
    padding: 14px 16px;
    animation: floating 5.6s ease-in-out infinite reverse;
  }

  .card-b-top {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 8px;
  }

  .avatar {
    width: 33px;
    height: 33px;
    flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff913d, #ffc74c);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
  }

  .name {
    color: #33231b;
    font-size: 12.5px;
    font-weight: 800;
  }

  .sub-role {
    color: #98877b;
    font-size: 10.5px;
  }

  .msg {
    color: #594336;
    font-size: 12px;
    line-height: 1.45;
  }

  /* =========================================================
     DOTS
  ========================================================= */

  .dots {
    position: absolute;
    right: -5px;
    bottom: 25px;
    width: 65px;
    display: grid;
    grid-template-columns: repeat(4, 5px);
    gap: 7px;
    z-index: 4;
  }

  .dots span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,.45);
  }

  /* =========================================================
     FLOATING ANIMATION
  ========================================================= */

  @keyframes floating {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }

  /* =========================================================
     WAVE
  ========================================================= */

  .hero-wave {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 75px;
    z-index: 7;
    pointer-events: none;
  }

  .hero-wave svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hero-wave path {
    fill: #fff8ed;
  }

  /* =========================================================
     TABLET
  ========================================================= */

  @media (max-width: 1000px) {
    .hero-container {
      width: calc(100% - 50px);
      grid-template-columns: 1fr 0.95fr;
      gap: 15px;
    }

    .hero h1 {
      font-size: 48px;
    }

    .hero-photo {
      width: 390px;
      height: 390px;
    }

    .card-a {
      left: -15px;
    }

    .card-b {
      right: -15px;
    }
  }

  /* =========================================================
     MOBILE
  ========================================================= */

  @media (max-width: 768px) {
    .hero {
      min-height: auto;
    }

    .hero-container {
      width: calc(100% - 32px);
      min-height: auto;
      grid-template-columns: 1fr;
      gap: 0;
    }

    .hero-left {
      padding: 45px 0 25px;
    }

    .hero h1 {
      font-size: clamp(40px, 11vw, 55px);
    }

    .hero-description {
      min-height: auto;
      font-size: 15px;
    }

    .hero-right {
      height: 390px;
      margin-bottom: 45px;
    }

    .hero-photo {
      width: 330px;
      height: 330px;
    }

    .visual-bg-one {
      width: 370px;
      height: 350px;
    }

    .card-a {
      top: 20px;
      left: 0;
      width: 185px;
    }

    .card-b {
      right: 0;
      bottom: 30px;
      width: 190px;
    }
  }

  /* =========================================================
     SMALL PHONE
  ========================================================= */

  @media (max-width: 480px) {
    .hero-container {
      width: calc(100% - 24px);
    }

    .hero-left {
      padding-top: 35px;
    }

    .badge {
      font-size: 9px;
      padding: 6px 10px;
    }

    .hero h1 {
      font-size: 38px;
      letter-spacing: -1px;
    }

    .hero-description {
      font-size: 14px;
    }

    .picker-row {
      gap: 7px;
    }

    .pick {
      width: 43px;
      height: 43px;
    }

    .btn-primary,
    .btn-outline {
      min-height: 45px;
      padding: 0 17px;
      font-size: 12px;
    }

    .hero-right {
      height: 330px;
    }

    .hero-photo {
      width: 280px;
      height: 280px;
    }

    .card-a {
      width: 155px;
      padding: 11px 13px;
    }

    .card-title {
      font-size: 12px;
    }

    .card-meta {
      font-size: 10px;
    }

    .card-b {
      width: 165px;
      padding: 11px 13px;
    }

    .name {
      font-size: 11px;
    }

    .msg {
      font-size: 10.5px;
    }

    .hero-wave {
      height: 55px;
    }
  }

</style>