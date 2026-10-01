<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const labelAksi: Record<string, string> = {
		hapus_produk: 'Dihapus',
		sembunyikan_produk: 'Disembunyikan',
		tampilkan_produk: 'Ditampilkan kembali',
		tegur_produk: 'Teguran',
		selesai_tegur_produk: 'Teguran diperbaiki'
	};
	const warnaAksi: Record<string, string> = {
		hapus_produk: 'bg-red-100 text-red-800',
		sembunyikan_produk: 'bg-gray-100 text-gray-700',
		tampilkan_produk: 'bg-green-100 text-green-800',
		tegur_produk: 'bg-[#FFC93C] text-[#2A1A0E]',
		selesai_tegur_produk: 'bg-blue-100 text-blue-800'
	};

	const namaBulan = (v: string) => {
		const [y, m] = v.split('-').map(Number);
		return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('id-ID', {
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		});
	};

	const waktu = (d: Date | string) =>
		new Date(d).toLocaleString('id-ID', {
			timeZone: 'Asia/Jakarta',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

	function tautan(jenis: string) {
		const p = new URLSearchParams();
		p.set('bulan', data.bulan);
		if (jenis) p.set('jenis', jenis);
		if (data.q) p.set('q', data.q);
		return `?${p.toString()}`;
	}

	const kartu = $derived([
		{ jenis: '', teks: 'Semua', jumlah: data.total },
		...Object.entries(labelAksi).map(([jenis, teks]) => ({
			jenis,
			teks,
			jumlah: data.ringkasan[jenis] ?? 0
		}))
	]);
</script>

<svelte:head><title>Riwayat Produk · Nitip Admin</title></svelte:head>

<a href="/admin/produk" class="text-sm text-[#C23B0A] hover:underline">← Kembali ke produk</a>

<h1 class="mt-2 text-2xl font-bold">Riwayat produk</h1>
<p class="mt-1 text-sm text-[#7A5E44]">
	Semua tindakan admin pada produk, lengkap dengan alasan atau catatannya.
</p>

<form method="GET" class="mt-6 flex flex-wrap items-center gap-3">
	<select
		name="bulan"
		onchange={(e) => e.currentTarget.form?.requestSubmit()}
		class="rounded-full border border-[#FFE9C7] bg-white px-4 py-2 text-sm outline-none focus:border-[#FF6A1F]"
	>
		{#each data.bulanList as b}
			<option value={b} selected={b === data.bulan}>{namaBulan(b)}</option>
		{/each}
	</select>
	<input
		name="q"
		value={data.q}
		placeholder="Cari nama produk atau catatan..."
		class="w-72 rounded-full border border-[#FFE9C7] bg-white px-4 py-2 text-sm outline-none focus:border-[#FF6A1F]"
	/>
	<input type="hidden" name="jenis" value={data.jenis} />
	<button class="rounded-full bg-[#FF6A1F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C23B0A]">
		Cari
	</button>
</form>

<h2 class="mt-6 text-sm font-medium text-[#7A5E44]">Ringkasan {namaBulan(data.bulan)}</h2>
<div class="mt-2 grid grid-cols-2 gap-3 md:grid-cols-6">
	{#each kartu as k}
		<a
			href={tautan(k.jenis)}
			class="rounded-[20px] p-4 {data.jenis === k.jenis
				? 'bg-[#FF6A1F] text-white'
				: 'bg-white hover:bg-[#FFE9C7]'}"
		>
			<p class="text-2xl font-bold">{k.jumlah}</p>
			<p class="text-xs {data.jenis === k.jenis ? 'text-white/80' : 'text-[#7A5E44]'}">{k.teks}</p>
		</a>
	{/each}
</div>

<div class="mt-4 overflow-x-auto rounded-[26px] bg-white shadow-sm">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-[#FFE9C7] text-[#7A5E44]">
			<tr>
				<th class="px-5 py-3 font-medium">Waktu</th>
				<th class="px-5 py-3 font-medium">Tindakan</th>
				<th class="px-5 py-3 font-medium">Produk</th>
				<th class="px-5 py-3 font-medium">Oleh</th>
				<th class="px-5 py-3 font-medium">Alasan / catatan</th>
			</tr>
		</thead>
		<tbody>
			{#each data.rows as r (r.id)}
				<tr class="border-b border-[#FFF8EC] align-top last:border-0">
					<td class="whitespace-nowrap px-5 py-3 text-[#7A5E44]">{waktu(r.createdAt)}</td>
					<td class="px-5 py-3">
	                <span
	                	class="inline-flex w-[150px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {warnaAksi[r.aksi] ?? 'bg-gray-100'}"
	                >
		            {labelAksi[r.aksi] ?? r.aksi}
	                </span>
                    </td>
					<td class="px-5 py-3">
						{#if r.namaProduk}
							<span class="font-medium">{r.namaProduk}</span>
						{:else}
							<span class="text-xs italic text-[#7A5E44]">(produk sudah dihapus)</span>
						{/if}
					</td>
					<td class="px-5 py-3">{r.adminNama}</td>
					<td class="px-5 py-3">{r.alasan ?? '-'}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="px-5 py-10 text-center text-[#7A5E44]">
						Belum ada aktivitas di {namaBulan(data.bulan)}.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if data.rows.length === 300}
	<p class="mt-2 text-xs text-[#7A5E44]">
		Menampilkan 300 catatan terbaru. Persempit dengan filter atau pencarian.
	</p>
{/if}