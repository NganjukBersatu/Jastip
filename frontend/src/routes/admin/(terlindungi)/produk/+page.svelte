<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import type { PageData } from './$types';
	import KonfirmasiModal from '$lib/components/admin/KonfirmasiModal.svelte';
	import NotifModal from '$lib/components/admin/NotifModal.svelte';

	let { data }: { data: PageData } = $props();

	type Item = PageData['produk'][number];
	type Aksi = 'hapus' | 'sembunyikan' | 'tegur' | 'diperbaiki';
	type Filter = 'semua' | 'tampil' | 'disembunyikan' | 'ditegur';

	let cari = $state('');
	let filter = $state<Filter>('semua');

	let target = $state<Item | null>(null); // produk yang sedang diproses
	let aksi = $state<Aksi>('hapus');
	let teguranPesan = $state('');
	let notif = $state<{ ok: boolean; judul: string; pesan: string } | null>(null);

	// form tersembunyi yang dipakai semua tombol
	let formEl = $state<HTMLFormElement>();
	let fAksi = $state('sembunyikan');
	let fId = $state('');
	let fAlasan = $state('');
	let memuat = $state(false);

	const hitung = $derived({
		semua: data.produk.length,
		tampil: data.produk.filter((p) => p.aktif).length,
		disembunyikan: data.produk.filter((p) => !p.aktif).length,
		ditegur: data.produk.filter((p) => p.ditegur).length
	});

	const chips = $derived<{ id: Filter; teks: string; jumlah: number }[]>([
		{ id: 'semua', teks: 'Semua', jumlah: hitung.semua },
		{ id: 'tampil', teks: 'Tampil', jumlah: hitung.tampil },
		{ id: 'disembunyikan', teks: 'Disembunyikan', jumlah: hitung.disembunyikan },
		{ id: 'ditegur', teks: 'Ditegur', jumlah: hitung.ditegur }
	]);

	const daftar = $derived(
		data.produk.filter((i) => {
			const q = cari.trim().toLowerCase();
			const cocokCari =
				!q || i.nama.toLowerCase().includes(q) || i.jastiperNama.toLowerCase().includes(q);
			const cocokFilter =
				filter === 'semua' ||
				(filter === 'tampil' && i.aktif) ||
				(filter === 'disembunyikan' && !i.aktif) ||
				(filter === 'ditegur' && i.ditegur);
			return cocokCari && cocokFilter;
		})
	);

	const rupiah = (n: number) => new Intl.NumberFormat('id-ID').format(n);
    const tombol =
	'inline-flex h-8 w-[124px] items-center justify-center whitespace-nowrap rounded-full border text-xs font-medium transition disabled:opacity-50';

	function buka(item: Item, jenisAksi: Aksi) {
		target = item;
		aksi = jenisAksi;
		teguranPesan = '';
	}

	function tutup() {
		target = null;
	}

	// Kalau produk memang tidak bisa dihapus, langsung jelaskan alasannya
	// (tanpa meminta admin mengisi alasan dulu)
	function klikHapus(item: Item) {
		if (item.alasanTolakHapus) {
			notif = { ok: false, judul: 'Produk tidak bisa dihapus', pesan: item.alasanTolakHapus };
		} else {
			buka(item, 'hapus');
		}
	}

	async function kirim(namaAksi: string, item: Item | null, alasan = '') {
		if (!item) return;
		fAksi = namaAksi;
		fId = item.id;
		fAlasan = alasan;
		await tick(); // tunggu atribut form ter-update sebelum dikirim
		formEl?.requestSubmit();
	}

	const teks: Record<string, { judul: string; tombol: string }> = {
		hapus: { judul: 'Hapus permanen?', tombol: 'Hapus' },
		sembunyikan: { judul: 'Sembunyikan dari katalog?', tombol: 'Sembunyikan' },
		diperbaiki: { judul: 'Tandai sudah diperbaiki?', tombol: 'Tandai diperbaiki' }
	};

	const pesanKonfirmasi = $derived(
		!target
			? ''
			: aksi === 'hapus'
				? `"${target.nama}" dihapus permanen beserta keranjang yang terkait. Tidak bisa dikembalikan.`
				: aksi === 'sembunyikan'
					? `"${target.nama}" tidak akan tampil di katalog sampai ditampilkan lagi.`
					: `Tanda "Ditegur" pada "${target.nama}" akan dicabut. Catatan boleh dikosongkan.`
	);

	const isiPesan = $derived(
		target
			? `Halo ${target.jastiperNama}, ini admin Nitip. Kami menemukan masalah pada produk "${target.nama}": ${teguranPesan.trim()}. Mohon segera diperbaiki. Terima kasih.`
			: ''
	);
	const linkWa = $derived(
		target && target.noWa ? `https://wa.me/${target.noWa}?text=${encodeURIComponent(isiPesan)}` : ''
	);
