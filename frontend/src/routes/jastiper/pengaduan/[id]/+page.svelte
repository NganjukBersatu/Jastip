<script lang="ts">
	import AduanDetail from '$lib/components/AduanDetail.svelte';
	let { data, form } = $props();
</script>

<AduanDetail {data} {form} basePath="/jastiper/pengaduan" />