<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

	// state lokal supaya bisa dihapus dari tampilan tanpa reload halaman
	let daftarPercakapan = $state(data.daftarPercakapan);
	let sedangMenghapus = $state(/** @type {string | number | null} */ (null));

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

		{#if daftarPercakapan.length > 0}
			<span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
				{daftarPercakapan.length}
			</span>
		{/if}
	</div>

	{#if daftarPercakapan.length > 0}
		<div class="flex flex-col gap-3">
			{#each daftarPercakapan as p (p.id)}
				{@const st = labelStatus(p.status)}
				<div
					class="bg-white rounded-2xl border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-4 sm:p-5 flex justify-between items-start gap-4 transition hover:shadow-md hover:border-ink/15 {sedangMenghapus === p.id ? 'opacity-50 pointer-events-none' : ''}"
				>
					<a href="/pelanggan/chat/{p.id}" class="min-w-0 flex-1">
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
					</a>

					<div class="flex items-start gap-3 shrink-0">
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
								class="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
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