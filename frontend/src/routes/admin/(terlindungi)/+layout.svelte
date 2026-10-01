<script>
	let { data, children } = $props();
	const menu = [
		{ href: '/admin', label: 'Dashboard', aktif: true },
		{ href: '/admin/verifikasi-jastiper', label: 'Verifikasi jastiper', aktif: true },
		{ href: '#', label: 'Akun', aktif: false },
		{ href: '#', label: 'Produk & jasa', aktif: false },
		{ href: '#', label: 'Pesanan', aktif: false }
	];
</script>

<div class="flex min-h-screen bg-[#FFF8EC] text-[#2A1A0E]">
	<aside class="flex w-60 flex-col bg-white p-5">
		<p class="mb-6 text-xl font-bold text-[#C23B0A]">Nitip Admin</p>
		<nav class="flex flex-1 flex-col gap-1">
			{#each menu as m}
				{#if m.aktif}
					<a href={m.href} class="rounded-xl bg-[#FFE9C7] px-3 py-2 font-medium">{m.label}</a>
				{:else}
					<span class="cursor-not-allowed rounded-xl px-3 py-2 text-[#7A5E44]/60">
						{m.label} <small>(segera)</small>
					</span>
				{/if}
			{/each}
		</nav>
		<p class="mb-2 text-sm text-[#7A5E44]">{data.admin.nama}</p>
		<form method="POST" action="/admin/keluar">
			<button
				class="w-full rounded-full border border-[#FF6A1F] py-2 text-[#C23B0A] hover:bg-[#FFE9C7]"
			>
				Keluar
			</button>
		</form>
	</aside>
	<main class="flex-1 p-8">{@render children()}</main>
</div>
