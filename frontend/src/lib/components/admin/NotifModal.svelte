<script>
	let { buka = false, ok = true, judul = '', pesan = '', ontutup } = $props();
</script>

{#if buka}
	<div
		class="fixed inset-0 z-[60] flex items-center justify-center bg-[#2A1A0E]/50 px-4"
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-sm rounded-[26px] bg-white p-6 text-center shadow-xl">
			<div
				class="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold {ok
					? 'bg-green-100 text-green-800'
					: 'bg-red-100 text-red-800'}"
			>
				{ok ? '✓' : '!'}
			</div>
			<h2 class="mt-3 text-lg font-bold text-[#2A1A0E]">
				{judul || (ok ? 'Berhasil' : 'Tidak bisa dilanjutkan')}
			</h2>
			<p class="mt-1 text-sm text-[#7A5E44]">{pesan}</p>
			<button
				onclick={ontutup}
				class="mt-5 w-full rounded-full bg-[#FF6A1F] py-2 font-semibold text-white hover:bg-[#C23B0A]"
			>
				Mengerti
			</button>
		</div>
	</div>
{/if}