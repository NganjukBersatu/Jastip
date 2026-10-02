<script lang="ts">
	import { TIPE_LABEL, KATEGORI_LABEL, STATUS_LABEL, STATUS_WARNA, STATUS_ADUAN, fmtTgl } from '$lib/aduan';
	let { data } = $props();
</script>

<h1 class="font-display text-3xl font-bold text-ink">Pengaduan</h1>

<div class="mt-4 flex flex-wrap gap-2">
	{#each STATUS_ADUAN as s}
		<a
			href="?status={s}&tipe={data.tipe}"
			class="rounded-full px-4 py-1.5 text-sm font-semibold {data.status === s
				? 'bg-primary text-white'
				: 'bg-white text-ink'}"
		>
			{STATUS_LABEL[s]} ({data.jumlah[s] ?? 0})
		</a>
	{/each}
	<a
		href="?status=semua&tipe={data.tipe}"
		class="rounded-full px-4 py-1.5 text-sm font-semibold {data.status === 'semua' ? 'bg-primary text-white' : 'bg-white text-ink'}"
	>
		Semua
	</a>
</div>

<div class="mt-2 flex flex-wrap gap-2 text-sm">
	{#each ['semua', 'akun', 'produk', 'pesanan', 'umum'] as t}
		<a
			href="?status={data.status}&tipe={t}"
			class="rounded-full border px-3 py-1 {data.tipe === t ? 'border-primary text-primary-dark' : 'border-bg-alt text-ink-soft'}"
		>
			{t === 'semua' ? 'Semua jenis' : TIPE_LABEL[t]}
		</a>
	{/each}
</div>

<div class="mt-6 space-y-3">
	{#if data.daftar.length === 0}
		<p class="text-ink-soft">Tidak ada aduan.</p>
	{/if}
	{#each data.daftar as a (a.id)}
		<a href="/admin/pengaduan/{a.id}" class="block rounded-[26px] bg-white p-5 shadow-sm hover:shadow-md">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="font-semibold text-ink">
					{TIPE_LABEL[a.targetTipe]}{a.targetNama ? ` · ${a.targetNama}` : ''}
				</div>
				<div class="flex items-center gap-2">
					{#if a.pesanBaru > 0}
						<span class="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{a.pesanBaru} pesan baru</span>
					{/if}
					<span class="rounded-full px-3 py-1 text-xs font-semibold {STATUS_WARNA[a.status]}">{STATUS_LABEL[a.status]}</span>
				</div>
			</div>
			<p class="mt-1 text-sm text-ink-soft">
				Dari {a.pelaporNama} · {KATEGORI_LABEL[a.kategori] ?? a.kategori} · {fmtTgl(a.createdAt)}
			</p>
		</a>
	{/each}
</div>