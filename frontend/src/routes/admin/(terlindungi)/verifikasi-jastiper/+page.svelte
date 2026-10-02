<script lang="ts">
	let { data } = $props();
	import { goto } from '$app/navigation';

	type Status = 'menunggu' | 'disetujui' | 'ditolak';

	const tab: {
		nilai: Status;
		label: string;
		ket: string;
		kartu: string;
		chip: string;
		teksKet: string;
	}[] = [
		{ nilai: 'menunggu', label: 'Menunggu', ket: 'Perlu diperiksa', kartu: 'bg-[#FF6A1F] text-white', chip: 'bg-white/20', teksKet: 'text-white/80' },
		{ nilai: 'disetujui', label: 'Disetujui', ket: 'Boleh berjualan', kartu: 'bg-[#2A1A0E] text-white', chip: 'bg-white/15', teksKet: 'text-white/70' },
		{ nilai: 'ditolak', label: 'Ditolak', ket: 'Tidak lolos', kartu: 'bg-[#FFC83D] text-[#2A1A0E]', chip: 'bg-[#2A1A0E]/10', teksKet: 'text-[#2A1A0E]/70' }
	];

	const kolom = [
		{ label: 'Pendaftar', rata: 'text-left' },
		{ label: 'Nomor WhatsApp', rata: 'text-left' },
		{ label: 'Tanggal', rata: 'text-left' },
		{ label: 'Status', rata: 'text-left' },
		{ label: 'Aksi', rata: 'text-center' }
	];

	const badge: Record<Status, string> = {
		menunggu: 'bg-[#FFE9C7] text-[#C23B0A]',
		disetujui: 'bg-emerald-100 text-emerald-700',
		ditolak: 'bg-red-100 text-red-700'
	};
	const titik: Record<Status, string> = {
		menunggu: 'bg-[#FF6A1F]',
		disetujui: 'bg-emerald-500',
		ditolak: 'bg-red-500'
	};

	const qs = $derived(data.q ? `&q=${encodeURIComponent(data.q)}` : '');
	const labelAktif = $derived(tab.find((t) => t.nilai === data.status)?.label ?? '');

	const tanggal = (d: Date | string) =>
		new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	const inisial = (nama: string) => nama.trim().charAt(0).toUpperCase() || '?';

	// Pencarian langsung: jalan otomatis sambil mengetik (jeda 300 ms)
	// svelte-ignore state_referenced_locally
	let kataCari = $state(data.q);
	let timer: ReturnType<typeof setTimeout>;

	function cari(nilai: string) {
		kataCari = nilai;
		clearTimeout(timer);
		timer = setTimeout(() => {
			const params = new URLSearchParams();
			params.set('status', data.status);
			if (nilai.trim()) params.set('q', nilai.trim());
			goto(`?${params}`, { keepFocus: true, noScroll: true, replaceState: true });
		}, 300);
	}

	$effect(() => () => clearTimeout(timer));

	// Tinggi tabel (hanya layar besar) = sisa tinggi layar di bawah bagian atas,
	// supaya kotaknya memanjang sampai bawah dan hanya isi tabel yang bergulir.
	let bagianAtas: HTMLDivElement | undefined = $state();
	let tinggiTabel = $state(320);

	$effect(() => {
		if (!bagianAtas) return;

		const hitung = () => {
			if (!bagianAtas) return;
			const bawah = bagianAtas.getBoundingClientRect().bottom + window.scrollY;
			// 16px jarak ke tabel dan 32px sisa di bawah tabel
			tinggiTabel = Math.max(260, window.innerHeight - bawah - 16 - 32);
		};

		hitung();
		const pengamat = new ResizeObserver(hitung);
		pengamat.observe(bagianAtas);
		window.addEventListener('resize', hitung);

		return () => {
			pengamat.disconnect();
			window.removeEventListener('resize', hitung);
		};
	});
</script>

<svelte:head><title>Verifikasi jastiper · Nitip Admin</title></svelte:head>

