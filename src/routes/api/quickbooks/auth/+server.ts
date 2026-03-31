import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get_auth_url } from '../../../../services/quickbooks';

export const GET: RequestHandler = () => {
	redirect(302, get_auth_url());
};
