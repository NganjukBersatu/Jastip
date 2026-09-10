<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	const opsiPeriode = [
		{ value: 'hari-ini', label: 'Hari ini' },
		{ value: 'minggu-ini', label: 'Minggu ini' },
		{ value: 'bulan-ini', label: 'Bulan ini' },
		{ value: 'bulan-lalu', label: 'Bulan lalu' },
		{ value: 'kustom', label: 'Rentang kustom' }
	];

  let riwayatTerbuka = $state(false);

// svelte-ignore state_referenced_locally
let periodeDipilih = $state(data.periode);
// svelte-ignore state_referenced_locally
let dariDipilih = $state(data.dari ?? '');
// svelte-ignore state_referenced_locally
let sampaiDipilih = $state(data.sampai ?? '');

	let labelPeriodeAktif = $derived(
		opsiPeriode.find((o) => o.value === data.periode)?.label ?? 'Periode ini'
	);

	let labelRentangTanggal = $derived(
		`${formatTanggal(data.rentangAwal)} – ${formatTanggal(data.rentangAkhir)}`
	);

	function formatRupiah(angka: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}

	function formatTanggal(tanggal: string | Date) {
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(tanggal));
	}

	const labelStatus: Record<string, { teks: string; kelas: string }> = {
		menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-bg-alt text-primary-dark' },
		dibelanjakan: { teks: 'Dibelanjakan', kelas: 'bg-blue-50 text-blue-700' },
		dikirim: { teks: 'Dikirim', kelas: 'bg-amber-50 text-amber-700' },
		selesai: { teks: 'Selesai', kelas: 'bg-green-50 text-green-700' },
		dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-50 text-red-700' }
	};

	function terapkanFilter() {
		const params = new URLSearchParams();
		params.set('periode', periodeDipilih);
		if (periodeDipilih === 'kustom') {
			if (dariDipilih) params.set('dari', dariDipilih);
			if (sampaiDipilih) params.set('sampai', sampaiDipilih);
		}
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	function gantiHalaman(halamanBaru: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('halaman', String(halamanBaru));
		goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}

	function unduhCsv() {
		const keterangan = [
			[`Laporan penjualan — ${labelPeriodeAktif}`],
			[`Rentang tanggal: ${labelRentangTanggal}`],
			[`Halaman ${data.halaman} dari ${data.totalHalaman}`],
			[]
		];

		const header = ['Tanggal', 'Nama', 'Jumlah', 'Status', 'Total'];
		const baris = data.riwayatPesanan.map((p) => [
			formatTanggal(p.createdAt),
			p.nama,
			String(p.jumlah),
			labelStatus[p.status]?.teks ?? p.status,
			String(p.totalHarga)
		]);

		const csv = [...keterangan, header, ...baris]
			.map((kolom) => kolom.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
			.join('\n');

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `laporan-${data.periode}-hal${data.halaman}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
  </script>

<svelte:head>
	<title>Laporan — Nitip</title>
</svelte:head>

<div class="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
  	<div class="mb-6 sm:mb-8">
		<h1 class="text-2xl sm:text-[28px] font-extrabold tracking-tight text-ink">
			Laporan penjualan
		</h1>
		<p class="text-ink-soft mt-1.5 text-sm sm:text-[15px] leading-relaxed">
			Pendapatan dihitung dari pesanan yang sudah berstatus selesai.
		</p>
	</div>

	<!-- FILTER PERIODE -->
	<div class="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col gap-3">
		<div class="flex flex-col sm:flex-row sm:items-end gap-3">
			<div class="flex-1">
				<label for="periode" class="block text-xs font-bold text-ink-soft mb-1.5">Periode</label>
				<select
					id="periode"
					bind:value={periodeDipilih}
					class="w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm font-semibold bg-white"
				>
					{#each opsiPeriode as opsi}
						<option value={opsi.value}>{opsi.label}</option>
					{/each}
				</select>
			</div>

			{#if periodeDipilih === 'kustom'}
				<div class="flex-1">
					<label for="dari" class="block text-xs font-bold text-ink-soft mb-1.5">Dari</label>
					<input
						id="dari"
						type="date"
						bind:value={dariDipilih}
						class="w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm"
					/>
				</div>
				<div class="flex-1">
					<label for="sampai" class="block text-xs font-bold text-ink-soft mb-1.5">Sampai</label>
					<input
						id="sampai"
						type="date"
						bind:value={sampaiDipilih}
						class="w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm"
					/>
				</div>
			{/if}

			<button
				type="button"
				onclick={terapkanFilter}
				class="rounded-pill bg-ink text-bg font-bold text-sm px-6 py-2.5 whitespace-nowrap"
			>
				Terapkan
			</button>
		</div>
	</div>

	<!-- RINGKASAN PERIODE TERPILIH -->
	<div class="rounded-2xl bg-primary text-white p-5 sm:p-6 mb-4">
		<p class="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">
			Pendapatan · {labelPeriodeAktif}
		</p>
		<p class="text-xs opacity-75 mb-2">{labelRentangTanggal}</p>
		<p class="font-display font-bold text-3xl sm:text-4xl">{formatRupiah(data.pendapatanPeriode)}</p>
	</div>

	<!-- STAT SEKILAS -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="rounded-2xl border border-ink/10 bg-white p-5">
			<p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Hari ini</p>
			<p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanHarian)}</p>
		</div>
		<div class="rounded-2xl border border-ink/10 bg-white p-5">
			<p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Minggu ini</p>
			<p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanMingguan)}</p>
		</div>
		<div class="rounded-2xl border border-ink/10 bg-white p-5">
			<p class="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">Bulan ini</p>
			<p class="font-display font-bold text-xl text-ink">{formatRupiah(data.pendapatanBulanan)}</p>
		</div>
	</div>

  <div class="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">
	<!-- PRODUK/JASA TERLARIS -->
	<section>
		<div class="flex items-center justify-between gap-2 bg-white border border-ink/10 rounded-2xl px-4 py-3.5 mb-3">
			<h2 class="text-lg font-display font-semibold text-ink">Produk/jasa terlaris</h2>
			<span class="text-xs text-ink-soft">{labelPeriodeAktif}</span>
		</div>

		{#if data.produkTerlaris.length === 0}
			<div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-8 text-center">
				<p class="text-[13px] font-semibold text-ink mb-1">Tidak ada data untuk rentang ini</p>
				<p class="text-[13px] text-ink-soft">
					Belum ada pesanan selesai antara {labelRentangTanggal}. Coba pilih periode lain.
				</p>
			</div>
      		{:else}
			<div class="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
				{#each data.produkTerlaris as p, i (p.produkId ?? p.jasaId)}
					<div class="flex justify-between items-center px-4 py-3.5">
						<div class="flex items-center gap-3 min-w-0">
							<span
								class="w-6 h-6 rounded-full bg-bg-alt text-primary-dark text-xs font-bold flex items-center justify-center shrink-0"
							>
								{i + 1}
							</span>
							<div class="min-w-0">
								<div class="font-semibold text-sm truncate">{p.nama}</div>
								<div class="text-xs text-ink-soft">{p.totalTerjual} terjual</div>
							</div>
						</div>
						<div class="font-display font-semibold text-sm shrink-0 ml-3">
							{formatRupiah(p.totalPendapatan)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- RIWAYAT PESANAN -->
	<section>
		<button
			type="button"
			onclick={() => (riwayatTerbuka = !riwayatTerbuka)}
			class="w-full flex items-center justify-between gap-2 bg-white border border-ink/10 rounded-2xl px-4 py-3.5 hover:bg-bg-alt/40 transition"
		>
			<span class="flex flex-col items-start gap-0.5">
				<span class="flex items-center gap-2">
					<h2 class="text-lg font-display font-semibold text-ink">Riwayat pesanan</h2>
					<span class="text-xs text-ink-soft">({data.riwayatPesanan.length} di halaman ini)</span>
				</span>
				<span class="text-xs text-primary-dark font-semibold">
					{riwayatTerbuka ? 'Klik untuk tutup' : 'Klik untuk lihat riwayat'}
				</span>
			</span>
  			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="w-5 h-5 shrink-0 transition-transform {riwayatTerbuka ? 'rotate-180' : ''}"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>

		{#if !riwayatTerbuka && data.riwayatPesanan.length > 0}
			<div class="mt-3 bg-white/60 border border-dashed border-ink/15 rounded-2xl px-4 py-3.5">
				<p class="text-xs text-ink-soft mb-1">Pesanan terbaru</p>
				<div class="flex items-center justify-between gap-3">
					<div class="min-w-0">
						<div class="font-semibold text-sm truncate">{data.riwayatPesanan[0].nama}</div>
						<div class="text-xs text-ink-soft">
							{formatTanggal(data.riwayatPesanan[0].createdAt)} · {data.riwayatPesanan[0].jumlah}x
						</div>
					</div>
					<span
						class="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 {labelStatus[data.riwayatPesanan[0].status]?.kelas ?? 'bg-bg-alt text-ink-soft'}"
					>
						{labelStatus[data.riwayatPesanan[0].status]?.teks ?? data.riwayatPesanan[0].status}
					</span>
				</div>
			</div>
		{/if}

		{#if riwayatTerbuka}
    
    <p class="text-xs text-ink-soft mb-3 mt-2">
			Menampilkan pesanan periode {labelPeriodeAktif.toLowerCase()}, termasuk yang dibatalkan —
			pesanan dibatalkan tidak dihitung ke pendapatan di atas.
		</p>

		{#if data.riwayatPesanan.length === 0}
    			<div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-8 text-center">
				<p class="text-[13px] font-semibold text-ink mb-1">Tidak ada data untuk rentang ini</p>
				<p class="text-[13px] text-ink-soft">
					Tidak ada pesanan tercatat antara {labelRentangTanggal}. Coba pilih periode lain.
				</p>
			</div>
      		{:else}
			<div class="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10 max-h-[420px] overflow-y-auto">
				{#each data.riwayatPesanan as p (p.id)}
					<div class="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
						<div class="min-w-0">
							<div class="font-semibold text-sm truncate">{p.nama}</div>
							<div class="text-xs text-ink-soft">{formatTanggal(p.createdAt)} · {p.jumlah}x</div>
						</div>
						<div class="flex items-center gap-3 shrink-0">
							<span
								class="text-[11px] font-bold px-2.5 py-1 rounded-full {labelStatus[p.status]?.kelas ?? 'bg-bg-alt text-ink-soft'}"
							>
								{labelStatus[p.status]?.teks ?? p.status}
							</span>
							<span class="font-display font-semibold text-sm w-24 text-right">
								{formatRupiah(p.totalHarga)}
							</span>
						</div>
					</div>
				{/each}
			</div>

			{#if data.totalHalaman > 1}
				<div class="flex items-center justify-center gap-2 mt-4">
					<button
						type="button"
						onclick={() => gantiHalaman(data.halaman - 1)}
						disabled={data.halaman <= 1}
						class="rounded-pill border border-ink/15 px-4 py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Sebelumnya
					</button>
					<span class="text-xs text-ink-soft px-2">
						Halaman {data.halaman} dari {data.totalHalaman}
					</span>
					<button
						type="button"
						onclick={() => gantiHalaman(data.halaman + 1)}
						disabled={data.halaman >= data.totalHalaman}
						class="rounded-pill border border-ink/15 px-4 py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Berikutnya
					</button>
				</div>
			{/if}
		{/if}

		<button
			type="button"
			onclick={unduhCsv}
			disabled={data.riwayatPesanan.length === 0}
			class="mt-4 rounded-pill border border-ink/15 text-ink font-bold text-xs px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
		>
			Unduh CSV — {labelPeriodeAktif}
		</button>
		{/if}
	</section>
	</div>
</div>