<script>
	import { enhance } from '$app/forms';
	import { MapPin } from 'lucide-svelte';
	let { data, form } = $props();
	let mengirim = $state(false);

	// kontrol mode titik jemput
	let modeJemput = $state('pilih'); // 'pilih' | 'gps' | 'manual'
	let lokasiLoading = $state(false);
	let lokasiError = $state('');
	/** @type {number | null} */
	let titikJemputLat = $state(null);
	/** @type {number | null} */
	let titikJemputLng = $state(null);
	let konfirmasiLokasi = $state('');

	/** @param {number} angka */
	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(angka);
	}

	// Daftar kota/kabupaten yang sering dipakai (bisa ditambah sesuai kebutuhan)
	const daftarKota = [
		'Kabupaten Nganjuk',
		'Kota Kediri',
		'Kabupaten Kediri',
		'Kota Madiun',
		'Kabupaten Madiun',
		'Kota Blitar',
		'Kabupaten Blitar',
		'Kota Malang',
		'Kabupaten Malang',
		'Kota Surabaya',
		'Kabupaten Sidoarjo',
		'Kabupaten Jombang',
		'Kabupaten Mojokerto',
		'Kota Mojokerto',
		'Kabupaten Tulungagung',
		'Kabupaten Trenggalek',
		'Kabupaten Magetan',
		'Kabupaten Ngawi',
		'Kabupaten Bojonegoro',
		'Kabupaten Lamongan',
		'Kabupaten Gresik',
		'Kabupaten Tuban',
		'Kabupaten Ponorogo',
		'Kabupaten Pacitan',
		'Kabupaten Bondowoso',
		'Kabupaten Situbondo',
		'Kabupaten Banyuwangi',
		'Kabupaten Jember',
		'Kabupaten Lumajang',
		'Kabupaten Probolinggo',
		'Kota Probolinggo',
		'Kabupaten Pasuruan',
		'Kota Pasuruan',
		'Kabupaten Bangkalan',
		'Kabupaten Sampang',
		'Kabupaten Pamekasan',
		'Kabupaten Sumenep'
	];

	function gunakanLokasiSaya() {
		lokasiLoading = true;
		lokasiError = '';

		if (!('geolocation' in navigator)) {
			lokasiError = 'Browser tidak mendukung fitur lokasi. Silakan isi alamat manual.';
			lokasiLoading = false;
			modeJemput = 'manual';
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				titikJemputLat = position.coords.latitude;
				titikJemputLng = position.coords.longitude;
				konfirmasiLokasi = `Lokasi terdeteksi (${titikJemputLat.toFixed(5)}, ${titikJemputLng.toFixed(5)})`;
				modeJemput = 'gps';
				lokasiLoading = false;
			},
			(err) => {
				lokasiError =
					err.code === 1
						? 'Izin lokasi ditolak. Silakan isi alamat manual di bawah.'
						: 'Gagal mengambil lokasi. Silakan isi alamat manual.';
				modeJemput = 'manual';
				lokasiLoading = false;
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	}

	function batalkanLokasi() {
		modeJemput = 'pilih';
		titikJemputLat = null;
		titikJemputLng = null;
		konfirmasiLokasi = '';
	}
</script>

<svelte:head>
	<title>Pesan {data.jasa.nama} — Nitip</title>
</svelte:head>

<section class="max-w-140 mx-auto px-5 py-12">
	<a href="/publik/katalog" class="text-sm text-ink-soft hover:text-ink mb-4 inline-block"
		>← Kembali ke katalog</a
	>

	<div class="bg-white rounded-[22px] shadow-[0_10px_30px_rgba(42,26,14,0.06)] overflow-hidden mb-6">
		<img
			src={data.jasa.gambarUrl}
			alt={data.jasa.nama}
			class="w-full aspect-video object-cover"
		/>
		<div class="p-5">
			<h1 class="font-bold text-xl">{data.jasa.nama}</h1>
			<p class="text-ink-soft text-sm mt-1">oleh {data.jasa.jastiperNama}</p>
			<p class="font-display font-semibold text-lg mt-2">
				{formatRupiah(data.jasa.harga)}
				<span class="text-xs text-ink-soft font-sans">{data.jasa.satuan ?? '/km'}</span>
			</p>
		</div>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3 mb-6">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		action="?/buatPesanan"
		use:enhance={() => {
			mengirim = true;
			return async ({ update }) => {
				mengirim = false;
				await update();
			};
		}}
		class="bg-white rounded-[22px] shadow-[0_10px_30px_rgba(42,26,14,0.06)] p-6 space-y-5"
	>
		<!-- ========== TITIK JEMPUT ========== -->
		<div class="space-y-3">
			<p class="text-sm font-bold">Titik jemput</p>

			{#if modeJemput === 'pilih'}
				<button
					type="button"
					onclick={gunakanLokasiSaya}
					disabled={lokasiLoading}
					class="w-full py-2.5 rounded-xl border border-accent text-sm font-semibold text-accent flex items-center justify-center gap-2"
				>
					<MapPin size={16} />
					{lokasiLoading ? 'Mengambil lokasi...' : 'Gunakan lokasi saya'}
				</button>
				<button
					type="button"
					onclick={() => (modeJemput = 'manual')}
					class="w-full py-2 text-xs text-ink-soft underline"
				>
					Isi alamat manual saja
				</button>
			{/if}

			{#if lokasiError}
				<p class="text-red-600 text-xs">{lokasiError}</p>
			{/if}

			{#if modeJemput === 'gps'}
				<div class="bg-accent/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
					<span class="flex items-center gap-1.5">
						<MapPin size={14} class="text-accent shrink-0" />
						{konfirmasiLokasi}
					</span>
					<button type="button" onclick={batalkanLokasi} class="text-xs text-ink-soft underline ml-3">
						Ganti
					</button>
				</div>
				<input type="hidden" name="titikJemputLat" value={titikJemputLat} />
				<input type="hidden" name="titikJemputLng" value={titikJemputLng} />
			{/if}

			{#if modeJemput === 'manual'}
				<div>
					<label for="kotaJemput" class="block text-xs text-ink-soft mb-1">Kabupaten / Kota</label>
					<select
						id="kotaJemput"
						name="kotaJemput"
						required
						class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
					>
						<option value="">Pilih kabupaten/kota</option>
						{#each daftarKota as kota}
							<option value={kota}>{kota}</option>
						{/each}
					</select>
				</div>

				<!-- BARU: kecamatan dipisah dari alamat detail supaya pencarian lokasi
					lebih presisi (dulu jadi salah satu sumber lokasi nyasar) -->
				<div>
					<label for="kecamatanJemput" class="block text-xs text-ink-soft mb-1">Kecamatan</label>
					<input
						id="kecamatanJemput"
						name="kecamatanJemput"
						type="text"
						required
						placeholder="Misal: Kertosono"
						class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
					/>
				</div>

				<div>
					<label for="titikJemput" class="block text-xs text-ink-soft mb-1">Alamat detail</label>
					<input
						id="titikJemput"
						name="titikJemput"
						type="text"
						required
						placeholder="Misal: Stasiun Kertosono / Jl. Ahmad Yani No. 15"
						class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
					/>
				</div>

				<button type="button" onclick={batalkanLokasi} class="text-xs text-ink-soft underline">
					← Pakai lokasi HP saja
				</button>
			{/if}
		</div>

		<!-- ========== TITIK TUJUAN ========== -->
		<div class="space-y-3">
			<p class="text-sm font-bold">Titik tujuan</p>

			<div>
				<label for="kotaTujuan" class="block text-xs text-ink-soft mb-1">Kabupaten / Kota</label>
				<select
					id="kotaTujuan"
					name="kotaTujuan"
					required
					class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
				>
					<option value="">Pilih kabupaten/kota</option>
					{#each daftarKota as kota}
						<option value={kota}>{kota}</option>
					{/each}
				</select>
			</div>

			<!-- BARU: kecamatan tujuan, dikirim terpisah ke jarak.ts supaya
				pencarian LocationIQ tidak salah pilih jalan dengan nama sama
				di kecamatan lain dalam kabupaten yang sama -->
			<div>
				<label for="kecamatanTujuan" class="block text-xs text-ink-soft mb-1">Kecamatan</label>
				<input
					id="kecamatanTujuan"
					name="kecamatanTujuan"
					type="text"
					required
					placeholder="Misal: Kertosono"
					class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
				/>
			</div>

			<div>
				<label for="titikTujuan" class="block text-xs text-ink-soft mb-1">Alamat detail</label>
				<input
					id="titikTujuan"
					name="titikTujuan"
					type="text"
					required
					placeholder="Misal: Jl. Diponegoro No.12, Desa / Kelurahan ..."
					class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
				/>
			</div>
		</div>

		<div>
			<label for="metodePembayaran" class="block text-sm font-bold mb-1.5">Metode pembayaran</label>
			<select
				id="metodePembayaran"
				name="metodePembayaran"
				required
				class="w-full rounded-xl px-4 py-2.5 border border-ink/10 text-sm outline-none focus:ring-2 focus:ring-accent"
			>
				<option value="">Pilih metode pembayaran</option>
				<option value="tunai">Tunai (bayar di tempat)</option>
				<option value="transfer">Transfer bank</option>
				<option value="e-wallet">E-wallet</option>
			</select>
		</div>

		<p class="text-xs text-ink-soft">
			Jarak dan harga total dihitung otomatis setelah kamu menekan tombol pesan. Pastikan
			kabupaten/kota dan kecamatan sudah benar agar jarak akurat.
		</p>

		<button
			type="submit"
			disabled={mengirim}
			class="w-full py-3.5 rounded-full font-bold text-[15px] bg-accent text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-50"
		>
			{mengirim ? 'Menghitung jarak & memproses...' : 'Pesan sekarang'}
		</button>
	</form>
</section>