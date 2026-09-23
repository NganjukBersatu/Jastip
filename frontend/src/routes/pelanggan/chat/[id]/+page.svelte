<script>
// @ts-nocheck

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
	let mengirimKonfirmasi = $state(false);

	let wilayahDipilih = $state('');
	let alamatLengkap = $state('');
	let metodePembayaran = $state('');

	/** @type {HTMLDivElement | null} */
	let elemChat = $state(null);

	/** @type {ReturnType<typeof setInterval> | null} */
	let interval = null;

	let sedangPolling = false;

	/** @type {string | null} */
	let menghapusId = $state(null);

	/** @type {string | null} */
	let menuTerbukaId = $state(null);

	let menuPosisi = $state({ top: 0, left: 0 });

	/** @type {string | null} */
	let editIdAktif = $state(null);

	let isiEditSementara = $state('');

	// =========================================================
	// DATA DARI SERVER
	// =========================================================

	$effect(() => {
		daftarPesan = data.daftarPesan ?? [];
		daftarTawaran = data.daftarTawaran ?? [];
	});

	// =========================================================
	// DERIVED DATA
	// =========================================================

	let tawaranTerakhir = $derived(daftarTawaran.at(-1));

	let ongkirDipilih = $derived(
		(data.daftarWilayah ?? []).find(
			/** @param {{ id: string }} w */
			(w) => w.id === wilayahDipilih
		)
	);

	let totalKonfirmasi = $derived(
		Number(data.item.hargaDiajukan ?? 0) * Number(data.item.jumlah ?? 0) +
			Number(ongkirDipilih?.biaya ?? 0)
	);

	let statusInfo = $derived(labelStatus(data.item.status));

	// BARU: nomor WA jastiper dirapikan jadi format internasional (62...),
	// dipakai buat arahkan pembayaran non-COD.
	let nomorWaJastiper = $derived(formatNomorWa(data.item.jastiperNoWa));

	let pesanWa = $derived(
		`Halo ${data.item.jastiperNama}, saya mau konfirmasi pembayaran untuk pesanan "${data.item.namaItem}" sebesar ${formatRupiah(totalKonfirmasi)}.`
	);

	let linkWa = $derived(
		nomorWaJastiper ? `https://wa.me/${nomorWaJastiper}?text=${encodeURIComponent(pesanWa)}` : null
	);

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

	/** @param {string} nama */
	function inisial(nama) {
		return nama?.trim()?.charAt(0)?.toUpperCase() ?? '?';
	}

	/**
	 * Rapikan nomor WA ke format internasional (62...) tanpa +/spasi/strip.
	 * @param {string | null | undefined} nomor
	 */
	function formatNomorWa(nomor) {
		if (!nomor) return null;
		const bersih = nomor.replace(/[^0-9]/g, '');
		if (!bersih) return null;
		if (bersih.startsWith('0')) return '62' + bersih.slice(1);
		if (bersih.startsWith('62')) return bersih;
		return '62' + bersih;
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
	// MENU OPSI PESAN (Edit & Hapus)
	// =========================================================

	/**
	 * @param {string} id
	 * @param {MouseEvent} e
	 */
	function toggleMenu(id, e) {
		if (menuTerbukaId === id) {
			menuTerbukaId = null;
			return;
		}

		const tombol = /** @type {HTMLElement} */ (e.currentTarget);
		const rect = tombol.getBoundingClientRect();

		const lebarMenu = 144;
		const tinggiMenuPerkiraan = 90;

		const bukaKeAtas = rect.bottom + tinggiMenuPerkiraan > window.innerHeight;

		menuPosisi = {
			top: bukaKeAtas ? rect.top - tinggiMenuPerkiraan - 4 : rect.bottom + 6,
			left: Math.max(8, rect.right - lebarMenu)
		};

		menuTerbukaId = id;
	}

	function tutupMenu() {
		menuTerbukaId = null;
	}

	// =========================================================
	// EDIT PESAN
	// =========================================================

	/**
	 * @param {{ id: string; isi: string }} pesan
	 */
	function mulaiEdit(pesan) {
		editIdAktif = pesan.id;
		isiEditSementara = pesan.isi;
		menuTerbukaId = null;
	}

	function batalEdit() {
		editIdAktif = null;
		isiEditSementara = '';
	}

	/**
	 * @param {string} pesanId
	 * @returns {SubmitFunction}
	 */
	function handleEditPesan(pesanId) {
		return () => {
			return async ({ result }) => {
				if (result.type === 'success' && result.data?.success) {
					const isiBaru = /** @type {string} */ (result.data.isiBaru);

					daftarPesan = daftarPesan.map((pesan) =>
						pesan.id === pesanId ? { ...pesan, isi: isiBaru } : pesan
					);

					editIdAktif = null;
					isiEditSementara = '';
				} else {
					alert('Gagal mengedit pesan. Coba lagi.');
				}
			};
		};
	}

	// =========================================================
	// HAPUS PESAN
	// =========================================================

	/**
	 * @param {string} pesanId
	 * @returns {SubmitFunction}
	 */
	function handleHapusPesan(pesanId) {
		return () => {
			menghapusId = pesanId;
			menuTerbukaId = null;

			return async ({ result }) => {
				if (result.type === 'success') {
					daftarPesan = daftarPesan.filter((pesan) => pesan.id !== pesanId);
				} else {
					alert('Gagal menghapus pesan. Coba lagi.');
				}

				menghapusId = null;
			};
		};
	}

	/**
	 * @param {SubmitEvent} e
	 */
	function konfirmasiHapus(e) {
		if (!confirm('Hapus pesan ini?')) {
			e.preventDefault();
		}
	}

	// =========================================================
	// FORM TAWARAN
	// =========================================================

	/**
	 * BARU: klik chip riwayat tawaran buat isi ulang form,
	 * bukan langsung kirim — biar pelanggan masih bisa sesuaikan dulu.
	 * @param {{ harga: number; jumlah: number }} t
	 */
	function pakaiTawaranLagi(t) {
		hargaBaru = t.harga;
		jumlahBaru = t.jumlah;
	}

	/** @type {SubmitFunction} */
	function handleAjukanTawaran() {
		mengirimTawaran = true;

		return async ({ update }) => {
			mengirimTawaran = false;

			hargaBaru = '';
			jumlahBaru = 1;

			await update();
		};
	}

	// =========================================================
	// FORM KONFIRMASI PESANAN
	// =========================================================

	/** @type {SubmitFunction} */
	function handleKonfirmasiPesanan() {
		mengirimKonfirmasi = true;

		return async ({ update }) => {
			mengirimKonfirmasi = false;
			await update();
		};
	}
</script>

<svelte:window onclick={tutupMenu} onresize={tutupMenu} />

<svelte:head>
	<title>Chat — {data.item.namaItem} — Nitip</title>
</svelte:head>

<div
	class="p-4 sm:p-6 lg:p-8 max-w-310 mx-auto
	       flex flex-col h-[calc(100vh-4rem)]
	       overflow-x-hidden"
>
	<!-- ===================================================== -->
	<!-- HEADER CHAT -->
	<!-- ===================================================== -->

	<div class="shrink-0">
		<a href="/pelanggan/chat"
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
	</div>

	<!-- ===================================================== -->
	<!-- PANEL AJUKAN HARGA — selalu tampil (tidak dropdown), -->
	<!-- cuma muncul selama belum diterima jastiper -->
	<!-- ===================================================== -->

	{#if data.item.status !== 'diterima'}
		<div class="mt-4 bg-white border border-ink/10 rounded-2xl p-4 shrink-0">
			<div class="flex items-center gap-2.5 mb-3">
				<div
					class="w-7 h-7 rounded-lg bg-primary/10
					       flex items-center justify-center
					       text-primary-dark shrink-0"
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
						<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
					</svg>
				</div>
				<span class="text-[13px] font-bold">Ajukan harga</span>
			</div>

			{#if tawaranTerakhir}
				<div class="flex items-center justify-between gap-3 bg-bg rounded-xl px-3.5 py-2.5 mb-3">
					<div>
						<div class="text-[11px] text-ink-soft">
							Tawaran terakhirmu · {tawaranTerakhir.jumlah} pcs
						</div>
						<div class="font-display font-semibold text-[15px] mt-0.5">
							{formatRupiah(Number(tawaranTerakhir.harga))}
						</div>
					</div>
					<span
						class="text-[10px] font-bold px-2 py-1 rounded-full
						       {labelStatus(tawaranTerakhir.status).kelas}"
					>
						{labelStatus(tawaranTerakhir.status).teks}
					</span>
				</div>
			{:else}
				<p class="text-[12px] text-ink-soft mb-3">
					Belum ada tawaran. Ajukan harga yang kamu mau di bawah ini.
				</p>
			{/if}

			{#if daftarTawaran.length > 1}
				<div class="mb-3">
					<div class="text-[11px] font-semibold text-ink-soft mb-1.5">
						Riwayat tawaran · klik buat pakai lagi
					</div>
					<div class="flex flex-wrap gap-1.5">
						{#each [...daftarTawaran].reverse() as t (t.id)}
							<button
								type="button"
								onclick={() => pakaiTawaranLagi(t)}
								class="text-[11.5px] font-semibold bg-bg hover:bg-bg-alt
								       border border-ink/10 rounded-full px-3 py-1.5 transition"
							>
								{formatRupiah(Number(t.harga))} · {t.jumlah} pcs
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<form
				method="POST"
				action="?/ajukanTawaran"
				use:enhance={handleAjukanTawaran}
				class="flex gap-2"
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

	<!-- ===================================================== -->
	<!-- AREA CHAT -->
	<!-- ===================================================== -->

	<div
		bind:this={elemChat}
		onscroll={tutupMenu}
		class="flex-1 min-h-0 overflow-y-auto
		       mt-4 flex flex-col gap-3
		       pr-1 pb-1"
	>
		{#each daftarPesan as pesan (pesan.id)}
			{@const punyaSaya = pesan.pengirimId === data.userId}
			{@const sedangEdit = editIdAktif === pesan.id}

			<div class="flex {punyaSaya ? 'justify-end' : 'justify-start'}">
				<div class="relative max-w-[78%] sm:max-w-[70%]">
					<div
						class="rounded-2xl px-4 py-2.5
						       text-[13.5px] sm:text-[14px]
						       {punyaSaya
							? 'bg-ink text-bg rounded-br-md'
							: 'bg-white border border-ink/10 rounded-bl-md'}"
					>
						{#if sedangEdit}
							<form
								method="POST"
								action="?/editPesan"
								use:enhance={handleEditPesan(pesan.id)}
								class="flex flex-col gap-1.5 min-w-50"
							>
								<input type="hidden" name="pesanId" value={pesan.id} />

								<input
									type="text"
									name="isi"
									bind:value={isiEditSementara}
									required
									class="rounded-lg px-2.5 py-1.5
									       text-[13px] text-ink bg-white
									       border border-ink/20
									       focus:outline-none
									       focus:border-ink/40"
								/>

								<div class="flex gap-3 justify-end">
									<button
										type="button"
										onclick={batalEdit}
										class="text-[11px] font-semibold
										       opacity-70 hover:opacity-100
										       {punyaSaya ? 'text-bg' : 'text-ink'}"
									>
										Batal
									</button>

									<button
										type="submit"
										class="text-[11px] font-bold
										       {punyaSaya ? 'text-bg' : 'text-primary-dark'}"
									>
										Simpan
									</button>
								</div>
							</form>
						{:else}
							<div class="leading-relaxed">
								{pesan.isi}
							</div>

							<div class="flex items-center justify-end gap-1.5 mt-1">
								<span class="text-[10px] opacity-60">
									{formatJam(pesan.createdAt)}
								</span>

								{#if punyaSaya}
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											toggleMenu(pesan.id, e);
										}}
										aria-label="Opsi pesan"
										class="w-5 h-5 flex items-center justify-center
										       rounded opacity-60 hover:opacity-100
										       transition shrink-0"
									>
										<svg
											class="w-4 h-4"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="6 9 12 15 18 9" />
										</svg>
									</button>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>

			{#if menuTerbukaId === pesan.id}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					onclick={(e) => e.stopPropagation()}
					style="position: fixed; top: {menuPosisi.top}px; left: {menuPosisi.left}px;"
					class="z-50 bg-white border border-ink/10
					       rounded-xl shadow-xl
					       py-1 w-36 overflow-hidden"
				>
					<button
						type="button"
						onclick={() => mulaiEdit(pesan)}
						class="w-full flex items-center gap-2
						       px-3 py-2 text-[12.5px] font-medium
						       text-ink hover:bg-bg-alt
						       transition text-left"
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
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
						</svg>
						Edit
					</button>

					<form
						method="POST"
						action="?/hapusPesan"
						use:enhance={handleHapusPesan(pesan.id)}
						onsubmit={konfirmasiHapus}
					>
						<input type="hidden" name="pesanId" value={pesan.id} />

						<button
							type="submit"
							disabled={menghapusId === pesan.id}
							class="w-full flex items-center gap-2
							       px-3 py-2 text-[12.5px] font-medium
							       text-red-500 hover:bg-red-50
							       transition text-left
							       disabled:opacity-40"
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
								<polyline points="3 6 5 6 21 6" />
								<path
									d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
								/>
							</svg>
							{menghapusId === pesan.id ? 'Menghapus...' : 'Hapus'}
						</button>
					</form>
				</div>
			{/if}
		{:else}
			{#if data.item.status !== 'diterima'}
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
			{/if}
		{/each}

		<!-- ================================================= -->
		<!-- BUBBLE "JASTIPER" BERISI KONFIRMASI PESANAN — -->
		<!-- muncul otomatis di ujung chat begitu status diterima -->
		<!-- ================================================= -->

		{#if data.item.status === 'diterima'}
			<div class="flex justify-start">
				<div class="max-w-[85%] sm:max-w-[75%]">
					<div class="flex items-center gap-2 mb-1 pl-0.5">
						<div
							class="w-6 h-6 rounded-full bg-accent
							       flex items-center justify-center
							       text-[11px] font-bold text-primary-deep shrink-0"
						>
							{inisial(data.item.jastiperNama)}
						</div>
						<span class="text-[11px] font-semibold text-ink-soft">
							{data.item.jastiperNama}
						</span>
					</div>

					<div class="bg-white border border-ink/10 rounded-2xl rounded-tl-md px-4 py-3.5">
						{#if !data.pesananId}
							<p class="text-[13.5px] leading-relaxed mb-3.5">
								 Tawaran <span class="font-semibold">{formatRupiah(Number(data.item.hargaDiajukan))}</span>
								buat <span class="font-semibold">{data.item.namaItem}</span> diterima! Lengkapi pesanan
								di bawah ini ya biar bisa langsung diproses.
							</p>

							<form
								method="POST"
								action="?/konfirmasiPesanan"
								use:enhance={handleKonfirmasiPesanan}
								class="flex flex-col gap-3"
							>
								{#if (data.daftarWilayah ?? []).length === 0}
									<p class="text-[12px] text-ink-soft">
										Jastiper ini belum mengatur wilayah pengiriman. Tanyakan lewat chat
										sebelum lanjut.
									</p>
								{:else}
									<div>
									<label for="wilayahId" class="text-[12px] font-semibold text-ink block mb-1.5">
              						   Wilayah tujuan
									</label>
										<select
  										  id="wilayahId"
  										  name="wilayahId"
  										  bind:value={wilayahDipilih}
  										  required
											class="w-full rounded-xl border border-ink/15
											       px-3 py-2.5 text-[13px]
											       focus:outline-none focus:border-ink/40 bg-white"
										>
											<option value="" disabled>Pilih wilayah tujuan...</option>
											{#each data.daftarWilayah as w (w.id)}
												<option value={w.id}>
													{w.wilayah} — {formatRupiah(Number(w.biaya))}
												</option>
											{/each}
										</select>
									</div>
								{/if}

								<div>
									<label for="alamatLengkap" class="text-[12px] font-semibold text-ink block mb-1.5">
   									 Alamat lengkap
									</label>
									<textarea
  										id="alamatLengkap"
  										name="alamatLengkap"
   										bind:value={alamatLengkap}
										required
										rows="3"
										placeholder="Nama jalan, nomor rumah, patokan, dll."
										class="w-full rounded-xl border border-ink/15
										       px-3 py-2.5 text-[13px] resize-none
										       focus:outline-none focus:border-ink/40"
									></textarea>
								</div>

								<div>
									<label for="metodePembayaran" class="text-[12px] font-semibold text-ink block mb-1.5">
  									  Metode pembayaran
									</label>
									<select
  										id="metodePembayaran"
   										name="metodePembayaran"
   										bind:value={metodePembayaran}
										required
										class="w-full rounded-xl border border-ink/15
										       px-3 py-2.5 text-[13px]
										       focus:outline-none focus:border-ink/40 bg-white"
									>
										<option value="" disabled>Pilih metode pembayaran...</option>
										<option value="transfer_bank">Transfer bank</option>
										<option value="e_wallet">E-wallet</option>
										<option value="cod">Bayar di tempat (COD)</option>
									</select>
								</div>

								{#if metodePembayaran && metodePembayaran !== 'cod'}
									<div class="bg-yellow-50 border border-yellow-200 rounded-xl px-3.5 py-3 text-[12px] text-yellow-800 leading-relaxed">
										Pembayaran non-COD belum bisa diproses langsung di aplikasi. Setelah
										konfirmasi pesanan, hubungi jastiper lewat WhatsApp buat dapat nomor
										rekening/e-wallet tujuan.

										{#if linkWa}
											<a
												href={linkWa}
												target="_blank"
												rel="noopener noreferrer"
												class="mt-2 inline-flex items-center gap-1.5
												       rounded-full bg-green-600 text-white
												       font-bold text-[11.5px] px-3 py-1.5"
											>
												<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
													<path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7a11.9 11.9 0 0 0 5.7 1.5h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.1-3.5-8.4Zm-8.5 18.2h-.1a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 0 1-1.5-5.2c0-5.5 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 9.9-9.9 9.9Z" />
												</svg>
												Chat WA jastiper
											</a>
										{:else}
											<div class="mt-1.5 text-[11px] italic">
												Jastiper belum mengisi nomor WhatsApp. Tanyakan cara pembayarannya
												lewat chat di sini dulu.
											</div>
										{/if}
									</div>
								{/if}

								{#if wilayahDipilih}
									<div class="flex justify-between items-center pt-2 border-t border-ink/10">
										<span class="text-[12px] text-ink-soft">Total (barang + ongkir)</span>
										<span class="font-display font-semibold text-[15px]">
											{formatRupiah(totalKonfirmasi)}
										</span>
									</div>
								{/if}

								<button
									type="submit"
									disabled={mengirimKonfirmasi || (data.daftarWilayah ?? []).length === 0}
									class="rounded-pill bg-primary text-bg
									       font-bold text-[13px] py-2.5
									       disabled:opacity-50"
								>
									{mengirimKonfirmasi ? 'Menyimpan...' : 'Konfirmasi & lanjutkan pesanan'}
								</button>
							</form>
						{:else}
							<p class="text-[13.5px] leading-relaxed mb-3">
								Pesanan kamu sudah dikonfirmasi dan siap diproses. Pantau statusnya di halaman
								Pesanan saya, ya.
							</p>
							<a
								href="/pesanan"
								class="inline-flex items-center gap-1.5
								       rounded-full bg-ink text-bg
								       font-bold text-[12px] px-4 py-2"
							>
								Lihat pesanan
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/if}
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