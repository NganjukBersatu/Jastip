<script>
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';

	/** @typedef {import('@sveltejs/kit').SubmitFunction} SubmitFunction */

	let { data } = $props();

	/** @type {{ id: string; isi: string; pengirimId: string; createdAt: string | Date }[]} */
	let daftarPesan = $state([]);

	/** @type {{ id: string; harga: number; jumlah: number; status: string; createdAt: string | Date }[]} */
	let daftarTawaran = $state([]);

	let isiPesan = $state('');
	let hargaBaru = $state('');
	let jumlahBaru = $state(1);

	let mengirimTawaran = $state(false);
	let mengirimWilayah = $state(false);

	let wilayahDipilih = $state('');

	/** @type {HTMLDivElement | null} */
	let elemChat = $state(null);

	/** @type {ReturnType<typeof setInterval> | null} */
	let interval = null;

	let sedangPolling = false;

	// Panel detail transaksi
	let detailTerbuka = $state(false);

	// Accordion
	let penawaranTerbuka = $state(true);
	let ongkirTerbuka = $state(false);

	// =========================================================
	// DATA DARI SERVER
	// =========================================================

	$effect(() => {
		daftarPesan = data.daftarPesan ?? [];
		daftarTawaran = data.daftarTawaran ?? [];
	});

	// Ambil wilayah yang sebelumnya sudah dipilih
	$effect(() => {
		wilayahDipilih = data.item.wilayahId ?? '';
	});

	// =========================================================
	// DERIVED DATA
	// =========================================================

	let tawaranTerakhir = $derived(daftarTawaran.at(-1));

	let ongkirTerpilih = $derived(
		(data.daftarWilayah ?? []).find(
			/** @param {{ id: string }} w */
			(w) => w.id === wilayahDipilih
		)
	);

	let totalPerkiraan = $derived(
		Number(data.item.hargaDiajukan ?? 0) * Number(data.item.jumlah ?? 0) +
			Number(ongkirTerpilih?.biaya ?? 0)
	);

	let statusInfo = $derived(labelStatus(data.item.status));

	// =========================================================
	// HELPER
	// =========================================================

	/**
	 * @param {number} angka
	 */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}

	/**
	 * @param {string | Date} tanggal
	 */
	function formatJam(tanggal) {
		return new Date(tanggal).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * @param {string} status
	 */
	function labelStatus(status) {
		/** @type {Record<string, { teks: string; kelas: string }>} */
		const peta = {
			menunggu: {
				teks: 'Menunggu balasan',
				kelas: 'bg-yellow-100 text-yellow-700'
			},
			diterima: {
				teks: 'Diterima',
				kelas: 'bg-green-100 text-green-700'
			},
			ditolak: {
				teks: 'Ditolak',
				kelas: 'bg-red-100 text-red-700'
			}
		};

		return (
			peta[status] ?? {
				teks: status,
				kelas: 'bg-gray-100 text-gray-700'
			}
		);
	}

	function scrollKeBawah() {
		if (elemChat) {
			elemChat.scrollTop = elemChat.scrollHeight;
		}
	}

	// =========================================================
	// NOTIFIKASI
	// =========================================================

	async function tandaiDibaca() {
		try {
			await fetch('?/tandaiDibaca', {
				method: 'POST',
				body: new URLSearchParams()
			});
		} catch (error) {
			console.error('Gagal menandai pesan sebagai dibaca:', error);
		}
	}

	// =========================================================
	// POLLING PESAN
	// =========================================================

	async function ambilPesanBaru() {
		if (sedangPolling) return;

		sedangPolling = true;

		try {
			const terakhir = daftarPesan.at(-1);

			const sejak = terakhir
				? `?sejak=${encodeURIComponent(
						new Date(terakhir.createdAt).toISOString()
					)}`
				: '';

			const res = await fetch(`${data.item.id}/pesan${sejak}`);

			if (!res.ok) {
				return;
			}

			const hasil = await res.json();

			/** @type {{ id: string; isi: string; pengirimId: string; createdAt: string | Date }[]} */
			const pesanDariServer = hasil.pesan ?? [];

			if (pesanDariServer.length === 0) {
				return;
			}

			// Cegah pesan yang sudah ada masuk lagi
			const idSudahAda = new Set(daftarPesan.map((pesan) => pesan.id));

			const pesanBaru = pesanDariServer.filter((pesan) => !idSudahAda.has(pesan.id));

			if (pesanBaru.length > 0) {
				daftarPesan = [...daftarPesan, ...pesanBaru];

				setTimeout(() => {
					scrollKeBawah();
				}, 0);

				await tandaiDibaca();
			}
		} catch (error) {
			console.error('Gagal mengambil pesan baru:', error);
		} finally {
			sedangPolling = false;
		}
	}

	// =========================================================
	// LIFECYCLE
	// =========================================================

	onMount(() => {
		setTimeout(() => {
			scrollKeBawah();
		}, 0);

		tandaiDibaca();

		interval = setInterval(ambilPesanBaru, 3000);
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});

	// =========================================================
	// FORM CHAT
	// =========================================================

	/** @type {SubmitFunction} */
	const handleKirim = () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				isiPesan = '';

				await ambilPesanBaru();

				setTimeout(() => {
					scrollKeBawah();
				}, 0);
			}

			await update({ reset: false });
		};
	};

	// =========================================================
	// FORM TAWARAN
	// =========================================================

	/** @type {SubmitFunction} */
	function handleAjukanTawaran() {
		mengirimTawaran = true;

		return async ({ update }) => {
			mengirimTawaran = false;

			hargaBaru = '';
			jumlahBaru = 1;

			await update();

			// Setelah kirim tawaran,
			// buka bagian penawaran supaya hasilnya terlihat.
			detailTerbuka = true;
			penawaranTerbuka = true;
		};
	}

	// =========================================================
	// FORM WILAYAH
	// =========================================================

	/** @type {SubmitFunction} */
	function handlePilihWilayah() {
		mengirimWilayah = true;

		return async ({ update }) => {
			mengirimWilayah = false;

			await update();

			// Setelah menyimpan wilayah,
			// buka bagian ongkir supaya hasilnya terlihat.
			detailTerbuka = true;
			ongkirTerbuka = true;
		};
	}

	function toggleDetail() {
		detailTerbuka = !detailTerbuka;
	}
