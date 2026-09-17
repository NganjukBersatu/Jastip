<script>
	import { page } from '$app/stores';
	import { CheckCircle2 } from 'lucide-svelte';

	let total = $derived(Number($page.url.searchParams.get('total') ?? 0));
	let nama = $derived($page.url.searchParams.get('nama') ?? '');
	let metode = $derived($page.url.searchParams.get('metode') ?? '');
	// DIUBAH: tidak lagi fallback ke '#', supaya bisa dicek kosong/tidaknya di bawah
	let waLink = $derived($page.url.searchParams.get('wa'));
	let jarak = $derived(Number($page.url.searchParams.get('jarak') ?? 0));
	let hargaKm = $derived(Number($page.url.searchParams.get('hargaKm') ?? 0));

	let labelMetode = $derived(
		metode === 'transfer' ? 'Transfer bank' : metode === 'e-wallet' ? 'E-wallet' : 'Tunai (bayar di tempat)'
	);

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}
</script>

<svelte:head>
	<title>Konfirmasi Pesanan — Nitip</title>
</svelte:head>

<section class="max-w-140 mx-auto px-5 py-12">
	<div class="bg-white rounded-[22px] shadow-[0_10px_30px_rgba(42,26,14,0.06)] p-6 space-y-5 text-center">
		<div class="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
			<CheckCircle2 size={28} class="text-accent" />
		</div>

		<div>
			<h1 class="font-bold text-lg">Pesanan berhasil dibuat</h1>
			<p class="text-ink-soft text-sm mt-1">{nama}</p>
		</div>

		<div class="bg-bg-alt rounded-xl px-5 py-4 text-left">
			<p class="text-xs font-bold text-ink-soft uppercase tracking-wide mb-3">Rincian pesanan</p>

			<div class="space-y-2 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-ink-soft">Jarak tempuh</span>
					<span class="font-semibold">{jarak} km</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-ink-soft">Harga per km</span>
					<span class="font-semibold">{formatRupiah(hargaKm)}</span>
				</div>
			</div>

			<div class="border-t border-dashed border-ink/15 my-3"></div>

			<div class="flex items-center justify-between">
				<span class="font-bold">Total yang harus dibayar</span>
				<span class="font-display font-semibold text-lg">{formatRupiah(total)}</span>
			</div>
			<div class="flex items-center justify-between text-sm mt-2">
				<span class="text-ink-soft">Metode pembayaran</span>
				<span class="font-semibold">{labelMetode}</span>
			</div>
		</div>

		{#if waLink}
			<p class="text-xs text-ink-soft">
				Pastikan totalnya sudah sesuai. Untuk pembayaran {labelMetode.toLowerCase()}, konfirmasi
				dilakukan langsung lewat WhatsApp jastiper.
			</p>

			<a
				href={waLink}
				target="_blank"
				rel="noopener noreferrer"
				class="block w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
			>
				Lanjut ke WhatsApp jastiper
			</a>
		{:else}
			<p class="text-xs text-ink-soft">
				Pastikan totalnya sudah sesuai. Pembayaran dilakukan tunai saat jastiper tiba.
			</p>

			<a
				href="/pesanan"
				class="block w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
			>
				Selesai
			</a>
		{/if}

		<a href="/pesanan" class="block text-sm text-ink-soft underline">
			Lihat pesanan saya nanti saja
		</a>
	</div>
</section>