</script>

<svelte:head><title>Produk · Nitip Admin</title></svelte:head>

<h1 class="text-2xl font-bold">Produk</h1>
<p class="mt-1 text-sm text-[#7A5E44]">
	Sembunyikan untuk menarik produk dari katalog sementara. Hapus hanya untuk produk yang belum pernah dipesan.
</p>

<div class="mt-6 flex flex-wrap items-center gap-3">
	<input
		bind:value={cari}
		placeholder="Cari produk atau jastiper..."
		class="w-72 rounded-full border border-[#FFE9C7] bg-white px-4 py-2 text-sm outline-none focus:border-[#FF6A1F]"
	/>
	<a
		href="/admin/produk/riwayat"
		class="rounded-full border border-[#FF6A1F] px-4 py-2 text-sm font-medium text-[#C23B0A] hover:bg-[#FFE9C7]"
	>
		Riwayat
	</a>
</div>

<div class="mt-3 flex flex-wrap gap-2">
	{#each chips as c}
		<button
			onclick={() => (filter = c.id)}
			class="rounded-full px-4 py-1.5 text-sm {filter === c.id
				? 'bg-[#FF6A1F] font-semibold text-white'
				: 'bg-white text-[#7A5E44] hover:bg-[#FFE9C7]'}"
		>
			{c.teks} <span class="opacity-70">({c.jumlah})</span>
		</button>
	{/each}
</div>

