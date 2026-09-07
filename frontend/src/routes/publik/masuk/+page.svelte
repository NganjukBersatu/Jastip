<script lang="ts">
  let showPassword = false;
  let email = '';
  let password = '';
</script>

<svelte:head>
  <title>Masuk — Nitip</title>
  <meta
    name="description"
    content="Masuk ke akun Nitip untuk melanjutkan perjalanan jastipmu."
  />
</svelte:head>

<div class="login-page">
  <!-- HERO -->
  <section class="hero">
    <div class="hero-content">
      <div class="logo-text">
        <span>N</span>
        <strong>Nitip.</strong>
      </div>
      <h1>Jastip, Jadi Lebih Praktis</h1>
      <p>
        Nitip siap membantu kamu mendapatkan barang impian dari mana
        saja, dengan mudah, aman, dan terpercaya.
      </p>
    </div>

    <div class="illustration">
      <div class="plant">
        <div class="leaf leaf-1"></div>
        <div class="leaf leaf-2"></div>
        <div class="leaf leaf-3"></div>
        <div class="pot"></div>
      </div>

      <div class="plant-text">
        <b>nitip</b>
        <span>♥</span>
      </div>

      <div class="packages">
        <div class="package-top">
          <div class="package-line"></div>
        </div>
        <div class="package-bottom">
          <span>nitip</span>
        </div>
      </div>

      <div class="suitcase">
        <div class="handle"></div>
        <div class="suitcase-body">
          <div class="suitcase-line left"></div>
          <div class="suitcase-line right"></div>
          <div class="suitcase-label">
            nitip
          </div>
        </div>
        <div class="wheel wheel-1"></div>
        <div class="wheel wheel-2"></div>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">♢</div>
        <div>
          <strong>Terpercaya</strong>
          <small>Jastip aman</small>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon">◇</div>
        <div>
          <strong>Mudah</strong>
          <small>Proses simpel</small>
        </div>
      </div>
      <div class="feature">
        <div class="feature-icon">♡</div>
        <div>
          <strong>Praktis</strong>
          <small>Hemat waktu</small>
        </div>
      </div>
    </div>
  </section>

  <!-- LOGIN -->
  <section class="login-area">
    <div class="login-card">
      <div class="login-header">
        <span>Selamat datang kembali!</span>
        <h2>Masuk ke Nitip</h2>
        <p>
          Yuk masuk untuk melanjutkan perjalanan jastipmu 
        </p>
      </div>

      <form method="POST" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-box">
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <path
                d="M4 7L12 13L20 7"
                stroke="currentColor"
                stroke-width="1.7"
              />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              bind:value={email}
              placeholder="Masukkan email kamu"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <div class="input-box">
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <path
                d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
                stroke="currentColor"
                stroke-width="1.7"
              />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              placeholder="Masukkan kata sandi kamu"
              required
            />
            <button
              type="button"
              class="password-toggle"
              onclick={() => showPassword = !showPassword}
              aria-label="Tampilkan kata sandi"
            >
              {showPassword ? '◉' : '◌'}
            </button>
          </div>
        </div>

        <div class="forgot">
          <a href="/publik/lupa-kata-sandi">
            Lupa kata sandi?
          </a>
        </div>

        <button type="submit" class="login-button">
          Masuk
        </button>
      </form>

      <div class="divider">
        <span></span>
        <p>atau</p>
        <span></span>
      </div>

      <a href="/auth/google" class="google-button">
        <span class="google-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.95h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.25Z"
            />
            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.75Z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 13.83a5.86 5.86 0 0 1 0-3.66V7.64H3.3a9.75 9.75 0 0 0 0 8.72l3.24-2.53Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.24 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
            />
          </svg>
        </span>
        Masuk dengan Google
      </a>

      <p class="register">
        Belum punya akun?
        <a href="/publik/daftar">Daftar di sini</a>
      </p>
    </div>
  </section>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
  }

  .login-page {
    width: 100%;
    height: calc(100vh - 68px);
    display: grid;
    grid-template-columns: 56% 44%;
    overflow: hidden;
    background: #fff8ec;
  }

  /* HERO */
  .hero {
    height: 100%;
    padding: 25px 50px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(
      145deg,
      #fff8ec 0%,
      #fff0d8 55%,
      #ffdda9 100%
    );
  }

  .hero-content {
    text-align: center;
  }

  .logo-text {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #ff641d;
    font-family: var(--font-display);
  }

  .logo-text span {
    font-size: 32px;
    font-weight: 900;
  }

  .logo-text strong {
    font-size: 44px;
    font-weight: 900;
  }

  .hero h1 {
    margin: 10px 0;
    font-family: var(--font-display);
    font-size: 28px;          /* sebelumnya 25px */
    font-style: italic;
    color: #2a1a0e;
  }

  .hero p {
    max-width: 450px;
    margin: auto;
    color: #7a5e44;
    font-size: 15px;          /* sebelumnya 12px */
    line-height: 1.7;
  }

  /* ILUSTRASI */
  .illustration {
    position: relative;
    width: 100%;
    max-width: 560px;
    height: 225px;
    margin-top: 5px;
  }

  .plant {
    position: absolute;
    left: 10px;
    bottom: 18px;
    width: 75px;
    height: 90px;
  }

  .pot {
    position: absolute;
    bottom: 0;
    left: 19px;
    width: 42px;
    height: 40px;
    border-radius: 5px 5px 14px 14px;
    background: #f1dfc1;
  }

  .leaf {
    position: absolute;
    bottom: 30px;
    left: 35px;
    width: 22px;
    height: 57px;
    border-radius: 100% 0;
    background: #8cae5b;
  }

  .leaf-1 { transform: rotate(-40deg); }
  .leaf-2 { transform: rotate(8deg); }
  .leaf-3 { transform: rotate(42deg); }

  .plant-text {
    position: absolute;
    left: 70px;
    bottom: 45px;
    color: #ff641d;
    font-family: var(--font-display);
    font-size: 23px;
    font-weight: 900;
  }

  .plant-text span {
    display: block;
    text-align: center;
    font-family: var(--font-sans);
    font-size: 13px;
  }

  .packages {
    position: absolute;
    left: 30%;
    bottom: 20px;
    width: 150px;
    height: 130px;
  }

  .package-top {
    position: absolute;
    left: 35px;
    top: 0;
    width: 100px;
    height: 60px;
    border-radius: 5px;
    background: #ed641e;
  }

  .package-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 12px;
    height: 100%;
    transform: translateX(-50%);
    background: #ffc93c;
  }

  .package-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 150px;
    height: 75px;
    border-radius: 5px;
    background: #efc18a;
  }

  .package-bottom span {
    position: absolute;
    right: 15px;
    bottom: 12px;
    color: #ed641e;
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 800;
  }

  .suitcase {
    position: absolute;
    right: 7%;
    bottom: 13px;
    width: 125px;
    height: 205px;
  }

  .handle {
    position: absolute;
    top: 0;
    left: 40px;
    width: 45px;
    height: 35px;
    border: 6px solid #2a1a0e;
    border-bottom: 0;
    border-radius: 8px 8px 0 0;
  }

  .suitcase-body {
    position: absolute;
    top: 29px;
    left: 4px;
    width: 117px;
    height: 155px;
    border-radius: 20px;
    background: linear-gradient(90deg, #ff984c, #ff7027);
  }

  .suitcase-line {
    position: absolute;
    top: 16px;
    width: 3px;
    height: 125px;
    background: rgba(120, 48, 10, .14);
  }

  .suitcase-line.left { left: 29px; }
  .suitcase-line.right { right: 29px; }

  .suitcase-label {
    position: absolute;
    top: 63px;
    left: 34px;
    width: 52px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff3da;
    color: #ff641d;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 900;
  }

  .wheel {
    position: absolute;
    bottom: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2a1a0e;
  }

  .wheel-1 { left: 18px; }
  .wheel-2 { right: 18px; }

  /* FEATURES */
  .features {
    width: min(540px, 100%);
    min-height: 64px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px 12px;
    border-radius: 50px;
    background: rgba(255,255,255,.88);
    box-shadow: 0 10px 25px rgba(80,40,10,.08);
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
  }

  .feature + .feature {
    border-left: 1px solid #edd5b5;
  }

  .feature-icon {
    width: 28px;
    color: #ff641d;
    font-size: 27px;
  }

  .feature strong,
  .feature small {
    display: block;
  }

  .feature strong {
    font-size: 13px;          /* sebelumnya 10px */
  }

  .feature small {
    margin-top: 2px;
    color: #987c62;
    font-size: 12px;          /* sebelumnya 8px */
  }

  /* LOGIN */
  .login-area {
    height: 100%;
    padding: 20px 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fffaf4;
  }

  .login-card {
    width: 100%;
    max-width: 475px;
    padding: 32px 38px;
    border-radius: 22px;
    background: white;
    box-shadow: 0 12px 35px rgba(70,40,15,.06);
  }

  .login-header span {
    color: #ff641d;
    font-size: 13px;          /* sebelumnya 11px */
    font-weight: 700;
  }

  .login-header h2 {
    margin: 6px 0 8px;
    color: #2a1a0e;
    font-family: var(--font-display);
    font-size: 32px;
    line-height: 1.1;
  }

  .login-header p {
    margin: 0;
    color: #8b7766;
    font-size: 14px;          /* sebelumnya 11px */
  }

  .login-form {
    margin-top: 24px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    margin-bottom: 7px;
    font-size: 13px;          /* sebelumnya 11px */
    font-weight: 700;
  }

  .input-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-box > svg {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: #929292;
    pointer-events: none;
  }

  .input-box input {
    width: 100%;
    height: 50px;
    padding: 0 44px;
    border: 1px solid #dedede;
    border-radius: 11px;
    outline: none;
    font-family: var(--font-sans);
    font-size: 14px;          /* sebelumnya 11px */
    color: #2a1a0e;
  }

  .input-box input:focus {
    border-color: #ff641d;
    box-shadow: 0 0 0 3px rgba(255,100,29,.08);
  }

  .input-box input::placeholder {
    color: #aaa;
    font-size: 14px;
  }

  .password-toggle {
    position: absolute;
    right: 8px;
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
    color: #888;
    cursor: pointer;
    font-size: 16px;
  }

  .forgot {
    margin: -2px 0 18px;
    text-align: right;
  }

  .forgot a,
  .register a {
    color: #ff641d;
    text-decoration: none;
    font-weight: 600;
  }

  .forgot a {
    font-size: 13px;          /* sebelumnya 10px */
  }

  .login-button {
    width: 100%;
    height: 52px;
    border: 0;
    border-radius: 11px;
    background: linear-gradient(135deg,#ff641d,#f45112);
    color: white;
    font-family: var(--font-sans);
    font-size: 15px;          /* sebelumnya 12px */
    font-weight: 700;
    cursor: pointer;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 18px 0;
  }

  .divider span {
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }

  .divider p {
    margin: 0;
    color: #999;
    font-size: 13px;          /* sebelumnya 10px */
  }

  .google-button {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: 1px solid #dedede;
    border-radius: 11px;
    background: white;
    color: #222;
    text-decoration: none;
    font-size: 14px;          /* sebelumnya 11px */
    font-weight: 700;
  }

  .google-icon {
    width: 18px;
    height: 18px;
  }

  .google-icon svg {
    width: 100%;
    height: 100%;
  }

  .register {
    margin: 20px 0 0;
    text-align: center;
    color: #8b8b8b;
    font-size: 13px;          /* sebelumnya 10px */
  }

  .register a {
    font-weight: 700;
  }

  /* =================================
     TABLET
  ================================= */
  @media (max-width: 1100px) {
    .login-page {
      grid-template-columns: 52% 48%;
    }

    .hero {
      padding-left: 25px;
      padding-right: 25px;
    }

    .login-area {
      padding: 20px;
    }

    .login-card {
      padding: 28px 30px;
    }

    .illustration {
      transform: scale(.9);
    }
  }

  /* =================================
     MOBILE
  ================================= */
  @media (max-width: 768px) {
    .login-page {
      height: auto;
      min-height: calc(100vh - 68px);
      display: flex;
      flex-direction: column;
      overflow: visible;
    }

    .hero {
      min-height: 330px;
      height: auto;
      padding: 25px 20px 20px;
    }

    .logo-text strong {
      font-size: 38px;
    }

    .logo-text span {
      font-size: 27px;
    }

    .hero h1 {
      font-size: 24px;
    }

    .hero p {
      max-width: 430px;
      font-size: 14px;
    }

    .illustration {
      height: 145px;
      max-width: 390px;
      transform: scale(.72);
      transform-origin: center bottom;
      margin-top: -2px;
    }

    .features {
      width: 100%;
      max-width: 390px;
      min-height: 58px;
    }

    .feature {
      padding: 0 7px;
      gap: 5px;
    }

    .feature-icon {
      width: 20px;
      font-size: 20px;
    }

    .feature strong {
      font-size: 12px;
    }

    .feature small {
      font-size: 11px;
    }

    .login-area {
      min-height: auto;
      height: auto;
      padding: 25px 16px 35px;
    }

    .login-card {
      max-width: 500px;
      padding: 28px 24px;
      border-radius: 20px;
    }
  }

  /* =================================
     HP KECIL
  ================================= */
  @media (max-width: 480px) {
    .hero {
      min-height: 300px;
      padding: 20px 15px 15px;
    }

    .logo-text strong {
      font-size: 34px;
    }

    .logo-text span {
      font-size: 24px;
    }

    .hero h1 {
      margin-top: 5px;
      font-size: 20px;
    }

    .hero p {
      font-size: 13px;
      line-height: 1.5;
    }

    .illustration {
      height: 125px;
      transform: scale(.58);
      margin-top: -5px;
    }

    .features {
      min-height: 50px;
      padding: 4px;
    }

    .feature {
      padding: 0 4px;
    }

    .feature-icon {
      display: none;
    }

    .feature strong {
      font-size: 11px;
    }

    .feature small {
      font-size: 10px;
    }

    .login-area {
      padding: 20px 12px 30px;
    }

    .login-card {
      padding: 24px 18px;
      border-radius: 18px;
    }

    .login-header h2 {
      font-size: 28px;
    }

    .login-header p {
      font-size: 13px;
    }

    .input-box input {
      height: 48px;
      font-size: 14px;
    }

    .login-button {
      height: 50px;
      font-size: 15px;
    }

    .google-button {
      height: 48px;
      font-size: 14px;
    }
  }

  /* =================================
     LAYAR PENDEK DESKTOP
  ================================= */
  @media (min-width: 769px) and (max-height: 700px) {
    .hero {
      padding-top: 15px;
    }

    .logo-text strong {
      font-size: 36px;
    }

    .logo-text span {
      font-size: 26px;
    }

    .hero h1 {
      font-size: 24px;
    }

    .illustration {
      height: 185px;
    }

    .suitcase {
      transform: scale(.88);
      transform-origin: bottom right;
    }

    .packages,
    .plant {
      transform: scale(.9);
    }

    .features {
      min-height: 58px;
    }

    .login-card {
      padding: 25px 34px;
    }

    .login-form {
      margin-top: 18px;
    }
  }
</style>