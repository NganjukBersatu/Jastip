<script lang="ts">
	let openFaq: number | null = $state(null);

	function toggleFaq(i: number) {
		openFaq = openFaq === i ? null : i;
	}

	const benefits = [
		{
			icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
			title: 'Nggak perlu modal',
			desc: 'Kamu jalan seperti biasa, titipan dibayar duluan sama pemesan.'
		},
		{
			icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
			title: 'Atur waktu sendiri',
			desc: 'Buka trip cuma kalau kamu memang lagi mau jalan ke sana.'
		},
		{
			icon: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4h-4Z',
			title: 'Komisi langsung cair',
			desc: 'Selesai antar barang, saldo bisa langsung ditarik ke rekening.'
		}
	];

	const steps = [
		{ n: 1, title: 'Daftar', desc: 'Isi profil & KTP' },
		{ n: 2, title: 'Buka trip', desc: 'Set rute & tanggal' },
		{ n: 3, title: 'Terima titipan', desc: 'Pelanggan pesan' },
		{ n: 4, title: 'Cair', desc: 'Saldo masuk rekening' }
	];

	const testimonials = [
		{
			initial: 'R',
			name: 'Rani',
			route: 'Nganjuk–Surabaya',
			quote: 'Tiap pulang kampung sekarang jadi ada tambahan uang bensin.'
		},
		{
			initial: 'D',
			name: 'Dimas',
			route: 'Madiun–Malang',
			quote: 'Aturannya fleksibel, aku cuma buka trip pas weekend.'
		}
	];

	const faqs = [
		{ q: 'Ada biaya pendaftaran?', a: 'Tidak ada. Daftar dan jadi jastiper di Nitip sepenuhnya gratis.' },
		{
			q: 'Kapan saldo bisa dicairkan?',
			a: 'Saldo langsung cair ke saldo akunmu setelah titipan dikonfirmasi diterima pelanggan, dan bisa ditarik ke rekening kapan saja.'
		},
		{
			q: 'Barang rusak/hilang gimana?',
			a: 'Setiap titipan tercatat di sistem, jadi ada jejak transaksi yang jelas kalau terjadi masalah dan perlu ditelusuri.'
		},
		{ q: 'Bisa jadi jastiper part-time?', a: 'Bisa. Kamu cuma buka trip saat memang lagi mau jalan ke sana, tanpa jadwal wajib.' }
	];
</script>

