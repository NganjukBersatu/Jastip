<script>
	let {
		buka = false,
		judul,
		pesan,
		labelTombol = 'Ya, lanjut',
		wajibAlasan = true,
		onbatal,
		onkonfirmasi
	} = $props();

	let alasan = $state('');

	function konfirmasi() {
		if (wajibAlasan && !alasan.trim()) return;
		onkonfirmasi?.(alasan.trim());
		alasan = '';
	}

	function batal() {
		alasan = '';
		onbatal?.();
	}
</script>

{#if buka}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1A0E]/50 px-4">
		<div class="w-full max-w-md rounded-[26px] bg-white p-6 shadow-xl">
			<h2 class="text-lg font-bold text-[#2A1A0E]">{judul}</h2>
			<p class="mt-1 text-sm text-[#7A5E44]">{pesan}</p>

			<label class="mt-4 block text-sm font-medium text-[#2A1A0E]" for="alasan">
				Alasan {wajibAlasan ? '(wajib)' : '(opsional)'}
			</label>
			<textarea
				id="alasan"
				bind:value={alasan}
				rows="3"
				class="mt-1 w-full rounded-xl border border-[#FFE9C7] px-3 py-2 text-sm outline-none focus:border-[#FF6A1F]"
				placeholder="Tulis alasan singkat..."
			></textarea>

			<div class="mt-5 flex justify-end gap-2">
				<button
					onclick={batal}
					class="rounded-full border border-[#FFE9C7] px-4 py-2 text-sm text-[#7A5E44] hover:bg-[#FFF8EC]"
				>
					Batal
				</button>
				<button
					onclick={konfirmasi}
					disabled={wajibAlasan && !alasan.trim()}
					class="rounded-full bg-[#C23B0A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8F2B08] disabled:opacity-50"
				>
					{labelTombol}
				</button>
			</div>
		</div>
	</div>
{/if}