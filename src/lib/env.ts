import { env } from '$env/dynamic/private';

export function get_airtable_config(): { token: string; base_id: string; table_name: string } {
	const token = env.AIRTABLE_API_TOKEN;
	const base_id = env.AIRTABLE_BASE_ID;
	const table_name = env.AIRTABLE_TABLE_NAME;

	if (!token || !base_id || !table_name) {
		throw new Error('Missing Airtable environment variables');
	}

	return { token, base_id, table_name };
}

export function get_quickbooks_config(): {
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	environment: string;
} {
	const client_id = env.QUICKBOOKS_CLIENT_ID?.trim();
	const client_secret = env.QUICKBOOKS_CLIENT_SECRET?.trim();
	const redirect_uri = env.QUICKBOOKS_REDIRECT_URI?.trim();
	const environment = env.QUICKBOOKS_ENVIRONMENT?.trim() || 'production';

	if (!client_id || !client_secret || !redirect_uri) {
		throw new Error('Missing QuickBooks environment variables');
	}

	return { client_id, client_secret, redirect_uri, environment };
}

export function get_stripe_config(): { secret_key: string; price_id: string; price_id_onetime: string } {
	const secret_key = env.STRIPE_SECRET_KEY;
	const price_id = env.STRIPE_PRICE_ID;
	const price_id_onetime = env.STRIPE_PRICE_ID_ONETIME;

	if (!secret_key || !price_id || !price_id_onetime) {
		throw new Error('Missing Stripe environment variables');
	}

	return { secret_key, price_id, price_id_onetime };
}
