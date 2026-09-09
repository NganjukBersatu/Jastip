<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	/** @type {{ data: import('./$types').PageData, form: any }} */
	let { data, form } = $props();
	/** @typedef {import('./$types').PageData['daftarProduk'][number]} Produk */
	/** @typedef {import('./$types').PageData['daftarJasa'][number]} Jasa */
	const kategoriProduk = ['Semua', 'Makanan', 'Skincare', 'Fashion', 'Elektronik', 'Barang Langka'];
	const kategoriJasa = [
		'Semua',
		'Jemputan',
		'Antar Barang',
		'Titip Antre',
		'Belanja Kebutuhan',
		'Jasa Lainnya'
	];
	const areaList = ['Semua Area', 'Surabaya', 'Malang', 'Kediri', 'Jember', 'Banyuwangi', 'Madiun'];
	/** @type {'produk' | 'jasa'} */
	let tampilan = $state('produk');
	let kategoriAktif = $state('Semua');
	let areaAktif = $state('Semua Area');
	let keyword = $state('');
	let urutan = $state('terbaru');
	let areaOpen = $state(false);
	let urutanOpen = $state(false);
	const urutanList = [
		{ value: 'terbaru', label: 'Terbaru' },
		{ value: 'termurah', label: 'Termurah' },
		{ value: 'termahal', label: 'Termahal' }
	];
	/** @typedef {(Produk & { tipe: 'produk' }) | (Jasa & { tipe: 'jasa', satuan?: string }) | null} ItemDipilih */
	/** @type {ItemDipilih} */
	let itemDipilih = $state(null);
	/** @param {'produk' | 'jasa'} t */
	function gantiTampilan(t) {
		tampilan = t;
		kategoriAktif = 'Semua';
	}
	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}
	/**
	 * @param {Produk | Jasa} item
	 * @param {'produk' | 'jasa'} tipe
	 */
	function bukaDetail(item, tipe) {
		itemDipilih = /** @type {ItemDipilih} */ ({ ...item, tipe });
	}
	function tutupDetail() {
		itemDipilih = null;
	}
	function hubungiJastiper() {
		goto('/publik/pesan');
	}
	/**
	 * @param {{ harga: number }} a
	 * @param {{ harga: number }} b
	 */
	function urutkan(a, b) {
		if (urutan === 'termurah') return a.harga - b.harga;
		if (urutan === 'termahal') return b.harga - a.harga;
		return 0;
	}
	let kategoriList = $derived(tampilan === 'produk' ? kategoriProduk : kategoriJasa);
	let hasilProduk = $derived(
		data.daftarProduk
			.filter((p) => {
				const cocokKategori = kategoriAktif === 'Semua' || p.kategori === kategoriAktif;
				const cocokArea = areaAktif === 'Semua Area' || p.area === areaAktif;
				const cocokKeyword = p.nama.toLowerCase().includes(keyword.toLowerCase());
				return cocokKategori && cocokArea && cocokKeyword;
			})
			.sort(urutkan)
	);
	let hasilJasa = $derived(
		data.daftarJasa
			.filter((j) => {
				const cocokKategori = kategoriAktif === 'Semua' || j.kategori === kategoriAktif;
				const cocokArea = areaAktif === 'Semua Area' || j.area === areaAktif;
				const cocokKeyword = j.nama.toLowerCase().includes(keyword.toLowerCase());
				return cocokKategori && cocokArea && cocokKeyword;
			})
			.sort(urutkan)
	);
	let hasilFilter = $derived(tampilan === 'produk' ? hasilProduk : hasilJasa);
</script>

<svelte:head>
	<title>Katalog — Nitip.</title>
</svelte:head>

<svelte:window onkeydown={(e) => itemDipilih && e.key === 'Escape' && tutupDetail()} />

