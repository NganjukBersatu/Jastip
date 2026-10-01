<script lang="ts">
	import { untrack } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let tampilForm = $state(false);
	let kirim = $state(false);
	let lihatPassword = $state(false);
	let q = $state(untrack(() => data.q));
	let role = $state(untrack(() => data.role));

	// Konfirmasi hapus
	let hapusTarget = $state<{ id: string; nama: string } | null>(null);
	let kirimHapus = $state(false);

	// Notifikasi (toast)
	let toast = $state<{ tipe: 'sukses' | 'error'; teks: string } | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function tampilToast(tipe: 'sukses' | 'error', teks: string) {
		clearTimeout(timer);
		toast = { tipe, teks };
		timer = setTimeout(() => (toast = null), 3000);
	}

	function tutupToast() {
		clearTimeout(timer);
		toast = null;
	}

	$effect(() => {
		if (form?.sukses) tampilToast('sukses', form.sukses);
		else if (form?.pesan) tampilToast('error', form.pesan);
	});

	function cari() {
		const p = new URLSearchParams();
		if (q) p.set('q', q);
		if (role) p.set('role', role);
		goto(`?${p}`, { keepFocus: true, noScroll: true });
	}

	function tutup() {
		tampilForm = false;
		lihatPassword = false;
	}

	function tutupHapus() {
		if (kirimHapus) return;
		hapusTarget = null;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (hapusTarget) tutupHapus();
		else tutup();
	}

	function fokus(node: HTMLInputElement) {
		node.focus();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if toast}
	<div class="toast-wrap">
		<div
			class="toast"
			class:sukses={toast.tipe === 'sukses'}
			class:error={toast.tipe === 'error'}
			role={toast.tipe === 'error' ? 'alert' : 'status'}
			transition:fly={{ y: -24, duration: 220 }}
		>
			<span class="toast-ikon">{toast.tipe === 'sukses' ? '✓' : '!'}</span>
			<span class="toast-teks">{toast.teks}</span>
			<button type="button" class="toast-tutup" aria-label="Tutup notifikasi" onclick={tutupToast}>✕</button>
		</div>
	</div>
{/if}

<!-- Kepala halaman -->
<header class="kepala">
	<div>
		<h1>Akun</h1>
		<p class="sub">Kelola akun pengguna, role, dan status akses mereka.</p>
	</div>
	<button class="utama tambah" onclick={() => (tampilForm = true)}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
		</svg>
		Tambah akun
	</button>
</header>

<!-- Pencarian & filter -->
<div class="bar">
	<div class="cari">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<input placeholder="Cari nama atau email..." bind:value={q} oninput={cari} />
	</div>
	<select class="pilih filter" bind:value={role} onchange={cari}>
		<option value="">Semua role</option>
		<option value="admin">Admin</option>
		<option value="jastiper">Jastiper</option>
		<option value="pelanggan">Pelanggan</option>
	</select>
	<span class="jumlah">{data.akun.length} akun</span>
</div>

