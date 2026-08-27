import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be
				// removed once https://github.com/sveltejs/kit/issues/xxxxx is resolved.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see
			// https://svelte.dev/docs/kit/adapter-auto
			// If your environment is not supported, or you settled on a specific
			// See https://svelte.dev/docs/kit/adapters for more information about
			adapter: adapter()
		})
	]
});