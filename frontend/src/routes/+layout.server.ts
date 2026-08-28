import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user // null kalau belum login, atau data user kalau sudah
	};
};