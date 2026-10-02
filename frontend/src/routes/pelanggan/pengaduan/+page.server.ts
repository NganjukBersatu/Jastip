import type { Actions, PageServerLoad } from './$types';
import { loadDaftar, handleBuat } from '$lib/server/aduan';

export const load: PageServerLoad = (e) => loadDaftar(e);
export const actions: Actions = { buat: (e) => handleBuat(e, '/pelanggan/pengaduan') };