<!-- Modal tambah akun -->
{#if tampilForm}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay"
		role="presentation"
		transition:fade={{ duration: 150 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) tutup();
		}}
	>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="judul-modal" transition:scale={{ start: 0.96, duration: 180 }}>
			<div class="modal-kepala">
				<h2 id="judul-modal">Tambah akun</h2>
				<button type="button" class="tutup" aria-label="Tutup" onclick={tutup}>✕</button>
			</div>

			<form
				method="POST"
				action="?/tambah"
				class="form"
				use:enhance={() => {
					kirim = true;
					return async ({ result, update }) => {
						await update();
						kirim = false;
						if (result.type === 'success') tutup();
					};
				}}
			>
				<label>
					Nama
					<input name="nama" placeholder="Nama lengkap" value={form?.nama ?? ''} required use:fokus />
				</label>
				<label>
					Email
					<input name="email" type="email" placeholder="email@contoh.com" value={form?.email ?? ''} required />
				</label>
				<label>
					Password
					<div class="pw">
						<input
							name="password"
							type={lihatPassword ? 'text' : 'password'}
							placeholder="Minimal 6 karakter"
							required
						/>
						<button
							type="button"
							class="mata"
							aria-label={lihatPassword ? 'Sembunyikan password' : 'Lihat password'}
							onclick={() => (lihatPassword = !lihatPassword)}
						>
							{#if lihatPassword}
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
									<line x1="1" y1="1" x2="23" y2="23" />
								</svg>
							{:else}
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>
				</label>
				<label>
					Role
					<select class="pilih" name="role" value={form?.role ?? 'pelanggan'}>
						<option value="pelanggan">Pelanggan</option>
						<option value="jastiper">Jastiper</option>
						<option value="admin">Admin</option>
					</select>
				</label>

				<div class="modal-aksi">
					<button type="button" onclick={tutup}>Batal</button>
					<button class="utama" type="submit" disabled={kirim}>
						{kirim ? 'Menyimpan...' : 'Simpan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal konfirmasi hapus -->
{#if hapusTarget}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="overlay konfirmasi"
		role="presentation"
		transition:fade={{ duration: 150 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) tutupHapus();
		}}
	>
		<div
			class="modal modal-hapus"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="judul-hapus"
			aria-describedby="isi-hapus"
			transition:scale={{ start: 0.94, duration: 180 }}
		>
			<div class="ikon-hapus">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					<path d="M10 11v6M14 11v6" />
					<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
				</svg>
			</div>
			<h2 id="judul-hapus">Hapus akun ini?</h2>
			<p id="isi-hapus">
				Akun <strong>{hapusTarget.nama}</strong> akan dihapus secara permanen dan tidak bisa dikembalikan.
			</p>

			<form
				method="POST"
				action="?/hapus"
				class="hapus-aksi"
				use:enhance={() => {
					kirimHapus = true;
					return async ({ update }) => {
						await update();
						kirimHapus = false;
						hapusTarget = null;
					};
				}}
			>
				<input type="hidden" name="id" value={hapusTarget.id} />
				<button type="button" class="btn-batal" onclick={tutupHapus} disabled={kirimHapus}>Batal</button>
				<button type="submit" class="btn-hapus" disabled={kirimHapus}>
					{kirimHapus ? 'Menghapus...' : 'Ya, hapus'}
				</button>
			</form>
		</div>
	</div>
{/if}

<!-- Tabel -->
<div class="tabel-wrap">
	<table>
		<thead>
			<tr>
				<th class="kol-nama">Nama</th>
				<th class="kol-email">Email</th>
				<th class="kol-role">Role</th>
				<th class="tengah kol-status">Status</th>
				<th class="tengah kol-aksi">Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each data.akun as a (a.id)}
				<tr>
					<td class="nama">{a.nama}</td>
					<td class="email">{a.email}</td>
					<td>
						<form method="POST" action="?/ubah" use:enhance>
							<input type="hidden" name="id" value={a.id} />
							<select
								name="role"
								class="pilih pilih-role"
								value={a.role}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								<option value="admin">Admin</option>
								<option value="jastiper">Jastiper</option>
								<option value="pelanggan">Pelanggan</option>
							</select>
						</form>
					</td>
					<td class="tengah">
						<span class="badge" class:aktif={a.aktif}>
							<span class="titik"></span>
							{a.aktif ? 'Aktif' : 'Nonaktif'}
						</span>
					</td>
					<td class="tengah">
						<div class="aksi">
							<form method="POST" action="?/ubah" use:enhance>
								<input type="hidden" name="id" value={a.id} />
								<input type="hidden" name="aktif" value={String(!a.aktif)} />
								<button type="submit" class="btn-aksi">{a.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>
							</form>
							<button
								type="button"
								class="btn-aksi bahaya"
								onclick={() => (hapusTarget = { id: a.id, nama: a.nama })}
							>
								Hapus
							</button>
						</div>
					</td>
				</tr>
			{:else}
				<tr><td colspan="5" class="kosong">Belum ada akun.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	/* Dasar */
	input, select { padding: 0.55rem 0.8rem; border: 1px solid #e5d3b8; border-radius: 10px; background: #fff; font: inherit; color: #2b2116; }
	input:focus, select:focus { outline: none; border-color: #c2410c; box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.15); }
	button { padding: 0.5rem 0.9rem; border: 1px solid #e5d3b8; border-radius: 10px; background: #fff; cursor: pointer; font: inherit; color: #2b2116; transition: background 0.15s, border-color 0.15s, transform 0.1s; }
	button:active:not(:disabled) { transform: translateY(1px); }
	button:disabled { opacity: 0.6; cursor: not-allowed; }
	.utama { background: #c2410c; color: #fff; border-color: #c2410c; font-weight: 600; }
	.utama:hover:not(:disabled) { background: #9a3412; border-color: #9a3412; }

	/* Dropdown (panah sendiri) */
	.pilih {
		appearance: none;
		-webkit-appearance: none;
		padding-right: 2.2rem;
		cursor: pointer;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b5b45' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.7rem center;
	}
	.pilih option { background: #fffaf2; color: #2b2116; padding: 0.4rem; }

	/* Kepala halaman */
	.kepala {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}
	h1 {
		font-family: serif;
		font-size: 2.4rem;
		line-height: 1.1;
		margin: 0;
		color: #2b2116;
		letter-spacing: -0.01em;
	}
	.sub { margin: 0.4rem 0 0; color: #8a7760; font-size: 0.95rem; }
	.tambah { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.65rem 1.1rem; box-shadow: 0 4px 12px rgba(194, 65, 12, 0.25); }

	/* Bar pencarian */
	.bar { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
	.cari { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
	.cari svg { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #a8957a; pointer-events: none; }
	.cari input { width: 100%; box-sizing: border-box; padding-left: 2.5rem; }
	.filter { min-width: 150px; }
	.jumlah { margin-left: auto; font-size: 0.88rem; color: #8a7760; }

	/* Toast */
	.toast-wrap {
		position: fixed;
		top: 1.25rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding: 0 1rem;
		z-index: 100;
		pointer-events: none;
	}
	.toast {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-width: 260px;
		max-width: 460px;
		padding: 0.7rem 0.9rem;
		border-radius: 12px;
		background: #fff;
		border: 1px solid #e5d3b8;
		border-left-width: 5px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		font-size: 0.92rem;
	}
	.toast.sukses { border-left-color: #16a34a; }
	.toast.error { border-left-color: #dc2626; }
	.toast-ikon {
		flex: none;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: 700;
		color: #fff;
	}
	.toast.sukses .toast-ikon { background: #16a34a; }
	.toast.error .toast-ikon { background: #dc2626; }
	.toast-teks { flex: 1; color: #2b2116; }
	.toast-tutup { flex: none; border: none; background: transparent; padding: 0.1rem 0.3rem; color: #8a7760; font-size: 0.9rem; }

	/* Tabel */
	.tabel-wrap {
		background: #fff;
		border: 1px solid #f1e6d3;
		border-radius: 16px;
		overflow-x: auto;
		box-shadow: 0 2px 12px rgba(120, 80, 30, 0.06);
	}
	table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 800px; }
	th, td {
		text-align: left;
		vertical-align: middle;
		padding: 0.9rem 1.1rem;
		border-bottom: 1px solid #f6ecdc;
	}
	th {
		background: #fdf1de;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #7a6445;
		padding-top: 0.95rem;
		padding-bottom: 0.95rem;
	}
	tbody tr { transition: background 0.15s; }
	tbody tr:last-child td { border-bottom: none; }
	tbody tr:hover { background: #fffaf2; }
	.tengah { text-align: center; }
	.kol-nama { width: 24%; }
	.kol-email { width: 27%; }
	.kol-role { width: 16%; }
	.kol-status { width: 12%; }
	.kol-aksi { width: 21%; }
	.nama { font-weight: 600; color: #2b2116; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.email { color: #6b5b45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.kosong { text-align: center; color: #8a7760; padding: 2.5rem; }

	.pilih-role { padding: 0.4rem 2rem 0.4rem 0.7rem; font-size: 0.9rem; background-color: #fffaf2; }

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 600;
		background: #fef2f2;
		color: #991b1b;
	}
	.badge .titik { width: 7px; height: 7px; border-radius: 50%; background: #dc2626; }
	.badge.aktif { background: #ecfdf3; color: #166534; }
	.badge.aktif .titik { background: #16a34a; }

	.aksi { display: flex; justify-content: center; align-items: center; gap: 0.5rem; }
	.aksi form { margin: 0; }
	.btn-aksi { font-size: 0.85rem; min-width: 5.8rem; padding: 0.4rem 0.7rem; }
	.btn-aksi:hover { background: #fdebd0; border-color: #e5c9a0; }
	.bahaya { color: #b91c1c; }
	.bahaya:hover { background: #fee2e2; border-color: #fca5a5; }

	/* Modal */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 50;
	}
	.overlay.konfirmasi { z-index: 60; background: rgba(30, 15, 5, 0.5); backdrop-filter: blur(2px); }
	.modal {
		background: #fffaf2;
		border-radius: 16px;
		width: 100%;
		max-width: 420px;
		padding: 1.4rem 1.6rem;
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.28);
	}
	.modal-kepala { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
	.modal-kepala h2 { font-family: serif; margin: 0; font-size: 1.4rem; }
	.tutup { border: none; background: transparent; font-size: 1.1rem; padding: 0.2rem 0.4rem; }
	.form { display: flex; flex-direction: column; gap: 0.8rem; }
	.form label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.88rem; font-weight: 600; color: #5b4630; }
	.form input, .form select { width: 100%; box-sizing: border-box; font-weight: 400; }
	.modal-aksi { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }

	.pw { position: relative; }
	.pw input { padding-right: 2.6rem; }
	.mata {
		position: absolute;
		right: 0.4rem;
		top: 50%;
		transform: translateY(-50%);
		border: none;
		background: transparent;
		padding: 0.25rem;
		display: flex;
		color: #6b5b45;
	}

	/* Modal konfirmasi hapus */
	.modal-hapus { max-width: 380px; padding: 1.75rem 1.5rem 1.4rem; text-align: center; }
	.ikon-hapus {
		width: 56px;
		height: 56px;
		margin: 0 auto 0.9rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fee2e2;
		color: #dc2626;
		box-shadow: 0 0 0 8px #fef2f2;
	}
	.modal-hapus h2 { font-family: serif; margin: 0 0 0.5rem; font-size: 1.25rem; color: #2b2116; }
	.modal-hapus p { margin: 0 0 1.4rem; color: #6b5b45; font-size: 0.92rem; line-height: 1.5; }
	.modal-hapus strong { color: #2b2116; }
	.hapus-aksi { display: flex; gap: 0.6rem; margin: 0; }
	.hapus-aksi button { flex: 1; padding: 0.6rem 0.8rem; font-weight: 600; }
	.btn-batal:hover { background: #fdebd0; }
	.btn-hapus { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-hapus:hover:not(:disabled) { background: #b91c1c; border-color: #b91c1c; }
</style>