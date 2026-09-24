<script lang="ts">
	// Empat langkah utama (alur pelanggan di Nitip)
	const langkah = [
		{
			n: 1,
			judul: 'Pilih di katalog',
			teks: 'Cari barang dari jastiper area Nganjuk dan sekitarnya. Masuk ke akunmu dulu saat mau beli.',
			icon: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z'
		},
		{
			n: 2,
			judul: 'Beli atau nego',
			teks: 'Harga pas? Langsung beli. Harga bisa ditawar? Chat jastiper lalu ajukan harga.',
			icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
		},
		{
			n: 3,
			judul: 'Cek biaya & bayar',
			teks: 'Lihat rincian barang + ongkir wilayahmu, lalu pilih metode pembayaran.',
			icon: 'M3 6h18v12H3zM3 10h18'
		},
		{
			n: 4,
			judul: 'Pantau sampai selesai',
			teks: 'Ikuti status pesananmu dan lihat struknya di halaman pesanan.',
			icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
		}
	];

	// Dua jalur beli
	const jalur = [
		{
			label: 'Harga pas',
			judul: 'Beli langsung',
			desk: 'Untuk barang dengan harga tetap.',
			tone: 'terang',
			alur: ['Klik beli', 'Lihat rincian biaya', 'Pilih metode pembayaran', 'Pantau pesanan sampai selesai']
		},
		{
			label: 'Harga bisa nego',
			judul: 'Tawar dulu',
			desk: 'Untuk barang yang harganya bisa disepakati.',
			tone: 'gelap',
			alur: [
				'Klik hubungi penjual',
				'Diskusi harga lewat chat',
				'Isi form ajukan harga',
				'Jastiper setuju atau tolak. Kalau setuju, lanjut bayar; kalau ditolak, pengajuan itu berhenti'
			]
		}
	];

	const benefit = [
		{
			judul: 'Harga bisa nego',
			teks: 'Ngobrol dan ajukan harga langsung ke jastiper.',
			icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01'
		},
		{
			judul: 'Biaya jelas di awal',
			teks: 'Harga barang dan ongkir per wilayah terlihat sebelum bayar.',
			icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 14l2 2 4-4'
		},
		{
			judul: 'Keranjang belanja',
			teks: 'Kumpulkan beberapa item, checkout sekali jalan.',
			icon: 'M6 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h2l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 8H5.12'
		},
		{
			judul: 'Struk & riwayat',
			teks: 'Semua pesananmu tersimpan dan bisa dilihat lagi.',
			icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5'
		}
	];

	const sebelum = [
		'WA bolak-balik ke banyak orang',
		'Harga nggak jelas di awal',
		'Nggak tahu status pesanan'
	];

	const sesudah = [
		'Ngobrol dan nego langsung di Nitip',
		'Harga dan ongkir jelas sebelum bayar',
		'Status dan struk di satu halaman'
	];
</script>