<div class="bg-[#FBF3E7] text-[#2C2C2A]">
	<!-- Hero -->
	<section class="relative overflow-hidden px-6 pt-20 pb-16 sm:px-8">
		<div class="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#F0997B]/35"></div>
		<div class="pointer-events-none absolute bottom-0 -left-12 h-40 w-40 rounded-full bg-[#FAC775]/40"></div>

		<div class="relative mx-auto max-w-2xl text-center">
			<span class="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#2C2416] px-4 py-2 text-sm text-[#FAC775]">
				500+ jastiper aktif di Jawa Timur
			</span>
			<h1 class="mb-4 text-4xl leading-tight font-medium sm:text-5xl">
				Suka jalan-jalan?<br />
				Jadiin itu <span class="text-[#D85A30]">penghasilan.</span>
			</h1>
			<p class="mx-auto mb-8 max-w-md text-base text-[#5F5E5A]">
				Jastipin nyambungin kamu yang lagi jalan antar kota dengan orang-orang yang mau nitip
				barang.
			</p>
			<div class="flex flex-wrap justify-center gap-3">
				<a href="/publik/daftar" class="rounded-lg bg-[#D85A30] px-7 py-3 text-base font-medium text-white">
					Daftar jadi jastiper
				</a>
				<a href="/publik/cara-kerja" class="rounded-lg border border-[#2C2C2A] px-7 py-3 text-base font-medium">
					Lihat cara kerja
				</a>
			</div>
		</div>
	</section>

	<!-- Kenapa gabung -->
	<section class="mx-auto max-w-7xl px-6 py-16 sm:px-12 lg:px-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">kenapa gabung</p>
		<h2 class="mb-8 text-2xl font-medium sm:text-3xl">Cara kerjanya simpel banget</h2>
		<div class="grid gap-6 sm:grid-cols-3">
			{#each benefits as b}
				<div class="rounded-2xl border border-[#E8DECF] bg-white p-7">
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

	<!-- Simulasi penghasilan -->
	<section class="mx-auto max-w-7xl px-6 pb-16 sm:px-12 lg:px-16">
		<div class="grid items-center gap-8 rounded-2xl bg-[#2C2416] p-8 sm:grid-cols-2 sm:p-10">
			<div>
				<p class="mb-2 text-sm font-medium tracking-wide text-[#FAC775] uppercase">
					simulasi penghasilan
				</p>
				<h2 class="mb-3 text-xl font-medium text-white sm:text-2xl">Berapa yang bisa kamu dapat?</h2>
				<p class="text-sm leading-relaxed text-[#D3D1C7]">
					Trip ke Surabaya bawa 4 titipan @ Rp150rb, komisi 10%.
				</p>
			</div>
			<div class="rounded-xl bg-[#3C3129] p-5">
				<div class="flex justify-between border-b border-[#4a4136] py-2.5 text-sm text-[#D3D1C7]">
					<span>4 titipan × Rp15rb</span><span class="text-white">Rp60rb</span>
				</div>
				<div class="flex justify-between border-b border-[#4a4136] py-2.5 text-sm text-[#D3D1C7]">
					<span>Bonus rute jauh</span><span class="text-white">Rp10rb</span>
				</div>
				<div class="flex justify-between pt-3.5 text-base font-medium">
					<span class="text-[#FAC775]">Total per trip</span><span class="text-[#FAC775]">Rp70rb</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Cara kerja -->
	<section class="mx-auto max-w-7xl px-6 pb-16 sm:px-12 lg:px-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">cara kerja</p>
		<h2 class="mb-8 text-xl font-medium sm:text-2xl">Empat langkah sampai saldo cair</h2>
		<div class="relative">
			<div class="absolute top-6 right-12 left-12 hidden h-0.5 bg-[#E8DECF] sm:block"></div>
			<div class="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
				{#each steps as s}
					<div class="text-center">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D85A30] text-base font-medium text-white"
						>
							{s.n}
						</div>
						<p class="text-sm font-medium">{s.title}</p>
						<p class="text-sm text-[#5F5E5A]">{s.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimoni -->
	<section class="mx-auto max-w-7xl px-6 pb-16 sm:px-12 lg:px-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">kata jastiper</p>
		<h2 class="mb-6 text-xl font-medium sm:text-2xl">Cerita dari jastiper aktif</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			{#each testimonials as t}
				<div class="rounded-2xl border border-[#E8DECF] bg-white p-7">
					<div class="mb-3 flex items-center gap-3">
						<div
							class="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0997B] text-base font-medium text-[#4A1B0C]"
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
	<section class="mx-auto max-w-7xl px-6 pb-16 sm:px-12 lg:px-16">
		<div
			class="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#F5DCC0] p-7"
		>
			<div>
				<p class="mb-1.5 text-base font-medium">Yang kamu butuhin cuma ini</p>
				<p class="text-sm text-[#5F5E5A]">
					Nggak ada syarat ribet — asal sering jalan-jalan di Jawa Timur.
				</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="rounded-full bg-white px-4 py-2 text-sm">HP aktif</span>
				<span class="rounded-full bg-white px-4 py-2 text-sm">KTP</span>
				<span class="rounded-full bg-white px-4 py-2 text-sm">Suka jalan</span>
			</div>
		</div>
	</section>

	<!-- FAQ -->
	<section class="mx-auto max-w-7xl px-6 pb-16 sm:px-12 lg:px-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">faq</p>
		<h2 class="mb-6 text-xl font-medium sm:text-2xl">Masih ragu?</h2>
		<div class="flex flex-col gap-3">
			{#each faqs as f, i}
				<div class="rounded-xl border border-[#E8DECF] bg-white">
					<button
						class="flex w-full items-center justify-between px-5 py-4 text-left text-base"
						onclick={() => toggleFaq(i)}
					>
						<span>{f.q}</span>
						<span class="text-lg text-[#888780]">{openFaq === i ? '−' : '+'}</span>
					</button>
					{#if openFaq === i}
						<p class="px-5 pb-4 text-sm leading-relaxed text-[#5F5E5A]">{f.a}</p>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA akhir -->
	<section class="relative overflow-hidden bg-[#D85A30] px-6 py-14 text-center sm:px-8">
		<div class="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-[#e9764e]/50"></div>
		<div class="relative">
			<h2 class="mb-2 text-2xl font-medium text-white">Yuk, buka trip pertamamu</h2>
			<p class="mb-6 text-base text-[#FAECE7]">Daftar sekarang, nggak sampai 5 menit.</p>
			<a href="/publik/daftar" class="rounded-lg bg-white px-8 py-3 text-base font-medium text-[#993C1D]">
				Daftar jadi jastiper
			</a>
		</div>
	</section>
</div>