<script>
  const fitur = [
    {
      nomor: '01',
      label: 'KOMUNIKASI',
      judul: 'Chat langsung, tanpa pindah aplikasi.',
      deskripsi:
        'Tanya barang, nego harga, sampai konfirmasi pesanan langsung dengan jastiper dalam satu percakapan.',
      variant: 'primary'
    },
    {
      nomor: '02',
      label: 'HARGA',
      judul: 'Harga jelas sejak awal.',
      deskripsi:
        'Harga barang dan ongkir ditampilkan dengan transparan, jadi nggak perlu menebak-nebak totalnya.',
      variant: 'white'
    },
    {
      nomor: '03',
      label: 'PESANAN',
      judul: 'Pesanan selalu tercatat.',
      deskripsi:
        'Pantau perjalanan titipanmu dari mulai dibelanjakan sampai barang siap diterima.',
      variant: 'accent'
    },
    {
      nomor: '04',
      label: 'KEAMANAN',
      judul: 'Jastiper yang lebih terpercaya.',
      deskripsi:
        'Hanya jastiper dengan profil dan area layanan yang lengkap yang bisa menerima pesanan.',
      variant: 'dark'
    }
  ];
</script>


<section class="features-section">
  <div class="features-container">

    <!-- =========================
         HEADING
    ========================== -->

    <div class="features-heading">

      <div class="heading-left">

        <div class="section-label">
          <span class="label-dot"></span>
          KENAPA NITIP?
        </div>

        <h2>
          Titip barang jadi
          <span>lebih simpel.</span>
        </h2>

      </div>


      <div class="heading-right">

        <p>
          Nggak perlu lagi mencari chat lama, menghitung harga sendiri,
          atau khawatir pesanan lupa. Semua dibuat lebih rapi di Nitip.
        </p>

        <div class="heading-note">
          <span>✦</span>
          <span>Semua dalam satu tempat.</span>
        </div>

      </div>

    </div>


    <!-- =========================
         FEATURE GRID
    ========================== -->

    <div class="features-grid">

      {#each fitur as f}

        <article class={`feature-card card-${f.variant}`}>

          <!-- Card Header -->
          <div class="card-top">

            <span class="feature-number">
              {f.nomor}
            </span>

            <span class="feature-label">
              {f.label}
            </span>

          </div>


          <!-- =====================
               CHAT
          ====================== -->

          {#if f.nomor === '01'}

            <div class="chat-preview">

              <div class="chat-message message-left">
                Kak, masih bisa titip?
              </div>

              <div class="chat-message message-right">
                Bisa dong 👋
              </div>

              <div class="chat-message message-left small-message">
                Kalau 2 kg mangga bisa nego?
              </div>

            </div>


          <!-- =====================
               PRICE
          ====================== -->

          {:else if f.nomor === '02'}

            <div class="price-preview">

              <span class="price-old">
                Rp75.000
              </span>

              <strong class="price-main">
                Rp65.000
              </strong>

              <span class="nego-badge">
                Bisa nego
              </span>

            </div>


          <!-- =====================
               TRACKING
          ====================== -->

          {:else if f.nomor === '03'}

            <div class="tracking-preview">

              <div class="tracking-line"></div>

              <div class="tracking-item active">

                <span class="tracking-dot"></span>

                <div class="tracking-text">
                  <strong>Pesanan dibuat</strong>
                  <small>Selesai</small>
                </div>

              </div>


              <div class="tracking-item active">

                <span class="tracking-dot"></span>

                <div class="tracking-text">
                  <strong>Sedang dibelanjakan</strong>
                  <small>Berlangsung</small>
                </div>

              </div>


              <div class="tracking-item">

                <span class="tracking-dot"></span>

                <div class="tracking-text">
                  <strong>Siap diterima</strong>
                  <small>Menunggu</small>
                </div>

              </div>

            </div>


          <!-- =====================
               SECURITY
          ====================== -->

          {:else}

            <div class="security-preview">

              <div class="security-row">

                <div class="security-avatar">
                  N
                </div>

                <div class="security-info">

                  <strong>
                    Jastiper aktif
                  </strong>

                  <span>
                    Profil lengkap
                  </span>

                </div>

                <span class="security-check">
                  ✓
                </span>

              </div>


              <div class="security-row">

                <div class="security-avatar">
                  ✓
                </div>

                <div class="security-info">

                  <strong>
                    Area terverifikasi
                  </strong>

                  <span>
                    Siap menerima pesanan
                  </span>

                </div>

                <span class="security-check">
                  ✓
                </span>

              </div>

            </div>

          {/if}


          <!-- =====================
               CONTENT + ARROW
          ====================== -->

          <div class="card-footer">

            <div class="card-content">

              <h3>
                {f.judul}
              </h3>

              <p>
                {f.deskripsi}
              </p>

            </div>

            <button
              class="card-arrow"
              aria-label={`Lihat fitur ${f.judul}`}
            >
              →
            </button>

          </div>

        </article>

      {/each}

    </div>


    <!-- =========================
         BOTTOM NOTE
    ========================== -->

    <div class="features-bottom">

      <span class="bottom-line"></span>

      <p>
        Karena urusan titip barang seharusnya
        <strong>nggak seribet cari chat lama.</strong>
      </p>

      <span class="bottom-symbol">
        ✦
      </span>

    </div>

  </div>
</section>


<style>
  /* =====================================================
     SECTION
  ===================================================== */

  .features-section {
    padding: 120px 0;
    overflow: hidden;
  }


  .features-container {
    width: min(1180px, calc(100% - 48px));
    margin: 0 auto;
  }


  /* =====================================================
     HEADING
  ===================================================== */

  .features-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    gap: 60px;
    margin-bottom: 55px;
  }


  .heading-left {
    max-width: 650px;
  }


  .section-label {
    display: flex;
    align-items: center;
    gap: 9px;

    margin-bottom: 18px;

    color: var(--color-primary-dark);

    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 800;

    letter-spacing: 0.13em;
  }


  .label-dot {
    width: 7px;
    height: 7px;

    flex-shrink: 0;

    border-radius: 50%;

    background: var(--color-primary);
  }


  .features-heading h2 {
    margin: 0;

    font-family: var(--font-display);
    font-size: clamp(42px, 5vw, 68px);
    font-weight: 600;

    line-height: 0.98;
    letter-spacing: -0.045em;
  }


  .features-heading h2 span {
    color: var(--color-primary);
  }


  .heading-right {
    width: 340px;
    padding-bottom: 5px;
  }


  .heading-right p {
    margin: 0;

    color: var(--color-ink-soft);

    font-family: var(--font-sans);
    font-size: 14px;

    line-height: 1.8;
  }


  .heading-note {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-top: 18px;

    color: var(--color-ink);

    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 700;
  }


  .heading-note span:first-child {
    color: var(--color-primary);
    font-size: 17px;
  }


  /* =====================================================
     GRID
  ===================================================== */

  .features-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);

    gap: 18px;
  }


  /* =====================================================
     CARD
  ===================================================== */

  .feature-card {
    position: relative;

    min-height: 390px;
    padding: 30px;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    border-radius: 30px;

    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }


  .feature-card:hover {
    transform: translateY(-5px);

    box-shadow:
      0 20px 45px rgba(42, 26, 14, 0.12);
  }


  /* =====================================================
     CARD COLORS
  ===================================================== */

  .card-primary {
    grid-column: span 7;

    background: var(--color-primary-deep);
    color: white;
  }


  .card-white {
    grid-column: span 5;

    background: white;
    color: var(--color-ink);

    border: 1px solid rgba(42, 26, 14, 0.08);
  }


  .card-accent {
    grid-column: span 5;

    background: var(--color-accent);
    color: var(--color-ink);
  }


  .card-dark {
    grid-column: span 7;

    background: var(--color-ink);
    color: var(--color-bg);
  }


  /* =====================================================
     CARD TOP
  ===================================================== */

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    flex-shrink: 0;
  }


  .feature-number {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;

    opacity: 0.65;
  }


  .feature-label {
    padding: 7px 11px;

    border: 1px solid currentColor;
    border-radius: 999px;

    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 800;

    letter-spacing: 0.1em;

    opacity: 0.7;
  }


  /* =====================================================
     CARD FOOTER
  ===================================================== */

  .card-footer {
    position: relative;

    display: flex;
    align-items: flex-end;

    gap: 20px;

    margin-top: auto;
  }


  .card-content {
    min-width: 0;
    flex: 1;
  }


  .card-content h3 {
    margin: 0;

    font-family: var(--font-display);
    font-size: clamp(25px, 2.5vw, 34px);
    font-weight: 600;

    line-height: 1.06;
    letter-spacing: -0.025em;
  }


  .card-content p {
    max-width: 500px;

    margin: 13px 0 0;

    font-family: var(--font-sans);
    font-size: 13px;

    line-height: 1.7;

    opacity: 0.72;
  }


  /* =====================================================
     ARROW
  ===================================================== */

  .card-arrow {
    width: 44px;
    height: 44px;

    flex: 0 0 44px;

    display: grid;
    place-items: center;

    padding: 0;

    border: 0;
    border-radius: 50%;

    background: rgba(255, 255, 255, 0.12);
    color: inherit;

    font-family: var(--font-sans);
    font-size: 20px;

    cursor: pointer;

    transition:
      transform 0.3s ease,
      background 0.3s ease;
  }


  .card-white .card-arrow,
  .card-accent .card-arrow {
    background: rgba(42, 26, 14, 0.07);
  }


  .feature-card:hover .card-arrow {
    transform: translateX(4px);
  }


  /* =====================================================
     CHAT PREVIEW
  ===================================================== */

  .chat-preview {
    position: absolute;

    top: 88px;
    right: 35px;

    width: 290px;
  }


  .chat-message {
    width: fit-content;

    padding: 12px 16px;
    margin-bottom: 9px;

    border-radius: 15px;

    font-family: var(--font-sans);
    font-size: 11px;

    line-height: 1.4;
  }


  .message-left {
    background: rgba(255, 255, 255, 0.13);

    border-bottom-left-radius: 5px;
  }


  .message-right {
    margin-left: auto;

    background: white;
    color: var(--color-primary-deep);

    border-bottom-right-radius: 5px;
  }


  .small-message {
    max-width: 190px;

    opacity: 0.75;
  }


  /* =====================================================
     PRICE PREVIEW
  ===================================================== */

  .price-preview {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: 8px;

    margin-top: 90px;
    margin-bottom: 35px;
  }


  .price-old {
    color: var(--color-ink-soft);

    font-family: var(--font-sans);
    font-size: 14px;

    text-decoration: line-through;

    opacity: 0.6;
  }


  .price-main {
    color: var(--color-primary-dark);

    font-family: var(--font-display);
    font-size: 42px;
    font-weight: 600;

    line-height: 1;

    letter-spacing: -0.04em;
  }


  .nego-badge {
    padding: 5px 9px;

    border-radius: 999px;

    background: #fff0d5;
    color: var(--color-primary-dark);

    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 800;

    white-space: nowrap;
  }


  /* =====================================================
     TRACKING PREVIEW
  ===================================================== */

  .tracking-preview {
    position: relative;

    margin: 50px 0 30px;
    padding-left: 7px;
  }


  .tracking-line {
    position: absolute;

    top: 12px;
    bottom: 12px;
    left: 11px;

    width: 1px;

    background: rgba(42, 26, 14, 0.22);
  }


  .tracking-item {
    position: relative;

    display: flex;
    align-items: center;

    gap: 14px;

    margin-bottom: 16px;
  }


  .tracking-item:last-child {
    margin-bottom: 0;
  }


  .tracking-dot {
    position: relative;
    z-index: 1;

    width: 9px;
    height: 9px;

    flex: 0 0 9px;

    border-radius: 50%;

    background: rgba(42, 26, 14, 0.25);

    box-shadow:
      0 0 0 5px var(--color-accent);
  }


  .tracking-item.active .tracking-dot {
    background: var(--color-primary-dark);
  }


  .tracking-text {
    display: flex;
    flex-direction: column;

    gap: 2px;
  }


  .tracking-text strong {
    font-family: var(--font-sans);
    font-size: 11px;
  }


  .tracking-text small {
    color: var(--color-ink-soft);

    font-family: var(--font-sans);
    font-size: 9px;
  }


  /* =====================================================
     SECURITY PREVIEW
  ===================================================== */

  .security-preview {
    display: flex;
    flex-direction: column;

    gap: 12px;

    margin: 50px 0 30px;
  }


  .security-row {
    display: flex;
    align-items: center;

    gap: 12px;

    padding: 12px 14px;

    border: 1px solid rgba(255, 248, 236, 0.1);
    border-radius: 16px;

    background: rgba(255, 248, 236, 0.06);
  }


  .security-avatar {
    width: 36px;
    height: 36px;

    flex: 0 0 36px;

    display: grid;
    place-items: center;

    border-radius: 11px;

    background: rgba(255, 201, 60, 0.15);
    color: var(--color-accent);

    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
  }


  .security-info {
    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 3px;
  }


  .security-info strong {
    font-family: var(--font-sans);
    font-size: 11px;
  }


  .security-info span {
    color: rgba(255, 248, 236, 0.5);

    font-family: var(--font-sans);
    font-size: 9px;
  }


  .security-check {
    margin-left: auto;

    color: var(--color-accent);

    font-size: 14px;
    font-weight: 700;
  }


  /* =====================================================
     BOTTOM
  ===================================================== */

  .features-bottom {
    display: flex;
    align-items: center;

    gap: 18px;

    margin-top: 42px;
  }


  .bottom-line {
    width: 55px;
    height: 1px;

    flex-shrink: 0;

    background: var(--color-primary);
  }


  .features-bottom p {
    margin: 0;

    color: var(--color-ink-soft);

    font-family: var(--font-sans);
    font-size: 12px;

    line-height: 1.6;
  }


  .features-bottom strong {
    color: var(--color-ink);
  }


  .bottom-symbol {
    margin-left: auto;

    color: var(--color-primary);

    font-size: 20px;
  }


  /* =====================================================
     TABLET
  ===================================================== */

  @media (max-width: 900px) {

    .features-heading {
      align-items: flex-start;
      flex-direction: column;

      gap: 25px;
    }


    .heading-right {
      width: 100%;
      max-width: 500px;
    }


    .card-primary,
    .card-white,
    .card-accent,
    .card-dark {
      grid-column: span 6;
    }


    .chat-preview {
      position: relative;

      top: auto;
      right: auto;

      width: 100%;

      margin: 45px 0 40px;
    }

  }


  /* =====================================================
     MOBILE
  ===================================================== */

  @media (max-width: 640px) {

    .features-section {
      padding: 80px 0;
    }


    .features-container {
      width: min(100% - 32px, 500px);
    }


    .features-heading {
      margin-bottom: 35px;
    }


    .features-heading h2 {
      font-size: 43px;
    }


    .features-grid {
      display: flex;
      flex-direction: column;

      gap: 14px;
    }


    .feature-card {
      min-height: 370px;

      padding: 24px;

      border-radius: 24px;
    }


    .card-primary {
      min-height: 430px;
    }


    .chat-preview {
      margin-top: 45px;
    }


    .price-preview {
      margin-top: 70px;
      margin-bottom: 30px;
    }


    .price-main {
      font-size: 36px;
    }


    .tracking-preview,
    .security-preview {
      margin-top: 50px;
    }


    .card-content h3 {
      font-size: 27px;
    }


    .card-content p {
      font-size: 12px;
    }


    .card-arrow {
      width: 40px;
      height: 40px;

      flex-basis: 40px;

      font-size: 18px;
    }


    .features-bottom {
      align-items: flex-start;
    }


    .features-bottom p {
      font-size: 11px;
    }

  }


  /* =====================================================
     SMALL MOBILE
  ===================================================== */

  @media (max-width: 420px) {

    .features-container {
      width: calc(100% - 28px);
    }


    .feature-card {
      padding: 21px;

      border-radius: 22px;
    }


    .feature-label {
      padding: 6px 9px;

      font-size: 8px;
    }


    .feature-number {
      font-size: 13px;
    }


    .price-main {
      font-size: 32px;
    }


    .price-old {
      font-size: 12px;
    }


    .card-content h3 {
      font-size: 24px;
    }


    .card-footer {
      gap: 12px;
    }


    .card-arrow {
      width: 38px;
      height: 38px;

      flex-basis: 38px;
    }

  }
</style>