<div class="mt-4 overflow-x-auto rounded-[26px] bg-white shadow-sm">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-[#FFE9C7] text-[#7A5E44]">
			<tr>
				<th class="px-5 py-3 font-medium">Produk</th>
				<th class="px-5 py-3 font-medium">Jastiper</th>
				<th class="px-5 py-3 font-medium">Harga</th>
				<th class="px-5 py-3 font-medium">Status</th>
				<th class="px-5 py-3 text-right font-medium">Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each daftar as item (item.id)}
				<tr class="border-b border-[#FFF8EC] last:border-0">
					<td class="px-5 py-3">
						<div class="flex items-center gap-3">
							<img
								src={item.gambarUrl}
								alt=""
								loading="lazy"
								class="h-10 w-10 rounded-xl bg-[#FFE9C7] object-cover"
							/>
							<div>
								<p class="font-medium">{item.nama}</p>
								<p class="text-xs text-[#7A5E44]">{item.kategori ?? '-'}</p>
							</div>
						</div>
					</td>
					<td class="px-5 py-3">{item.jastiperNama}</td>
					<td class="px-5 py-3">
						Rp{rupiah(item.harga)}
						{#if item.hargaTipe === 'nego'}
							<span class="ml-1 rounded-full bg-[#FFC93C] px-2 py-0.5 text-xs">Nego</span>
						{/if}
					</td>
					<td class="px-5 py-3">
						<div class="flex flex-wrap gap-1">
							<span
								class="rounded-full px-3 py-1 text-xs font-medium {item.aktif
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-600'}"
							>
								{item.aktif ? 'Tampil' : 'Disembunyikan'}
							</span>
							{#if item.ditegur}
								<span
									title={item.teguranTerakhir ? `Teguran: ${item.teguranTerakhir}` : 'Ditegur'}
									class="rounded-full bg-[#FFC93C] px-3 py-1 text-xs font-medium text-[#2A1A0E]"
								>
									Ditegur
								</span>
							{/if}
						</div>
					</td>
					<td class="px-5 py-3">
						<div class="ml-auto grid w-[256px] grid-cols-2 gap-2">
							<button
								onclick={() => buka(item, 'tegur')}
								class="{tombol} border-[#FFE9C7] text-[#7A5E44] hover:bg-[#FFF8EC]"
							>
								Tegur
							</button>

							{#if item.ditegur}
								<button
									onclick={() => buka(item, 'diperbaiki')}
									class="{tombol} border-green-700 text-green-800 hover:bg-green-50"
								>
									Sudah diperbaiki
								</button>
							{:else}
								<span aria-hidden="true"></span>
							{/if}

							{#if item.aktif}
								<button
									onclick={() => buka(item, 'sembunyikan')}
									class="{tombol} border-[#FF6A1F] text-[#C23B0A] hover:bg-[#FFE9C7]"
								>
									Sembunyikan
								</button>
							{:else}
								<button
									onclick={() => kirim('tampilkan', item)}
									disabled={memuat}
									class="{tombol} border-[#FF6A1F] bg-[#FF6A1F] font-semibold text-white hover:bg-[#C23B0A]"
								>
									Tampilkan
								</button>
							{/if}

							<button
								onclick={() => klikHapus(item)}
								class="{tombol} border-[#C23B0A] text-[#C23B0A] hover:bg-[#FFE9C7]"
							>
								Hapus
							</button>
						</div>
					</td>
				</tr>
                {:else}
				<tr><td colspan="5" class="px-5 py-10 text-center text-[#7A5E44]">Tidak ada produk.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Form tersembunyi: dipakai semua tombol -->
<form
	bind:this={formEl}
	method="POST"
	action={`?/${fAksi}`}
	class="hidden"
	use:enhance={() => {
		memuat = true;
		return async ({ result, update }) => {
			await update();
			memuat = false;
			tutup();
			if (result.type === 'success' || result.type === 'failure') {
				notif = {
					ok: !!result.data?.ok,
					judul: String(result.data?.judul ?? ''),
					pesan: String(result.data?.pesan ?? '')
				};
			} else if (result.type === 'error') {
				notif = { ok: false, judul: 'Terjadi kesalahan', pesan: 'Aksi gagal diproses. Coba lagi.' };
			}
		};
	}}
>
	<input type="hidden" name="id" value={fId} />
	<input type="hidden" name="alasan" value={fAlasan} />
</form>

<!-- Konfirmasi hapus / sembunyikan / tandai diperbaiki -->
<KonfirmasiModal
	buka={target !== null && aksi !== 'tegur'}
	judul={teks[aksi]?.judul ?? ''}
	pesan={pesanKonfirmasi}
	labelTombol={teks[aksi]?.tombol ?? 'Lanjut'}
	wajibAlasan={aksi !== 'diperbaiki'}
	onbatal={tutup}
	onkonfirmasi={(alasan: string) => kirim(aksi, target, alasan)}
/>

<!-- Modal teguran -->
{#if target && aksi === 'tegur'}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1A0E]/50 px-4">
		<div class="w-full max-w-md rounded-[26px] bg-white p-6 shadow-xl">
			<h2 class="text-lg font-bold text-[#2A1A0E]">Tegur jastiper</h2>
			<p class="mt-1 text-sm text-[#7A5E44]">
				Produk "{target.nama}" milik {target.jastiperNama}
			</p>

			<label class="mt-4 block text-sm font-medium" for="teguran">Apa masalahnya?</label>
			<textarea
				id="teguran"
				bind:value={teguranPesan}
				rows="3"
				placeholder="Contoh: foto produk tidak sesuai deskripsi"
				class="mt-1 w-full rounded-xl border border-[#FFE9C7] px-3 py-2 text-sm outline-none focus:border-[#FF6A1F]"
			></textarea>

			{#if teguranPesan.trim()}
				<p class="mt-3 rounded-xl bg-[#FFF8EC] p-3 text-xs text-[#7A5E44]">{isiPesan}</p>
			{/if}

			{#if !target.noWa}
				<p class="mt-3 text-xs text-[#C23B0A]">
					Nomor WA jastiper ini belum diisi, jadi teguran belum bisa dikirim.
				</p>
			{/if}

			<div class="mt-5 flex justify-end gap-2">
				<button
					onclick={tutup}
					class="rounded-full border border-[#FFE9C7] px-4 py-2 text-sm text-[#7A5E44] hover:bg-[#FFF8EC]"
				>
					Batal
				</button>
				{#if linkWa && teguranPesan.trim()}
					<a
						href={linkWa}
						target="_blank"
						rel="noopener"
						onclick={() => kirim('tegur', target, teguranPesan.trim())}
						class="rounded-full bg-[#FF6A1F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C23B0A]"
					>
						Kirim teguran lewat WA
					</a>
				{:else}
					<button
						disabled
						class="rounded-full bg-[#FF6A1F] px-4 py-2 text-sm font-semibold text-white opacity-50"
					>
						Kirim teguran lewat WA
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Notifikasi hasil aksi (di tengah layar) -->
<NotifModal
	buka={notif !== null}
	ok={notif?.ok ?? true}
	judul={notif?.judul ?? ''}
	pesan={notif?.pesan ?? ''}
	ontutup={() => (notif = null)}
/>