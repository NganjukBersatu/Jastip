<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Filter = 'semua' | 'aktif' | 'selesai' | 'dibatalkan';

	const chips = $derived<{ id: Filter; teks: string; jumlah: number }[]>([
		{ id: 'semua', teks: 'Semua pesanan', jumlah: data.hitung.semua },
		{ id: 'aktif', teks: 'Pesanan aktif', jumlah: data.hitung.aktif },
		{ id: 'selesai', teks: 'Pesanan selesai', jumlah: data.hitung.selesai },
		{ id: 'dibatalkan', teks: 'Pesanan dibatalkan', jumlah: data.hitung.dibatalkan }
	]);

	const labelStatus: Record<string, { teks: string; kelas: string }> = {
		menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-[#FFC93C] text-[#2A1A0E]' },
		dibelanjakan: { teks: 'Dibelanjakan', kelas: 'bg-[#FFE9C7] text-[#C23B0A]' },
		dikirim: { teks: 'Dikirim', kelas: 'bg-blue-100 text-blue-800' },
		selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-800' },
		dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-800' }
	};

	const rupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

	const waktu = (d: Date | string) =>
		new Date(d).toLocaleString('id-ID', {
			timeZone: 'Asia/Jakarta',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

	function tautan(filter: string, halaman = 1) {
		const p = new URLSearchParams();
		if (filter !== 'semua') p.set('filter', filter);
		if (data.q) p.set('q', data.q);
		if (halaman > 1) p.set('halaman', String(halaman));
		const s = p.toString();
		return s ? `?${s}` : '?';
	}
</script>

<svelte:head><title>Pesanan · Nitip Admin</title></svelte:head>

<h1 class="text-2xl font-bold">Pesanan</h1>
<p class="mt-1 text-sm text-[#7A5E44]">
	Pantau semua pesanan di Nitip. Halaman ini hanya untuk melihat, tidak ada yang bisa diubah.
</p>

<form method="GET" class="mt-6 flex flex-wrap items-center gap-3">
	{#if data.filter !== 'semua'}
		<input type="hidden" name="filter" value={data.filter} />
	{/if}
	<input
		name="q"
		value={data.q}
		placeholder="Cari id pesanan, pembeli, atau jastiper..."
		class="w-80 rounded-full border border-[#FFE9C7] bg-white px-4 py-2 text-sm outline-none focus:border-[#FF6A1F]"
	/>
	<button class="rounded-full bg-[#FF6A1F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C23B0A]">
		Cari
	</button>
</form>

<div class="mt-3 flex flex-wrap gap-2">
	{#each chips as c}
		<a
			href={tautan(c.id)}
			class="rounded-full px-4 py-1.5 text-sm {data.filter === c.id
				? 'bg-[#FF6A1F] font-semibold text-white'
				: 'bg-white text-[#7A5E44] hover:bg-[#FFE9C7]'}"
		>
			{c.teks} <span class="opacity-70">({c.jumlah})</span>
		</a>
	{/each}
</div>

<div class="mt-4 flex items-center justify-between gap-3">
	<p class="text-sm text-[#7A5E44]">{data.totalBaris} pesanan</p>

	{#if data.totalHalaman > 1}
		<div class="flex items-center gap-2">
			<a
				href={tautan(data.filter, Math.max(1, data.halaman - 1))}
				aria-label="Halaman sebelumnya"
				class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6A1F] text-[#C23B0A] transition hover:bg-[#FFE9C7] {data.halaman <= 1 ? 'pointer-events-none opacity-40' : ''}"
			>
				←
			</a>
			<span class="min-w-[120px] text-center text-sm text-[#7A5E44]">
				Halaman {data.halaman} dari {data.totalHalaman}
			</span>
			<a
				href={tautan(data.filter, Math.min(data.totalHalaman, data.halaman + 1))}
				aria-label="Halaman berikutnya"
				class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6A1F] text-[#C23B0A] transition hover:bg-[#FFE9C7] {data.halaman >= data.totalHalaman ? 'pointer-events-none opacity-40' : ''}"
			>
				→
			</a>
		</div>
	{/if}
</div>

<div class="mt-4 overflow-x-auto rounded-[26px] bg-white shadow-sm">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-[#FFE9C7] text-[#7A5E44]">
			<tr>
				<th class="px-5 py-3 font-medium">Pesanan</th>
				<th class="px-5 py-3 font-medium">Pembeli</th>
				<th class="px-5 py-3 font-medium">Jastiper</th>
				<th class="px-5 py-3 font-medium">Total</th>
				<th class="px-5 py-3 font-medium">Status</th>
				<th class="px-5 py-3 font-medium">Tanggal</th>
				<th class="px-5 py-3 text-right font-medium">Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each data.daftar as p (p.id)}
				{@const st = labelStatus[p.status]}
				<tr class="border-b border-[#FFF8EC] last:border-0">
					<td class="px-5 py-3">
						<p class="font-medium">{p.namaItem}</p>
						<p class="text-xs text-[#7A5E44]">#{p.id.slice(0, 8)}</p>
					</td>
					<td class="px-5 py-3">{p.pembeliNama}</td>
					<td class="px-5 py-3">{p.jastiperNama}</td>
					<td class="whitespace-nowrap px-5 py-3">Rp{rupiah(p.totalHarga)}</td>
					<td class="px-5 py-3">
						<span
							class="inline-flex w-[150px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {st?.kelas ?? 'bg-gray-100 text-gray-600'}"
						>
							{st?.teks ?? p.status}
						</span>
					</td>
					<td class="whitespace-nowrap px-5 py-3 text-[#7A5E44]">{waktu(p.createdAt)}</td>
					<td class="px-5 py-3 text-right">
						<a
							href="/admin/pesanan/{p.id}"
							class="inline-flex h-8 w-[104px] items-center justify-center whitespace-nowrap rounded-full border border-[#FF6A1F] text-xs font-medium text-[#C23B0A] transition hover:bg-[#FFE9C7]"
						>
							Lihat detail
						</a>
					</td>
				</tr>
			{:else}
				<tr><td colspan="7" class="px-5 py-10 text-center text-[#7A5E44]">Tidak ada pesanan.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

