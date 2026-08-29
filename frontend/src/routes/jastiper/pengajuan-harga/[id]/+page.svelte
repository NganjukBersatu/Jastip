<script>
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();

	let daftarPesan = $state(data.daftarPesan);
	let isiPesan = $state('');
	/** @type {HTMLDivElement | null} */
	let elemChat = $state(null);
	/** @type {ReturnType<typeof setInterval>} */
	let interval;

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
	}

	/** @param {string | Date} tanggal */
	function formatJam(tanggal) {
		return new Date(tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
	}

	function scrollKeBawah() {
		if (elemChat) elemChat.scrollTop = elemChat.scrollHeight;
	}

	async function ambilPesanBaru() {
		const terakhir = daftarPesan.at(-1);
		const sejak = terakhir
			? `?sejak=${encodeURIComponent(new Date(terakhir.createdAt).toISOString())}`
			: '';
		const res = await fetch(`${data.item.id}/pesan${sejak}`);
		if (!res.ok) return;

		const { pesan } = await res.json();
		if (pesan.length > 0) {
			daftarPesan = [...daftarPesan, ...pesan];
			setTimeout(scrollKeBawah, 0);
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
</script>

<svelte:head>
	<title>Chat — {data.item.produkNama} — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[720px] flex flex-col h-[calc(100vh-4rem)]">
	<div class="flex justify-between items-start gap-4">
		<div>
			<h1 class="text-[24px]">{data.item.produkNama}</h1>
			<p class="text-ink-soft text-[14px]">
				Nego dengan <span class="font-semibold text-ink">{data.item.pelangganNama}</span>
			</p>
		</div>
		<div class="text-right shrink-0">
			<div class="font-display font-semibold text-lg text-primary-dark">
				{formatRupiah(data.item.hargaDiajukan)}
			</div>
			<div class="text-[12px] text-ink-soft">× {data.item.jumlah} pcs</div>
		</div>
	</div>

	{#if data.item.status === 'menunggu'}
		<div class="flex gap-3 mt-4">
			<form method="POST" action="?/terima" use:enhance class="flex-1">
				<button type="submit" class="w-full rounded-pill bg-ink text-bg font-bold text-[13.5px] py-2.5">
					Terima harga ini
				</button>
			</form>
			<form method="POST" action="?/tolak" use:enhance class="flex-1">
				<button type="submit" class="w-full rounded-pill border-2 border-ink/15 text-ink-soft font-bold text-[13.5px] py-2.5 hover:border-red-300 hover:text-red-500">
					Tolak
				</button>
			</form>
		</div>
	{/if}

	<div bind:this={elemChat} class="flex-1 overflow-y-auto mt-6 flex flex-col gap-3 pr-1">
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