{#if form?.error}
	<div
		class="fixed top-4 left-1/2 -translate-x-1/2 z-200 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 shadow-lg"
	>
		{form.error}
	</div>
{/if}

<!-- ===== HERO ===== -->
<section
	class="relative overflow-hidden bg-linear-to-br from-orange-100 via-amber-100 to-white
	       pt-8 pb-10 lg:pt-10 lg:pb-14 lg:min-h-90 flex items-center"
>
	<div class="max-w-295 mx-auto px-4 md:px-6 relative z-10 w-full flex items-center justify-between gap-8">
		<div class="lg:max-w-130 shrink-0">
			<span
				class="inline-flex items-center gap-2 bg-white text-primary-dark text-sm font-bold px-4 py-2.5 rounded-full shadow-sm"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="w-3.5 h-3.5"
				>
					<path d="M6 7V5a3 3 0 016 0v2" />
					<rect x="3" y="7" width="12" height="13" rx="2" />
				</svg>
				Katalog Jastip
			</span>

			<h1 class="mt-5 text-[42px] md:text-[60px] leading-tight font-extrabold text-ink">
	Temukan Berbagai Layanan
	<span class="block text-primary">Jastip di Sini!</span>
</h1>

<p class="mt-3 text-ink-soft max-w-130 text-lg md:text-xl">
	Dari produk fashion, makanan, elektronik, hingga layanan jasa, semua bisa kamu temukan
	dengan mudah di Nitip.
</p>

			<div class="mt-7 flex gap-3">
				<button
					onclick={() => gantiTampilan('produk')}
					class="px-7 py-3.5 rounded-full text-base font-bold transition-colors flex items-center gap-2
					{tampilan === 'produk'
						? 'bg-primary text-white shadow-md'
						: 'bg-white text-ink-soft hover:bg-orange-50'}"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="w-4 h-4"
					>
						<path d="M21 8l-9-5-9 5 9 5 9-5z" />
						<path d="M3 8v8l9 5 9-5V8" />
						<path d="M12 13v8" />
					</svg>
					Produk
				</button>

				<button
					onclick={() => gantiTampilan('jasa')}
					class="px-7 py-3.5 rounded-full text-base font-bold transition-colors flex items-center gap-2
					{tampilan === 'jasa'
						? 'bg-primary text-white shadow-md'
						: 'bg-white text-ink-soft hover:bg-orange-50'}"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="w-4 h-4"
					>
						<path d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4z" />
					</svg>
					Jasa
					<span class="ml-0.5">→</span>
				</button>
			</div>
		</div>

		<img
			src="/hero-images/nitip-hero.png"
			alt="Ilustrasi Nitip"
			class="hidden lg:block absolute -right-30 top-1/1 -translate-y-1/2
			       h-[110%] max-h-115 w-auto object-contain z-0 drop-shadow-2xl
			       animate-float"
		/>
	</div>

	<!-- Dekorasi glow -->
	<div
		class="pointer-events-none absolute -left-24 -top-24 w-80 h-80 bg-orange-300/50 rounded-full blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -left-10 top-1/3 w-44 h-44 bg-amber-300/40 rounded-full blur-2xl"
	></div>
	<div
		class="pointer-events-none absolute right-0 -top-16 w-72 h-72 bg-orange-300/40 rounded-full blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-16 bottom-0 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute left-1/3 bottom-0 w-56 h-56 bg-orange-200/40 rounded-full blur-3xl"
	></div>
</section>

<!-- ===== SEARCH + FILTER + GRID ===== -->
<section class="py-10 bg-linear-to-br from-amber-100 via-yellow-50 to-amber-50 relative overflow-hidden">

	<!-- Dekorasi glow pojok -->
	<div class="pointer-events-none absolute -left-10 -top-10 w-72 h-72 bg-orange-200/60 rounded-full blur-3xl"></div>
	<div class="pointer-events-none absolute -right-10 top-10 w-96 h-96 bg-amber-200/60 rounded-full blur-3xl"></div>
	<div class="pointer-events-none absolute right-1/4 -bottom-20 w-72 h-72 bg-orange-200/60 rounded-full blur-3xl"></div>
	<div class="pointer-events-none absolute left-1/3 top-1/2 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl"></div>
	<!-- Search bar: full width, mepet kiri-kanan, terpisah dari container max-w -->
	<div class="px-4 md:px-6 -mt-6 relative z-20">
		<div
			class="flex gap-3 flex-wrap items-center bg-white rounded-2xl shadow-[0_10px_30px_rgba(42,26,14,0.08)] p-1.5 w-full"
		>
			<div class="flex-1 min-w-55 flex items-center gap-2 px-3">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-ink-soft shrink-0">
					<circle cx="11" cy="11" r="7" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					type="text"
					bind:value={keyword}
					placeholder={tampilan === 'produk' ? 'Cari produk, misal: skincare, tiket...' : 'Cari jasa, misal: jemputan, titip antre...'}
					class="w-full py-1.5 text-[15px] outline-none bg-transparent"
				/>
			</div>

			<!-- Dropdown Area -->
			<div class="relative">
				<button
					type="button"
					onclick={() => { areaOpen = !areaOpen; urutanOpen = false; }}
					class="rounded-full px-4 py-1.5 bg-bg-alt text-ink text-sm font-semibold outline-none focus:ring-2 focus:ring-accent flex items-center gap-2 hover:bg-accent/30 transition-colors"
				>
					{areaAktif}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 transition-transform {areaOpen ? 'rotate-180' : ''}">
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>
				{#if areaOpen}
					<button type="button" class="fixed inset-0 z-30 cursor-default" aria-label="Tutup dropdown" onclick={() => (areaOpen = false)}></button>
					<div class="absolute top-full mt-2 left-0 min-w-45 bg-white rounded-2xl shadow-[0_10px_30px_rgba(42,26,14,0.15)] border border-black/5 py-2 z-40">
						{#each areaList as area}
							<button
								type="button"
								onclick={() => { areaAktif = area; areaOpen = false; }}
								class="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors
								{areaAktif === area ? 'text-primary-dark font-bold bg-orange-50' : 'text-ink font-medium hover:bg-bg-alt'}"
							>
								{area}
								{#if areaAktif === area}
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Dropdown Urutan -->
			<div class="relative">
				<button
					type="button"
					onclick={() => { urutanOpen = !urutanOpen; areaOpen = false; }}
					class="rounded-full px-4 py-1.5 bg-bg-alt text-ink text-sm font-semibold outline-none focus:ring-2 focus:ring-accent flex items-center gap-2 hover:bg-accent/30 transition-colors"
				>
					Urutan: {urutanList.find((u) => u.value === urutan)?.label}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5 transition-transform {urutanOpen ? 'rotate-180' : ''}">
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>
				{#if urutanOpen}
					<button type="button" class="fixed inset-0 z-30 cursor-default" aria-label="Tutup dropdown" onclick={() => (urutanOpen = false)}></button>
					<div class="absolute top-full mt-2 right-0 min-w-40 bg-white rounded-2xl shadow-[0_10px_30px_rgba(42,26,14,0.15)] border border-black/5 py-2 z-40">
						{#each urutanList as u}
							<button
								type="button"
								onclick={() => { urutan = u.value; urutanOpen = false; }}
								class="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors
								{urutan === u.value ? 'text-primary-dark font-bold bg-orange-50' : 'text-ink font-medium hover:bg-bg-alt'}"
							>
								{u.label}
								{#if urutan === u.value}
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="max-w-295 mx-auto px-4 md:px-6 relative z-10">
		<div class="flex gap-2.5 flex-wrap mt-8 mb-8">
			{#each kategoriList as kategori}
				<button
					onclick={() => (kategoriAktif = kategori)}
					class="px-4 py-2 rounded-full text-sm font-bold transition-colors
					{kategoriAktif === kategori ? 'bg-primary text-white shadow-[0_6px_16px_rgba(234,88,12,0.45)] ring-2 ring-white/80' : 'bg-white text-ink-soft shadow-sm hover:bg-accent/40'}"
				>
					{kategori}
				</button>
			{/each}
		</div>

		<p class="text-ink-soft text-sm mb-6">
			Menampilkan {hasilFilter.length}
			{tampilan === 'produk' ? 'produk' : 'jasa'}
			{#if areaAktif !== 'Semua Area'}di {areaAktif}{/if}
		</p>

		{#if hasilFilter.length > 0}
			<div class="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
				{#each hasilFilter as item}
					<div
						role="button"
						tabindex="0"
						onclick={() => bukaDetail(item, tampilan)}
						onkeydown={(e) => e.key === 'Enter' && bukaDetail(item, tampilan)}
						class="text-left block w-full bg-white rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(42,26,14,0.06)]
						transition-transform hover:-translate-y-1.5 cursor-pointer"
					>
						<div class="aspect-4/3 relative overflow-hidden">
							<img src={item.gambarUrl} alt={item.nama} class="w-full h-full object-cover" />
							<div
								class="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
							></div>
							<span
								class="absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm
								{item.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}"
							>
								{item.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
							</span>
						</div>
						<div class="px-4 pt-4 pb-4.5">
							<div class="flex justify-between items-center gap-2">
								<span
									class="text-[11px] font-bold text-primary-dark uppercase tracking-wide truncate"
								>
									{item.area ?? '-'}
								</span>
								<span class="text-[11px] text-ink-soft truncate">{item.jastiperNama}</span>
							</div>
							<div class="font-bold text-[15px] mt-1.5 line-clamp-2 min-h-[2.5em]">{item.nama}</div>
							<div class="flex justify-between items-center mt-3 gap-2">
								<div class="font-display font-semibold text-base min-w-0 truncate">
									{formatRupiah(item.harga)}
									{#if item.hargaTipe === 'nego'}
										<span class="text-[11px] font-semibold text-ink-soft font-sans block"
											>mulai dari</span
										>
									{:else if tampilan === 'jasa' && 'satuan' in item && item.satuan}
										<span class="text-[11px] font-semibold text-ink-soft font-sans block"
											>{item.satuan}</span
										>
									{/if}
								</div>
								{#if tampilan === 'jasa'}
									<a href={`/pelanggan/pesan-jasa/${item.id}`}
										onclick={(e) => e.stopPropagation()}
										class="rounded-full bg-ink text-bg font-bold text-xs px-3.5 py-2 whitespace-nowrap
										hover:bg-primary-dark transition-colors"
									>
										Pesan →
									</a>
								{:else if item.hargaTipe === 'nego'}
									<form method="POST" action="?/chatJastiper" use:enhance class="shrink-0"> 
										<input type="hidden" name="produkId" value={item.id} />
										<button
											type="submit"
											onclick={(e) => e.stopPropagation()}
											class="rounded-full bg-ink text-bg font-bold text-xs px-3.5 py-2 whitespace-nowrap
											hover:bg-primary-dark transition-colors flex items-center gap-1.5"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												class="w-3.5 h-3.5"
											>
												<path
													d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
												/>
											</svg>
											Chat
										</button>
									</form>
								{:else}
									<div
										class="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center text-base font-bold shrink-0"
									>
										→
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20 bg-white shadow-[0_10px_30px_rgba(42,26,14,0.08)] rounded-card">
				<p class="text-lg font-semibold">
					{tampilan === 'produk' ? 'Produk' : 'Jasa'} tidak ditemukan
				</p>
				<p class="text-ink-soft text-sm mt-1">
					Coba ganti kata kunci, kategori, atau area pencarian.
				</p>
			</div>
		{/if}
	</div>
</section>

<!-- ===== MODAL DETAIL ===== -->
{#if itemDipilih}
	{@const item = itemDipilih}
	<div
		class="fixed inset-0 z-100 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4"
		role="presentation"
		onclick={tutupDetail}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-white w-full max-w-110 rounded-card overflow-hidden shadow-[0_20px_60px_rgba(42,26,14,0.25)]"
			role="dialog"
			aria-modal="true"
			aria-label={item.nama}
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="aspect-16/10 relative overflow-hidden">
				<img src={item.gambarUrl} alt={item.nama} class="w-full h-full object-cover" />
				<div
					class="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
				></div>
				<span
					class="absolute top-3.5 left-3.5 text-[11.5px] font-extrabold px-3 py-1.5 rounded-full shadow-sm
					{item.hargaTipe === 'nego' ? 'bg-accent text-ink' : 'bg-white/95 text-ink'}"
				>
					{item.hargaTipe === 'nego' ? 'Bisa nego' : 'Harga tetap'}
				</span>
				<button
					onclick={tutupDetail}
					aria-label="Tutup"
					class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 text-ink flex items-center justify-center font-bold shadow-sm hover:bg-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="w-4 h-4"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
			<div class="px-6 pt-5 pb-6">
				<div class="flex justify-between items-center">
					<span class="text-xs font-bold text-primary-dark uppercase tracking-wide"
						>{item.area ?? '-'}</span
					>
					<span class="text-xs text-ink-soft">Jastiper {item.jastiperNama}</span>
				</div>
				<h2 class="font-bold text-xl mt-1.5">{item.nama}</h2>
				<div class="font-display font-semibold text-2xl mt-2">
					{formatRupiah(item.harga)}
					{#if item.hargaTipe === 'nego'}
						<span class="text-sm font-semibold text-ink-soft font-sans">mulai dari</span>
					{:else if item.tipe === 'jasa' && 'satuan' in item && item.satuan}
						<span class="text-sm font-semibold text-ink-soft font-sans">{item.satuan}</span>
					{/if}
				</div>
				<p
					class="text-xs font-semibold mt-1 {item.hargaTipe === 'nego'
						? 'text-primary-dark'
						: 'text-ink-soft'}"
				>
					{item.hargaTipe === 'nego' ? 'Harga bisa dinego' : 'Harga pas, tanpa nego'}
				</p>
				<p class="text-sm text-ink-soft mt-4 leading-relaxed">
					{item.deskripsi ??
						`Detail lengkap ${item.tipe === 'produk' ? 'produk' : 'jasa'} ini dari jastiper ${item.jastiperNama}.`}
				</p>
				<div class="mt-6">
					{#if item.tipe === 'jasa'}
						<a
							href={`/pelanggan/pesan-jasa/${item.id}`}
							class="block text-center w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
						>
							Pesan Jasa
						</a>
					{:else if item.hargaTipe === 'nego'}
						<button
							onclick={hubungiJastiper}
							class="w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5"
						>
							Hubungi Jastiper
						</button>
					{:else}
						<form method="POST" action="?/tambahKeranjang" use:enhance>
							<input type="hidden" name="produkId" value={item.id} />
							<button
								type="submit"
								class="w-full py-3.5 rounded-full font-bold text-[15px] bg-ink text-bg transition-transform hover:-translate-y-0.5"
							>
								Beli
							</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(-50%) translateY(0px);
		}
		50% {
			transform: translateY(-50%) translateY(-16px);
		}
	}

	:global(.animate-float) {
		animation: float 4s ease-in-out infinite;
	}
</style>