<script>
  const kategori = [
    'OLEH-OLEH',
    'JAJANAN PASAR',
    'TIKET EVENT',
    'SKINCARE LOKAL',
    'BARANG LANGKA'
  ];
  // digandakan supaya animasi loop-nya mulus (tanpa jeda)
  const kategoriGanda = [...kategori, ...kategori];
</script>

<div class="bg-ink overflow-hidden py-4">
  <div class="flex whitespace-nowrap w-max animate-ticker">
    {#each kategoriGanda as item, i}
      <span class="font-display italic font-semibold text-xl px-7 text-bg/90">{item}</span>
      {#if i < kategoriGanda.length - 1}
        <span class="text-accent font-sans not-italic self-center">✦</span>
      {/if}
    {/each}
  </div>
</div>