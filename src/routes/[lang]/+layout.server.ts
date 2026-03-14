import { error } from '@sveltejs/kit';
import { is_valid_lang, type Lang } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	if (!is_valid_lang(params.lang)) {
		error(404, 'Not found');
	}
	return { lang: params.lang as Lang };
};
