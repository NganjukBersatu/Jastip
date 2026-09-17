<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	let mengirim = $state(false);
	let lihatPassword = $state(false);
	let lihatKonfirmasi = $state(false);
</script>

<svelte:head>
	<title>Lupa Kata Sandi — Nitip</title>
</svelte:head>

<div class="reset-page">
	<div class="reset-card">
		{#if form?.tahap === 'kodeTerkirim'}
			<h2>Masukkan Kode & Kata Sandi Baru</h2>
			<p>Kode 6 digit sudah dikirim ke <strong>{form.email}</strong>.</p>

			<form method="POST" action="?/resetPassword" use:enhance>
				<input type="hidden" name="email" value={form.email} />

				<div class="form-group">
					<label for="kode">Kode OTP</label>
					<input id="kode" name="kode" type="text" maxlength="6" placeholder="000000" required />
				</div>

								<div class="form-group">
					<label for="password">Kata Sandi Baru</label>
					<div class="input-box">
						<input
                         id="password"
                          name="password"
                           type={lihatPassword ? 'text' : 'password'}
                         placeholder="Masukkan sandi baru"
                        minlength="8"
                    required
                />

						<button
							type="button"
							class="password-toggle"
							onclick={() => (lihatPassword = !lihatPassword)}
							aria-label={lihatPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
						>
						{#if lihatPassword}
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" />
  </svg>
{:else}
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
  </svg>
{/if}
						</button>
					</div>
				</div>

								<div class="form-group">
					<label for="konfirmasi">Konfirmasi Kata Sandi Baru</label>
					<div class="input-box">
						<input
                          id="konfirmasi"
                          name="konfirmasi"
                          type={lihatKonfirmasi ? 'text' : 'password'}
                         placeholder="Konfirmasi sandi baru"
                         minlength="8"
                        required
                    />
						<button
							type="button"
							class="password-toggle"
							onclick={() => (lihatKonfirmasi = !lihatKonfirmasi)}
							aria-label={lihatKonfirmasi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
						>
							{#if lihatKonfirmasi}
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" />
  </svg>
{:else}
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
  </svg>
{/if}

						</button>
					</div>
				</div>

				{#if form?.pesan}
					<p class="error">{form.pesan}</p>
				{/if}

				<button type="submit" class="reset-button">Simpan Kata Sandi Baru</button>
			</form>

			<div class="link-row">
    <a href="/publik/masuk" class="back-link">← Kembali</a>
    <a href="/publik/lupa-kata-sandi" class="back-link">Kirim ulang kode </a>
</div>
		{:else}
			<h2>Lupa Kata Sandi?</h2>
			<p>Masukkan email kamu, kami akan kirim kode OTP untuk atur ulang kata sandi.</p>

						<form
				method="POST"
				action="?/kirimKode"
				use:enhance={() => {
					mengirim = true;
					return async ({ update }) => {
						await update();
						mengirim = false;
					};
				}}
			>
				<div class="form-group">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" placeholder="Masukkan email kamu" required />
				</div>

				{#if form?.pesan}
					<p class="error">{form.pesan}</p>
				{/if}

				<button type="submit" class="reset-button" class:mengirim disabled={mengirim}>
					{mengirim ? 'Mengirim...' : 'Kirim Kode OTP'}
				</button>
			</form>

			<a href="/publik/masuk" class="back-link">← Kembali ke halaman masuk</a>
		{/if}
	</div>
</div>

<style>
	.reset-page {
		min-height: calc(100vh - 68px);
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff8ec;
		padding: 20px;
	}
	.reset-card {
		width: 100%;
		max-width: 440px;
		padding: 32px 38px;
		border-radius: 22px;
		background: white;
		box-shadow: 0 12px 35px rgba(70,40,15,.06);
		text-align: center;
	}
	.reset-card h2 {
		font-family: var(--font-display);
		font-size: 28px;
		color: #2a1a0e;
		margin-bottom: 8px;
	}
	.reset-card p {
		color: #8b7766;
		font-size: 14px;
		margin-bottom: 20px;
	}
	.form-group { text-align: left; margin-bottom: 16px; }
	.form-group label { display: block; margin-bottom: 7px; font-size: 13px; font-weight: 700; }
	.form-group input {
		width: 100%;
		height: 50px;
		padding: 0 16px;
		border: 1px solid #dedede;
		border-radius: 11px;
		outline: none;
		font-size: 14px;
	}
		.form-group input:focus {
		border-color: #ff641d;
		box-shadow: 0 0 0 3px rgba(255,100,29,.08);
	}
	.input-box {
		position: relative;
		display: flex;
		align-items: center;
	}
	.input-box input {
		padding-right: 44px;
	}
	.password-toggle {
		position: absolute;
		right: 8px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		color: #888;
		cursor: pointer;
	}
	.password-toggle svg {
		width: 19px;
		height: 19px;
	}
		.reset-button {
		width: 100%;
		height: 52px;
		border: 0;
		border-radius: 11px;
		background: linear-gradient(135deg,#ff641d,#f45112);
		color: white;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		transition: background .2s ease, opacity .2s ease;
	}
	.reset-button.mengirim {
		background: #d99a72;
		cursor: not-allowed;
		opacity: .85;
	}

	.back-link {
    display: inline-block;
    margin-top: 0;
    color: #ff641d;
    font-weight: 600;
    font-size: 13px;
    text-decoration: none;
}

	.link-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
}

	.error {
		color: #d33;
		font-size: 13px;
		margin-bottom: 10px;
		text-align: left;
	}
</style>