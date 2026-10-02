<script lang="ts">
	let { data } = $props();

	const rupiah = (n: number) => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
	const tanggal = (d: string | Date | null) =>
		d
			? new Date(d).toLocaleString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: '-';
	const persen = (n: number, total: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
	const rapi = (s: string) => {
		const x = (s ?? '').replace(/_/g, ' ');
		return x.charAt(0).toUpperCase() + x.slice(1);
	};

	// Warna lencana status pesanan + warna titiknya
	function warnaStatus(s: string) {
		const x = (s ?? '').toLowerCase();
		if (x.includes('selesai')) return { badge: 'bg-emerald-100 text-emerald-700', titik: 'bg-emerald-500' };
		if (x.includes('batal')) return { badge: 'bg-red-100 text-red-700', titik: 'bg-red-500' };
		return { badge: 'bg-[#FFE9C7] text-[#C23B0A]', titik: 'bg-[#FF6A1F]' };
	}

	const kartuCls = 'rounded-2xl border border-[#E8D5B5] bg-white shadow-sm';
	const thCls =
		'bg-[#FFF1D6] px-5 py-3.5 text-xs font-bold tracking-wide text-[#5A3D26] uppercase border-b border-[#E8D5B5]';
	const tdCls = 'border-b border-[#F6ECD9] px-5 py-4';
</script>

<!-- Bar progres, dipakai di semua kartu (tanpa persen) -->
{#snippet bar(label: string, n: number, total: number, warna: string)}
	<div class="mb-4 last:mb-0">
		<div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
			<span class="min-w-0 truncate font-medium">{label}</span>
			<b class="shrink-0 text-ink">{n}</b>
		</div>
		<div class="h-2.5 overflow-hidden rounded-full bg-[#FFF3DF]">
			<div
				class="h-full rounded-full transition-all duration-500 {warna}"
				style="width: {persen(n, total)}%"
			></div>
		</div>
	</div>
{/snippet}

<!-- Lencana status pesanan dengan titik -->
{#snippet lencanaPesanan(status: string)}
	{@const w = warnaStatus(status)}
	<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap {w.badge}">
		<span class="h-1.5 w-1.5 rounded-full {w.titik}"></span>
		{rapi(status)}
	</span>
{/snippet}

<!-- Lencana status produk dengan titik -->
{#snippet lencanaProduk(aktif: boolean)}
	<span
		class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap {aktif
			? 'bg-emerald-100 text-emerald-700'
			: 'bg-gray-100 text-gray-600'}"
	>
		<span class="h-1.5 w-1.5 rounded-full {aktif ? 'bg-emerald-500' : 'bg-gray-400'}"></span>
		{aktif ? 'Tampil' : 'Disembunyikan'}
	</span>
{/snippet}

<svelte:head><title>Dashboard · Nitip Admin</title></svelte:head>

<div class="mb-6">
	<h1 class="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
	<p class="mt-1 text-sm text-ink-soft sm:text-base">Ringkasan aktivitas Nitip.</p>
</div>

<!-- Kartu ringkasan (gaya sama seperti halaman Verifikasi jastiper) -->
<div class="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
	<a
		href="/admin/akun"
		class="flex items-center gap-4 rounded-2xl bg-ink p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
	>
		<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
			<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="9" cy="8" r="3.5" />
				<path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2A6.5 6.5 0 0 1 21.5 20" />
			</svg>
		</span>
		<div class="min-w-0">
			<p class="text-3xl leading-none font-bold">{data.akun.total}</p>
			<p class="mt-1.5 text-sm font-semibold">Total akun</p>
			<p class="text-xs text-white/70">{data.akun.jastiper} jastiper · {data.akun.pelanggan} pelanggan</p>
		</div>
	</a>

	<a
		href="/admin/pesanan"
		class="flex items-center gap-4 rounded-2xl bg-primary p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
	>
		<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
			<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M5 8h14l-1 12H6L5 8Z" />
				<path d="M9 8V6a3 3 0 0 1 6 0v2" />
			</svg>
		</span>
		<div class="min-w-0">
			<p class="text-3xl leading-none font-bold">{data.pesanan.aktif}</p>
			<p class="mt-1.5 text-sm font-semibold">Pesanan aktif</p>
			<p class="text-xs text-white/80">dari {data.pesanan.total} total pesanan</p>
		</div>
	</a>

	<a
		href="/admin/produk"
		class="flex items-center gap-4 rounded-2xl border border-[#F0E3CB] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
	>
		<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-alt text-primary-dark">
			<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
				<path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
			</svg>
		</span>
		<div class="min-w-0">
			<p class="text-3xl leading-none font-bold">{data.produk.tampil}</p>
			<p class="mt-1.5 text-sm font-semibold">Produk tampil</p>
			<p class="text-xs text-ink-soft">{data.produk.disembunyikan} disembunyikan · {data.produk.total} total</p>
		</div>
	</a>

	<a
		href="/admin/verifikasi-jastiper"
		class="flex items-center gap-4 rounded-2xl bg-[#FFC83D] p-4 text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
	>
		<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink/10">
			<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9.5 4.3-1.7 7.5-5 7.5-9.5V6L12 3Z" />
				<path d="m9 12 2.2 2.2L15.5 10" />
			</svg>
		</span>
		<div class="min-w-0">
			<p class="text-3xl leading-none font-bold">{data.jastiper.terverifikasi}</p>
			<p class="mt-1.5 text-sm font-semibold">Jastiper terverifikasi</p>
			<p class="text-xs text-ink/70">{data.jastiper.belum} belum terverifikasi</p>
		</div>
	</a>
</div>

<!-- Pesanan & akun -->
<div class="mt-4 grid grid-cols-1 gap-4 sm:mt-6 lg:grid-cols-2">
	<section class="{kartuCls} p-5 sm:p-6">
		<div class="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
			<h2 class="font-serif text-lg font-bold">Status pesanan</h2>
			<p class="text-sm text-ink-soft">
				Nilai pesanan selesai:
				<b class="text-ink">{rupiah(data.pesanan.nilaiSelesai)}</b>
			</p>
		</div>
		{@render bar('Aktif', data.pesanan.aktif, data.pesanan.total, 'bg-[#FFC93C]')}
		{@render bar('Selesai', data.pesanan.selesai, data.pesanan.total, 'bg-green-500')}
		{@render bar('Dibatalkan', data.pesanan.batal, data.pesanan.total, 'bg-red-400')}
	</section>

	<section class="{kartuCls} p-5 sm:p-6">
		<h2 class="mb-5 font-serif text-lg font-bold">Akun per role</h2>
		{@render bar('Admin', data.akun.admin, data.akun.total, 'bg-[#2A1A0E]')}
		{@render bar('Jastiper', data.akun.jastiper, data.akun.total, 'bg-[#FF6A1F]')}
		{@render bar('Pelanggan', data.akun.pelanggan, data.akun.total, 'bg-[#FFC93C]')}
	</section>
</div>

<!-- Ringkasan produk -->
<section class="{kartuCls} mt-4 overflow-hidden sm:mt-6">
	<div class="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
		<h2 class="font-serif text-lg font-bold">Ringkasan produk</h2>
		<a href="/admin/produk" class="shrink-0 text-sm font-medium text-primary-dark hover:underline">
			Kelola produk →
		</a>
	</div>

	<div class="grid grid-cols-1 gap-4 px-5 pb-6 sm:px-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
		<!-- Status di katalog -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4">
			<p class="mb-4 text-sm font-semibold text-ink-soft">Status di katalog</p>
			{@render bar('Tampil', data.produk.tampil, data.produk.total, 'bg-green-500')}
			{@render bar('Disembunyikan', data.produk.disembunyikan, data.produk.total, 'bg-gray-400')}
			<p class="mt-3 text-xs text-ink-soft">{data.produk.total} produk di seluruh toko</p>
		</div>

		<!-- Kategori -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4">
			<p class="mb-4 text-sm font-semibold text-ink-soft">Produk per kategori</p>
			{#each data.produk.kategori as k}
				{@render bar(rapi(k.nama), k.n, data.produk.total, 'bg-[#FF6A1F]')}
			{:else}
				<p class="text-sm text-ink-soft">Belum ada data kategori.</p>
			{/each}
		</div>

		<!-- Harga -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4 md:col-span-2 xl:col-span-1">
			<p class="mb-4 text-sm font-semibold text-ink-soft">Harga produk</p>
			<div class="grid grid-cols-1 gap-2 text-center min-[420px]:grid-cols-3">
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-ink-soft">Termurah</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(data.produk.harga.termurah)}</p>
				</div>
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-ink-soft">Rata-rata</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(Math.round(data.produk.harga.rata))}</p>
				</div>
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-ink-soft">Termahal</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(data.produk.harga.termahal)}</p>
				</div>
			</div>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each data.produk.hargaTipe as t}
					<span class="rounded-full bg-bg-alt px-3 py-1 text-xs font-medium">{rapi(t.nama)}: {t.n}</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Produk terbaru: kartu di HP -->
	<div class="border-t border-[#E8D5B5] md:hidden">
		<p class="bg-[#FFF1D6] px-5 py-3 text-xs font-bold tracking-wide text-[#5A3D26] uppercase">Produk terbaru</p>
		<div class="divide-y divide-[#F6ECD9]">
			{#each data.produk.terbaru as p}
				<div class="p-4">
					<div class="flex items-start gap-3">
						{#if p.gambar_url}
							<img
								src={p.gambar_url}
								alt=""
								class="size-12 shrink-0 rounded-xl bg-[#FFF3DF] object-cover"
								onerror={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
							/>
						{:else}
							<div class="size-12 shrink-0 rounded-xl bg-[#FFF3DF]"></div>
						{/if}
						<div class="min-w-0 flex-1">
							<p class="font-semibold wrap-break-word">{p.nama}</p>
							<p class="text-xs text-primary-dark">{rapi(p.kategori ?? '')}</p>
							<p class="mt-0.5 text-xs wrap-break-wordword text-ink-soft">Jastiper: {p.jastiper ?? '-'}</p>
						</div>
						<div class="shrink-0">{@render lencanaProduk(!!p.aktif)}</div>
					</div>
					<div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
						<p class="font-medium">
							{rupiah(Number(p.harga ?? 0))}
							{#if (p.harga_tipe ?? '').toLowerCase().includes('nego')}
								<span class="ml-1 rounded-full bg-accent-2 py-0.5 text-xs">Nego</span>
							{/if}
						</p>
						<p class="text-xs text-ink-soft">{tanggal(p.created_at)}</p>
					</div>
				</div>
			{:else}
				<p class="px-5 py-8 text-center text-sm text-ink-soft">Belum ada produk.</p>
			{/each}
		</div>
	</div>

	<!-- Produk terbaru: tabel di layar menengah ke atas -->
	<div class="hidden overflow-x-auto border-t border-[#E8D5B5] md:block">
		<table class="w-full border-separate border-spacing-0 text-left text-sm">
			<thead>
				<tr>
					<th class={thCls}>Produk terbaru</th>
					<th class={thCls}>Jastiper</th>
					<th class={thCls}>Harga</th>
					<th class={thCls}>Status</th>
					<th class={thCls}>Ditambahkan</th>
				</tr>
			</thead>
			<tbody>
				{#each data.produk.terbaru as p}
					<tr class="transition hover:bg-[#FFFBF3]">
						<td class={tdCls}>
							<div class="flex items-center gap-3">
								{#if p.gambar_url}
									<img
										src={p.gambar_url}
										alt=""
										class="size-10 shrink-0 rounded-xl bg-[#FFF3DF] object-cover"
										onerror={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
									/>
								{:else}
									<div class="size-10 shrink-0 rounded-xl bg-[#FFF3DF]"></div>
								{/if}
								<div class="min-w-0">
									<p class="font-semibold">{p.nama}</p>
									<p class="text-xs text-primary-dark">{rapi(p.kategori ?? '')}</p>
								</div>
							</div>
						</td>
						<td class={tdCls}>{p.jastiper ?? '-'}</td>
						<td class="{tdCls} whitespace-nowrap">
							<span class="font-medium">{rupiah(Number(p.harga ?? 0))}</span>
							{#if (p.harga_tipe ?? '').toLowerCase().includes('nego')}
								<span class="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs">Nego</span>
							{/if}
						</td>
						<td class={tdCls}>{@render lencanaProduk(!!p.aktif)}</td>
						<td class="{tdCls} whitespace-nowrap text-ink-soft">{tanggal(p.created_at)}</td>
					</tr>
				{:else}
					<tr><td colspan="5" class="px-5 py-10 text-center text-ink-soft">Belum ada produk.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<!-- Pesanan terbaru -->
<section class="{kartuCls} mt-4 overflow-hidden sm:mt-6">
	<div class="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
		<h2 class="font-serif text-lg font-bold">Pesanan terbaru</h2>
		<a href="/admin/pesanan" class="shrink-0 text-sm font-medium text-primary-dark hover:underline">
			Lihat semua →
		</a>
	</div>

	<!-- Kartu di HP -->
	<div class="divide-y divide-[#F6ECD9] border-t border-[#E8D5B5] md:hidden">
		{#each data.pesanan.terbaru as p}
			<div class="p-4">
				<div class="flex items-center justify-between gap-3">
					<p class="font-semibold text-ink-soft">#{p.kode}</p>
					{@render lencanaPesanan(p.status)}
				</div>
				<dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
					<div class="min-w-0">
						<dt class="text-xs text-ink-soft">Pembeli</dt>
						<dd class="wrap-break-word">{p.pembeli ?? '-'}</dd>
					</div>
					<div class="min-w-0">
						<dt class="text-xs text-ink-soft">Jastiper</dt>
						<dd class="wrap-break-word">{p.jastiper ?? '-'}</dd>
					</div>
					<div>
						<dt class="text-xs text-ink-soft">Total</dt>
						<dd class="font-semibold">{rupiah(Number(p.total))}</dd>
					</div>
					<div>
						<dt class="text-xs text-ink-soft">Tanggal</dt>
						<dd class="text-ink-soft">{tanggal(p.created_at)}</dd>
					</div>
				</dl>
			</div>
		{:else}
			<p class="px-5 py-8 text-center text-sm text-ink-soft">Belum ada pesanan.</p>
		{/each}
	</div>

	<!-- Tabel di layar menengah ke atas -->
	<div class="hidden overflow-x-auto border-t border-[#E8D5B5] md:block">
		<table class="w-full border-separate border-spacing-0 text-left text-sm">
			<thead>
				<tr>
					<th class={thCls}>Kode</th>
					<th class={thCls}>Pembeli</th>
					<th class={thCls}>Jastiper</th>
					<th class={thCls}>Total</th>
					<th class={thCls}>Status</th>
					<th class={thCls}>Tanggal</th>
				</tr>
			</thead>
			<tbody>
				{#each data.pesanan.terbaru as p}
					<tr class="transition hover:bg-[#FFFBF3]">
						<td class="{tdCls} font-medium text-ink-soft">#{p.kode}</td>
						<td class={tdCls}>{p.pembeli ?? '-'}</td>
						<td class={tdCls}>{p.jastiper ?? '-'}</td>
						<td class="{tdCls} font-semibold whitespace-nowrap">{rupiah(Number(p.total))}</td>
						<td class={tdCls}>{@render lencanaPesanan(p.status)}</td>
						<td class="{tdCls} whitespace-nowrap text-ink-soft">{tanggal(p.created_at)}</td>
					</tr>
				{:else}
					<tr><td colspan="6" class="px-5 py-10 text-center text-ink-soft">Belum ada pesanan.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>