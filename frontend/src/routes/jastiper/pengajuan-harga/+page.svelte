<script>
// @ts-nocheck

	import { enhance } from '$app/forms';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let daftarPengajuan = $state(data.daftarPengajuan);
	let sedangProses = $state(/** @type {string | number | null} */ (null));

	let kataKunci = $state('');
	let filterAktif = $state('semua');

	const opsiFilter = [
		{ nilai: 'semua', label: 'Semua' },
		{ nilai: 'menunggu', label: 'Menunggu' },
		{ nilai: 'diterima', label: 'Diterima' },
		{ nilai: 'ditolak', label: 'Ditolak' }
	];

	let daftarTertampil = $derived(
		daftarPengajuan.filter((p) => {
			const cocokFilter = filterAktif === 'semua' || p.status === filterAktif;
			const teks = `${p.produkNama} ${p.pelangganNama}`.toLowerCase();
			const cocokKataKunci = teks.includes(kataKunci.toLowerCase());
			return cocokFilter && cocokKataKunci;
		})
	);

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
	}

	/** @param {string | Date} tanggal */
	function formatTanggal(tanggal) {
		return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
	}

	/** @param {string} status */
	function labelStatus(status) {
		/** @type {Record<string, { teks: string, kelas: string }>} */
		const peta = {
			menunggu: { teks: 'Menunggu', kelas: 'bg-accent/20 text-primary-deep' },
			diterima: { teks: 'Diterima', kelas: 'bg-green-100 text-green-700' },
			ditolak: { teks: 'Ditolak', kelas: 'bg-red-100 text-red-700' }
		};
		return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
	}

	/** @param {string} nama */
	function inisial(nama) {
		return nama?.trim()?.charAt(0)?.toUpperCase() ?? '?';
	}
</script>

<svelte:head>
	<title>Pengajuan harga — Nitip</title>
</svelte:head>

<div class="w-full max-w-285uto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
	<!-- HEADER -->
	<div class="mb-8 sm:mb-10 pb-6 border-b border-ink/10">
		<h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">
			Pengajuan harga
		</h1>

		<p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
			Balas tawaran harga dari pelanggan yang lagi nego.
		</p>
	</div>

	<!-- ===== PENCARIAN ===== -->
	<div class="relative mb-3.5">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
		<input
			type="text"
			bind:value={kataKunci}
			placeholder="Cari nama pelanggan atau produk"
			class="w-full h-9.5 rounded-full border border-bg-alt bg-white pl-9 pr-4 text-[13px] text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-primary"
		/>
	</div>

	<!-- ===== FILTER STATUS ===== -->
	<div class="flex flex-wrap gap-2 mb-4">
		{#each opsiFilter as opsi}
			<button
				type="button"
				onclick={() => (filterAktif = opsi.nilai)}
				class="rounded-full px-3.5 py-1.5 text-xs font-semibold border transition {filterAktif === opsi.nilai
					? 'bg-primary text-white border-primary'
					: 'bg-white text-ink-soft border-bg-alt hover:border-primary/40'}"
			>
				{opsi.label}
			</button>
		{/each}
	</div>

	<div class="mb-3.5 flex items-center gap-2">
		<h2 class="font-bold text-[15px] text-ink">
			Pengajuan masuk
		</h2>

		{#if daftarTertampil.length > 0}
			<span class="text-[11px] font-bold bg-bg-alt text-primary-deep px-2 py-0.5 rounded-full">
				{daftarTertampil.length}
			</span>
		{/if}
	</div>

	{#if daftarTertampil.length === 0}
		<div class="bg-white rounded-2xl border border-dashed border-bg-alt px-5 py-14 sm:p-16 text-center">
			<div class="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
				<svg class="w-6 h-6 text-primary-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.35 0-2.62-.32-3.74-.9L3 21l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
				</svg>
			</div>

			{#if kataKunci || filterAktif !== 'semua'}
				<div class="font-bold text-[15px] text-ink">Tidak ada pengajuan yang cocok</div>
				<div class="text-[13.5px] text-ink-soft mt-1.5">Coba ubah kata kunci atau filter status.</div>
			{:else}
				<div class="font-bold text-[15px] text-ink">Belum ada pengajuan masuk</div>
				<div class="text-[13.5px] text-ink-soft mt-1.5 max-w-[280px] mx-auto leading-relaxed">
					Tawaran harga dari pelanggan bakal muncul di sini.
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col gap-3 sm:gap-4">
			{#each daftarTertampil as p (p.id)}
				{@const st = labelStatus(p.status)}
				<div class="bg-white rounded-[26px] border border-bg-alt p-4 sm:p-5 transition hover:shadow-md {sedangProses === p.id ? 'opacity-50 pointer-events-none' : ''}">
					<div class="flex justify-between items-start gap-4">
						<div class="flex items-start gap-3 min-w-0">
							<div class="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-display font-semibold text-[15px] text-primary-deep shrink-0">
								{inisial(p.pelangganNama)}
							</div>
							<div class="min-w-0">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="font-bold text-sm text-ink truncate">{p.produkNama}</span>
									<span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full {st.kelas} shrink-0">
										{st.teks}
									</span>
								</div>
								<div class="text-[12.5px] text-ink-soft mt-1 leading-relaxed">
									dari <span class="font-semibold text-ink">{p.pelangganNama}</span> · {formatTanggal(p.createdAt)}
								</div>
							</div>
						</div>
						<div class="text-right shrink-0">
							<div class="font-display font-semibold text-lg text-primary-dark">{formatRupiah(p.hargaDiajukan)}</div>
							<div class="text-[12px] text-ink-soft">× {p.jumlah} pcs</div>
						</div>
					</div>

					{#if p.catatan}
						<div class="mt-3 bg-bg rounded-xl px-4 py-2.5 text-[13.5px] text-ink-soft italic">
							"{p.catatan}"
						</div>
					{/if}

					<div class="flex gap-2 mt-4">
						<a href="/jastiper/pengajuan-harga/{p.id}" class="flex-1">
							<button
								type="button"
								class="w-full min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-full bg-white border border-bg-alt text-ink font-bold text-[13px] hover:bg-bg transition"
							>
								<i class="ti ti-message-circle" aria-hidden="true"></i> Balas chat
							</button>
						</a>

						{#if p.status === 'menunggu'}
							<a href="/jastiper/pengajuan-harga/{p.id}" class="flex-1">
								<button
									type="button"
									class="w-full min-h-[42px] inline-flex items-center justify-center rounded-full bg-primary text-white font-bold text-[13px] hover:-translate-y-0.5 hover:shadow-md transition"
								>
									Terima / Tolak
								</button>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>