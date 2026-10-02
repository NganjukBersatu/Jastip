<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Kalau pengiriman sebelumnya gagal, form langsung terbuka supaya pesan error terlihat
	// svelte-ignore state_referenced_locally
	let tampilForm = $state(!!form?.error);
	let selfiePreview = $state('');

	function pilihSelfie(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (selfiePreview) URL.revokeObjectURL(selfiePreview);
		selfiePreview = file ? URL.createObjectURL(file) : '';
	}
</script>

<svelte:head>
	<title>Status Pendaftaran Jastiper — Nitip</title>
</svelte:head>

<div class="wrap">
	<div class="card">
		<div class="icon">
			{#if data.status === 'ditolak'}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
					<circle cx="12" cy="12" r="9"></circle>
					<path d="m9 9 6 6M15 9l-6 6"></path>
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
					<circle cx="12" cy="12" r="9"></circle>
					<path d="M12 7v5l3 2"></path>
				</svg>
			{/if}
		</div>

		{#if data.status === 'ditolak'}
			<h1>Pendaftaran belum disetujui</h1>
			<p>Admin belum bisa menyetujui pendaftaran jastiper kamu.</p>
			{#if data.alasan}
				<div class="alasan">
					<strong>Alasan</strong>
					<span>{data.alasan}</span>
				</div>
			{/if}

			{#if !tampilForm}
				<button type="button" class="btn" onclick={() => (tampilForm = true)}>
					Perbaiki dan kirim ulang
				</button>
			{:else}
				<form method="POST" action="?/kirimUlang" enctype="multipart/form-data" class="resubmit">
					{#if form?.error}
						<div class="alert-error" role="alert">{form.error}</div>
					{/if}

					<div class="field">
						<label for="noWa">Nomor WhatsApp</label>
						<input
							id="noWa"
							name="noWa"
							type="tel"
							inputmode="numeric"
							placeholder="08xxxxxxxxxx"
							value={form?.noWa ?? data.noWa}
							required
						/>
					</div>

					<div class="field">
						<label for="selfie">Foto selfie baru</label>
						<input
							id="selfie"
							name="selfie"
							type="file"
							accept="image/jpeg,image/png"
							capture="user"
							class="file-input"
							onchange={pilihSelfie}
							required
						/>
						<div class="help">Wajah terlihat jelas, tanpa masker/kacamata hitam. JPG atau PNG, maks. 2 MB.</div>
						{#if selfiePreview}
							<img class="selfie-preview" src={selfiePreview} alt="Pratinjau selfie" />
						{/if}
					</div>

					<button type="submit" class="btn">Kirim ulang pendaftaran</button>
				</form>
			{/if}
		{:else}
			<h1>Pendaftaran sedang ditinjau</h1>
			<p>Terima kasih sudah mendaftar. Admin akan memeriksa data dan selfie kamu. Dashboard jastiper terbuka setelah pendaftaran disetujui.</p>
		{/if}

	</div>
</div>

<style>
	.wrap {
		min-height: calc(100vh - 68px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30px 16px;
		background: #fffaf4;
	}
	.card {
		width: 100%;
		max-width: 460px;
		padding: 36px 32px;
		box-sizing: border-box;
		border-radius: 22px;
		background: white;
		text-align: center;
		box-shadow: 0 12px 35px rgba(68, 37, 13, .06);
	}
	.icon {
		width: 52px;
		height: 52px;
		margin: 0 auto 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		background: #fff0df;
		color: var(--color-primary);
	}
	.icon svg {
		width: 26px;
		height: 26px;
	}
	h1 {
		margin: 0 0 10px;
		font-family: var(--font-display);
		font-size: 26px;
		color: var(--color-ink);
	}
	p {
		margin: 0 0 18px;
		color: var(--color-ink-soft);
		font-family: var(--font-sans);
		font-size: 14px;
		line-height: 1.6;
	}
	.alasan {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 18px;
		padding: 12px 14px;
		border-radius: 11px;
		background: #fff8f1;
		text-align: left;
		font-family: var(--font-sans);
		font-size: 13px;
		color: var(--color-ink);
	}
	.resubmit {
		margin-bottom: 18px;
		text-align: left;
	}
	.field {
		margin-bottom: 14px;
	}
	.field label {
		display: block;
		margin-bottom: 7px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.field input[type='tel'] {
		width: 100%;
		height: 46px;
		box-sizing: border-box;
		padding: 0 14px;
		border: 1px solid #e1d9d2;
		border-radius: 11px;
		outline: none;
		color: var(--color-ink);
		font-family: var(--font-sans);
		font-size: 14px;
	}
	.field input[type='tel']:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(255, 106, 31, .07);
	}
	.help {
		margin-top: 6px;
		color: #a49b94;
		font-family: var(--font-sans);
		font-size: 12px;
	}
	.file-input {
		width: 100%;
		box-sizing: border-box;
		padding: 8px;
		border: 1px dashed #e1d9d2;
		border-radius: 11px;
		background: #fffaf4;
		color: var(--color-ink-soft);
		font-family: var(--font-sans);
		font-size: 13px;
	}
	.file-input::file-selector-button {
		margin-right: 10px;
		padding: 8px 14px;
		border: 0;
		border-radius: 100px;
		background: #fff0df;
		color: var(--color-primary-dark);
		font-family: var(--font-sans);
		font-size: 12px;
		font-weight: 700;
		cursor: pointer;
	}
	.selfie-preview {
		display: block;
		width: 96px;
		height: 96px;
		margin-top: 10px;
		border: 1px solid #e1d9d2;
		border-radius: 12px;
		object-fit: cover;
	}
	.alert-error {
		margin-bottom: 14px;
		padding: 12px 14px;
		border: 1px solid #f6c9b8;
		border-radius: 11px;
		background: #fff1ec;
		color: #b3401a;
		font-family: var(--font-sans);
		font-size: 13px;
		line-height: 1.5;
	}
	.btn {
		width: 100%;
		height: 46px;
		margin-bottom: 18px;
		border: 0;
		border-radius: 100px;
		background: linear-gradient(100deg, #ff641d, #ff4e19);
		color: white;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 8px 18px rgba(255, 106, 31, .18);
	}
	.btn:hover {
		transform: translateY(-1px);
	}
		.card > :last-child,
	.resubmit > :last-child {
		margin-bottom: 0;
	}
    
</style>