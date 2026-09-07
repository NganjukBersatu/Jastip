<script lang="ts">
	let role: 'pelanggan' | 'jastiper' = 'pelanggan';
	let showPassword = false;
</script>

<svelte:head>
	<title>Daftar — Nitip</title>
</svelte:head>

<div class="register-page">

	<!-- =====================================================
	     BAGIAN KIRI — HERO
	===================================================== -->
	<section class="hero-section">

		<div class="hero-content">

			<!-- LOGO / BRAND -->
			<div class="brand">
				<div class="brand-icon">
					<span>♡</span>
				</div>

				<div class="brand-text">
					<div class="brand-name">nitip</div>
					<div class="brand-caption">
						JASTIP AMAN & TERPERCAYA
					</div>
				</div>
			</div>


			<!-- HERO TEXT -->
			<div class="hero-copy">

				<div class="hero-badge">
					✦ JASTIP MUDAH & AMAN
				</div>

				<h1>
					Titip barang
					<span>impianmu,</span>
					kami yang urus.
				</h1>

				<p>
					Temukan barang yang kamu inginkan dari luar kota
					hingga luar negeri. Praktis, aman, dan sampai
					di tanganmu.
				</p>

			</div>


			<!-- =================================================
			     ILUSTRASI
			================================================= -->
			<div class="illustration">

				<!-- awan -->
				<div class="cloud cloud-one"></div>
				<div class="cloud cloud-two"></div>

				<!-- pesawat -->
				<div class="plane">✈</div>


				<!-- TAS / KOPER -->
				<div class="luggage">

					<div class="luggage-handle"></div>

					<div class="luggage-body">
						<div class="luggage-line"></div>
						<div class="luggage-lock"></div>

						<div class="luggage-label">
							nitip
						</div>
					</div>

					<div class="luggage-wheel wheel-left"></div>
					<div class="luggage-wheel wheel-right"></div>

				</div>


				<!-- PAKET -->
				<div class="package package-one">
					<div class="package-tape"></div>
					<span>nitip</span>
				</div>

				<div class="package package-two">
					<div class="package-tape"></div>
				</div>


				<!-- TAS BELANJA -->
				<div class="shopping-bag">

					<div class="bag-handle"></div>

					<span>nitip</span>

				</div>


				<!-- titik lokasi -->
				<div class="map-pin">
					<div></div>
				</div>


				<!-- garis perjalanan -->
				<div class="route-line"></div>

			</div>


			<!-- =================================================
			     BENEFIT
			================================================= -->
			<div class="benefits">

				<div class="benefit-item">

					<div class="benefit-icon">
						◇
					</div>

					<div>
						<strong>Terpercaya</strong>
						<span>Jastip aman</span>
					</div>

				</div>


				<div class="benefit-divider"></div>


				<div class="benefit-item">

					<div class="benefit-icon">
						◇
					</div>

					<div>
						<strong>Mudah</strong>
						<span>Proses simpel</span>
					</div>

				</div>


				<div class="benefit-divider"></div>


				<div class="benefit-item">

					<div class="benefit-icon">
						♡
					</div>

					<div>
						<strong>Praktis</strong>
						<span>Hemat waktu</span>
					</div>

				</div>

			</div>

		</div>

	</section>



	<!-- =====================================================
	     BAGIAN KANAN — FORM DAFTAR
	===================================================== -->
	<section class="form-section">

		<div class="register-card">

			<!-- HEADER -->
			<div class="form-header">

				<div class="welcome-text">
					SELAMAT DATANG DI NITIP
				</div>

				<h2>
					Saya mendaftar sebagai
				</h2>

				<p>
					Pilih jenis akun yang ingin kamu buat
				</p>

			</div>


			<!-- =================================================
			     FORM
			================================================= -->
			<form method="POST">

				<!-- =================================================
				     PILIH ROLE
				     PENTING:
				     RADIO + LABEL AGAR PASTI BISA DIKLIK
				================================================= -->
				<div class="role-options">

					<!-- PELANGGAN -->
					<label
						class="role-card"
						class:selected={role === 'pelanggan'}
					>

						<input
							type="radio"
							name="role"
							value="pelanggan"
							bind:group={role}
						/>

						<div class="role-icon">

							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
							>
								<circle cx="12" cy="7" r="4"></circle>
								<path d="M4 21a8 8 0 0 1 16 0"></path>
							</svg>

						</div>

						<div class="role-info">
							<strong>Pelanggan</strong>
							<span>Ingin titip barang</span>
						</div>

						{#if role === 'pelanggan'}
							<div class="check">
								✓
							</div>
						{/if}

					</label>


					<!-- JASTIPER -->
					<label
						class="role-card"
						class:selected={role === 'jastiper'}
					>

						<input
							type="radio"
							name="role"
							value="jastiper"
							bind:group={role}
						/>

						<div class="role-icon">

							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
							>
								<path d="M5 8h14l1 13H4L5 8Z"></path>
								<path d="M9 8a3 3 0 0 1 6 0"></path>
							</svg>

						</div>

						<div class="role-info">
							<strong>Jastiper</strong>
							<span>Ingin menerima titipan</span>
						</div>

						{#if role === 'jastiper'}
							<div class="check">
								✓
							</div>
						{/if}

					</label>

				</div>



				<!-- =================================================
				     NAMA
				================================================= -->
				<div class="form-group">

					<label for="nama">
						Nama Lengkap
					</label>

					<div class="input-wrapper">

						<svg
							class="input-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
						>
							<circle cx="12" cy="7" r="4"></circle>
							<path d="M4 21a8 8 0 0 1 16 0"></path>
						</svg>

						<input
							id="nama"
							name="nama"
							type="text"
							placeholder="Masukkan nama lengkap"
							required
						/>

					</div>

				</div>



				<!-- =================================================
				     EMAIL
				================================================= -->
				<div class="form-group">

					<label for="email">
						Email
					</label>

					<div class="input-wrapper">

						<svg
							class="input-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
						>
							<rect
								x="3"
								y="5"
								width="18"
								height="14"
								rx="2"
							></rect>

							<path d="m3 7 9 6 9-6"></path>
						</svg>

						<input
							id="email"
							name="email"
							type="email"
							placeholder="Masukkan email aktif"
							required
						/>

					</div>

				</div>



				<!-- =================================================
				     PASSWORD
				================================================= -->
				<div class="form-group">

					<label for="password">
						Kata Sandi
					</label>

					<div class="input-wrapper">

						<svg
							class="input-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
						>
							<rect
								x="4"
								y="10"
								width="16"
								height="11"
								rx="2"
							></rect>

							<path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
						</svg>


						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Masukkan kata sandi"
							minlength="8"
							required
						/>


						<button
							type="button"
							class="password-toggle"
							onclick={() => showPassword = !showPassword}
							aria-label="Tampilkan kata sandi"
						>

							{#if showPassword}

								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.6"
								>
									<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path>
									<circle cx="12" cy="12" r="2.5"></circle>
								</svg>

							{:else}

								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.6"
								>
									<path d="m3 3 18 18"></path>
									<path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 3.8"></path>
									<path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.9"></path>
								</svg>

							{/if}

						</button>

					</div>

					<div class="password-help">
						Minimal 8 karakter dengan kombinasi huruf & angka
					</div>

				</div>



				<!-- =================================================
				     BUTTON
				================================================= -->
				<button
					type="submit"
					class="register-button"
				>

					Daftar sebagai
					{role === 'pelanggan' ? 'Pelanggan' : 'Jastiper'}

					<span>→</span>

				</button>

			</form>



			<!-- =================================================
			     LOGIN
			================================================= -->
			<div class="login-link">

				<span>
					Sudah punya akun?
				</span>

				<a href="/publik/masuk">
					Masuk di sini
				</a>

			</div>

		</div>

	</section>

</div>



<style>

	/* =====================================================
	   PAGE
	===================================================== */

	.register-page {
		width: 100%;
		min-height: calc(100vh - 68px);

		display: grid;
		grid-template-columns: 55% 45%;

		background: var(--color-bg);
		overflow: hidden;
	}



	/* =====================================================
	   HERO
	===================================================== */

	.hero-section {
		position: relative;

		min-height: calc(100vh - 68px);

		background:
			radial-gradient(
				circle at 90% 0%,
				rgba(255, 201, 60, .28),
				transparent 18%
			),
			linear-gradient(
				145deg,
				#fff8e9 0%,
				#ffe7c0 100%
			);

		overflow: hidden;
	}

	.hero-content {
		height: 100%;
		min-height: calc(100vh - 68px);

		padding:
			42px
			clamp(45px, 7vw, 100px)
			30px;

		box-sizing: border-box;
	}



	/* =====================================================
	   BRAND
	===================================================== */

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.brand-icon {
		width: 51px;
		height: 51px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 15px;

		background:
			linear-gradient(
				145deg,
				#ff7026,
				#f4511e
			);

		color: white;

		font-size: 24px;

		box-shadow:
			0 8px 18px rgba(255, 106, 31, .2);
	}

	.brand-name {
		font-family: var(--font-display);

		font-size: 41px;
		font-weight: 900;

		line-height: .8;

		letter-spacing: -2px;
	}

	.brand-caption {
		margin-top: 7px;

		color: var(--color-primary-dark);

		font-size: 8px;
		font-weight: 800;

		letter-spacing: 1.3px;
	}



	/* =====================================================
	   HERO COPY
	===================================================== */

	.hero-copy {
		max-width: 520px;

		margin-top: 44px;
	}

	.hero-badge {
		display: inline-flex;

		padding: 7px 12px;

		border-radius: 100px;

		background: rgba(255, 106, 31, .1);

		color: var(--color-primary-dark);

		font-size: 9px;
		font-weight: 800;

		letter-spacing: .4px;
	}

	.hero-copy h1 {
		margin: 17px 0 12px;

		font-family: var(--font-display);

		font-size: clamp(40px, 4vw, 57px);
		font-weight: 600;

		line-height: .98;

		letter-spacing: -2px;
	}

	.hero-copy h1 span {
		display: block;

		color: var(--color-primary);

		font-style: italic;
	}

	.hero-copy p {
		max-width: 475px;

		margin: 0;

		color: var(--color-ink-soft);

		font-size: 13px;
		line-height: 1.65;
	}



	/* =====================================================
	   ILLUSTRATION
	===================================================== */

	.illustration {
		position: relative;

		height: 220px;

		margin-top: 4px;
	}

	.cloud {
		position: absolute;

		width: 65px;
		height: 19px;

		border-radius: 100px;

		background: rgba(255,255,255,.75);
	}

	.cloud::before {
		content: '';

		position: absolute;

		left: 12px;
		bottom: 4px;

		width: 27px;
		height: 27px;

		border-radius: 50%;

		background: inherit;
	}

	.cloud::after {
		content: '';

		position: absolute;

		right: 9px;
		bottom: 4px;

		width: 22px;
		height: 22px;

		border-radius: 50%;

		background: inherit;
	}

	.cloud-one {
		left: 10px;
		top: 30px;
	}

	.cloud-two {
		right: 40px;
		top: 65px;

		transform: scale(.75);
	}

	.plane {
		position: absolute;

		right: 145px;
		top: 35px;

		color: var(--color-primary);

		font-size: 27px;

		transform: rotate(-18deg);
	}



	/* =====================================================
	   LUGGAGE
	===================================================== */

	.luggage {
		position: absolute;

		left: 12px;
		bottom: 2px;

		width: 94px;
		height: 120px;
	}

	.luggage-handle {
		position: absolute;

		left: 26px;
		top: -20px;

		width: 38px;
		height: 30px;

		border:
			6px solid
			var(--color-ink);

		border-bottom: 0;

		border-radius: 20px 20px 0 0;
	}

	.luggage-body {
		position: absolute;

		inset: 0;

		border:
			3px solid
			#b94f18;

		border-radius: 17px;

		background:
			linear-gradient(
				145deg,
				#ff9d66,
				#ff6a31
			);
	}

	.luggage-line {
		position: absolute;

		left: 26px;
		top: 0;

		width: 4px;
		height: 100%;

		background: rgba(143,43,8,.15);
	}

	.luggage-lock {
		position: absolute;

		right: 9px;
		top: 53px;

		width: 9px;
		height: 13px;

		border-radius: 3px;

		background: #8f2b08;
	}

	.luggage-label {
		position: absolute;

		left: 25px;
		top: 48px;

		padding: 4px 8px;

		border-radius: 20px;

		background: white;

		color: var(--color-primary);

		font-family: var(--font-display);

		font-size: 10px;
		font-weight: 900;
	}

	.luggage-wheel {
		position: absolute;

		bottom: -7px;

		width: 13px;
		height: 13px;

		border-radius: 50%;

		background: var(--color-ink);
	}

	.wheel-left {
		left: 13px;
	}

	.wheel-right {
		right: 13px;
	}



	/* =====================================================
	   PACKAGE
	===================================================== */

	.package {
		position: absolute;

		border:
			2px solid
			#b76d27;

		border-radius: 5px;

		background: #dda053;

		box-shadow:
			5px 7px 14px rgba(143,43,8,.1);
	}

	.package-one {
		left: 235px;
		bottom: 4px;

		width: 135px;
		height: 84px;
	}

	.package-two {
		left: 330px;
		bottom: 76px;

		width: 78px;
		height: 59px;
	}

	.package-tape {
		position: absolute;

		left: 45%;
		top: 0;

		width: 13px;
		height: 100%;

		background: var(--color-accent);
	}

	.package-one span {
		position: absolute;

		left: 43px;
		top: 33px;

		color: #fff0d5;

		font-family: var(--font-display);

		font-size: 18px;
		font-weight: 900;
	}



	/* =====================================================
	   SHOPPING BAG
	===================================================== */

	.shopping-bag {
		position: absolute;

		left: 100px;
		bottom: 1px;

		width: 92px;
		height: 94px;

		display: flex;
		align-items: center;
		justify-content: center;

		border:
			3px solid
			#e4c58d;

		border-radius: 8px 8px 16px 16px;

		background: #fff7e7;

		color: var(--color-primary);

		font-family: var(--font-display);

		font-size: 23px;
		font-weight: 900;
	}

	.bag-handle {
		position: absolute;

		top: -29px;
		left: 20px;

		width: 48px;
		height: 35px;

		border:
			6px solid
			#e4c58d;

		border-bottom: 0;

		border-radius: 25px 25px 0 0;
	}



	/* =====================================================
	   MAP PIN
	===================================================== */

	.map-pin {
		position: absolute;

		right: 55px;
		bottom: 47px;

		width: 40px;
		height: 40px;

		border-radius:
			50% 50% 50% 0;

		background: var(--color-primary);

		transform: rotate(-45deg);
	}

	.map-pin div {
		position: absolute;

		left: 14px;
		top: 14px;

		width: 11px;
		height: 11px;

		border-radius: 50%;

		background: white;
	}

	.route-line {
		position: absolute;

		right: 20px;
		bottom: 10px;

		width: 170px;
		height: 70px;

		border:
			1.5px dashed
			var(--color-primary);

		border-radius: 50%;

		opacity: .4;

		transform: rotate(10deg);
	}



	/* =====================================================
	   BENEFITS
	===================================================== */

	.benefits {
		width: min(100%, 490px);

		display: flex;
		align-items: center;

		padding: 10px 18px;

		box-sizing: border-box;

		border-radius: 100px;

		background: rgba(255,255,255,.85);

		box-shadow:
			0 8px 20px rgba(143,43,8,.07);
	}

	.benefit-item {
		flex: 1;

		display: flex;
		align-items: center;

		gap: 8px;
	}

	.benefit-icon {
		color: var(--color-primary);

		font-size: 20px;
	}

	.benefit-item div:last-child {
		display: flex;
		flex-direction: column;
	}

	.benefit-item strong {
		font-size: 9px;
		font-weight: 800;
	}

	.benefit-item span {
		margin-top: 2px;

		color: var(--color-ink-soft);

		font-size: 7px;
	}

	.benefit-divider {
		width: 1px;
		height: 29px;

		background: #ead7bd;
	}



	/* =====================================================
	   FORM SECTION
	===================================================== */

	.form-section {
		min-height: calc(100vh - 68px);

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 35px 45px;

		box-sizing: border-box;

		background: #fffaf4;
	}



	/* =====================================================
	   CARD — SEPERTI GAMBAR MASUK
	===================================================== */

	.register-card {
		width: 100%;
		max-width: 500px;

		padding: 34px 34px 28px;

		box-sizing: border-box;

		border-radius: 22px;

		background: white;

		box-shadow:
			0 12px 35px rgba(68, 37, 13, .06);
	}



	/* =====================================================
	   FORM HEADER
	===================================================== */

	.form-header {
		margin-bottom: 22px;
	}

	.welcome-text {
		margin-bottom: 7px;

		color: var(--color-primary);

		font-size: 8px;
		font-weight: 800;

		letter-spacing: 1.4px;
	}

	.form-header h2 {
		margin: 0;

		font-family: var(--font-display);

		font-size: 32px;
		font-weight: 600;

		line-height: 1.05;

		letter-spacing: -1px;

		color: var(--color-ink);
	}

	.form-header p {
		margin: 7px 0 0;

		color: var(--color-ink-soft);

		font-size: 10px;
	}



	/* =====================================================
	   ROLE
	===================================================== */

	.role-options {
		display: grid;

		grid-template-columns: 1fr 1fr;

		gap: 10px;

		margin-bottom: 21px;
	}

	.role-card {
		position: relative;

		min-height: 64px;

		display: flex;
		align-items: center;

		gap: 10px;

		padding: 10px 12px;

		box-sizing: border-box;

		border:
			1px solid
			#e5dbd1;

		border-radius: 14px;

		background: white;

		cursor: pointer;

		transition:
			.2s ease;

		user-select: none;
	}

	/* RADIO ASLI DISEMBUNYIKAN */
	.role-card input {
		position: absolute;

		width: 1px;
		height: 1px;

		opacity: 0;
		pointer-events: none;
	}

	.role-card:hover {
		border-color: var(--color-primary);
	}

	.role-card.selected {
		border-color: var(--color-primary);

		background: #fff8f1;

		box-shadow:
			0 4px 12px rgba(255,106,31,.06);
	}

	.role-icon {
		width: 34px;
		height: 34px;

		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 10px;

		background: #fff0df;

		color: var(--color-primary);
	}

	.role-icon svg {
		width: 17px;
		height: 17px;
	}

	.role-info {
		display: flex;
		flex-direction: column;

		gap: 2px;
	}

	.role-info strong {
		font-size: 10px;
		font-weight: 800;
	}

	.role-info span {
		color: #a18e7e;

		font-size: 7px;
	}

	.check {
		position: absolute;

		right: 8px;
		top: 8px;

		width: 15px;
		height: 15px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 50%;

		background: var(--color-primary);

		color: white;

		font-size: 8px;
		font-weight: 900;
	}



	/* =====================================================
	   INPUT
	===================================================== */

	.form-group {
		margin-bottom: 14px;
	}

	.form-group label {
		display: block;

		margin-bottom: 6px;

		font-size: 9px;
		font-weight: 800;

		color: var(--color-ink);
	}

	.input-wrapper {
		position: relative;
	}

	.input-icon {
		position: absolute;

		left: 14px;
		top: 50%;

		width: 14px;
		height: 14px;

		color: #aaa098;

		transform: translateY(-50%);

		pointer-events: none;
	}

	.input-wrapper input {
		width: 100%;
		height: 45px;

		box-sizing: border-box;

		padding:
			0
			40px
			0
			39px;

		border:
			1px solid
			#e1d9d2;

		border-radius: 11px;

		outline: none;

		background: white;

		color: var(--color-ink);

		font-family: var(--font-sans);

		font-size: 9px;

		transition:
			border-color .2s ease,
			box-shadow .2s ease;
	}

	.input-wrapper input::placeholder {
		color: #aaa29c;
	}

	.input-wrapper input:focus {
		border-color: var(--color-primary);

		box-shadow:
			0 0 0 3px
			rgba(255,106,31,.07);
	}



	/* =====================================================
	   PASSWORD
	===================================================== */

	.password-toggle {
		position: absolute;

		right: 11px;
		top: 50%;

		width: 20px;
		height: 20px;

		padding: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		border: 0;

		background: transparent;

		color: #a29a94;

		cursor: pointer;

		transform: translateY(-50%);
	}

	.password-toggle svg {
		width: 15px;
		height: 15px;
	}

	.password-help {
		margin-top: 5px;

		color: #a49b94;

		font-size: 6.5px;
	}



	/* =====================================================
	   BUTTON DAFTAR
	===================================================== */

	.register-button {
		width: 100%;
		height: 44px;

		display: flex;
		align-items: center;
		justify-content: center;

		gap: 7px;

		margin-top: 20px;

		border: 0;
		border-radius: 100px;

		background:
			linear-gradient(
				100deg,
				#ff641d,
				#ff4e19
			);

		color: white;

		font-family: var(--font-sans);

		font-size: 10px;
		font-weight: 800;

		cursor: pointer;

		box-shadow:
			0 8px 18px rgba(255,106,31,.18);

		transition: .2s ease;
	}

	.register-button:hover {
		transform: translateY(-1px);

		box-shadow:
			0 11px 22px rgba(255,106,31,.23);
	}

	.register-button span {
		font-size: 15px;
	}



	/* =====================================================
	   LOGIN LINK
	===================================================== */

	.login-link {
		display: flex;
		justify-content: center;

		gap: 4px;

		margin-top: 16px;

		font-size: 8px;

		color: #958b84;
	}

	.login-link a {
		color: var(--color-primary);

		font-weight: 800;

		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}



	/* =====================================================
	   RESPONSIVE
	===================================================== */

	@media (max-width: 1000px) {

		.register-page {
			grid-template-columns: 1fr;
			overflow: visible;
		}

		.hero-section {
			min-height: 500px;
		}

		.hero-content {
			min-height: 500px;
		}

		.form-section {
			min-height: auto;

			padding:
				50px
				25px;
		}

	}



	@media (max-width: 600px) {

		.hero-content {
			padding:
				30px
				22px;
		}

		.hero-copy h1 {
			font-size: 40px;
		}

		.role-options {
			grid-template-columns: 1fr;
		}

		.form-section {
			padding:
				35px
				18px;
		}

		.register-card {
			padding:
				28px
				22px
				24px;
		}

	}

</style>