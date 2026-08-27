<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Ticker from '$lib/components/Ticker.svelte';
  import Features from '$lib/components/Features.svelte';
  import CatalogTeaser from '$lib/components/CatalogTeaser.svelte';
  import JastiperCta from '$lib/components/JastiperCta.svelte';
</script>

<svelte:head>
  <title>Nitip — Nitip apa aja, ke mana aja di Jawa Timur</title>
</svelte:head>

<Navbar active="beranda" />
<Hero />
<Ticker />
<Features />
<CatalogTeaser />
<JastiperCta />
<Footer />