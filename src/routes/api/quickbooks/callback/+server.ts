import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exchange_code } from '../../../../services/quickbooks';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const realm_id = url.searchParams.get('realmId');
	const error_param = url.searchParams.get('error');

	if (error_param) {
		return json({ error: error_param }, { status: 400 });
	}

	if (!code || !realm_id) {
		return error(400, 'Missing code or realmId');
	}

	await exchange_code(code, realm_id);

	return json({ success: true, message: 'QuickBooks connected successfully' });
};
