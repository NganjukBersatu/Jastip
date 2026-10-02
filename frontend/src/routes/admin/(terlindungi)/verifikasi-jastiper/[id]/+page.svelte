<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const p = $derived(data.pengajuan);
	const sudahDiproses = $derived(p.status !== 'menunggu');

	const badge: Record<string, string> = {
		menunggu: 'bg-[#FFE9C7] text-[#C23B0A]',
		disetujui: 'bg-emerald-100 text-emerald-700',
		ditolak: 'bg-red-100 text-red-700'
	};

	const cekOtomatis = $derived([
		{ label: 'Format nomor valid', lolos: data.formatNomorValid },
		{ label: 'Nomor tidak dipakai akun lain', lolos: !!p.noWa && !data.nomorDipakaiLain }
	]);

	const tanggal = (d: Date | string) =>
		new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<svelte:head><title>Detail pengajuan · Nitip Admin</title></svelte:head>

<a
	href="/admin/verifikasi-jastiper"
	class="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A5E44] transition hover:text-[#C23B0A]"
>
	<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M19 12H5M11 6l-6 6 6 6" />
	</svg>
	Kembali ke daftar
</a>

<div class="mt-3 grid items-start gap-4 sm:gap-6 lg:grid-cols-3">
	<!-- Kolom kiri -->
	<div class="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
		<section class="overflow-hidden rounded-2xl border border-[#F0E3CB] bg-white shadow-sm">
			<div class="h-16 bg-gradient-to-r from-[#FFE9C7] to-[#FFD8A8] sm:h-20"></div>
			<div class="px-4 pb-5 sm:px-6 sm:pb-6">
				<div class="-mt-9 flex items-end justify-between gap-3">
					<span class="flex size-[72px] shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#FF6A1F] text-3xl font-bold text-white shadow-sm">
						{p.nama.trim().charAt(0).toUpperCase()}
					</span>
					<span class="mb-1 rounded-full px-3 py-1 text-xs font-semibold capitalize {badge[p.status]}">
						{p.status}
					</span>
				</div>

				<h1 class="mt-3 break-words text-xl font-bold tracking-tight">{p.nama}</h1>
				<p class="text-sm text-[#7A5E44]">Mendaftar pada {tanggal(p.createdAt)}</p>

				<dl class="mt-5 divide-y divide-[#F6ECD9] border-t border-[#F6ECD9] text-sm">
					{#each [{ k: 'Email', v: p.email }, { k: 'Nomor WhatsApp', v: p.noWa }, { k: 'Area', v: p.area }, { k: 'Alamat', v: p.alamat }] as baris}
						<div class="grid grid-cols-[150px_1fr] gap-4 py-3">
							<dt class="text-[#7A5E44]">{baris.k}</dt>
							<dd class="font-medium">
								{#if baris.v}{baris.v}{:else}<span class="font-normal text-[#7A5E44]/70">Belum diisi</span>{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</section>

		<section class="rounded-2xl border border-[#F0E3CB] bg-white p-4 shadow-sm sm:p-6">
			<h2 class="font-bold">Foto selfie</h2>
			<p class="text-sm text-[#7A5E44]">Pastikan wajah terlihat jelas dan foto tidak buram.</p>

			<div class="mt-4">
				{#if p.dokumenSelfieUrl}
					<a
						href={p.dokumenSelfieUrl}
						target="_blank"
						rel="noopener"
						class="block h-64 w-full overflow-hidden rounded-xl border border-[#F0E3CB] bg-[#FFFBF3] transition hover:border-[#FF6A1F] sm:h-80"
					>
						<img src={p.dokumenSelfieUrl} alt="Foto selfie pendaftar" class="h-full w-full object-contain" />
					</a>
					<p class="mt-2 text-xs text-[#7A5E44]">Klik foto untuk membuka ukuran penuh.</p>
				{:else}
					<div class="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E8D5B5] bg-[#FFFBF3] text-[#7A5E44] sm:h-80">
						<svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="3" y="4" width="18" height="16" rx="3" />
							<circle cx="9" cy="10" r="1.8" />
							<path d="m21 16-5-5-8 8" />
						</svg>
						<span class="text-sm">Belum diunggah</span>
					</div>
				{/if}
			</div>
		</section>
	</div>

	<!-- Kolom kanan -->
	<div class="min-w-0 space-y-4 sm:space-y-6 lg:sticky lg:top-6">
		<section class="rounded-2xl border border-[#F0E3CB] bg-white p-4 shadow-sm sm:p-6">
			<h2 class="font-bold">Daftar periksa</h2>

			<ul class="mt-4 space-y-3 text-sm">
				{#each cekOtomatis as c}
					<li class="flex items-center gap-3">
						<span class="flex size-5 shrink-0 items-center justify-center rounded-full {c.lolos ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}">
							<svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								{#if c.lolos}<path d="m6 12.5 4 4 8-9" />{:else}<path d="m7 7 10 10M17 7 7 17" />{/if}
							</svg>
						</span>
						<span class="min-w-0">{c.label}</span>
						<span class="ml-auto shrink-0 text-xs text-[#7A5E44]">otomatis</span>
					</li>
				{/each}
				{#each ['Nomor aktif di WhatsApp', 'Dokumen jelas dan sesuai'] as label}
					<li>
						<label class="flex cursor-pointer items-center gap-3">
							<input type="checkbox" class="size-5 shrink-0 rounded accent-[#FF6A1F]" />
							<span>{label}</span>
						</label>
					</li>
				{/each}
			</ul>

			{#if data.waLink}
				<a
					href={data.waLink}
					target="_blank"
					rel="noopener"
					class="mt-5 flex items-center justify-center gap-2 rounded-full border border-[#E8D5B5] py-2.5 text-sm font-semibold transition hover:border-[#FF6A1F] hover:bg-[#FFE9C7]"
				>
					<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z" />
					</svg>
					Hubungi via WhatsApp
				</a>
			{/if}
		</section>

		<section class="rounded-2xl border border-[#F0E3CB] bg-white p-4 shadow-sm sm:p-6">
			<h2 class="font-bold">Keputusan</h2>

			{#if p.status === 'disetujui'}
				<p class="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
					Pengajuan ini sudah disetujui. Jastiper boleh berjualan di Nitip.
				</p>
			{:else if p.status === 'ditolak'}
				<div class="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
					<p class="font-semibold">Pengajuan ini sudah ditolak.</p>
					{#if p.alasanPenolakan}<p class="mt-1 break-words">Alasan: {p.alasanPenolakan}</p>{/if}
				</div>
			{:else}
				<form method="POST" action="?/tolak" use:enhance class="mt-3 space-y-3">
					<label for="alasan" class="text-sm text-[#7A5E44]">Alasan penolakan (wajib jika ditolak)</label>
					<textarea
						id="alasan"
						name="alasan"
						rows="3"
						value={form?.alasan ?? ''}
						placeholder="Tulis alasan supaya pendaftar tahu apa yang harus diperbaiki"
						class="w-full resize-none rounded-xl border border-[#E8D5B5] p-3 text-sm outline-none transition focus:border-[#FF6A1F] focus:ring-2 focus:ring-[#FF6A1F]/15"
					></textarea>
					{#if form?.pesan}
						<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{form.pesan}</p>
					{/if}
					<div class="grid grid-cols-2 gap-3">
						<button
							type="submit"
							class="rounded-full border border-red-300 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
						>
							Tolak
						</button>
						<button
							type="submit"
							formaction="?/setujui"
							class="rounded-full bg-[#FF6A1F] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C23B0A]"
						>
							Setujui
						</button>
					</div>
				</form>
			{/if}
		</section>
	</div>
</div>