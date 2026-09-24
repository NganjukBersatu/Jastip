<script lang="ts">
	let openFaq: number | null = $state(null);

	function toggleFaq(i: number) {
		openFaq = openFaq === i ? null : i;
	}

	// Keuntungan jadi jastiper di Nitip
	const benefits = [
		{
			icon: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
			title: 'Gratis, tanpa biaya daftar',
			desc: 'Daftar, pasang produk, dan terima pesanan tanpa bayar apa pun ke Nitip.'
		},
		{
			icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
			title: 'Harga kamu yang tentukan',
			desc: 'Pilih harga tetap atau harga bisa ditawar. Untung dan komisinya kamu atur sendiri.'
		},
		{
			icon: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4h-4Z',
			title: 'Pembayaran langsung ke kamu',
			desc: 'Uang nggak lewat web kami, jadi nggak ada potongan atau saldo yang tertahan. Urusan bayar antara kamu dan pelanggan.'
		},
		{
			icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
			title: 'Atur waktu sendiri',
			desc: 'Aktif kalau lagi mau jalan, nonaktifkan akun kalau lagi sibuk. Produkmu otomatis hilang dari katalog.'
		},
		{
			icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
			title: 'Etalase online sendiri',
			desc: 'Produk tampil di katalog Jawa Timur, bisa dilihat pelanggan kapan saja.'
		},
		{
			icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
			title: 'Nggak perlu nyetok barang',
			desc: 'Belanja sesuai pesanan yang masuk, jadi nggak ada modal yang nyangkut di stok.'
		}
	];

	// Fitur yang dipakai jastiper di dashboard
	const features = [
		{
			icon: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
			title: 'Dashboard ringkas',
			desc: 'Pantau pesanan, chat, dan pengajuan harga dari satu halaman.'
		},
		{
			icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
			title: 'Produk saya',
			desc: 'Tambah produk titipan, lengkap dengan kategori dan harga tetap atau nego.'
		},
		{
			icon: 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3',
			title: 'Pengajuan harga',
			desc: 'Terima atau tolak tawaran pelanggan, lengkap dengan notifikasi pengajuan baru.'
		},
		{
			icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
			title: 'Chat dengan pelanggan',
			desc: 'Diskusi harga dan detail titipan langsung di web, dengan notifikasi pesan masuk.'
		},
		{
			icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
			title: 'Kelola pesanan',
			desc: 'Lihat detail semua item dalam satu pesanan, dan riwayat penjualanmu tersimpan rapi.'
		},
		{
			icon: 'M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
			title: 'Ongkir per wilayah',
			desc: 'Isi sendiri biaya antar untuk tiap wilayah yang kamu layani.'
		},
		{
			icon: 'M18 20V10M12 20V4M6 20v-6',
			title: 'Laporan penjualan',
			desc: 'Catat pemasukanmu sendiri dan lihat produk mana yang paling laris.'
		},
		{
			icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
			title: 'Profil & pengaturan',
			desc: 'Atur profil, area layanan, nomor WA, dan nonaktifkan akun kapan pun perlu.'
		}
	];

	const steps = [
		{ n: 1, title: 'Daftar', desc: 'Isi profil jastiper' },
		{ n: 2, title: 'Pasang produk', desc: 'Atur harga & ongkir' },
		{ n: 3, title: 'Terima pesanan', desc: 'Chat & nego dengan pelanggan' },
		{ n: 4, title: 'Belanja & antar', desc: 'Pantau sampai selesai' }
	];

	const testimonials = [
		{
			initial: 'R',
			name: 'Rani',
			route: 'Nganjuk–Surabaya',
			quote: 'Nego harga langsung di chat, jadi nggak bolak-balik WA lagi.'
		},
		{
			initial: 'D',
			name: 'Dimas',
			route: 'Madiun–Malang',
			quote: 'Pas lagi sibuk tinggal nonaktifkan akun, jadi nggak ada pesanan yang numpuk.'
		}
	];

	const faqs = [
		{ q: 'Ada biaya pendaftaran?', a: 'Tidak ada. Daftar dan jadi jastiper di Nitip sepenuhnya gratis.' },
		{
			q: 'Pembayaran dan komisinya gimana?',
			a: 'Pembayaran dan komisi diatur langsung antara kamu dan pelanggan, termasuk lewat WhatsApp untuk transfer atau e-wallet. Nitip tidak memegang uang dan tidak memotong penghasilanmu.'
		},
		{
			q: 'Barang rusak/hilang gimana?',
			a: 'Setiap titipan tercatat di sistem, jadi ada jejak transaksi yang jelas kalau terjadi masalah dan perlu ditelusuri.'
		},
		{
			q: 'Bisa jadi jastiper part-time?',
			a: 'Bisa. Kamu bebas menentukan kapan aktif, dan bisa menonaktifkan akun sementara — produkmu otomatis hilang dari katalog.'
		},
		{
			q: 'Perlu laptop untuk mengelola pesanan?',
			a: 'Nggak perlu. Dashboard jastiper bisa dibuka lewat HP, jadi tetap bisa cek pesanan dan chat sambil di jalan.'
		}
	];

	const heroStats = [
		{ value: '1.2rb+', label: 'jastiper aktif' },
		{ value: '38', label: 'kota & kabupaten' },
		{ value: '4.8/5', label: 'rating rata-rata' }
	];
