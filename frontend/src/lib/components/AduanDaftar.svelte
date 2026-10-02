<script lang="ts">
	import { enhance } from '$app/forms';
	import BuktiPicker from './BuktiPicker.svelte';
	import { TIPE_LABEL, KATEGORI_LABEL, STATUS_LABEL, STATUS_WARNA, fmtTgl } from '$lib/aduan';

	let { data, form, basePath }: { data: any; form: any; basePath: string } = $props();

	const opsiTipe = $derived([
		...(data.kandidat.akun.length ? ['akun'] : []),
		...(data.kandidat.produk.length ? ['produk'] : []),
		...(data.kandidat.pesanan.length ? ['pesanan'] : []),
		'umum'
	]);

	// Nilai awal form sengaja dibaca sekali saat komponen dibuat
	// svelte-ignore state_referenced_locally
	let tipe = $state(form?.nilai?.tipe || data.prefill.tipe || 'umum');
	// svelte-ignore state_referenced_locally
	let targetId = $state(form?.nilai?.targetId || data.prefill.targetId || '');
	// svelte-ignore state_referenced_locally
	let kategori = $state(form?.nilai?.kategori || '');
	// svelte-ignore state_referenced_locally
	let deskripsi = $state(form?.nilai?.deskripsi || '');
	let berkas = $state<{ file: File; url: string }[]>([]);
	let mengirim = $state(false);

	// kalau tipe dari ?tipe=... tidak tersedia, kembali ke 'umum'
	$effect(() => {
		if (!opsiTipe.includes(tipe)) tipe = 'umum';
	});

	const inputClass =
		'mt-1.5 w-full rounded-xl border border-ink/15 bg-bg px-3.5 py-2.5 text-sm text-ink ' +
		'outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';
</script>

<div class="mx-auto w-full max-w-295 px-5 py-8 sm:px-8 sm:py-10">
	<div>
		<h1 class="font-display text-2xl font-bold text-ink sm:text-3xl">Pengaduan</h1>
		<p class="mt-1 text-sm text-ink-soft">
			Laporkan akun, produk, atau pesanan bermasalah, atau hubungi admin langsung.
		</p>
	</div>

	<div class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
		<!-- Formulir -->
		<form
			method="POST"
			action="?/buat"
			enctype="multipart/form-data"
			class="space-y-5 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6"
			use:enhance={({ formData }) => {
				formData.delete('bukti');
				for (const b of berkas) formData.append('bukti', b.file);
				mengirim = true;
				return async ({ update }) => {
					await update({ reset: false });
					mengirim = false;
				};
			}}
		>
			<div class="flex items-center gap-3">
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.5 w-4.5">
						<path d="M4 22V4" />
						<path d="M4 4h13l-2 4 2 4H4" />
					</svg>
				</span>
				<h2 class="text-sm font-bold text-ink">Buat aduan baru</h2>
			</div>

			{#if form?.pesan}
				<p class="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{form.pesan}</p>
			{/if}

			<label class="block text-sm font-semibold text-ink">
				Yang ingin dilaporkan
				<select name="tipe" bind:value={tipe} onchange={() => (targetId = '')} class={inputClass}>
					{#each opsiTipe as t}
						<option value={t}>{TIPE_LABEL[t]}</option>
					{/each}
				</select>
			</label>

			{#if tipe === 'akun'}
				<label class="block text-sm font-semibold text-ink">
					Akun
					<select name="targetId" bind:value={targetId} required class={inputClass}>
						<option value="" disabled>Pilih akun</option>
						{#each data.kandidat.akun as a}<option value={a.id}>{a.nama}</option>{/each}
					</select>
				</label>
			{:else if tipe === 'produk'}
				<label class="block text-sm font-semibold text-ink">
					Produk
					<select name="targetId" bind:value={targetId} required class={inputClass}>
						<option value="" disabled>Pilih produk</option>
						{#each data.kandidat.produk as p}<option value={p.id}>{p.nama}</option>{/each}
					</select>
				</label>
			{:else if tipe === 'pesanan'}
				<label class="block text-sm font-semibold text-ink">
					Pesanan
					<select name="targetId" bind:value={targetId} required class={inputClass}>
						<option value="" disabled>Pilih pesanan</option>
						{#each data.kandidat.pesanan as p}<option value={p.id}>{p.label}</option>{/each}
					</select>
				</label>
			{/if}

			<label class="block text-sm font-semibold text-ink">
				Kategori
				<select name="kategori" bind:value={kategori} required class={inputClass}>
					<option value="" disabled>Pilih kategori</option>
					{#each Object.entries(KATEGORI_LABEL) as [k, label]}<option value={k}>{label}</option>{/each}
				</select>
			</label>

			<label class="block text-sm font-semibold text-ink">
				Ceritakan masalahnya
				<textarea
					name="deskripsi"
					bind:value={deskripsi}
					rows="4"
					maxlength="1000"
					required
					class="{inputClass} resize-y"
					placeholder="Jelaskan kejadiannya sejelas mungkin (minimal 10 karakter)"
				></textarea>
			</label>

			<div>
				<p class="text-sm font-semibold text-ink">Bukti (opsional)</p>
				<p class="mb-2 text-xs text-ink-soft">
					Foto dari perangkatmu, mis. tangkapan layar chat atau bukti transfer. JPG, PNG, atau WEBP,
					maksimal 3 foto @ 2 MB.
				</p>
				<BuktiPicker bind:berkas />
			</div>

			<button
				type="submit"
				disabled={mengirim}
				class="w-full rounded-pill bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto"
			>
				{mengirim ? 'Mengirim...' : 'Kirim aduan'}
			</button>
		</form>

		<!-- Daftar aduan -->
		<div class="space-y-3">
			<h2 class="text-sm font-bold text-ink">Aduan saya</h2>

			{#if data.daftar.length === 0}
				<div class="rounded-2xl border border-dashed border-ink/15 px-4 py-10 text-center">
					<p class="text-sm font-bold text-ink">Belum ada aduan</p>
					<p class="mt-1 text-xs text-ink-soft">Aduan yang kamu kirim akan muncul di sini.</p>
				</div>
			{/if}

			{#each data.daftar as a (a.id)}
				<a
					href="{basePath}/{a.id}"
					class="block rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-primary/40 hover:shadow-sm sm:p-5"
				>
					<div class="flex flex-wrap items-start justify-between gap-2">
						<div class="min-w-0 text-sm font-bold text-ink">
							{a.targetNama ?? 'Hubungi admin'}
						</div>
						<div class="flex shrink-0 items-center gap-2">
							{#if a.belumDibaca > 0}
								<span class="rounded-pill bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
									{a.belumDibaca} balasan baru
								</span>
							{/if}
							<span class="rounded-pill px-3 py-1 text-[11px] font-bold {STATUS_WARNA[a.status]}">
								{STATUS_LABEL[a.status]}
							</span>
						</div>
					</div>
					<p class="mt-1 text-xs text-ink-soft">
						{a.targetTipe === 'umum' ? '' : `Laporan ${a.targetTipe} · `}{KATEGORI_LABEL[a.kategori] ?? a.kategori} · {fmtTgl(a.createdAt)}
					</p>
				</a>
			{/each}
		</div>
	</div>
</div>