<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

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
			menunggu_konfirmasi: { teks: 'Menunggu konfirmasi', kelas: 'bg-yellow-100 text-yellow-700' },
			dibelanjakan: { teks: 'Sedang dibelanjakan', kelas: 'bg-blue-100 text-blue-700' },
			dikirim: { teks: 'Sedang diantar', kelas: 'bg-purple-100 text-purple-700' },
			selesai: { teks: 'Selesai', kelas: 'bg-green-100 text-green-700' },
			dibatalkan: { teks: 'Dibatalkan', kelas: 'bg-red-100 text-red-700' }
		};
		return peta[status] ?? { teks: status, kelas: 'bg-gray-100 text-gray-700' };
	}
</script>

<svelte:head>
	<title>Pesanan — Nitip</title>
</svelte:head>

<div class="p-8 max-w-[820px]">
	<h1 class="text-[28px]">Pesanan</h1>
	<p class="text-ink-soft mt-1 text-[15px]">Pesanan yang masuk, perlu diantar ke mana, dan riwayatnya.</p>

	{#if data.kelompokSatuJalur.length > 0}
		<div class="mt-8">
			<h2 class="font-bold text-[15px]">🛵 Bisa dibeli &amp; diantar bareng</h2>
			<p class="text-[13px] text-ink-soft mt-0.5">
				Pesanan-pesanan ini kelihatannya searah — cek dulu, siapa tahu bisa sekali jalan.
			</p>
			<div class="flex flex-col gap-4 mt-3">
				{#each data.kelompokSatuJalur as kelompok (kelompok.wilayah)}
					<div class="bg-orange-50 border border-orange-200 rounded-2xl p-4">
						<div class="font-bold text-[13.5px] capitalize">{kelompok.wilayah} · {kelompok.daftar.length} pesanan</div>
						<div class="flex flex-col gap-2 mt-2">
							{#each kelompok.daftar as p (p.id)}
								<div class="bg-white rounded-xl px-3 py-2 text-[13px] flex justify-between">
									<span>{p.produkNama} — <span class="text-ink-soft">{p.pelangganNama}</span></span>
									<span class="font-semibold">{formatRupiah(p.totalHarga)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mt-8">
		<h2 class="font-bold text-[15px]">Pesanan aktif</h2>

		{#if data.pesananAktif.length === 0}
			<div class="mt-3 bg-white rounded-2xl border border-dashed border-ink/15 p-12 text-center">
				<div class="font-bold text-sm">Belum ada pesanan aktif</div>
				<div class="text-[13.5px] text-ink-soft mt-1">Pesanan baru bakal muncul di sini.</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4 mt-3">
				{#each data.pesananAktif as p (p.id)}
					{@const st = labelStatus(p.status)}
					<div class="bg-white rounded-2xl border border-ink/10 p-5">
						<div class="flex justify-between items-start gap-4">
							<div>
								<div class="font-bold text-sm">{p.produkNama}</div>
								<div class="text-[13px] text-ink-soft mt-0.5">
									untuk <span class="font-semibold text-ink">{p.pelangganNama}</span> · {formatTanggal(p.createdAt)}
								</div>
							</div>
							<span class="text-[11px] font-bold px-2.5 py-1 rounded-full {st.kelas} shrink-0">{st.teks}</span>
						</div>

						<div class="mt-3 bg-bg rounded-xl px-4 py-3 text-[13.5px] flex flex-col gap-1">
							<div class="flex justify-between">
								<span class="text-ink-soft">Antar ke</span>
								<span class="font-medium text-right max-w-[70%]">{p.alamatKirim ?? '—'}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-ink-soft">Jumlah</span>
								<span>{p.jumlah} pcs</span>
							</div>
							<div class="flex justify-between">
								<span class="text-ink-soft">Ongkir</span>
								<span>{formatRupiah(p.ongkir)}</span>
							</div>
							<div class="flex justify-between font-bold pt-1 border-t border-ink/10 mt-1">
								<span>Total</span>
								<span class="text-primary-dark">{formatRupiah(p.totalHarga)}</span>
							</div>
						</div>

						<div class="flex gap-3 mt-4">
							{#if p.status === 'menunggu_konfirmasi'}
								<form method="POST" action="?/mulaiBelanja" use:enhance class="flex-1">
									<input type="hidden" name="id" value={p.id} />
									<button type="submit" class="w-full rounded-pill bg-ink text-bg font-bold text-[13.5px] py-2.5">
										Mulai belanja
									</button>
								</form>
								<form method="POST" action="?/batalkan" use:enhance class="flex-1">
									<input type="hidden" name="id" value={p.id} />
									<button type="submit" class="w-full rounded-pill border-2 border-ink/15 text-ink-soft font-bold text-[13.5px] py-2.5 hover:border-red-300 hover:text-red-500">
										Batalkan
									</button>
								</form>
							{:else if p.status === 'dibelanjakan'}
								<form method="POST" action="?/mulaiAntar" use:enhance class="flex-1">
									<input type="hidden" name="id" value={p.id} />
									<button type="submit" class="w-full rounded-pill bg-ink text-bg font-bold text-[13.5px] py-2.5">
										Mulai antar
									</button>
								</form>
							{:else if p.status === 'dikirim'}
								<form method="POST" action="?/selesaikan" use:enhance class="flex-1">
									<input type="hidden" name="id" value={p.id} />
									<button type="submit" class="w-full rounded-pill bg-primary text-bg font-bold text-[13.5px] py-2.5">
										Tandai selesai
									</button>
								</form>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if data.riwayat.length > 0}
		<div class="mt-10">
			<h2 class="font-bold text-[15px]">Riwayat</h2>
			<div class="flex flex-col gap-2 mt-3">
				{#each data.riwayat as p (p.id)}
					{@const st = labelStatus(p.status)}
					<div class="bg-white rounded-xl border border-ink/10 px-4 py-3 flex justify-between items-center">
						<div>
							<div class="font-semibold text-[13.5px]">{p.produkNama}</div>
							<div class="text-[12px] text-ink-soft">{p.pelangganNama} · {formatTanggal(p.createdAt)}</div>
						</div>
						<div class="text-right">
							<div class="font-semibold text-[13.5px]">{formatRupiah(p.totalHarga)}</div>
							<span class="text-[11px] font-bold px-2 py-0.5 rounded-full {st.kelas}">{st.teks}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>