<script lang="ts">
	import { enhance } from '$app/forms';
	import BuktiPicker from './BuktiPicker.svelte';
	import { KATEGORI_LABEL, STATUS_LABEL, STATUS_WARNA, fmtTgl } from '$lib/aduan';

	let { data, form, basePath }: { data: any; form: any; basePath: string } = $props();

	const a = $derived(data.aduan);
	const terbuka = $derived(a.status === 'baru' || a.status === 'diproses');
	const judul = $derived(a.targetNama ?? 'Hubungi admin');
	const subjudul = $derived(
		`${a.targetTipe === 'umum' ? '' : `Laporan ${a.targetTipe} · `}${KATEGORI_LABEL[a.kategori] ?? a.kategori} · ${fmtTgl(a.createdAt)}`
	);

	let teks = $state('');
	let berkas = $state<{ file: File; url: string }[]>([]);
	let mengirim = $state(false);
</script>

{#snippet bukti(list: { id: string; namaAsli: string | null }[])}
	{#if list.length > 0}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each list as l (l.id)}
				<a href="/api/bukti/{l.id}" target="_blank" rel="noopener">
					<img
						src="/api/bukti/{l.id}"
						alt={l.namaAsli ?? 'Bukti'}
						loading="lazy"
						class="h-24 w-24 rounded-xl border border-ink/10 bg-white object-cover"
					/>
				</a>
			{/each}
		</div>
	{/if}
{/snippet}

<div class="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-295 flex-col px-5 sm:px-8">
	<!-- Header -->
	<div class="pt-8">
		<a href={basePath} class="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-dark">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
				<path d="M15 18l-6-6 6-6" />
			</svg>
			Kembali
		</a>

		<div class="mt-4 flex flex-wrap items-start justify-between gap-4">
			<div class="min-w-0">
				<h1 class="font-display text-2xl font-bold text-ink sm:text-3xl">{judul}</h1>
				<p class="mt-1 text-sm text-ink-soft">{subjudul}</p>
			</div>
			<span class="rounded-pill px-3.5 py-1.5 text-xs font-bold {STATUS_WARNA[a.status]}">
				{STATUS_LABEL[a.status]}
			</span>
		</div>
	</div>

	<!-- Isi aduan -->
	<div class="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
		<div class="flex items-center gap-3">
			<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4.5 w-4.5">
					<path d="M4 22V4" />
					<path d="M4 4h13l-2 4 2 4H4" />
				</svg>
			</span>
			<h2 class="text-sm font-bold text-ink">Isi aduan</h2>
		</div>
		<p class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{a.deskripsi}</p>
		{@render bukti(data.lampiranAduan)}

		{#if !terbuka && a.catatanAdmin}
			<div class="mt-4 rounded-xl bg-bg-alt p-4 text-sm text-ink">
				<strong>Catatan penutup dari admin:</strong>
				{a.catatanAdmin}
			</div>
		{/if}
	</div>

	<!-- Pesan -->
	<div class="flex-1 py-6">
		{#if data.pesan.length === 0}
			<div class="flex flex-col items-center py-10 text-center">
				<span class="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink-soft">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
						<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
					</svg>
				</span>
				<p class="mt-3 text-sm font-bold text-ink">Belum ada pesan</p>
				<p class="mt-1 text-xs text-ink-soft">
					{terbuka
						? 'Admin akan membalas di sini. Kamu juga bisa menambah penjelasan atau bukti.'
						: 'Aduan ini sudah ditutup.'}
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.pesan as p (p.id)}
					<div class="flex {p.peran === 'pelapor' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[65%] {p.peran === 'pelapor'
								? 'rounded-br-md bg-primary text-white'
								: 'rounded-bl-md border border-ink/10 bg-white text-ink'}"
						>
							<div class="text-[11px] opacity-70">
								{p.peran === 'admin' ? 'Admin' : 'Kamu'} · {fmtTgl(p.createdAt)}
							</div>
							{#if p.isi}
								<div class="mt-0.5 whitespace-pre-wrap leading-relaxed">{p.isi}</div>
							{/if}
							{@render bukti(p.lampiran)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Kolom ketik -->
	<div class="sticky bottom-0 border-t border-ink/10 bg-bg py-4">
		{#if terbuka}
			<form
				method="POST"
				action="?/balas"
				enctype="multipart/form-data"
				class="space-y-3"
				use:enhance={({ formData }) => {
					formData.delete('bukti');
					for (const b of berkas) formData.append('bukti', b.file);
					mengirim = true;
					return async ({ result, update }) => {
						await update({ reset: false });
						if (result.type === 'success') {
							for (const b of berkas) URL.revokeObjectURL(b.url);
							berkas = [];
							teks = '';
						}
						mengirim = false;
					};
				}}
			>
				<BuktiPicker bind:berkas />

				<div class="flex items-end gap-2">
					<textarea
						name="isi"
						bind:value={teks}
						rows="1"
						maxlength="1000"
						placeholder="Tulis pesan..."
						onkeydown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								e.currentTarget.form?.requestSubmit();
							}
						}}
						class="max-h-32 min-h-12 min-w-0 flex-1 resize-none rounded-3xl border border-ink/15 bg-white px-5 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
					></textarea>
					<button
						disabled={mengirim}
						class="h-12 shrink-0 rounded-pill bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
					>
						Kirim
					</button>
				</div>

				{#if form?.pesan}<p class="text-sm text-red-700">{form.pesan}</p>{/if}
			</form>
		{:else}
			<p class="text-center text-sm text-ink-soft">
				Aduan ini sudah ditutup. Jika masih ada masalah, buat aduan baru dari halaman Pengaduan.
			</p>
		{/if}
	</div>
</div>