<main class="bg-bg text-ink">
	<!-- Hero -->
	<section class="relative overflow-hidden px-8 pt-16 pb-14 text-center">
		<div class="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/15"></div>
		<div class="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent/25"></div>

		<div class="relative mx-auto max-w-350">
			<span class="mb-5 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-xs font-bold tracking-wide text-primary-dark uppercase">
				<span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
				Cara kerja
			</span>
			<h1 class="font-display mx-auto mb-4 max-w-2xl text-4xl leading-tight font-black md:text-5xl">
				Titip belanjaan, <span class="text-primary-dark">empat langkah</span> beres.
			</h1>
			<p class="mx-auto max-w-lg leading-relaxed text-ink/65">
				Nggak perlu ke luar kota atau muter-muter cari barang. Pilih di katalog, sepakati harga
				sama jastiper, lalu tunggu pesananmu sampai.
			</p>
		</div>
	</section>

	<!-- 4 langkah -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div class="relative">
			<div class="absolute top-12 right-[12.5%] left-[12.5%] hidden border-t-2 border-dashed border-primary/30 lg:block"></div>
			<div class="relative grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
				{#each langkah as l}
					<div class="flex h-full flex-row items-start gap-4 rounded-card border border-ink/5 bg-white p-4 text-left shadow-[0_1px_2px_rgba(44,36,22,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,36,22,0.08)] sm:p-5 lg:flex-col lg:items-center lg:p-6 lg:text-center">
						<!-- Satu ikon bulat, nomor langkah jadi lencana kecil di pojoknya -->
						<div class="relative shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
									<path stroke-linecap="round" stroke-linejoin="round" d={l.icon} />
								</svg>
							</div>
							<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink ring-2 ring-white">
								{l.n}
							</span>
						</div>
						<div>
							<h3 class="mb-1 text-base font-bold lg:mb-2">{l.judul}</h3>
							<p class="text-sm leading-relaxed text-ink/65">{l.teks}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Catatan pembayaran -->
		<div class="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-card bg-bg-alt px-6 py-4">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-5 w-5 shrink-0 text-primary-dark">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
			<p class="text-sm leading-relaxed text-ink/75">
				<span class="font-bold text-ink">Soal pembayaran:</span> Nitip mempertemukan kamu dengan jastiper.
				Pembayaran dilakukan langsung antara kamu dan jastiper, jadi tidak dikelola oleh Nitip.
			</p>
		</div>
	</section>

	<!-- Dua jalur beli -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div class="mb-8 text-center">
			<p class="mb-2 text-xs font-bold tracking-wide text-primary-dark uppercase">Dua cara beli</p>
			<h2 class="font-display text-2xl font-semibold md:text-3xl">Harga pas atau bisa nego</h2>
		</div>
		<div class="grid gap-5 md:grid-cols-2">
			{#each jalur as j}
				<div class="flex h-full flex-col rounded-card p-7 {j.tone === 'gelap' ? 'bg-ink text-bg' : 'border border-ink/5 bg-white'}">
					<span class="mb-3 inline-flex w-fit rounded-pill px-3 py-1 text-xs font-bold {j.tone === 'gelap' ? 'bg-accent text-ink' : 'bg-bg-alt text-primary-dark'}">
						{j.label}
					</span>
					<h3 class="font-display mb-1 text-xl font-semibold">{j.judul}</h3>
					<p class="mb-5 text-sm {j.tone === 'gelap' ? 'text-bg/65' : 'text-ink/65'}">{j.desk}</p>
					<ol class="space-y-3">
						{#each j.alur as a, i}
							<li class="flex items-start gap-3 text-sm">
								<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold {j.tone === 'gelap' ? 'bg-accent text-ink' : 'bg-primary text-white'}">
									{i + 1}
								</span>
								<span class="pt-0.5 leading-relaxed {j.tone === 'gelap' ? 'text-bg/90' : 'text-ink/80'}">{a}</span>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</div>
	</section>

	<!-- Kenapa pilih Nitip -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div class="mb-8 text-center">
			<p class="mb-2 text-xs font-bold tracking-wide text-primary-dark uppercase">Kenapa pilih Nitip</p>
			<h2 class="font-display text-2xl font-semibold md:text-3xl">Nggak cuma titip, tapi tenang</h2>
		</div>
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each benefit as b}
				<div class="flex h-full flex-col items-center rounded-card border border-ink/5 bg-white p-6 text-center shadow-[0_1px_2px_rgba(44,36,22,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,36,22,0.08)]">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-alt">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="h-6 w-6 text-primary-dark">
							<path stroke-linecap="round" stroke-linejoin="round" d={b.icon} />
						</svg>
					</div>
					<h3 class="mb-1 text-sm font-bold">{b.judul}</h3>
					<p class="text-sm leading-relaxed text-ink/65">{b.teks}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Sebelum vs sesudah -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<h2 class="font-display mb-8 text-center text-2xl font-semibold md:text-3xl">
			Sebelum vs sesudah pakai Nitip
		</h2>
		<div class="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
			<div class="flex h-full flex-col rounded-card border border-ink/5 bg-white p-7">
				<p class="mb-4 text-xs font-bold tracking-wide text-ink-soft uppercase">Titip manual</p>
				<ul class="space-y-3 text-sm text-ink/70">
					{#each sebelum as item}
						<li class="flex items-start gap-2">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0 text-ink/30">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
							</svg>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
			<div class="flex h-full flex-col rounded-card bg-primary p-7">
				<p class="mb-4 text-xs font-bold tracking-wide text-accent uppercase">Pakai Nitip</p>
				<ul class="space-y-3 text-sm text-white/90">
					{#each sesudah as item}
						<li class="flex items-start gap-2">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 h-4 w-4 shrink-0 text-accent">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Penutup -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div class="relative overflow-hidden rounded-card bg-ink px-8 py-12 text-center md:py-16">
			<svg class="absolute -top-10 -right-10 h-40 w-40 text-white/5" viewBox="0 0 100 100" fill="currentColor">
				<circle cx="50" cy="50" r="50" />
			</svg>
			<svg class="absolute -bottom-14 -left-8 h-36 w-36 text-white/5" viewBox="0 0 100 100" fill="currentColor">
				<circle cx="50" cy="50" r="50" />
			</svg>

			<p class="relative mb-3 text-xs font-bold tracking-wide text-accent uppercase">Siap coba?</p>
			<h2 class="font-display relative mb-3 text-2xl font-semibold text-bg md:text-3xl">
				Titip belanjaanmu sekarang juga
			</h2>
			<p class="relative mx-auto mb-8 max-w-md leading-relaxed text-bg/65">
				Pilih barang di katalog, ngobrol sama jastiper, tinggal tunggu pesananmu sampai.
			</p>

			<a
				href="/publik/katalog"
				class="relative inline-flex items-center justify-center gap-2 rounded-pill bg-bg px-8 py-3 text-sm font-bold text-ink transition hover:-translate-y-0.5"
			>
				Buka katalog
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>
	</section>

	<footer class="border-t border-ink/10 py-16">
		<div class="mx-auto flex max-w-295 flex-wrap justify-between gap-3 px-8 text-sm text-ink-soft">
			<span>© 2026 Nitip. Semua hak dilindungi.</span>
			<span>Dibuat untuk jastiper Jawa Timur</span>
		</div>
	</footer>
</main>