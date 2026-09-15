<script>
	import { enhance } from '$app/forms';

	/** @type {{ data: import('./$types').PageData, form: any }} */
	let { data, form } = $props();

	const kategoriList = ['Jemputan', 'Antar Barang', 'Titip Antre', 'Belanja Kebutuhan', 'Jasa Lainnya'];

	let hargaTipe = $state('tetap');
	let modeGambar = $state('url'); // 'url' | 'upload'
	let formVisible = $state(false);

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
	<title>Kelola Jasa — Nitip.</title>
</svelte:head>

<div class="w-full max-w-285 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
	<!-- HEADER -->
	<div class="flex justify-between items-start gap-4 flex-wrap mb-8 sm:mb-10 pb-6 border-b border-ink/10">
		<div>
			<h1 class="text-2xl sm:text-[30px] font-extrabold tracking-tight text-ink">Jasa saya</h1>
			<p class="text-ink-soft mt-2 text-sm sm:text-[15px] leading-relaxed">
				Kelola layanan jasa yang kamu tawarkan, seperti jemputan atau titip antre.
			</p>
		</div>
		<button
			onclick={() => (formVisible = !formVisible)}
			class="shrink-0 rounded-full bg-ink text-bg font-bold text-sm px-5 py-2.5 min-h-11 hover:-translate-y-0.5 hover:shadow-md transition"
		>
			{formVisible ? 'Tutup form' : '+ Tambah jasa'}
		</button>
	</div>

	{#if form?.error}
		<div
			class="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-red-700"
		>
			<span
				class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-extrabold"
			>
				!
			</span>
			<span>{form.error}</span>
		</div>
	{/if}

	{#if form?.success}
		<div
			class="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-green-700"
		>
			<span
				class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-extrabold"
			>
				✓
			</span>
			<span>Berhasil disimpan.</span>
		</div>
	{/if}

	<!-- ===== FORM TAMBAH JASA ===== -->
	{#if formVisible}
		<form
			method="POST"
			action="?/tambah"
			enctype="multipart/form-data"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
				};
			}}
			class="bg-white rounded-2xl border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] p-5 sm:p-6 mb-10"
		>
			<div class="mb-6">
				<h2 class="text-sm font-extrabold text-ink">Tambah jasa baru</h2>
				<p class="mt-0.5 text-xs text-ink-soft">Isi detail jasa yang kamu tawarkan ke pelanggan.</p>
			</div>

			<div class="flex flex-col gap-5">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<div>
						<label for="nama" class="block text-sm font-bold mb-1.5">Nama jasa</label>
						<input
							id="nama"
							name="nama"
							type="text"
							required
							placeholder="Misal: Jemput di stasiun Madiun"
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
						/>
					</div>
					<div>
						<label for="kategori" class="block text-sm font-bold mb-1.5">Kategori</label>
						<select
							id="kategori"
							name="kategori"
							required
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
						>
							{#each kategoriList as kategori}
								<option value={kategori}>{kategori}</option>
							{/each}
						</select>
					</div>
				</div>

				<div>
					<label for="deskripsi" class="block text-sm font-bold mb-1.5">Deskripsi (opsional)</label>
					<textarea
						id="deskripsi"
						name="deskripsi"
						rows="3"
						placeholder="Jelaskan detail jasa yang kamu tawarkan..."
						class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
					></textarea>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
					<div>
						<label for="satuan" class="block text-sm font-bold mb-1.5">Satuan (opsional)</label>
						<input
							id="satuan"
							name="satuan"
							type="text"
							placeholder="Misal: per trip, per jam"
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
						/>
					</div>
					<div>
						<label for="hargaTipe" class="block text-sm font-bold mb-1.5">Tipe harga</label>
						<select
							id="hargaTipe"
							name="hargaTipe"
							bind:value={hargaTipe}
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
						>
							<option value="tetap">Harga tetap</option>
							<option value="nego">Bisa nego</option>
						</select>
					</div>
					<div>
						<label for="harga" class="block text-sm font-bold mb-1.5">
							{hargaTipe === 'nego' ? 'Harga mulai dari (Rp)' : 'Harga (Rp)'}
						</label>
						<input
							id="harga"
							name="harga"
							type="number"
							min="1"
							required
							placeholder="15000"
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
						/>
					</div>
				</div>

				<div>
					<span class="block text-sm font-bold mb-1.5">Gambar jasa</span>
					<div class="inline-flex bg-bg-alt rounded-full p-1 mb-3">
						<button
							type="button"
							onclick={() => (modeGambar = 'url')}
							class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                     {modeGambar === 'url' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
						>
							Pakai URL
						</button>
						<button
							type="button"
							onclick={() => (modeGambar = 'upload')}
							class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                     {modeGambar === 'upload' ? 'bg-white shadow-sm' : 'text-ink-soft'}"
						>
							Upload dari perangkat
						</button>
					</div>

					{#if modeGambar === 'url'}
						<input
							name="gambarUrl"
							type="url"
							placeholder="https://..."
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
						/>
					{:else}
						<input
							name="gambarFile"
							type="file"
							accept="image/jpeg,image/png,image/webp"
							class="w-full rounded-xl px-4 py-3 border border-ink/15 bg-bg text-sm outline-none transition
                     file:mr-3 file:rounded-full file:border-0 file:bg-ink file:text-bg file:px-4 file:py-1.5 file:text-xs file:font-bold"
						/>
						<p class="text-xs text-ink-soft mt-1.5">Format JPG/PNG/WEBP, maksimal 5MB.</p>
					{/if}
				</div>
			</div>

			<button
				type="submit"
				class="w-full sm:w-auto mt-7 min-h-12 px-8 py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition hover:-translate-y-0.5 hover:shadow-md"
			>
				Simpan jasa
			</button>
		</form>
	{/if}

	<!-- ===== DAFTAR JASA ===== -->
	<div class="mb-3.5 flex items-center gap-2">
		<h2 class="font-bold text-[15px] text-ink">Daftar jasa</h2>
		{#if data.daftarJasa?.length > 0}
			<span class="text-[11px] font-bold bg-ink/8 text-ink-soft px-2 py-0.5 rounded-full">
				{data.daftarJasa.length}
			</span>
		{/if}
	</div>

	{#if data.daftarJasa?.length > 0}
		<div class="grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
			{#each data.daftarJasa as j}
				<div
					class="bg-white rounded-2xl overflow-hidden border border-ink/10 shadow-[0_2px_12px_rgba(0,0,0,0.025)] transition hover:shadow-md hover:border-ink/15 {!j.aktif
						? 'opacity-60'
						: ''}"
				>
					<div class="aspect-4/3 relative overflow-hidden">
						<img src={j.gambarUrl} alt={j.nama} class="w-full h-full object-cover" />
						<div class="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"></div>
						<span
							class="absolute bottom-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-ink/85 text-white uppercase tracking-wide"
						>
							{j.kategori}
						</span>
						<span
							class="absolute top-3 left-3 text-[10.5px] font-extrabold px-2.5 py-1 rounded-full {j.aktif
								? 'bg-accent text-ink'
								: 'bg-white/90 text-ink-soft'}"
						>
							{j.aktif ? 'Aktif' : 'Nonaktif'}
						</span>
					</div>

					<div class="px-4 pt-4 pb-4">
						<div class="flex justify-between items-start gap-2 mb-1">
							<span class="font-bold text-[13.5px] leading-snug">{j.nama}</span>
							<span
								class="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 {j.hargaTipe ===
								'nego'
									? 'bg-accent text-ink'
									: 'bg-bg-alt text-ink-soft'}"
							>
								{j.hargaTipe === 'nego' ? 'Nego' : 'Tetap'}
							</span>
						</div>

						<p class="font-display font-semibold text-lg text-primary-dark mb-3">
							{formatRupiah(j.harga)}
							{#if j.satuan}<span class="text-xs text-ink-soft font-sans"> / {j.satuan}</span>{/if}
						</p>

						<!-- Tombol aksi -->
						<div class="flex gap-1.5 pt-2.5 border-t border-ink/8">
							<a
								href={`/jastiper/jasa/${j.id}/edit`}
								class="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-bg text-ink font-bold text-[11.5px] py-2 hover:bg-bg-alt transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
								</svg>
								Edit
							</a>

							<form method="POST" action="?/toggleAktif" use:enhance>
								<input type="hidden" name="id" value={j.id} />
								<button
									type="submit"
									title={j.aktif ? 'Nonaktifkan' : 'Aktifkan'}
									aria-label={j.aktif ? 'Nonaktifkan jasa' : 'Aktifkan jasa'}
									class="w-9 h-9 rounded-lg bg-bg text-ink-soft flex items-center justify-center hover:bg-bg-alt transition-colors"
								>
									{#if j.aktif}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
											<path
												d="M16.681 16.673A8.717 8.717 0 0 1 12 18c-3.6 0-6.6-2-9-6 1.272-2.12 2.712-3.678 4.32-4.674m2.86-1.146A9.06 9.06 0 0 1 12 6c3.6 0 6.6 2 9 6-.666 1.11-1.379 2.067-2.138 2.87"
											/>
											<path d="M3 3l18 18" />
										</svg>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="15"
											height="15"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path
												d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
											/>
											<circle cx="12" cy="12" r="3" />
										</svg>
									{/if}
								</button>
							</form>

							<form
								method="POST"
								action="?/hapus"
								use:enhance={() => {
									if (!confirm('Yakin hapus jasa ini?')) return () => {};
								}}
							>
								<input type="hidden" name="id" value={j.id} />
								<button
									type="submit"
									title="Hapus"
									aria-label="Hapus jasa"
									class="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
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
				</div>
			{/each}
		</div>
	{:else}
		<div class="bg-white rounded-2xl border border-dashed border-ink/15 px-5 py-14 sm:p-16 text-center">
			<div class="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="26"
					height="26"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-primary-dark"
				>
					<rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
					<path d="M8.5 7.5V5.75A1.75 1.75 0 0 1 10.25 4h3.5A1.75 1.75 0 0 1 15.5 5.75V7.5" />
					<path d="M3 12.5h18" />
					<path d="M10.25 12.5v1.5a.5.5 0 0 0 .5.5h2.5a.5.5 0 0 0 .5-.5v-1.5" />
				</svg>
			</div>
			<div class="font-bold text-[15px] text-ink">Belum ada jasa</div>
			<div class="text-[13.5px] text-ink-soft mt-1.5 max-w-75 mx-auto leading-relaxed">
				Tambahkan jasa pertamamu supaya muncul di katalog pelanggan.
			</div>
		</div>
	{/if}
</div>