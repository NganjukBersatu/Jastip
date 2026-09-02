<svelte:head>
  <title>Jadi Jastiper — jastipin Jawa Timur</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,900;1,500&family=Work+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="wrap">
  <div class="intro">
    <h1>Suka jalan-jalan? Jadiin itu <span class="accent">penghasilan.</span></h1>
    <p class="lead">
      Jastipin nyambungin kamu yang lagi jalan antar kota di Jawa Timur, dengan orang-orang yang
      mau nitip barang. Gampang, nggak pakai ribet.
    </p>
  </div>

  <section>
    <div class="section-head">
      <span class="eyebrow">Kenapa gabung</span>
      <h2>Cara kerjanya simpel banget</h2>
    </div>
    <div class="why-grid">
      <div class="why-card">
        <div class="icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 11h14M14 5l6 6-6 6"
              stroke="#C6440A"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3>Nggak perlu modal</h3>
        <p>Kamu jalan seperti biasa, titipan dibayar duluan sama pemesan.</p>
      </div>
      <div class="why-card">
        <div class="icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#C6440A" stroke-width="1.8" />
            <path d="M11 6v5l4 2" stroke="#C6440A" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </div>
        <h3>Atur waktu sendiri</h3>
        <p>Buka trip cuma kalau kamu memang lagi mau jalan ke sana.</p>
      </div>
      <div class="why-card">
        <div class="icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 3v16M6 7c0-1.3 1.3-2.2 5-2.2s5 0.9 5 2.2-1.3 1.7-5 2.2-5 0.9-5 2.2 1.3 2.2 5 2.2 5-0.9 5-2.2"
              stroke="#C6440A"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h3>Komisi langsung cair</h3>
        <p>Selesai antar barang, saldo bisa langsung ditarik ke rekening.</p>
      </div>
    </div>
  </section>

  <section>
    <div class="needs">
      <div class="txt">
        <h2>Yang kamu butuhin cuma ini</h2>
        <p>Nggak ada syarat ribet — asal kamu emang sering jalan-jalan di Jawa Timur.</p>
      </div>
      <div class="chips">
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="4" y="1.5" width="8" height="13" rx="1.5" stroke="#FFE0C2" stroke-width="1.4" />
            <path d="M7 12.5h2" stroke="#FFE0C2" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          HP aktif
        </span>
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#FFE0C2" stroke-width="1.4" />
            <circle cx="5.2" cy="8" r="1.3" stroke="#FFE0C2" stroke-width="1.2" />
            <path d="M8.5 6.8h4M8.5 9.2h2.6" stroke="#FFE0C2" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          KTP
        </span>
        <span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="5" width="12" height="8.5" rx="1.5" stroke="#FFE0C2" stroke-width="1.4" />
            <path d="M6 5V3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V5" stroke="#FFE0C2" stroke-width="1.4" />
            <path d="M2 8.5h12" stroke="#FFE0C2" stroke-width="1.2" />
          </svg>
          Suka jalan-jalan
        </span>
      </div>
    </div>
  </section>

  <section>
    <div class="cta-final">
      <h2>Yuk, buka trip pertamamu</h2>
      <p>Daftar sekarang, nggak sampai 5 menit.</p>
      <a class="btn" href="/publik/daftar">Daftar Jadi Jastiper</a>
    </div>
  </section>
</div>

<footer>© 2026 jastipin — melayani seluruh Jawa Timur.</footer>

<style>
  :global(:root) {
    --bg: #fff3e6;
    --ink: #2a1607;
    --orange: #ff6a1a;
    --orange-deep: #c6440a;
    --orange-soft: #ffe0c2;
    --rust: #a8380a;
    --paper: #ffffff;
    --muted: #7a6248;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Work Sans', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  h1,
  h2,
  h3 {
    font-family: 'Fraunces', serif;
    margin: 0;
    color: var(--ink);
    font-weight: 600;
  }

  .wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 26px;
    background: var(--orange);
    color: #fff;
    font-weight: 700;
    border: none;
    border-radius: 100px;
    font-size: 0.95rem;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.15s ease;
  }
  .btn:hover {
    background: var(--orange-deep);
    transform: translateY(-1px);
  }

  /* INTRO */
  .intro {
    position: relative;
    padding: 56px 0 44px;
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
  }
  .intro h1 {
    font-size: clamp(1.9rem, 3.6vw, 2.6rem);
    line-height: 1.15;
    letter-spacing: -0.015em;
  }
  .intro .accent {
    color: var(--orange);
  }
  .intro p.lead {
    margin: 16px auto 0;
    font-size: 1.03rem;
    color: var(--muted);
    max-width: 42ch;
  }

  /* WHY SECTION */
  section {
    padding: 0 0 60px;
    position: relative;
    z-index: 1;
  }
  .section-head {
    max-width: 600px;
    margin-bottom: 30px;
  }
  .section-head .eyebrow {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--orange-deep);
    margin-bottom: 8px;
    display: block;
  }
  .section-head h2 {
    font-size: clamp(1.5rem, 2.6vw, 2rem);
  }

  .why-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .why-card {
    background: var(--paper);
    border-radius: 18px;
    padding: 26px 22px;
    border: 1px solid var(--orange-soft);
  }
  .why-card .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--orange-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .why-card h3 {
    font-size: 1.05rem;
    margin-bottom: 8px;
  }
  .why-card p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--muted);
  }

  /* SIMPLE REQUIREMENTS */
  .needs {
    background: var(--ink);
    border-radius: 22px;
    padding: 38px 36px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
  }
  .needs .txt h2 {
    color: #fff;
    font-size: 1.4rem;
    margin-bottom: 10px;
  }
  .needs .txt p {
    margin: 0;
    color: #e8c9a8;
    font-size: 0.95rem;
    max-width: 40ch;
  }
  .needs .chips {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .needs .chips span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    font-size: 0.86rem;
    font-weight: 600;
    padding: 9px 16px;
    border-radius: 100px;
    white-space: nowrap;
  }

  /* FINAL CTA */
  .cta-final {
    background: var(--orange);
    border-radius: 22px;
    padding: 46px;
    text-align: center;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .cta-final::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -60px;
    width: 220px;
    height: 220px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
  .cta-final h2 {
    color: #fff;
    font-size: clamp(1.5rem, 3vw, 2rem);
    position: relative;
    z-index: 1;
  }
  .cta-final p {
    color: #ffe0c2;
    margin: 10px 0 24px;
    position: relative;
    z-index: 1;
  }
  .cta-final .btn {
    background: #fff;
    color: var(--orange-deep);
    position: relative;
    z-index: 1;
  }
  .cta-final .btn:hover {
    background: var(--orange-soft);
  }

  footer {
    padding: 24px 0;
    text-align: center;
    color: var(--muted);
    font-size: 0.82rem;
    border-top: 1px solid var(--orange-soft);
  }

  @media (max-width: 860px) {
    .why-grid {
      grid-template-columns: 1fr;
    }
    .needs {
      flex-direction: column;
      text-align: center;
    }
    .needs .chips {
      justify-content: center;
    }
  }
</style>