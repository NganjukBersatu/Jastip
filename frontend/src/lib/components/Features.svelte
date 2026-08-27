<script>
  const fitur = [
    {
      nomor: '01',
      judul: 'Chat langsung',
      deskripsi: 'Ngobrol dan nego harga langsung sama jastiper, tanpa pindah aplikasi.',
      style: 'bg-primary text-white'
    },
    {
      nomor: '02',
      judul: 'Harga transparan',
      deskripsi: 'Tiap barang jelas: harga tetap atau bisa ditawar, plus ongkir per wilayah.',
      style: 'bg-accent text-ink'
    },
    {
      nomor: '03',
      judul: 'Pesanan tercatat',
      deskripsi: 'Status pesanan bisa dipantau real-time, dari dibelanjakan sampai selesai.',
      style: 'bg-ink text-bg'
    },
    {
      nomor: '04',
      judul: 'Jastiper terverifikasi',
      deskripsi: 'Cuma jastiper yang sudah lengkapi profil area yang bisa nerima pesanan.',
      style: 'bg-white text-ink border border-ink/10'
    }
  ];
</script>

<section class="py-24">
  <div class="max-w-[1180px] mx-auto px-8">
    <div class="flex justify-between items-end gap-6 flex-wrap mb-14">
      <h2 class="text-[30px] md:text-[42px] max-w-[560px]">
        Kenapa titip lewat Nitip, bukan chat WA biasa
      </h2>
      <p class="max-w-[340px] text-ink-soft text-[15.5px]">
        Semua rapi dalam satu dashboard — nggak ada lagi chat yang tenggelam atau pesanan yang kelupaan.
      </p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {#each fitur as f}
        <div class="rounded-[26px] p-7 min-h-[220px] flex flex-col justify-between {f.style}">
          <span class="font-display font-semibold text-sm opacity-55">{f.nomor}</span>
          <div>
            <h3 class="text-[19px] mt-8">{f.judul}</h3>
            <p class="text-sm mt-2 opacity-85">{f.deskripsi}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>