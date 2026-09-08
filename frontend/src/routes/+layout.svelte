<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { mulaiPollingNotifikasi } from '$lib/stores/notifikasi.svelte';
  import { page } from '$app/stores';

  let { children } = $props();

  // $effect biar polling mulai begitu user login (tanpa perlu full reload halaman)
  $effect(() => {
    if ($page.data.user) mulaiPollingNotifikasi();
  });
</script>

<Navbar />
<Toast />

{@render children()}