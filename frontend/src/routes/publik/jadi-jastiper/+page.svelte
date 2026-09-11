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
					Jastipin nyambungin kamu yang lagi jalan antar kota dengan orang-orang yang mau nitip
					barang.
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

			<!-- Kanan: ilustrasi kartu -->
			<div class="relative">
				<div class="rounded-2xl bg-[#2C2416] p-6 sm:p-8">
					<div class="mb-4 flex items-center justify-between">
						<p class="text-sm font-medium text-[#FAC775]">Trip aktif</p>
						<span class="rounded-full bg-[#3C3129] px-3 py-1 text-xs text-[#D3D1C7]">Live</span>
					</div>

					<div class="mb-3 rounded-xl bg-[#3C3129] p-4">
						<p class="mb-1 text-sm text-white">Nganjuk → Surabaya</p>
						<p class="text-xs text-[#D3D1C7]">4 titipan menunggu dijemput</p>
					</div>

					<div class="mb-3 flex gap-3">
						<div class="flex-1 rounded-xl bg-[#3C3129] p-4 text-center">
							<p class="text-lg font-medium text-[#FAC775]">Rp70rb</p>
							<p class="text-xs text-[#D3D1C7]">estimasi trip ini</p>
						</div>
						<div class="flex-1 rounded-xl bg-[#3C3129] p-4 text-center">
							<p class="text-lg font-medium text-[#FAC775]">12 mnt</p>
							<p class="text-xs text-[#D3D1C7]">lagi berangkat</p>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-xl bg-[#3C3129] p-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0997B] text-sm font-medium text-[#4A1B0C]">
							R
						</div>
						<div>
							<p class="text-sm text-white">Rani sedang menjemput titipan</p>
							<p class="text-xs text-[#D3D1C7]">Update 2 menit lalu</p>
						</div>
					</div>
				</div>

				<div class="absolute -bottom-5 -left-5 rounded-xl bg-white px-5 py-3 shadow-sm">
					<p class="text-xs text-[#5F5E5A]">Komisi bulan ini</p>
					<p class="text-lg font-medium text-[#D85A30]">Rp1.4jt</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Kenapa gabung -->
	<section class="mx-auto max-w-350 px-8 py-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">kenapa gabung</p>
		<h2 class="mb-8 text-2xl font-medium sm:text-3xl">Cara kerjanya simpel banget</h2>
		<div class="grid gap-6 sm:grid-cols-3">
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

	<!-- Simulasi penghasilan -->
	<section class="mx-auto max-w-350 px-8 pb-16">
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
	<section class="mx-auto max-w-350 px-8 pb-16">
		<p class="mb-2 text-sm font-medium tracking-wide text-[#D85A30] uppercase">cara kerja</p>
		<h2 class="mb-10 text-xl font-medium sm:text-2xl">Empat langkah sampai saldo cair</h2>
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
				<span class="rounded-full bg-white px-4 py-2 text-sm font-medium">KTP</span>
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
			<h2 class="mb-2 text-2xl font-medium text-white">Yuk, buka trip pertamamu</h2>
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