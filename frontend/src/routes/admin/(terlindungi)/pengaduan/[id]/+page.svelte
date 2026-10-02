<script lang="ts">
	import { enhance } from '$app/forms';
	import { TIPE_LABEL, KATEGORI_LABEL, STATUS_LABEL, STATUS_WARNA, fmtTgl, noWaIntl } from '$lib/aduan';

	let { data, form }: { data: any; form: any } = $props();
	const a = $derived(data.aduan);
	const terbuka = $derived(a.status === 'baru' || a.status === 'diproses');

	const LABEL_TINDAKAN: Record<string, string> = {
		tegur: 'Tegur (kirim lewat WA)',
		nonaktifkan_akun: 'Nonaktifkan akun terlapor',
		sembunyikan_produk: 'Sembunyikan produk',
		tolak: 'Tolak aduan (tidak terbukti)',
		selesai: 'Tandai selesai (tanpa tindakan)'
	};

	let tindakan = $state('');
	let alasan = $state('');

	const linkWa = $derived(
		data.terlapor?.noWa
			? `https://wa.me/${noWaIntl(data.terlapor.noWa)}?text=${encodeURIComponent(alasan)}`
			: null
	);
</script>

{#snippet bukti(list: { id: string; namaAsli: string | null }[])}
	{#if list.length > 0}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each list as l (l.id)}
				<a href="/api/bukti/{l.id}" target="_blank" rel="noopener">
					<img
						src="/api/bukti/{l.id}"
						alt={l.namaAsli ?? 'Bukti'}
						loading="lazy"
						class="h-24 w-24 rounded-xl border border-ink/10 bg-white object-cover"
					/>
				</a>
			{/each}
		</div>
	{/if}
{/snippet}

<a href="/admin/pengaduan" class="text-sm font-semibold text-primary-dark">← Semua aduan</a>

<div class="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
	<!-- kiri: isi aduan + thread -->
	<div class="space-y-5">
		<div class="rounded-[26px] bg-white p-6 shadow-sm">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<h1 class="font-display text-2xl font-bold text-ink">
					{TIPE_LABEL[a.targetTipe]}{a.targetNama ? ` · ${a.targetNama}` : ''}
				</h1>
				<span class="rounded-full px-3 py-1 text-xs font-semibold {STATUS_WARNA[a.status]}">{STATUS_LABEL[a.status]}</span>
			</div>
			<p class="mt-1 text-sm text-ink-soft">
				{KATEGORI_LABEL[a.kategori] ?? a.kategori} · {fmtTgl(a.createdAt)}
			</p>
			<p class="mt-4 whitespace-pre-wrap text-ink">{a.deskripsi}</p>
			{@render bukti(data.lampiranAduan)}
		</div>

		<div class="space-y-3">
			{#each data.pesan as p (p.id)}
				<div class="flex {p.peran === 'admin' ? 'justify-end' : 'justify-start'}">
					<div class="max-w-[80%] rounded-2xl px-4 py-2 {p.peran === 'admin' ? 'bg-primary text-white' : 'bg-white text-ink shadow-sm'}">
						<div class="text-xs opacity-70">{p.peran === 'admin' ? 'Admin' : data.pelapor?.nama} · {fmtTgl(p.createdAt)}</div>
						{#if p.isi}<div class="whitespace-pre-wrap">{p.isi}</div>{/if}
						{@render bukti(p.lampiran)}
					</div>
				</div>
			{/each}
		</div>

		{#if terbuka}
			<form method="POST" action="?/balas" use:enhance class="flex gap-2">
				<textarea
					name="isi"
					rows="2"
					maxlength="1000"
					required
					placeholder="Balas pelapor..."
					class="flex-1 rounded-xl border border-bg-alt px-3 py-2"
				></textarea>
				<button class="self-end rounded-full bg-primary px-5 py-2 font-semibold text-white">Kirim</button>
			</form>
		{/if}
	</div>

	<!-- kanan: info + tindakan -->
	<div class="space-y-5">
		<div class="rounded-[26px] bg-white p-5 text-sm shadow-sm">
			<h2 class="font-bold text-ink">Pelapor</h2>
			{#if data.pelapor}
				<p class="text-ink">{data.pelapor.nama} <span class="text-ink-soft">({data.pelapor.role})</span></p>
				<p class="text-ink-soft">{data.pelapor.email}</p>
			{/if}

			{#if data.terlapor}
				<h2 class="mt-4 font-bold text-ink">Pihak dilaporkan</h2>
				<p class="text-ink">
					{data.terlapor.nama} <span class="text-ink-soft">({data.terlapor.role})</span>
				</p>
				<p class="text-ink-soft">{data.terlapor.email}</p>
				<p class="text-ink-soft">Status akun: {data.terlapor.aktif ? 'Aktif' : 'Nonaktif'}</p>
			{/if}

			{#if data.targetInfo}
				<h2 class="mt-4 font-bold text-ink">Detail {a.targetTipe}</h2>
				{#each Object.entries(data.targetInfo) as [k, v]}
					<p class="text-ink-soft">{k}: {v instanceof Date ? fmtTgl(v) : String(v)}</p>
				{/each}
			{/if}

			<div class="mt-4 flex flex-wrap gap-3">
				{#if a.targetTipe === 'akun'}<a href="/admin/akun" class="font-semibold text-primary-dark">Buka halaman Akun →</a>{/if}
				{#if a.targetTipe === 'produk'}<a href="/admin/produk" class="font-semibold text-primary-dark">Buka halaman Produk →</a>{/if}
				{#if a.targetTipe === 'pesanan'}<a href="/admin/pesanan" class="font-semibold text-primary-dark">Buka halaman Pesanan →</a>{/if}
			</div>
		</div>

		{#if terbuka}
			<form method="POST" action="?/tindak" use:enhance class="space-y-3 rounded-[26px] bg-white p-5 shadow-sm">
				<h2 class="font-bold text-ink">Tindak lanjut</h2>

				{#if form?.pesan}<p class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{form.pesan}</p>{/if}

				<select name="tindakan" bind:value={tindakan} required class="w-full rounded-xl border border-bg-alt px-3 py-2">
					<option value="" disabled>Pilih tindakan</option>
					{#each data.tindakanBoleh as t}
						<option value={t}>{LABEL_TINDAKAN[t]}</option>
					{/each}
				</select>

				<textarea
					name="alasan"
					bind:value={alasan}
					rows="4"
					required
					placeholder={tindakan === 'tegur' ? 'Isi teguran (ikut dikirim ke WA terlapor)' : 'Alasan / catatan'}
					class="w-full rounded-xl border border-bg-alt px-3 py-2"
				></textarea>
				<p class="text-xs text-ink-soft">Catatan ini tercatat di Riwayat dan terlihat oleh pelapor.</p>

				{#if tindakan === 'tegur'}
					{#if linkWa}
						<a href={linkWa} target="_blank" rel="noopener" class="block rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary-dark">
							Buka WA terlapor dengan teks di atas
						</a>
					{:else}
						<p class="text-xs text-ink-soft">Nomor WA terlapor tidak tersedia di data, hubungi lewat kontak lain.</p>
					{/if}
				{/if}

				<button class="w-full rounded-full bg-primary px-5 py-2 font-semibold text-white">Simpan tindakan & tutup aduan</button>
			</form>
		{:else}
			<div class="rounded-[26px] bg-white p-5 text-sm shadow-sm">
				<h2 class="font-bold text-ink">Aduan ditutup</h2>
				<p class="text-ink-soft">Tindakan: {a.tindakan}</p>
				<p class="text-ink-soft">Catatan: {a.catatanAdmin}</p>
			</div>
		{/if}
	</div>
</div>