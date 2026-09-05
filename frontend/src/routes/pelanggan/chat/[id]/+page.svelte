<script>
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();

	/** @type {{ id: string; isi: string; pengirimId: string; createdAt: string | Date }[]} */
	let daftarPesan = $state([]);
	let isiPesan = $state('');
	/** @type {{ id: string; harga: number; jumlah: number; status: string; createdAt: string | Date }[]} */
	let daftarTawaran = $state([]);
	let hargaBaru = $state('');
	let jumlahBaru = $state(1);
	let mengirimTawaran = $state(false);
	/** @type {HTMLDivElement | null} */
	let elemChat = $state(null);
	/** @type {ReturnType<typeof setInterval>} */
	let interval;
	let sedangPolling = false;

	$effect(() => {
		daftarPesan = data.daftarPesan;
		daftarTawaran = data.daftarTawaran;
	});

	let tawaranTerakhir = $derived(daftarTawaran.at(-1));

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
	}

	/** @param {string | Date} tanggal */
	function formatJam(tanggal) {
		return new Date(tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
	}

	/** @param {string} status */
	function labelStatus(status) {
		/** @type {Record<string, { teks: string, kelas: string }>} */
		const peta = {
			menunggu: { teks: 'Menunggu balasan', kelas: 'bg-yellow-100 text-yellow-700' },
			diterima: { teks: 'Diterima', kelas: 'bg-green-100 text-green-700' },
			ditolak: { teks: 'Ditolak', kelas: 'bg-red-100 text-red-700' }
		};
		return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
	}

	function scrollKeBawah() {
		if (elemChat) elemChat.scrollTop = elemChat.scrollHeight;
	}

	async function ambilPesanBaru() {
		if (sedangPolling) return;
		sedangPolling = true;

		try {
			const terakhir = daftarPesan.at(-1);
			const sejak = terakhir
				? `?sejak=${encodeURIComponent(new Date(terakhir.createdAt).toISOString())}`
				: '';
			const res = await fetch(`${data.item.id}/pesan${sejak}`);
			if (!res.ok) return;

			const { pesan } = await res.json();
			const idSudahAda = new Set(daftarPesan.map((p) => p.id));
			const pesanBaru = pesan.filter((/** @type {{id: string}} */ p) => !idSudahAda.has(p.id));

			if (pesanBaru.length > 0) {
				daftarPesan = [...daftarPesan, ...pesanBaru];
				setTimeout(scrollKeBawah, 0);
			}
		} finally {
			sedangPolling = false;
		}
	}

	onMount(() => {
		scrollKeBawah();
		interval = setInterval(ambilPesanBaru, 3000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	/** @type {import('@sveltejs/kit').SubmitFunction} */
	function handleKirim() {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				isiPesan = '';
				await ambilPesanBaru();
			}
			await update({ reset: false });
		};
	}

	/** @type {import('@sveltejs/kit').SubmitFunction} */
	function handleAjukanTawaran() {
		mengirimTawaran = true;
		return async ({ update }) => {
			mengirimTawaran = false;
			hargaBaru = '';
			jumlahBaru = 1;
			await update();
		};
	}

	let statusInfo = $derived(labelStatus(data.item.status));
</script>

<svelte:head>
	<title>Chat — {data.item.namaItem} — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[720px] flex flex-col h-[calc(100vh-4rem)]">
	<div class="flex justify-between items-start gap-4">
		<div>
			<h1 class="text-[24px]">{data.item.namaItem}</h1>
			<p class="text-ink-soft text-[14px]">
				Nego dengan <span class="font-semibold text-ink">{data.item.jastiperNama}</span>
			</p>
		</div>
		<div class="text-right shrink-0">
			<div class="font-display font-semibold text-lg text-primary-dark">
				{formatRupiah(data.item.hargaDiajukan)}
			</div>
			<span class="text-[11px] font-bold px-2 py-0.5 rounded-full {statusInfo.kelas}">{statusInfo.teks}</span>
		</div>
	</div>

	<div class="mt-4 bg-white rounded-2xl border border-ink/10 p-4 shrink-0">
		<div class="flex justify-between items-center">
			<span class="text-[13px] font-bold">Penawaran harga</span>
			{#if tawaranTerakhir}
				{@const st = labelStatus(tawaranTerakhir.status)}
				<span class="text-[11px] font-bold px-2 py-0.5 rounded-full {st.kelas}">{st.teks}</span>
			{/if}
		</div>

		{#if tawaranTerakhir}
			<div class="flex justify-between items-baseline mt-2.5">
				<span class="text-[13px] text-ink-soft">Tawaranmu · {tawaranTerakhir.jumlah} pcs</span>
				<span class="font-display font-semibold text-[16px]">{formatRupiah(tawaranTerakhir.harga)}</span>
			</div>
			<p class="text-[11px] text-ink-soft/70 mt-0.5">Dikirim {formatJam(tawaranTerakhir.createdAt)}</p>
		{:else}
			<p class="text-[13px] text-ink-soft mt-2">Belum ada tawaran. Ajukan harga di bawah.</p>
		{/if}

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
				class="flex-1 rounded-xl border border-ink/15 px-3 py-2 text-[13.5px] focus:outline-none focus:border-ink/40"
			/>
			<input
				type="number"
				name="jumlah"
				bind:value={jumlahBaru}
				placeholder="Jumlah"
				required
				min="1"
				class="w-[80px] rounded-xl border border-ink/15 px-3 py-2 text-[13.5px] focus:outline-none focus:border-ink/40"
			/>
			<button
				type="submit"
				disabled={mengirimTawaran}
				class="rounded-pill bg-primary text-bg font-bold text-[13px] px-4 disabled:opacity-50"
			>
				Kirim
			</button>
		</form>
	</div>

	<div bind:this={elemChat} class="flex-1 overflow-y-auto mt-4 flex flex-col gap-3 pr-1">
		{#each daftarPesan as pesan (pesan.id)}
			{@const punyaSaya = pesan.pengirimId === data.userId}
			<div class="flex {punyaSaya ? 'justify-end' : 'justify-start'}">
				<div class="max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] {punyaSaya ? 'bg-ink text-bg' : 'bg-white border border-ink/10'}">
					<div>{pesan.isi}</div>
					<div class="text-[11px] mt-1 opacity-60">{formatJam(pesan.createdAt)}</div>
				</div>
			</div>
		{:else}
			<p class="text-center text-ink-soft text-[13.5px] my-auto">Belum ada pesan. Mulai nego di sini.</p>
		{/each}
	</div>

	<form
		method="POST"
		action="?/kirimPesan"
		use:enhance={handleKirim}
		class="flex gap-2 mt-4 pt-4 border-t border-ink/10"
	>
		<input
			type="text"
			name="isi"
			bind:value={isiPesan}
			placeholder="Tulis pesan..."
			required
			class="flex-1 rounded-pill border border-ink/15 px-4 py-2.5 text-[14px] focus:outline-none focus:border-ink/40"
		/>
		<button type="submit" class="rounded-pill bg-primary text-bg font-bold text-[13.5px] px-5">
			Kirim
		</button>
	</form>
</div>