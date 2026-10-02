<script lang="ts">
	let {
		berkas = $bindable([]),
		maks = 3,
		ukuranMaks = 2 * 1024 * 1024
	}: { berkas: { file: File; url: string }[]; maks?: number; ukuranMaks?: number } = $props();

	let galat = $state('');

	function pilih(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		galat = '';
		for (const f of Array.from(el.files ?? [])) {
			if (berkas.length >= maks) {
				galat = `Maksimal ${maks} foto.`;
				break;
			}
			if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
				galat = `"${f.name}" bukan foto JPG, PNG, atau WEBP.`;
				continue;
			}
			if (f.size > ukuranMaks) {
				galat = `"${f.name}" lebih dari 2 MB.`;
				continue;
			}
			berkas = [...berkas, { file: f, url: URL.createObjectURL(f) }];
		}
		el.value = ''; // supaya foto yang sama bisa dipilih lagi setelah dihapus
	}

	function hapus(i: number) {
		URL.revokeObjectURL(berkas[i].url);
		berkas = berkas.filter((_, x) => x !== i);
	}
</script>

<div class="space-y-2">
	{#if berkas.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each berkas as b, i (b.url)}
				<div class="relative h-16 w-16 overflow-hidden rounded-xl border border-ink/10 bg-white">
					<img src={b.url} alt="Pratinjau bukti" class="h-full w-full object-cover" />
					<button
						type="button"
						aria-label="Hapus foto"
						onclick={() => hapus(i)}
						class="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs leading-none text-white"
					>
						×
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<label
		class="inline-flex cursor-pointer items-center gap-2 rounded-pill border border-ink/15 bg-white px-4 py-2 text-xs font-bold text-ink-soft transition hover:border-primary hover:text-primary-dark {berkas.length >= maks
			? 'pointer-events-none opacity-50'
			: ''}"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
			<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
		</svg>
		Lampirkan foto bukti ({berkas.length}/{maks})
		<input
			type="file"
			accept="image/jpeg,image/png,image/webp"
			multiple
			class="sr-only"
			onchange={pilih}
		/>
	</label>

	{#if galat}<p class="text-xs text-red-700">{galat}</p>{/if}
</div>