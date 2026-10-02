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

	function warnaStatus(s: string) {
		const x = (s ?? '').toLowerCase();
		if (x.includes('selesai')) return 'bg-green-100 text-green-700';
		if (x.includes('batal')) return 'bg-red-100 text-red-700';
		return 'bg-[#FFC93C] text-[#2A1A0E]';
	}

	const kartuCls = 'rounded-3xl border border-[#F6ECD9] bg-white shadow-[0_2px_12px_rgba(122,94,68,0.06)]';
</script>

<!-- Bar progres, dipakai di semua kartu (tanpa persen) -->
{#snippet bar(label: string, n: number, total: number, warna: string)}
	<div class="mb-4 last:mb-0">
		<div class="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
			<span class="min-w-0 truncate font-medium">{label}</span>
			<b class="shrink-0 text-[#2A1A0E]">{n}</b>
		</div>
		<div class="h-2.5 overflow-hidden rounded-full bg-[#FFF3DF]">
			<div
				class="h-full rounded-full transition-all duration-500 {warna}"
				style="width: {persen(n, total)}%"
			></div>
		</div>
	</div>
{/snippet}

<svelte:head><title>Dashboard · Nitip Admin</title></svelte:head>

<div class="mb-6">
	<h1 class="font-serif text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
	<p class="mt-1 text-sm text-[#7A5E44] sm:text-base">Ringkasan aktivitas Nitip.</p>
</div>

<!-- Kartu ringkasan -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<a href="/admin/akun" class="rounded-2xl bg-[#2A1A0E] p-5 text-white transition hover:opacity-90">
		<p class="text-3xl font-bold">{data.akun.total}</p>
		<p class="font-medium">Total akun</p>
		<p class="text-xs text-white/70">{data.akun.jastiper} jastiper · {data.akun.pelanggan} pelanggan</p>
	</a>

	<a href="/admin/pesanan" class="rounded-2xl bg-[#FF6A1F] p-5 text-white transition hover:opacity-90">
		<p class="text-3xl font-bold">{data.pesanan.aktif}</p>
		<p class="font-medium">Pesanan aktif</p>
		<p class="text-xs text-white/80">dari {data.pesanan.total} total pesanan</p>
	</a>

	<a href="/admin/produk" class="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
		<p class="text-3xl font-bold">{data.produk.tampil}</p>
		<p class="font-medium">Produk tampil</p>
		<p class="text-xs text-[#7A5E44]">{data.produk.disembunyikan} disembunyikan · {data.produk.total} total</p>
	</a>

	<a
		href="/admin/verifikasi-jastiper"
		class="rounded-2xl bg-[#FFC93C] p-5 text-[#2A1A0E] transition hover:opacity-90"
	>
		<p class="text-3xl font-bold">{data.jastiper.terverifikasi}</p>
		<p class="font-medium">Jastiper terverifikasi</p>
		<p class="text-xs">{data.jastiper.belum} belum terverifikasi</p>
	</a>
</div>

<!-- Pesanan & akun -->
<div class="mt-4 grid grid-cols-1 gap-4 sm:mt-6 lg:grid-cols-2">
	<section class="{kartuCls} p-5 sm:p-6">
		<div class="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
			<h2 class="font-serif text-lg font-bold">Status pesanan</h2>
			<p class="text-sm text-[#7A5E44]">
				Nilai pesanan selesai:
				<b class="text-[#2A1A0E]">{rupiah(data.pesanan.nilaiSelesai)}</b>
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
		<a href="/admin/produk" class="shrink-0 text-sm font-medium text-[#C23B0A] hover:underline">
			Kelola produk →
		</a>
	</div>

	<div class="grid grid-cols-1 gap-4 px-5 pb-6 sm:px-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
		<!-- Status di katalog -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4">
			<p class="mb-4 text-sm font-semibold text-[#7A5E44]">Status di katalog</p>
			{@render bar('Tampil', data.produk.tampil, data.produk.total, 'bg-green-500')}
			{@render bar('Disembunyikan', data.produk.disembunyikan, data.produk.total, 'bg-gray-400')}
			<p class="mt-3 text-xs text-[#7A5E44]">{data.produk.total} produk di seluruh toko</p>
		</div>

		<!-- Kategori -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4">
			<p class="mb-4 text-sm font-semibold text-[#7A5E44]">Produk per kategori</p>
			{#each data.produk.kategori as k}
				{@render bar(rapi(k.nama), k.n, data.produk.total, 'bg-[#FF6A1F]')}
			{:else}
				<p class="text-sm text-[#7A5E44]">Belum ada data kategori.</p>
			{/each}
		</div>

		<!-- Harga -->
		<div class="rounded-2xl bg-[#FFFBF3] p-4 md:col-span-2 xl:col-span-1">
			<p class="mb-4 text-sm font-semibold text-[#7A5E44]">Harga produk</p>
			<div class="grid grid-cols-1 gap-2 text-center min-[420px]:grid-cols-3">
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-[#7A5E44]">Termurah</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(data.produk.harga.termurah)}</p>
				</div>
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-[#7A5E44]">Rata-rata</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(Math.round(data.produk.harga.rata))}</p>
				</div>
				<div class="rounded-xl bg-white p-3 shadow-sm">
					<p class="text-xs text-[#7A5E44]">Termahal</p>
					<p class="mt-0.5 text-sm font-bold">{rupiah(data.produk.harga.termahal)}</p>
				</div>
			</div>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each data.produk.hargaTipe as t}
					<span class="rounded-full bg-[#FFE9C7] px-3 py-1 text-xs font-medium">{rapi(t.nama)}: {t.n}</span>
				{/each}
			</div>
		</div>
	</div>

	<!-- Produk terbaru: kartu di HP -->
	<div class="border-t border-[#F6ECD9] md:hidden">
		<p class="bg-[#FFF3DF] px-5 py-2 text-sm font-medium text-[#7A5E44]">Produk terbaru</p>
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
							<p class="break-words font-medium">{p.nama}</p>
							<p class="text-xs text-[#C23B0A]">{rapi(p.kategori ?? '')}</p>
							<p class="mt-0.5 break-words text-xs text-[#7A5E44]">Jastiper: {p.jastiper ?? '-'}</p>
						</div>
						<span
							class="shrink-0 rounded-full px-3 py-1 text-xs font-medium {p.aktif
								? 'bg-green-100 text-green-700'
								: 'bg-gray-100 text-gray-600'}"
						>
							{p.aktif ? 'Tampil' : 'Disembunyikan'}
						</span>
					</div>
					<div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
						<p>
							{rupiah(Number(p.harga ?? 0))}
							{#if (p.harga_tipe ?? '').toLowerCase().includes('nego')}
								<span class="ml-1 rounded-full bg-[#FFC93C] px-2 py-0.5 text-xs">Nego</span>
							{/if}
						</p>
						<p class="text-xs text-[#7A5E44]">{tanggal(p.created_at)}</p>
					</div>
				</div>
			{:else}
				<p class="px-5 py-6 text-center text-sm text-[#7A5E44]">Belum ada produk.</p>
			{/each}
		</div>
	</div>

	<!-- Produk terbaru: tabel di layar menengah ke atas -->
	<div class="hidden overflow-x-auto border-t border-[#F6ECD9] md:block">
		<table class="w-full text-left text-sm">
			<thead class="bg-[#FFF3DF] text-[#7A5E44]">
				<tr>
					<th class="px-6 py-2.5 font-medium">Produk terbaru</th>
					<th class="px-6 py-2.5 font-medium">Jastiper</th>
					<th class="px-6 py-2.5 font-medium">Harga</th>
					<th class="px-6 py-2.5 font-medium">Status</th>
					<th class="px-6 py-2.5 font-medium">Ditambahkan</th>
				</tr>
			</thead>
			<tbody>
				{#each data.produk.terbaru as p}
					<tr class="border-t border-[#F6ECD9] transition hover:bg-[#FFFBF3]">
						<td class="px-6 py-3">
							<div class="flex items-center gap-3">
								{#if p.gambar_url}
									<img
										src={p.gambar_url}
										alt=""
										class="size-10 rounded-xl bg-[#FFF3DF] object-cover"
										onerror={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
									/>
								{:else}
									<div class="size-10 rounded-xl bg-[#FFF3DF]"></div>
								{/if}
								<div>
									<p class="font-medium">{p.nama}</p>
									<p class="text-xs text-[#C23B0A]">{rapi(p.kategori ?? '')}</p>
								</div>
							</div>
						</td>
						<td class="px-6 py-3">{p.jastiper ?? '-'}</td>
						<td class="px-6 py-3 whitespace-nowrap">
							{rupiah(Number(p.harga ?? 0))}
							{#if (p.harga_tipe ?? '').toLowerCase().includes('nego')}
								<span class="ml-1 rounded-full bg-[#FFC93C] px-2 py-0.5 text-xs">Nego</span>
							{/if}
						</td>
						<td class="px-6 py-3">
							<span
								class="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap {p.aktif
									? 'bg-green-100 text-green-700'
									: 'bg-gray-100 text-gray-600'}"
							>
								{p.aktif ? 'Tampil' : 'Disembunyikan'}
							</span>
						</td>
						<td class="px-6 py-3 whitespace-nowrap text-[#7A5E44]">{tanggal(p.created_at)}</td>
					</tr>
				{:else}
					<tr><td colspan="5" class="px-6 py-6 text-center text-[#7A5E44]">Belum ada produk.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<!-- Pesanan terbaru -->
<section class="{kartuCls} mt-4 overflow-hidden sm:mt-6">
	<div class="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
		<h2 class="font-serif text-lg font-bold">Pesanan terbaru</h2>
		<a href="/admin/pesanan" class="shrink-0 text-sm font-medium text-[#C23B0A] hover:underline">
			Lihat semua →
		</a>
	</div>

	<!-- Kartu di HP -->
	<div class="divide-y divide-[#F6ECD9] border-t border-[#F6ECD9] md:hidden">
		{#each data.pesanan.terbaru as p}
			<div class="p-4">
				<div class="flex items-center justify-between gap-3">
					<p class="font-medium text-[#7A5E44]">#{p.kode}</p>
					<span class="rounded-full px-3 py-1 text-xs font-medium {warnaStatus(p.status)}">{rapi(p.status)}</span>
				</div>
				<dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
					<div class="min-w-0">
						<dt class="text-xs text-[#7A5E44]">Pembeli</dt>
						<dd class="break-words">{p.pembeli ?? '-'}</dd>
					</div>
					<div class="min-w-0">
						<dt class="text-xs text-[#7A5E44]">Jastiper</dt>
						<dd class="break-words">{p.jastiper ?? '-'}</dd>
					</div>
					<div>
						<dt class="text-xs text-[#7A5E44]">Total</dt>
						<dd class="font-semibold">{rupiah(Number(p.total))}</dd>
					</div>
					<div>
						<dt class="text-xs text-[#7A5E44]">Tanggal</dt>
						<dd class="text-[#7A5E44]">{tanggal(p.created_at)}</dd>
					</div>
				</dl>
			</div>
		{:else}
			<p class="px-5 py-6 text-center text-sm text-[#7A5E44]">Belum ada pesanan.</p>
		{/each}
	</div>

	<!-- Tabel di layar menengah ke atas -->
	<div class="hidden overflow-x-auto md:block">
		<table class="w-full text-left text-sm">
			<thead class="bg-[#FFF3DF] text-[#7A5E44]">
				<tr>
					<th class="px-6 py-2.5 font-medium">Kode</th>
					<th class="px-6 py-2.5 font-medium">Pembeli</th>
					<th class="px-6 py-2.5 font-medium">Jastiper</th>
					<th class="px-6 py-2.5 font-medium">Total</th>
					<th class="px-6 py-2.5 font-medium">Status</th>
					<th class="px-6 py-2.5 font-medium">Tanggal</th>
				</tr>
			</thead>
			<tbody>
				{#each data.pesanan.terbaru as p}
					<tr class="border-t border-[#F6ECD9] transition hover:bg-[#FFFBF3]">
						<td class="px-6 py-3 text-[#7A5E44]">#{p.kode}</td>
						<td class="px-6 py-3">{p.pembeli ?? '-'}</td>
						<td class="px-6 py-3">{p.jastiper ?? '-'}</td>
						<td class="px-6 py-3 font-medium whitespace-nowrap">{rupiah(Number(p.total))}</td>
						<td class="px-6 py-3">
							<span class="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap {warnaStatus(p.status)}">
								{rapi(p.status)}
							</span>
						</td>
						<td class="px-6 py-3 whitespace-nowrap text-[#7A5E44]">{tanggal(p.created_at)}</td>
					</tr>
				{:else}
					<tr><td colspan="6" class="px-6 py-6 text-center text-[#7A5E44]">Belum ada pesanan.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>