<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// siap: true kalau halamannya sudah dibuat. Ubah jadi true saat halamanmu selesai.
	const menu = [
		{ href: '/admin', label: 'Dashboard', siap: true },
		{ href: '/admin/verifikasi-jastiper', label: 'Verifikasi jastiper', siap: true },
		{ href: '/admin/akun', label: 'Akun', siap: false },
		{ href: '/admin/produk', label: 'Produk', siap: true },
		{ href: '/admin/pesanan', label: 'Pesanan', siap: true }
	];

	function sedangDibuka(href: string) {
		const p = $page.url.pathname;
		return href === '/admin' ? p === '/admin' : p.startsWith(href);
	}
</script>

<div class="flex bg-[#FFF8EC] text-[#2A1A0E]">
	<aside class="w-60 shrink-0 bg-white p-5">
		<div class="sticky top-4">
			<p class="mb-6 text-xl font-bold text-[#C23B0A]">Nitip Admin</p>
			<nav class="flex flex-col gap-1">
				{#each menu as m}
					{#if m.siap}
						<a
							href={m.href}
							class="rounded-xl px-3 py-2 {sedangDibuka(m.href)
								? 'bg-[#FFE9C7] font-medium'
								: 'text-[#7A5E44] hover:bg-[#FFF8EC]'}"
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

			<div class="mt-8 border-t border-[#FFE9C7] pt-4">
				<p class="mb-2 text-sm text-[#7A5E44]">{data.admin.nama}</p>
				<form method="POST" action="/admin/keluar">
					<button
						class="w-full rounded-full border border-[#FF6A1F] py-2 text-[#C23B0A] hover:bg-[#FFE9C7]"
					>
						Keluar
					</button>
				</form>
			</div>
		</div>
	</aside>
	<main class="min-h-[70vh] flex-1 p-8">{@render children()}</main>
</div>