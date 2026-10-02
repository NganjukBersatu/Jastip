<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// siap: true kalau halamannya sudah dibuat. Ubah jadi true saat halamanmu selesai.
	// ikon: daftar path SVG (gaya garis, 24x24)
	const menu = [
		{
			href: '/admin',
			label: 'Dashboard',
			siap: true,
			ikon: ['M3 3h7v9H3z', 'M14 3h7v5h-7z', 'M14 12h7v9h-7z', 'M3 16h7v5H3z']
		},
		{
			href: '/admin/verifikasi-jastiper',
			label: 'Verifikasi jastiper',
			siap: true,
			ikon: [
				'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
				'm9 12 2 2 4-4'
			]
		},
		{
			href: '/admin/akun',
			label: 'Akun',
			siap: true,
			ikon: [
				'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
				'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
				'M22 21v-2a4 4 0 0 0-3-3.87',
				'M16 3.13a4 4 0 0 1 0 7.75'
			]
		},
		{
			href: '/admin/produk',
			label: 'Produk',
			siap: true,
			ikon: [
				'm7.5 4.27 9 5.15',
				'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
				'm3.3 7 8.7 5 8.7-5',
				'M12 22V12'
			]
		},
		{
			href: '/admin/pesanan',
			label: 'Pesanan',
			siap: true,
			ikon: ['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0']
		},
   {
    href: '/admin/pengaduan',
    label: 'Pengaduan',
    siap: true
    }
	];

	function sedangDibuka(href: string) {
		const p = $page.url.pathname;
		return href === '/admin' ? p === '/admin' : p.startsWith(href);
	}

	// Menu mobile (laci yang bisa dibuka/tutup)
	let terbuka = $state(false);

	// Tutup laci otomatis setiap pindah halaman
	$effect(() => {
		void $page.url.pathname;
		terbuka = false;
	});

	const judulAktif = $derived(menu.find((m) => sedangDibuka(m.href))?.label ?? 'Admin');
	const inisial = $derived((data.admin?.nama ?? 'A').trim().charAt(0).toUpperCase());
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (terbuka = false)} />

{#snippet ikon(paths: string[], kelas: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={kelas}
		aria-hidden="true"
	>
		{#each paths as d}
			<path {d} />
		{/each}
	</svg>
{/snippet}

<div class="flex min-h-[70vh] bg-[#FFF8EC] text-[#2A1A0E]">
	<!-- Latar gelap saat menu mobile terbuka -->
	{#if terbuka}
		<button
			type="button"
			aria-label="Tutup menu"
			class="fixed inset-0 z-[55] bg-[#2A1A0E]/40 backdrop-blur-[1px] lg:hidden"
			onclick={() => (terbuka = false)}
		></button>
	{/if}

	<!-- Sidebar: laci di layar kecil, kolom tetap di layar besar -->
	<aside
		class="fixed inset-y-0 left-0 z-[60] w-72 max-w-[85vw] shrink-0 overflow-y-auto border-r border-[#FFE9C7] bg-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:shadow-none {terbuka
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<!--
			Di layar besar: tinggi sidebar = tinggi layar (dikurangi navbar atas ±4.5rem),
			dan tetap menempel saat halaman di-scroll, jadi kartu profil selalu di paling bawah.
			Kalau tinggi navbar-mu beda, ubah dua angka 4.5rem di bawah.
		-->
		<div
			class="flex h-full flex-col p-5 lg:sticky lg:top-[4.5rem] lg:h-[calc(100dvh-4.5rem)] lg:overflow-y-auto"
		>
			<!-- Judul panel -->
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6A1F] to-[#C23B0A] text-lg font-bold text-white shadow-sm"
					>
						N
					</div>
					<div class="leading-tight">
						<p class="text-lg font-bold text-[#C23B0A]">Nitip Admin</p>
						<p class="text-xs text-[#7A5E44]">Panel pengelola</p>
					</div>
				</div>
				<button
					type="button"
					aria-label="Tutup menu"
					class="rounded-lg p-2 text-[#7A5E44] hover:bg-[#FFF3DF] lg:hidden"
					onclick={() => (terbuka = false)}
				>
					{@render ikon(['M18 6 6 18', 'M6 6l12 12'], 'h-5 w-5')}
				</button>
			</div>

			<!-- Menu -->
			<p class="mb-2 px-3 text-[11px] font-semibold tracking-wider text-[#7A5E44]/70 uppercase">Menu</p>
			<nav class="flex flex-col gap-1">
				{#each menu as m}
					{#if m.siap}
						{@const aktif = sedangDibuka(m.href)}
						<a
							href={m.href}
							aria-current={aktif ? 'page' : undefined}
							class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition {aktif
								? 'bg-[#FFE9C7] font-semibold text-[#C23B0A]'
								: 'text-[#7A5E44] hover:bg-[#FFF3DF] hover:text-[#2A1A0E]'}"
						>
							{@render ikon(
								m.ikon,
								'h-5 w-5 shrink-0 ' + (aktif ? 'text-[#C23B0A]' : 'text-[#7A5E44] group-hover:text-[#C23B0A]')
							)}
							<span class="flex-1">{m.label}</span>
							{#if aktif}
								<span class="h-1.5 w-1.5 rounded-full bg-[#FF6A1F]"></span>
							{/if}
						</a>
					{:else}
						<span
							class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#7A5E44]/50"
						>
							{@render ikon(m.ikon, 'h-5 w-5 shrink-0')}
							<span class="flex-1">{m.label}</span>
							<small class="text-[10px]">segera</small>
						</span>
					{/if}
				{/each}
			</nav>

			<!-- Profil & keluar: menempel di bawah, ukurannya ringkas -->
			<div class="mt-auto border-t border-[#FFE9C7] pt-3">
				<div class="flex items-center gap-2.5 rounded-xl bg-[#FFF8EC] p-2">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6A1F] to-[#FFC93C] text-sm font-bold text-white"
					>
						{inisial}
					</div>
					<div class="min-w-0 flex-1 leading-tight">
						<p class="truncate text-sm font-semibold">{data.admin?.nama}</p>
						<p class="text-[11px] text-[#7A5E44]">Administrator</p>
					</div>
					<form method="POST" action="/admin/keluar">
						<button
							type="submit"
							title="Keluar"
							aria-label="Keluar"
							class="flex h-8 w-8 items-center justify-center rounded-lg text-[#C23B0A] transition hover:bg-[#FFE9C7]"
						>
							{@render ikon(['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'], 'h-[18px] w-[18px]')}
						</button>
					</form>
				</div>
			</div>
		</div>
	</aside>

	<!-- Konten -->
	<main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
		<!-- Bilah atas khusus layar kecil -->
		<div class="mb-5 flex items-center gap-3 lg:hidden">
			<button
				type="button"
				aria-label="Buka menu"
				class="rounded-xl border border-[#FFE9C7] bg-white p-2.5 text-[#C23B0A] shadow-sm"
				onclick={() => (terbuka = true)}
			>
				{@render ikon(['M4 6h16', 'M4 12h16', 'M4 18h16'], 'h-5 w-5')}
			</button>
			<p class="font-serif text-lg font-bold">{judulAktif}</p>
		</div>

		{@render children()}
	</main>
</div>