</script>

<div class="bg-[#FBF3E7] text-[#2C2C2A]">
	<!-- Hero -->
	<section class="relative overflow-hidden px-8 pt-16 pb-16">
		<div class="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#F0997B]/25"></div>
		<div class="pointer-events-none absolute bottom-0 -left-16 h-48 w-48 rounded-full bg-[#FAC775]/30"></div>

		<div class="relative mx-auto grid max-w-350 items-center gap-12 lg:grid-cols-2">
			<!-- Kiri: teks -->
			<div>
				<span class="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#2C2416] px-4 py-2 text-sm text-[#FAC775]">
					500+ jastiper aktif di Jawa Timur
				</span>
				<h1 class="mb-4 text-4xl leading-tight font-medium sm:text-5xl">
					Suka jalan-jalan?<br />
					Jadiin itu <span class="text-[#D85A30]">penghasilan.</span>
				</h1>
				<p class="mb-8 max-w-md text-base text-[#5F5E5A]">
					Nitip nyambungin kamu yang lagi jalan antar kota dengan orang-orang yang mau nitip
					barang. Pasang produk, atur harga sendiri, dan kelola semua pesanan dari satu dashboard.
				</p>
				<div class="mb-10 flex flex-wrap gap-3">
					<a href="/publik/daftar" class="rounded-lg bg-[#D85A30] px-7 py-3 text-base font-medium text-white">
						Daftar jadi jastiper
					</a>
					<a href="/publik/cara-kerja" class="rounded-lg border border-[#2C2C2A] px-7 py-3 text-base font-medium">
						Lihat cara kerja
					</a>
				</div>

				<div class="flex flex-wrap gap-8">
					{#each heroStats as s}
						<div>
							<p class="text-2xl font-medium text-[#D85A30]">{s.value}</p>
							<p class="text-sm text-[#5F5E5A]">{s.label}</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Kanan: ilustrasi kartu dashboard -->
			<div class="relative">
				<div class="rounded-2xl bg-[#2C2416] p-6 sm:p-8">
					<div class="mb-4 flex items-center justify-between">
						<p class="text-sm font-medium text-[#FAC775]">Dashboard jastiper</p>
						<span class="rounded-full bg-[#3C3129] px-3 py-1 text-xs text-[#D3D1C7]">Aktif</span>
					</div>

					<div class="mb-3 rounded-xl bg-[#3C3129] p-4">
						<p class="mb-1 text-sm text-white">Pesanan masuk</p>
						<p class="text-xs text-[#D3D1C7]">4 titipan menunggu dibelikan</p>
					</div>

					<div class="mb-3 flex gap-3">
						<div class="flex-1 rounded-xl bg-[#3C3129] p-4 text-center">
							<p class="text-lg font-medium text-[#FAC775]">2</p>
							<p class="text-xs text-[#D3D1C7]">pengajuan harga baru</p>
						</div>
						<div class="flex-1 rounded-xl bg-[#3C3129] p-4 text-center">
							<p class="text-lg font-medium text-[#FAC775]">3</p>
							<p class="text-xs text-[#D3D1C7]">chat belum dibaca</p>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-xl bg-[#3C3129] p-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0997B] text-sm font-medium text-[#4A1B0C]">
							R
						</div>
						<div>
							<p class="text-sm text-white">Rani sedang belanja titipan</p>
							<p class="text-xs text-[#D3D1C7]">Update 2 menit lalu</p>
						</div>
					</div>
				</div>

				<div class="absolute -bottom-5 -left-5 rounded-xl bg-white px-5 py-3 shadow-sm">
					<p class="text-xs text-[#5F5E5A]">Pesanan selesai bulan ini</p>
					<p class="text-lg font-medium text-[#D85A30]">28 pesanan</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Keuntungan -->
	<section class="mx-auto max-w-350 px-8 py-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">kenapa gabung</p>
		<h2 class="mb-8 text-2xl font-medium sm:text-3xl">Untungnya jadi jastiper di Nitip</h2>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each benefits as b}
				<div class="flex h-full flex-col rounded-2xl border border-[#E8DECF] bg-white p-7 shadow-[0_1px_2px_rgba(44,36,22,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(44,36,22,0.08)]">
					<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F5DCC0]">
						<svg viewBox="0 0 24 24" fill="none" stroke="#993C1D" stroke-width="2" class="h-7 w-7">
							<path d={b.icon} stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<p class="mb-2 text-lg font-medium">{b.title}</p>
					<p class="text-base leading-relaxed text-[#5F5E5A]">{b.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Fitur dashboard -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div class="rounded-2xl bg-[#2C2416] p-8 sm:p-10">
			<p class="mb-2 text-sm font-medium tracking-wide text-[#FAC775] uppercase">fitur dashboard</p>
			<h2 class="mb-2 text-xl font-medium text-white sm:text-2xl">Semua yang kamu butuh, di satu tempat</h2>
			<p class="mb-8 max-w-xl text-sm leading-relaxed text-[#D3D1C7]">
				Nggak perlu lagi catat pesanan di chat atau buku. Semua alat jastiper sudah ada di akunmu.
			</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each features as f}
					<div class="rounded-xl bg-[#3C3129] p-5">
						<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2C2416]">
							<svg viewBox="0 0 24 24" fill="none" stroke="#FAC775" stroke-width="2" class="h-5 w-5">
								<path d={f.icon} stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<p class="mb-1 text-base font-medium text-white">{f.title}</p>
						<p class="text-sm leading-relaxed text-[#D3D1C7]">{f.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Cara kerja -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">cara kerja</p>
		<h2 class="mb-10 text-xl font-medium sm:text-2xl">Empat langkah sampai pesanan selesai</h2>
		<div class="relative">
			<div class="absolute top-6 right-[12.5%] left-[12.5%] hidden border-t-2 border-dashed border-[#E0C8A6] sm:block"></div>
			<div class="relative grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-4">
				{#each steps as s, i}
					<div class="relative text-center">
						<div
							class="relative z-10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D85A30] text-base font-medium text-white ring-4 ring-[#FBF3E7]"
						>
							{s.n}
						</div>
						<p class="text-sm font-medium">{s.title}</p>
						<p class="text-sm text-[#5F5E5A]">{s.desc}</p>
						{#if i < steps.length - 1}
							<svg viewBox="0 0 24 24" fill="none" stroke="#D8A97A" stroke-width="2" class="absolute top-4 -right-4 hidden h-4 w-4 sm:block">
								<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimoni -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">kata jastiper</p>
		<h2 class="mb-8 text-xl font-medium sm:text-2xl">Cerita dari jastiper aktif</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			{#each testimonials as t}
				<div class="relative flex h-full flex-col rounded-2xl border border-[#E8DECF] bg-white p-7">
					<svg viewBox="0 0 24 24" fill="#F0DDCB" class="absolute top-6 right-6 h-9 w-9">
						<path d="M9.5 7C6.5 7 4 9.5 4 12.5V19h6.5v-6.5H7C7 10 8 8.5 9.5 8.5V7ZM19.5 7c-3 0-5.5 2.5-5.5 5.5V19H20.5v-6.5H17C17 10 18 8.5 19.5 8.5V7Z"/>
					</svg>
					<div class="mb-3 flex items-center gap-3">
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0997B] text-base font-medium text-[#4A1B0C]"
						>
							{t.initial}
						</div>
						<div>
							<p class="text-base font-medium">{t.name}</p>
							<p class="text-sm text-[#5F5E5A]">{t.route}</p>
						</div>
					</div>
					<p class="text-base leading-relaxed">"{t.quote}"</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Syarat -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<div
			class="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#F5DCC0] p-7 sm:flex-row sm:items-center"
		>
			<div>
				<p class="mb-1.5 text-base font-medium">Yang kamu butuhin cuma ini</p>
				<p class="text-sm text-[#5F5E5A]">
					Nggak ada syarat ribet — asal sering jalan-jalan di Jawa Timur.
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="rounded-full bg-white px-4 py-2 text-sm font-medium">HP aktif</span>
				<span class="rounded-full bg-white px-4 py-2 text-sm font-medium">Suka jalan</span>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="mx-auto max-w-350 px-8 pb-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">faq</p>
		<h2 class="mb-8 text-xl font-medium sm:text-2xl">Masih ragu?</h2>
		<div class="mx-auto flex max-w-3xl flex-col gap-3">
			{#each faqs as f, i}
				<div class="overflow-hidden rounded-xl border border-[#E8DECF] bg-white transition-shadow {openFaq === i ? 'shadow-[0_4px_14px_rgba(44,36,22,0.06)]' : ''}">
					<button
						class="flex w-full items-center justify-between px-5 py-4 text-left text-base"
						onclick={() => toggleFaq(i)}
					>
						<span class={openFaq === i ? 'font-medium text-[#D85A30]' : ''}>{f.q}</span>
						<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5DCC0] text-base text-[#993C1D]">
							{openFaq === i ? '−' : '+'}
						</span>
					</button>
					{#if openFaq === i}
						<p class="border-t border-[#F0E8D8] px-5 py-4 text-sm leading-relaxed text-[#5F5E5A]">{f.a}</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA akhir -->
	<section class="relative overflow-hidden bg-[#D85A30] px-6 py-14 text-center sm:px-8">
		<div class="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-[#e9764e]/50"></div>
		<div class="relative">
			<h2 class="mb-2 text-2xl font-medium text-white">Yuk, buka toko titipanmu</h2>
			<p class="mb-6 text-base text-[#FAECE7]">Daftar sekarang, nggak sampai 5 menit.</p>
			<a href="/publik/daftar" class="rounded-lg bg-white px-8 py-3 text-base font-medium text-[#993C1D]">
				Daftar jadi jastiper
			</a>
		</div>
	</section>
</div>
<footer class="py-16 border-t border-ink/10">
  <div class="max-w-295 mx-auto px-8 flex justify-between flex-wrap gap-3 text-sm text-ink-soft">
    <span>© 2026 Nitip. Semua hak dilindungi.</span>
    <span>Dibuat untuk jastiper Jawa Timur</span>
  </div>
</footer>