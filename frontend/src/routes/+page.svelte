<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Features from '$lib/components/Features.svelte';
  import CatalogTeaser from '$lib/components/CatalogTeaser.svelte';
  import JastiperCta from '$lib/components/JastiperCta.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Nitip — Jastip apa aja, ke mana aja di Jawa Timur</title>
</svelte:head>

<Hero />
<Features />
<CatalogTeaser produkPilihan={data.produkPilihan} />
<JastiperCta />
<Footer />