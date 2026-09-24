<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

	/** @type {{ id: string | number, nama: string } | null} */
	let produkHapus = $state(null);
	let sedangMenghapus = $state(false);

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}

	function tutupModal() {
		if (sedangMenghapus) return;
		produkHapus = null;
	}

	/** @param {KeyboardEvent} e */
	function onKeydown(e) {
		if (e.key === 'Escape' && produkHapus) tutupModal();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>Produk saya — Nitip</title>
</svelte:head>

<div class="w-full max-w-[1800px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-14">
	<!-- HEADER -->
	<div
		class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-10 pb-6 border-b border-ink/10"
	>
		<div class="min-w-0">
			<h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">
				Produk saya
			</h1>
			<p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
				Kelola barang yang kamu tawarkan di katalog.
			</p>
		</div>

		<a
			href="/jastiper/produk/baru"
			class="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-ink text-bg font-bold text-sm px-5 py-3 min-h-11 hover:-translate-y-0.5 hover:shadow-md transition"
		>
			<svg
				class="w-4 h-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M12 5v14M5 12h14" />
			</svg>
			Tambah produk
		</a>
	</div>

	<div class="mb-3.5 flex items-center gap-2">
		<h2 class="font-bold text-[15px] text-ink">Daftar produk</h2>
		{#if data.daftarProduk?.length > 0}
			<span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
				{data.daftarProduk.length}
			</span>
		{/if}
	</div>

	<!-- EMPTY -->
	{#if !data.daftarProduk || data.daftarProduk.length === 0}
		<div
			class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center"
		>
			<div class="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
				<svg
					class="w-6 h-6 text-primary-dark"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
					<path d="M9 8V6a3 3 0 0 1 6 0v2" />
				</svg>
			</div>
			<div class="font-bold text-[15px] text-ink">Belum ada produk</div>
			<div class="text-[13.5px] text-ink-soft mt-1.5 leading-relaxed max-w-75 mx-auto">
				Mulai tambahkan barang pertama yang mau kamu titipkan.
			</div>
		</div>
	{:else}
		<!-- PRODUCT GRID -->
		<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
			{#each data.daftarProduk as p (p.id)}
				<article
					class="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:-translate-y-0.5 hover:shadow-md hover:border-ink/15 transition"
				>
					<!-- IMAGE -->
					<div class="relative h-44 sm:h-40 bg-ink/5 overflow-hidden">
						<img
							src={p.gambarUrl}
							alt={p.nama}
							class="w-full h-full object-cover transition duration-300 hover:scale-[1.02]"
						/>
						{#if p.kategori}
							<span
								class="absolute bottom-2.5 left-2.5 text-white text-[10px] font-bold uppercase tracking-wide bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-pill"
							>
								{p.kategori}
							</span>
						{/if}
					</div>

					<!-- CONTENT -->
					<div class="p-4 sm:p-4.5">
						<div class="flex items-center gap-2 flex-wrap">
							<span
								class="text-[10.5px] font-bold px-2.5 py-1 rounded-pill
                {p.aktif ? 'bg-bg-alt text-primary-dark' : 'bg-ink/5 text-ink-soft'}"
							>
								{p.aktif ? 'Aktif' : 'Nonaktif'}
							</span>
							<span class="text-[10.5px] font-bold px-2.5 py-1 rounded-pill bg-bg text-ink-soft">
								{p.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
							</span>
						</div>

						<div class="mt-3">
							<div class="flex items-start justify-between gap-3">
								<div class="font-bold text-sm text-ink line-clamp-2">
									{p.nama}
								</div>
							</div>

							<div class="font-display font-semibold text-lg text-primary-dark mt-1.5">
								{formatRupiah(p.harga)}
								{#if p.hargaTipe === 'nego'}
									<span class="text-[11px] font-sans font-semibold text-ink-soft ml-1">
										mulai dari
									</span>
								{/if}
							</div>

							<!-- ACTIONS: Edit + Hapus -->
							<div class="mt-4 flex items-center gap-2">
								<a
									href="/jastiper/produk/{p.id}/edit"
									class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-bg-alt text-primary-dark font-bold text-[12.5px] px-3 py-2 min-h-9.5 hover:bg-[#FFDFA8] transition"
								>
									<svg
										class="w-3.5 h-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M12 20h9" />
										<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
									</svg>
									Edit
								</a>

								<!-- Tombol ini hanya membuka modal, penghapusan dilakukan di modal -->
								<button
									type="button"
									onclick={() => (produkHapus = { id: p.id, nama: p.nama })}
									class="shrink-0 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold text-[12.5px] px-4 py-2 min-h-9.5 hover:bg-red-100 transition cursor-pointer"
								>
									Hapus
								</button>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<!-- MODAL KONFIRMASI HAPUS (tema gelap) -->
{#if produkHapus}
	<div class="fixed inset-0 z-70 flex items-center justify-center p-4">
		<button
			type="button"
			class="absolute inset-0 bg-black/60 cursor-default"
			aria-label="Tutup"
			onclick={tutupModal}
		></button>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="judul-hapus"
			class="relative w-full max-w-90 bg-ink text-bg rounded-2xl px-6 pt-6 pb-5 text-center shadow-2xl border border-white/10"
		>
			<div
				class="w-12 h-12 mx-auto mb-3.5 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center"
			>
				<svg
					class="w-6 h-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
					/>
					<path d="M12 9v4M12 17h.01" />
				</svg>
			</div>

			<h3 id="judul-hapus" class="font-bold text-base">Hapus produk?</h3>
			<p class="text-[13.5px] text-bg/70 mt-1.5 mb-5 leading-relaxed">
				Produk "{produkHapus.nama}" akan dihapus permanen dan tidak bisa dikembalikan.
			</p>

			<form
				method="POST"
				action="?/hapus"
				class="grid grid-cols-2 gap-2.5"
				use:enhance={() => {
					sedangMenghapus = true;
					return async ({ update }) => {
						await update();
						sedangMenghapus = false;
						produkHapus = null;
					};
				}}
			>
				<input type="hidden" name="id" value={produkHapus.id} />

				<button
					type="button"
					onclick={tutupModal}
					class="inline-flex items-center justify-center rounded-xl border border-white/25 text-bg font-bold text-[13px] px-4 py-2.5 min-h-10.5 hover:bg-white/10 transition cursor-pointer"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={sedangMenghapus}
					class="inline-flex items-center justify-center rounded-xl bg-red-500 text-white font-bold text-[13px] px-4 py-2.5 min-h-10.5 hover:bg-red-600 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{sedangMenghapus ? 'Menghapus…' : 'Hapus'}
				</button>
			</form>
		</div>
	</div>
{/if}