</script>

<svelte:head>
	<title>Chat — {data.item.namaItem} — Nitip</title>
</svelte:head>

<div
	class="p-4 sm:p-6 lg:p-8 max-w-310 mx-auto
	       flex flex-col h-[calc(100vh-4rem)]"
>
	<!-- ===================================================== -->
	<!-- HEADER CHAT -->
	<!-- ===================================================== -->

	<div class="shrink-0">
		<a
			href="/pelanggan/chat"
			class="inline-flex items-center gap-1
			       text-[13px] font-semibold text-ink
			       hover:text-ink/70 transition mb-1"
		>
			<svg
				class="w-3.5 h-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>
			Kembali
		</a>

		<div class="flex items-center justify-between gap-4">
			<div class="min-w-0">
				<h1
					class="text-[22px] sm:text-[24px]
					       font-display font-semibold truncate"
				>
					{data.item.namaItem}
				</h1>

				<p
					class="text-ink-soft text-[13px] sm:text-[14px]
					       mt-0.5 truncate"
				>
					Nego dengan
					<span class="font-semibold text-ink">
						{data.item.jastiperNama}
					</span>
				</p>
			</div>

			<div class="text-right shrink-0">
				<div
					class="font-display font-semibold
					       text-[17px] sm:text-lg text-primary-dark"
				>
					{formatRupiah(Number(data.item.hargaDiajukan))}
				</div>

				<div class="text-[11px] text-ink-soft">× {data.item.jumlah} pcs</div>

				<span
					class="inline-flex mt-1
					       text-[10px] sm:text-[11px]
					       font-bold px-2.5 py-1 rounded-full
					       {statusInfo.kelas}"
				>
					{statusInfo.teks}
				</span>
			</div>
		</div>

		<!-- ================================================= -->
		<!-- DETAIL TRANSAKSI -->
		<!-- ================================================= -->

		<div class="mt-4">
			<button
				type="button"
				onclick={toggleDetail}
				class="w-full flex items-center justify-between
				       gap-3 bg-white border border-ink/10
				       rounded-2xl px-4 py-3
				       hover:border-ink/20 hover:bg-bg-alt
				       transition"
			>
				<div class="flex items-center gap-3">
					<div
						class="w-8 h-8 rounded-xl bg-bg
						       flex items-center justify-center
						       text-ink-soft shrink-0"
					>
						<svg
							class="w-4 h-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="4" y1="6" x2="20" y2="6" />
							<line x1="4" y1="12" x2="20" y2="12" />
							<line x1="4" y1="18" x2="20" y2="18" />
						</svg>
					</div>

					<div class="text-left">
						<div class="text-[13px] font-bold text-ink">Detail transaksi</div>

						<div class="text-[11px] text-ink-soft">
							{#if detailTerbuka}
								Sembunyikan penawaran & ongkir
							{:else}
								Buka penawaran & ongkos kirim
							{/if}
						</div>
					</div>
				</div>

				<svg
					class="w-4 h-4 text-ink-soft
					       transition-transform
					       {detailTerbuka ? 'rotate-180' : ''}"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			<!-- ================================================= -->
			<!-- DETAIL DIBUKA -->
			<!-- ================================================= -->

			{#if detailTerbuka}
				<div class="mt-2 flex flex-col gap-2">
					<!-- ================================================= -->
					<!-- PENAWARAN HARGA -->
					<!-- ================================================= -->

					<div class="bg-white border border-ink/10 rounded-2xl overflow-hidden">
						<button
							type="button"
							onclick={() => (penawaranTerbuka = !penawaranTerbuka)}
							class="w-full flex items-center
							       justify-between px-4 py-3"
						>
							<div class="flex items-center gap-2.5">
								<div
									class="w-7 h-7 rounded-lg bg-primary/10
									       flex items-center justify-center
									       text-primary-dark"
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
										<path d="M12 2v20" />
										<path
											d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
										/>
									</svg>
								</div>

								<span class="text-[13px] font-bold">Penawaran harga</span>
							</div>

							<svg
								class="w-4 h-4 text-ink-soft
								       transition-transform
								       {penawaranTerbuka ? 'rotate-180' : ''}"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>

						{#if penawaranTerbuka}
							<div class="px-4 pb-4 border-t border-ink/5">
								{#if tawaranTerakhir}
									<div class="flex items-center justify-between gap-3 pt-3">
										<div>
											<div class="text-[12px] text-ink-soft">
												Tawaranmu · {tawaranTerakhir.jumlah} pcs
											</div>

											<div class="font-display font-semibold text-[16px] mt-0.5">
												{formatRupiah(Number(tawaranTerakhir.harga))}
											</div>
										</div>

										<div>
											<span
												class="text-[10px]
												       font-bold px-2 py-1
												       rounded-full
												       {labelStatus(tawaranTerakhir.status).kelas}"
											>
												{labelStatus(tawaranTerakhir.status).teks}
											</span>
										</div>
									</div>

									<p class="text-[10px] text-ink-soft mt-1">
										Dikirim {formatJam(tawaranTerakhir.createdAt)}
									</p>
								{:else}
									<p class="text-[12px] text-ink-soft pt-3">
										Belum ada tawaran. Kamu bisa mengajukan harga baru.
									</p>
								{/if}

								<!-- FORM TAWARAN -->

								<form
									method="POST"
									action="?/ajukanTawaran"
									use:enhance={handleAjukanTawaran}
									class="flex gap-2 mt-3"
								>
									<input
										type="number"
										name="harga"
										bind:value={hargaBaru}
										placeholder="Harga tawaran baru"
										required
										min="1"
										class="flex-1 min-w-0
										       rounded-xl
										       border border-ink/15
										       px-3 py-2.5
										       text-[13px]
										       focus:outline-none
										       focus:border-ink/40"
									/>

									<input
										type="number"
										name="jumlah"
										bind:value={jumlahBaru}
										placeholder="Jumlah"
										required
										min="1"
										class="w-18.75
										       rounded-xl
										       border border-ink/15
										       px-3 py-2.5
										       text-[13px]
										       focus:outline-none
										       focus:border-ink/40"
									/>

									<button
										type="submit"
										disabled={mengirimTawaran}
										class="rounded-pill
										       bg-primary text-bg
										       font-bold text-[12px]
										       px-4 shrink-0
										       disabled:opacity-50"
									>
										{mengirimTawaran ? '...' : 'Kirim'}
									</button>
								</form>
							</div>
						{/if}
					</div>

					<!-- ================================================= -->
					<!-- ONGKOS KIRIM -->
					<!-- ================================================= -->

					<div class="bg-white border border-ink/10 rounded-2xl overflow-hidden">
						<button
							type="button"
							onclick={() => (ongkirTerbuka = !ongkirTerbuka)}
							class="w-full flex items-center
							       justify-between px-4 py-3"
						>
							<div class="flex items-center gap-2.5">
								<div
									class="w-7 h-7 rounded-lg bg-primary/10
									       flex items-center justify-center
									       text-primary-dark"
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
										<rect x="3" y="7" width="11" height="9" />
										<path d="M14 10h4l3 3v3h-7z" />
										<circle cx="7" cy="18" r="2" />
										<circle cx="18" cy="18" r="2" />
									</svg>
								</div>

								<span class="text-[13px] font-bold">Ongkos kirim</span>
							</div>

							<svg
								class="w-4 h-4 text-ink-soft
								       transition-transform
								       {ongkirTerbuka ? 'rotate-180' : ''}"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>

						{#if ongkirTerbuka}
							<div class="px-4 pb-4 border-t border-ink/5">
								{#if (data.daftarWilayah ?? []).length === 0}
									<p class="text-[12px] text-ink-soft pt-3">
										Jastiper ini belum mengatur wilayah pengiriman. Tanyakan lewat chat jika
										perlu.
									</p>
								{:else}
									<form
										method="POST"
										action="?/pilihWilayah"
										use:enhance={handlePilihWilayah}
										class="flex gap-2 pt-3"
									>
										<select
											name="wilayahId"
											bind:value={wilayahDipilih}
											required
											class="flex-1 min-w-0
											       rounded-xl
											       border border-ink/15
											       px-3 py-2.5
											       text-[13px]
											       focus:outline-none
											       focus:border-ink/40
											       bg-white"
										>
											<option value="" disabled>Pilih wilayah tujuan...</option>

											{#each data.daftarWilayah ?? [] as w (w.id)}
												<option value={w.id}>
													{w.wilayah} — {formatRupiah(Number(w.biaya))}
												</option>
											{/each}
										</select>

										<button
											type="submit"
											disabled={mengirimWilayah || !wilayahDipilih}
											class="rounded-pill
											       bg-ink text-bg
											       font-bold text-[12px]
											       px-4 shrink-0
											       disabled:opacity-50"
										>
											{mengirimWilayah ? '...' : 'Simpan'}
										</button>
									</form>

									{#if data.item.wilayahId}
										<div
											class="flex justify-between
											       items-center gap-3
											       mt-3 pt-3
											       border-t border-ink/5"
										>
											<div>
												<div class="text-[11px] text-ink-soft">Total perkiraan</div>

												<div class="text-[10px] text-ink-soft/70">Barang + ongkos kirim</div>
											</div>

											<span class="font-display font-semibold text-[15px]">
												{formatRupiah(totalPerkiraan)}
											</span>
										</div>
									{:else}
										<p class="text-[11px] text-ink-soft mt-2">
											Pilih wilayah tujuan untuk menghitung total perkiraan.
										</p>
									{/if}
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- ===================================================== -->
	<!-- AREA CHAT -->
	<!-- ===================================================== -->

	<div
		bind:this={elemChat}
		class="flex-1 min-h-0 overflow-y-auto
		       mt-4 flex flex-col gap-3
		       pr-1 pb-1"
	>
		{#each daftarPesan as pesan (pesan.id)}
			{@const punyaSaya = pesan.pengirimId === data.userId}

			<div class="flex {punyaSaya ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-[78%] sm:max-w-[70%]
					       rounded-2xl px-4 py-2.5
					       text-[13.5px] sm:text-[14px]
					       {punyaSaya
						? 'bg-ink text-bg rounded-br-md'
						: 'bg-white border border-ink/10 rounded-bl-md'}"
				>
					<div class="leading-relaxed">
						{pesan.isi}
					</div>

					<div class="text-[10px] mt-1 opacity-60">
						{formatJam(pesan.createdAt)}
					</div>
				</div>
			</div>
		{:else}
			<div class="flex-1 flex items-center justify-center">
				<div class="text-center max-w-70">
					<div
						class="w-12 h-12 rounded-full bg-white
						       border border-ink/10
						       flex items-center justify-center
						       mx-auto mb-3"
					>
						<svg
							class="w-5 h-5 text-ink-soft"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5
								   c-1.35 0-2.62-.32-3.74-.9L3 21
								   l1.9-5.76A8.46 8.46 0 0 1 3.5 11.5
								   8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"
							/>
						</svg>
					</div>

					<p class="text-[13px] font-semibold text-ink">Belum ada pesan</p>

					<p class="text-[12px] text-ink-soft mt-1">
						Mulai nego dengan jastiper melalui chat ini.
					</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- ===================================================== -->
	<!-- INPUT CHAT -->
	<!-- ===================================================== -->

	<form
		method="POST"
		action="?/kirimPesan"
		use:enhance={handleKirim}
		class="shrink-0 flex items-center gap-2
		       mt-3 pt-3 border-t border-ink/10"
	>
		<input
			type="text"
			name="isi"
			bind:value={isiPesan}
			placeholder="Tulis pesan..."
			required
			autocomplete="off"
			class="flex-1 min-w-0 rounded-pill
			       border border-ink/15 bg-white
			       px-4 py-3 text-[13.5px]
			       focus:outline-none
			       focus:border-ink/40"
		/>

		<button
			type="submit"
			class="rounded-pill bg-primary text-bg
			       font-bold text-[13px]
			       px-5 py-3 shrink-0
			       hover:-translate-y-0.5 transition"
		>
			Kirim
		</button>
	</form>
</div>