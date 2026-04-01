import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exchange_code } from '../../../../services/quickbooks';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const realm_id = url.searchParams.get('realmId');
	const state = url.searchParams.get('state');
	const error_param = url.searchParams.get('error');

	if (error_param) {
		return json({ error: error_param }, { status: 400 });
	}

	if (state !== 'neq-renewal') {
		return json({ error: 'Invalid state parameter — possible CSRF attack' }, { status: 403 });
	}

	if (!code || !realm_id) {
		return json({ error: 'Missing code or realmId', params: Object.fromEntries(url.searchParams) }, { status: 400 });
	}

	try {
		await exchange_code(code, realm_id);
		return json({ success: true, message: 'QuickBooks connected successfully' });
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('QuickBooks callback error:', message);
		return json({ error: message }, { status: 500 });
	}
};
