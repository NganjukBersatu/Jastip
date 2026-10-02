import type { Actions, PageServerLoad } from './$types';
import { loadDetail, handleBalas } from '$lib/server/aduan';

export const load: PageServerLoad = (e) => loadDetail(e);
export const actions: Actions = { balas: (e) => handleBalas(e) };