<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Features from '$lib/components/Features.svelte';
  import CatalogTeaser from '$lib/components/CatalogTeaser.svelte';
  import JastiperCta from '$lib/components/JastiperCta.svelte';
</script>

<svelte:head>
  <title>Titipa — Titip apa aja, ke mana aja di Jawa Timur</title>
</svelte:head>

<Navbar active="beranda" />
<Hero />
<Features />
<CatalogTeaser />
<JastiperCta />
<Footer />