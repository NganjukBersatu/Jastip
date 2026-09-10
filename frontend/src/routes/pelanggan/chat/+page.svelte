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

<div class="w-full max-w-310 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
	<!-- HEADER -->
	<div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
		<h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Chat jastiper</h1>
		<p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
			Semua percakapan nego harga kamu.
		</p>
	</div>

	<!-- ===== DAFTAR PERCAKAPAN ===== -->
	<div class="mb-3.5 flex items-center gap-2">
		<h2 class="font-bold text-[15px] text-ink">Daftar percakapan</h2>

		{#if data.daftarPercakapan.length > 0}
			<span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
				{data.daftarPercakapan.length}
			</span>
		{/if}
	</div>

	{#if data.daftarPercakapan.length > 0}
		<div class="flex flex-col gap-3">
			{#each data.daftarPercakapan as p (p.id)}
				{@const st = labelStatus(p.status)}
				<a
					href="/pelanggan/chat/{p.id}"
					class="bg-white rounded-2xl border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-4 sm:p-5 flex justify-between items-start gap-4 transition hover:shadow-md hover:border-ink/15"
				>
					<div class="min-w-0">
						<div class="flex items-center gap-2 flex-wrap">
							<span class="font-bold text-sm text-ink">{p.namaItem}</span>
							<span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full {st.kelas} shrink-0">
								{st.teks}
							</span>
						</div>
						<div class="text-[13px] text-ink-soft mt-1">dengan {p.jastiperNama}</div>
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
	{:else}
		<div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
			<div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
				<span class="text-2xl">💬</span>
			</div>

			<div class="font-bold text-[15px] text-ink">Belum ada percakapan</div>
			<div class="text-[13.5px] text-ink-soft mt-1.5 max-w-75 mx-auto leading-relaxed">
				Klik "Chat jastiper" di produk yang bisa dinego buat mulai obrolan.
			</div>
		</div>
	{/if}
</div>