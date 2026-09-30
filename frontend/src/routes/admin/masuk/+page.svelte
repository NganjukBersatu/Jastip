<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
	let memuat = $state(false);
</script>

<svelte:head><title>Masuk Admin · Nitip</title></svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[#FFF8EC] px-4">
	<form
		method="POST"
		use:enhance={() => {
			memuat = true;
			return async ({ update }) => {
				await update();
				memuat = false;
			};
		}}
		class="w-full max-w-sm rounded-[26px] bg-white p-8 shadow-lg"
	>
		<p class="text-sm font-semibold text-[#C23B0A]">Nitip</p>
		<h1 class="mb-6 text-2xl font-bold text-[#2A1A0E]">Masuk Admin</h1>

		{#if form?.pesan}
			<p class="mb-4 rounded-xl bg-[#FFE9C7] px-4 py-2 text-sm text-[#8F2B08]">{form.pesan}</p>
		{/if}

		<label class="mb-1 block text-sm text-[#7A5E44]" for="email">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			required
			autocomplete="username"
			value={form?.email ?? ''}
			class="mb-4 w-full rounded-xl border border-[#FFE9C7] px-4 py-2 outline-none focus:border-[#FF6A1F]"
		/>

		<label class="mb-1 block text-sm text-[#7A5E44]" for="password">Kata sandi</label>
		<input
			id="password"
			name="password"
			type="password"
			required
			autocomplete="current-password"
			class="mb-6 w-full rounded-xl border border-[#FFE9C7] px-4 py-2 outline-none focus:border-[#FF6A1F]"
		/>

		<button
			disabled={memuat}
			class="w-full rounded-full bg-[#FF6A1F] py-2.5 font-semibold text-white hover:bg-[#C23B0A] disabled:opacity-60"
		>
			{memuat ? 'Memeriksa...' : 'Masuk'}
		</button>
	</form>
</div>
