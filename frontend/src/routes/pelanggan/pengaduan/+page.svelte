<script lang="ts">
	import AduanDaftar from '$lib/components/AduanDaftar.svelte';
	let { data, form } = $props();
</script>

<AduanDaftar {data} {form} basePath="/pelanggan/pengaduan" />