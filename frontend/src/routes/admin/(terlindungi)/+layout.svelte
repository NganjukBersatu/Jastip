<script lang="ts">
	import { page } from '$app/stores';

	let { data, children } = $props();

	const menu = [
		{ href: '/admin', label: 'Dashboard', aktif: true, persis: true },
		{ href: '#', label: 'Verifikasi jastiper', aktif: false, persis: false },
		{ href: '/admin/akun', label: 'Akun', aktif: true, persis: false },
		{ href: '#', label: 'Produk & jasa', aktif: false, persis: false },
		{ href: '#', label: 'Pesanan', aktif: false, persis: false }
	];

	function dipilih(m: { href: string; persis: boolean }) {
		const path = $page.url.pathname;
		return m.persis ? path === m.href : path.startsWith(m.href);
	}
</script>

<div class="flex min-h-screen bg-[#FFF8EC] text-[#2A1A0E]">
	<aside class="flex w-60 flex-col bg-white p-5">
		<p class="mb-6 text-xl font-bold text-[#C23B0A]">Nitip Admin</p>
		<nav class="flex flex-1 flex-col gap-1">
			{#each menu as m}
				{#if m.aktif}
					<a
						href={m.href}
						class="rounded-xl px-3 py-2 font-medium {dipilih(m)
							? 'bg-[#FFE9C7]'
							: 'hover:bg-[#FFF3DF]'}"
					>
						{m.label}
					</a>
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