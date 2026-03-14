import type { PageServerLoad } from './$types';
import type { Lang } from '$lib/i18n';

export const load: PageServerLoad = async ({ params, url }) => {
	const lang = params.lang as Lang;
	const session_id = url.searchParams.get('session_id');

	return {
		lang,
		session_id
	};
};
