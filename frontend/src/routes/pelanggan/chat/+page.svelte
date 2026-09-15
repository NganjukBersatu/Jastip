<script>
// @ts-nocheck

	import { enhance } from '$app/forms';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let daftarPercakapan = $state(data.daftarPercakapan);
	let sedangMenghapus = $state(/** @type {string | number | null} */ (null));

	// state baru: pencarian & filter status
	let kataKunci = $state('');
	let filterAktif = $state('semua');

	const opsiFilter = [
		{ nilai: 'semua', label: 'Semua' },
		{ nilai: 'menunggu', label: 'Menunggu' },
		{ nilai: 'diterima', label: 'Diterima' },
		{ nilai: 'ditolak', label: 'Ditolak' }
	];

	// daftar yang sudah difilter berdasarkan kata kunci + status
	let daftarTertampil = $derived(
		daftarPercakapan.filter((p) => {
			const cocokFilter = filterAktif === 'semua' || p.status === filterAktif;
			const teks = `${p.namaItem} ${p.jastiperNama}`.toLowerCase();
			const cocokKataKunci = teks.includes(kataKunci.toLowerCase());
			return cocokFilter && cocokKataKunci;
		})
	);

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

	<!-- ===== PENCARIAN ===== -->
	<div class="relative mb-3.5">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
		<input
			type="text"
			bind:value={kataKunci}
			placeholder="Cari nama jastiper atau produk"
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

	<!-- ===== DAFTAR PERCAKAPAN ===== -->
	<div class="mb-3.5 flex items-center gap-2">
		<h2 class="font-bold text-[15px] text-ink">Daftar percakapan</h2>

		{#if daftarTertampil.length > 0}
			<span class="text-[11px] font-bold bg-bg-alt text-primary-deep px-2 py-0.5 rounded-full">
				{daftarTertampil.length}
			</span>
		{/if}
	</div>

	{#if daftarTertampil.length > 0}
		<div class="flex flex-col gap-3">
			{#each daftarTertampil as p (p.id)}
				{@const st = labelStatus(p.status)}
				{@const belumDibaca = p.pesanTerakhir && !p.pesanTerakhir.dibacaPelanggan}
				<div
					class="bg-white rounded-card border border-bg-alt p-4 sm:p-5 flex items-start gap-3.5 transition hover:shadow-md {sedangMenghapus === p.id ? 'opacity-50 pointer-events-none' : ''}"
				>
					<!-- AVATAR + BADGE BELUM DIBACA -->
					<a href="/pelanggan/chat/{p.id}" class="relative shrink-0">
						<div class="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-display font-semibold text-[15px] text-primary-deep">
							{inisial(p.jastiperNama)}
						</div>
						{#if belumDibaca}
							<span class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
								1
							</span>
						{/if}
					</a>

					<a href="/pelanggan/chat/{p.id}" class="min-w-0 flex-1">
						<div class="flex items-center gap-2 flex-wrap">
							<span class="font-bold text-sm text-ink">{p.namaItem}</span>
							<span class="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full {st.kelas} shrink-0">
								{st.teks}
							</span>
						</div>
						<div class="text-[13px] text-ink-soft mt-1">dengan {p.jastiperNama}</div>
						{#if p.pesanTerakhir}
							<div class="text-[13px] mt-1.5 truncate {belumDibaca ? 'text-ink font-semibold' : 'text-ink-soft'}">
								{p.pesanTerakhir.isi}
							</div>
						{:else}
							<div class="text-[13px] text-ink-soft/60 italic mt-1.5">Belum ada pesan</div>
						{/if}
					</a>

					<div class="flex items-start gap-2.5 shrink-0">
						<a href="/pelanggan/chat/{p.id}" class="text-right">
							<div class="font-semibold text-[13.5px] text-primary-dark">{formatRupiah(p.hargaDiajukan)}</div>
							<div class="text-[11px] text-ink-soft mt-1">
								{formatWaktu(p.pesanTerakhir?.createdAt ?? p.createdAt)}
							</div>
						</a>

						<form
							method="POST"
							action="?/hapus"
							use:enhance={({ cancel }) => {
								const konfirmasi = confirm('Yakin ingin menghapus percakapan ini? Tindakan ini tidak bisa dibatalkan.');
								if (!konfirmasi) {
									cancel();
									return;
								}
								sedangMenghapus = p.id;

								return async ({ result }) => {
									if (result.type === 'success') {
										daftarPercakapan = daftarPercakapan.filter((item) => item.id !== p.id);
									} else {
										alert('Gagal menghapus percakapan, coba lagi.');
									}
									sedangMenghapus = null;
								};
							}}
						>
							<input type="hidden" name="id" value={p.id} />
							<button
								type="submit"
								aria-label="Hapus percakapan"
								title="Hapus percakapan"
								disabled={sedangMenghapus === p.id}
								class="w-8.5 h-8.5 rounded-[10px] border border-bg-alt bg-white flex items-center justify-center text-primary-dark hover:bg-bg hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="3 6 5 6 21 6" />
									<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
									<path d="M10 11v6" />
									<path d="M14 11v6" />
									<path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
								</svg>
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{:else if kataKunci || filterAktif !== 'semua'}
		<div class="bg-white rounded-2xl border border-dashed border-bg-alt px-5 py-14 sm:p-16 text-center">
			<div class="font-bold text-[15px] text-ink">Tidak ada percakapan yang cocok</div>
			<div class="text-[13.5px] text-ink-soft mt-1.5">Coba ubah kata kunci atau filter status.</div>
		</div>
	{:else}
		<div class="bg-white rounded-2xl border border-dashed border-bg-alt px-5 py-14 sm:p-16 text-center">
			<div class="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
				<span class="text-2xl">💬</span>
			</div>

			<div class="font-bold text-[15px] text-ink">Belum ada percakapan</div>
			<div class="text-[13.5px] text-ink-soft mt-1.5 max-w-75 mx-auto leading-relaxed">
				Klik "Chat jastiper" di produk yang bisa dinego buat mulai obrolan.
			</div>
		</div>
	{/if}
</div>