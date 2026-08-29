<script>
	let { data } = $props();

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
	}

	/** @param {string | Date} tanggal */
	function formatWaktu(tanggal) {
		return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
	}

	/** @param {string} status */
	function labelStatus(status) {
		/** @type {Record<string, { teks: string, kelas: string }>} */
		const peta = {
			menunggu: { teks: 'Menunggu', kelas: 'bg-yellow-100 text-yellow-700' },
			diterima: { teks: 'Diterima', kelas: 'bg-green-100 text-green-700' },
			ditolak: { teks: 'Ditolak', kelas: 'bg-red-100 text-red-700' }
		};
		return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
	}
</script>

<svelte:head>
	<title>Chat jastiper — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[720px]">
	<h1 class="text-[28px]">Chat jastiper</h1>
	<p class="text-ink-soft mt-1 text-[15px]">Semua percakapan nego harga kamu.</p>

	{#if data.daftarPercakapan.length === 0}
		<div class="mt-8 bg-white rounded-2xl border border-dashed border-ink/15 p-12 text-center">
			<div class="font-bold text-sm">Belum ada percakapan</div>
			<div class="text-[13.5px] text-ink-soft mt-1">
				Klik "Chat jastiper" di produk yang bisa dinego buat mulai obrolan.
			</div>
		</div>
	{:else}
		<div class="mt-6 flex flex-col gap-3">
			{#each data.daftarPercakapan as p (p.id)}
				{@const st = labelStatus(p.status)}
				<a
					href="/pelanggan/chat/{p.id}"
					class="bg-white rounded-2xl border border-ink/10 p-4 flex justify-between items-start gap-4 hover:border-ink/25 transition"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-bold text-sm">{p.produkNama}</span>
							<span class="text-[11px] font-bold px-2 py-0.5 rounded-full {st.kelas} shrink-0">{st.teks}</span>
						</div>
						<div class="text-[13px] text-ink-soft mt-0.5">dengan {p.jastiperNama}</div>
						{#if p.pesanTerakhir}
							<div class="text-[13px] text-ink-soft mt-1.5 truncate">
								{p.pesanTerakhir.isi}
							</div>
						{:else}
							<div class="text-[13px] text-ink-soft/60 italic mt-1.5">Belum ada pesan</div>
						{/if}
					</div>
					<div class="text-right shrink-0">
						<div class="font-semibold text-[13.5px] text-primary-dark">{formatRupiah(p.hargaDiajukan)}</div>
						<div class="text-[11px] text-ink-soft mt-1">
							{formatWaktu(p.pesanTerakhir?.createdAt ?? p.createdAt)}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>