<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const p = $derived(data.pesanan);

	const labelStatus: Record<string, { teks: string; kelas: string }> = {
		menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-[#FFC93C] text-[#2A1A0E]' },
		dibelanjakan: { teks: 'Dibelanjakan', kelas: 'bg-[#FFE9C7] text-[#C23B0A]' },
		dikirim: { teks: 'Dikirim', kelas: 'bg-blue-100 text-blue-800' },
		selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-800' },
		dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-800' }
	};

	const rupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);

	const waktu = (d: Date | string | null) =>
		d
			? new Date(d).toLocaleString('id-ID', {
					timeZone: 'Asia/Jakarta',
					day: 'numeric',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: '-';

	const st = $derived(labelStatus[p.status]);
	const linkWa = $derived(data.jastiperWa ? `https://wa.me/${data.jastiperWa}` : '');
</script>

<svelte:head><title>Pesanan #{p.id.slice(0, 8)} · Nitip Admin</title></svelte:head>

<a href="/admin/pesanan" class="text-sm text-[#C23B0A] hover:underline">← Kembali ke pesanan</a>

<div class="mt-2 flex flex-wrap items-center gap-3">
	<h1 class="text-2xl font-bold">Pesanan #{p.id.slice(0, 8)}</h1>
	<span
		class="inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {st?.kelas ?? 'bg-gray-100 text-gray-600'}"
	>
		{st?.teks ?? p.status}
	</span>
</div>
<p class="mt-1 text-sm text-[#7A5E44]">Dibuat {waktu(p.createdAt)}</p>

<div class="mt-6 grid gap-4 md:grid-cols-2">
	<section class="rounded-[26px] bg-white p-5 shadow-sm">
		<h2 class="text-sm font-medium text-[#7A5E44]">Pembeli</h2>
		<p class="mt-1 font-medium">{p.pembeliNama}</p>
		<p class="text-sm text-[#7A5E44]">{p.pembeliEmail}</p>
	</section>

	<section class="rounded-[26px] bg-white p-5 shadow-sm">
		<h2 class="text-sm font-medium text-[#7A5E44]">Jastiper</h2>
		<p class="mt-1 font-medium">{p.jastiperNama}</p>
		<p class="text-sm text-[#7A5E44]">{p.jastiperEmail}</p>
		{#if linkWa}
			<a
				href={linkWa}
				target="_blank"
				rel="noopener"
				class="mt-3 inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full border border-[#FF6A1F] px-4 text-xs font-medium text-[#C23B0A] transition hover:bg-[#FFE9C7]"
			>
				Hubungi lewat WA
			</a>
		{:else}
			<p class="mt-2 text-xs text-[#C23B0A]">Nomor WA jastiper ini belum diisi.</p>
		{/if}
	</section>
</div>

<section class="mt-4 rounded-[26px] bg-white p-5 shadow-sm">
	<h2 class="text-sm font-medium text-[#7A5E44]">Isi pesanan</h2>
	<div class="mt-2 divide-y divide-[#FFF8EC]">
		{#each data.items as it (it.id)}
			<div class="flex items-start justify-between gap-4 py-3 text-sm">
				<div>
					<p class="font-medium">
						{it.nama} <span class="font-normal text-[#7A5E44]">× {it.jumlah}</span>
					</p>
					{#if it.titikJemput}
						<p class="text-xs text-[#7A5E44]">Titik jemput: {it.titikJemput}</p>
					{/if}
				</div>
				<p class="whitespace-nowrap">Rp{rupiah(it.hargaSatuan * it.jumlah)}</p>
			</div>
		{/each}
		<div class="flex justify-between py-3 text-sm">
			<span class="text-[#7A5E44]">Ongkir</span>
			<span>Rp{rupiah(p.ongkir)}</span>
		</div>
		<div class="flex justify-between py-3 font-bold">
			<span>Total</span>
			<span class="text-[#C23B0A]">Rp{rupiah(p.totalHarga)}</span>
		</div>
	</div>
</section>

<section class="mt-4 rounded-[26px] bg-white p-5 text-sm shadow-sm">
	<h2 class="text-sm font-medium text-[#7A5E44]">Pembayaran dan pengiriman</h2>
	<div class="mt-2 grid gap-2 sm:grid-cols-[200px_1fr]">
		<span class="text-[#7A5E44]">Metode pembayaran</span>
		<span>{p.metodePembayaran ?? '-'}</span>

		<span class="text-[#7A5E44]">Pembayaran dikonfirmasi</span>
		<span>{p.pembayaranDikonfirmasi ? `Ya, ${waktu(p.dibayarPada)}` : 'Belum'}</span>

		<span class="text-[#7A5E44]">Alamat kirim</span>
		<span>{p.alamatKirim ?? '-'}</span>

		<span class="text-[#7A5E44]">Terakhir diperbarui</span>
		<span>{waktu(p.updatedAt)}</span>
	</div>
</section>