<div bind:this={bagianAtas}>
	<div>
		<h1 class="text-xl font-bold tracking-tight sm:text-2xl">Verifikasi jastiper</h1>
		<p class="mt-1 text-sm text-[#7A5E44] sm:text-base">
			Periksa pendaftar sebelum mereka bisa berjualan di Nitip.
		</p>
	</div>

	<!-- Kartu ringkasan: sekaligus jadi filter status -->
	<div class="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
		{#each tab as t}
			<a
				href="?status={t.nilai}{qs}"
				aria-current={data.status === t.nilai ? 'page' : undefined}
				class="flex items-center gap-4 rounded-2xl p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 {t.kartu} {data.status ===
				t.nilai
					? 'ring-2 ring-[#2A1A0E] ring-offset-2 ring-offset-[#FFF8EC]'
					: ''}"
			>
				<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 {t.chip}">
					<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="9" />
						{#if t.nilai === 'menunggu'}
							<path d="M12 7v5l3 2" />
						{:else if t.nilai === 'disetujui'}
							<path d="m8.5 12.5 2.5 2.5 4.5-5" />
						{:else}
							<path d="m9 9 6 6M15 9l-6 6" />
						{/if}
					</svg>
				</span>
				<div>
					<p class="text-3xl leading-none font-bold">{data.ringkasan[t.nilai]}</p>
					<p class="mt-1.5 text-sm font-semibold">{t.label}</p>
					<p class="text-xs {t.teksKet}">{t.ket}</p>
				</div>
			</a>
		{/each}
	</div>

	<!-- Keterangan filter aktif dan pencarian -->
	<div class="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
		<p class="text-sm text-[#7A5E44]">
			Menampilkan pengajuan <span class="font-semibold text-[#2A1A0E]">{labelAktif}</span>
			<span class="ml-1">({data.daftar.length})</span>
		</p>

		<form method="GET" class="relative w-full sm:w-72">
			<input type="hidden" name="status" value={data.status} />
			<svg viewBox="0 0 24 24" class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#7A5E44]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input
				type="search"
				name="q"
				value={kataCari}
				oninput={(e) => cari(e.currentTarget.value)}
				autocomplete="off"
				placeholder="Cari nama atau email"
				class="w-full rounded-full border border-[#E8D5B5] bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition focus:border-[#FF6A1F] focus:ring-2 focus:ring-[#FF6A1F]/15"
			/>
		</form>
	</div>
</div>

<!-- Tampilan kartu (layar kecil) -->
<div class="mt-4 space-y-3 lg:hidden">
	{#each data.daftar as d (d.id)}
		<div class="rounded-2xl border border-[#E8D5B5] bg-white p-4 shadow-sm">
			<div class="flex items-start gap-3">
				<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE9C7] font-bold text-[#C23B0A]">
					{inisial(d.nama)}
				</span>
				<div class="min-w-0 flex-1">
					<p class="break-words font-semibold">{d.nama}</p>
					<p class="break-all text-xs text-[#7A5E44]">{d.email}</p>
				</div>
				<span class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize {badge[d.status]}">
					<span class="h-1.5 w-1.5 rounded-full {titik[d.status]}"></span>
					{d.status}
				</span>
			</div>

			<dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
				<div class="min-w-0">
					<dt class="text-xs text-[#7A5E44]">Nomor WhatsApp</dt>
					<dd>
						{#if d.noWa}
							<span class="font-medium tabular-nums">{d.noWa}</span>
						{:else}
							<span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Belum diisi</span>
						{/if}
					</dd>
				</div>
				<div>
					<dt class="text-xs text-[#7A5E44]">Tanggal</dt>
					<dd class="text-[#7A5E44]">{tanggal(d.createdAt)}</dd>
				</div>
			</dl>

			<a
				href="/admin/verifikasi-jastiper/{d.id}"
				class="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-[#E8D5B5] py-2 text-sm font-semibold text-[#C23B0A] transition hover:border-[#FF6A1F] hover:bg-[#FFE9C7]"
			>
				Periksa
				<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" />
				</svg>
			</a>
		</div>
	{:else}
		<div class="rounded-2xl border border-[#E8D5B5] bg-white px-5 py-12 text-center shadow-sm">
			<p class="font-semibold">Tidak ada pengajuan</p>
			<p class="text-sm text-[#7A5E44]">
				{data.q ? 'Coba kata pencarian yang lain.' : 'Belum ada pengajuan dengan status ini.'}
			</p>
		</div>
	{/each}
</div>

<!-- Tabel (layar besar): tingginya memanjang ke bawah, hanya isi yang bergulir -->
<div class="mt-4 hidden overflow-hidden rounded-2xl border border-[#E8D5B5] bg-white shadow-sm lg:block">
	<div class="overflow-auto overscroll-contain" style="height: {tinggiTabel}px">
		<table class="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
			<thead>
				<tr>
					{#each kolom as k}
						<th
							class="sticky top-0 z-10 border-b border-[#E8D5B5] bg-[#FFF1D6] px-5 py-3.5 text-xs font-bold tracking-wide text-[#5A3D26] uppercase {k.rata}"
						>
							{k.label}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.daftar as d (d.id)}
					<tr class="transition hover:bg-[#FFFBF3]">
						<td class="border-b border-[#F6ECD9] px-5 py-4">
							<div class="flex items-center gap-3">
								<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE9C7] font-bold text-[#C23B0A]">
									{inisial(d.nama)}
								</span>
								<div class="min-w-0">
									<p class="truncate font-semibold">{d.nama}</p>
									<p class="truncate text-xs text-[#7A5E44]">{d.email}</p>
								</div>
							</div>
						</td>
						<td class="border-b border-[#F6ECD9] px-5 py-4">
							{#if d.noWa}
								<span class="font-medium tabular-nums">{d.noWa}</span>
							{:else}
								<span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Belum diisi</span>
							{/if}
						</td>
						<td class="border-b border-[#F6ECD9] px-5 py-4 whitespace-nowrap text-[#7A5E44]">
							{tanggal(d.createdAt)}
						</td>
						<td class="border-b border-[#F6ECD9] px-5 py-4">
							<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize {badge[d.status]}">
								<span class="h-1.5 w-1.5 rounded-full {titik[d.status]}"></span>
								{d.status}
							</span>
						</td>
						<td class="border-b border-[#F6ECD9] px-5 py-4 text-center">
							<a
								href="/admin/verifikasi-jastiper/{d.id}"
								class="inline-flex items-center gap-1.5 rounded-full border border-[#E8D5B5] px-4 py-1.5 text-sm font-semibold text-[#C23B0A] transition hover:border-[#FF6A1F] hover:bg-[#FFE9C7]"
							>
								Periksa
								<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M13 6l6 6-6 6" />
								</svg>
							</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-5 py-14 text-center">
							<p class="font-semibold">Tidak ada pengajuan</p>
							<p class="text-sm text-[#7A5E44]">
								{data.q ? 'Coba kata pencarian yang lain.' : 'Belum ada pengajuan dengan status ini.'}
							</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>