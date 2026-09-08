<script>
	import { notifikasiState, tutupToast } from '$lib/stores/notifikasi.svelte';

	const state = notifikasiState();
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
	{#each state.toast as t (t.id)}
		<div class="pointer-events-auto flex items-center gap-3 bg-ink text-bg rounded-2xl px-4 py-3 shadow-lg text-[13.5px]">
			<span>{t.teks}</span>
			<button onclick={() => tutupToast(t.id)} class="text-bg/60 hover:text-bg text-xs font-bold">
				✕
			</button>
		</div>
	{/each}
</div>