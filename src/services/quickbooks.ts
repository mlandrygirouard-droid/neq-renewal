import { get_quickbooks_config, get_airtable_config } from '$lib/env';

const INTUIT_AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
const INTUIT_TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

type QBTokens = {
	access_token: string;
	refresh_token: string;
	realm_id: string;
	record_id: string;
};

function get_api_base(): string {
	const { environment } = get_quickbooks_config();
	return environment === 'sandbox'
		? 'https://sandbox-quickbooks.api.intuit.com'
		: 'https://quickbooks.api.intuit.com';
}

export function get_auth_url(): string {
	const { client_id, redirect_uri } = get_quickbooks_config();
	const params = new URLSearchParams({
		client_id,
		redirect_uri,
		response_type: 'code',
		scope: 'com.intuit.quickbooks.accounting',
		state: 'neq-renewal'
	});
	return `${INTUIT_AUTH_URL}?${params.toString()}`;
}

export async function exchange_code(code: string, realm_id: string): Promise<void> {
	const { client_id, client_secret, redirect_uri } = get_quickbooks_config();

	const response = await fetch(INTUIT_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`QuickBooks token exchange failed: ${response.status} - ${body}`);
	}

	const tokens = await response.json();
	await store_tokens(tokens.access_token, tokens.refresh_token, realm_id);
}

async function refresh_access_token(stored: QBTokens): Promise<QBTokens> {
	const { client_id, client_secret } = get_quickbooks_config();

	const response = await fetch(INTUIT_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: stored.refresh_token
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`QuickBooks token refresh failed: ${response.status} - ${body}`);
	}

	const tokens = await response.json();
	await update_tokens(stored.record_id, tokens.access_token, tokens.refresh_token);

	return {
		...stored,
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token
	};
}

async function store_tokens(access_token: string, refresh_token: string, realm_id: string): Promise<void> {
	const { token, base_id } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent('Settings')}`;

	const existing = await get_stored_tokens();
	if (existing) {
		await update_tokens(existing.record_id, access_token, refresh_token);
		return;
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			records: [{
				fields: {
					'Key': 'quickbooks_tokens',
					'Access Token': access_token,
					'Refresh Token': refresh_token,
					'Realm ID': realm_id
				}
			}]
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Airtable store tokens failed: ${response.status} - ${body}`);
	}
}

async function update_tokens(record_id: string, access_token: string, refresh_token: string): Promise<void> {
	const { token, base_id } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent('Settings')}/${record_id}`;

	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fields: {
				'Access Token': access_token,
				'Refresh Token': refresh_token
			}
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Airtable update tokens failed: ${response.status} - ${body}`);
	}
}

async function get_stored_tokens(): Promise<QBTokens | null> {
	const { token, base_id } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent('Settings')}?filterByFormula={Key}='quickbooks_tokens'`;

	const response = await fetch(url, {
		headers: { 'Authorization': `Bearer ${token}` }
	});

	if (!response.ok) return null;

	const data = await response.json();
	if (!data.records || data.records.length === 0) return null;

	const record = data.records[0];
	return {
		access_token: record.fields['Access Token'],
		refresh_token: record.fields['Refresh Token'],
		realm_id: record.fields['Realm ID'],
		record_id: record.id
	};
}

async function qb_api_request(tokens: QBTokens, method: string, endpoint: string, body?: unknown): Promise<unknown> {
	const base = get_api_base();
	const url = `${base}/v3/company/${tokens.realm_id}/${endpoint}`;

	let response = await fetch(url, {
		method,
		headers: {
			'Authorization': `Bearer ${tokens.access_token}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: body ? JSON.stringify(body) : undefined
	});

	if (response.status === 401) {
		const refreshed = await refresh_access_token(tokens);
		response = await fetch(url, {
			method,
			headers: {
				'Authorization': `Bearer ${refreshed.access_token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: body ? JSON.stringify(body) : undefined
		});
	}

	const intuit_tid = response.headers.get('intuit_tid');

	if (!response.ok) {
		const error_body = await response.text();
		throw new Error(`QuickBooks API error: ${response.status} - ${error_body} (intuit_tid: ${intuit_tid})`);
	}

	console.log(`QuickBooks API ${method} ${endpoint} — intuit_tid: ${intuit_tid}`);
	return response.json();
}

type InvoiceParams = {
	company_name: string;
	email: string;
	plan: 'annual' | 'onetime';
};

const GOVERNMENT_FEE = 108.00;
const SERVICE_FEE_ANNUAL = 191.99;
const SERVICE_FEE_ONETIME = 241.99;

export async function create_invoice(params: InvoiceParams): Promise<string> {
	const tokens = await get_stored_tokens();
	if (!tokens) throw new Error('QuickBooks not connected — visit /api/quickbooks/auth');

	const service_fee = params.plan === 'annual' ? SERVICE_FEE_ANNUAL : SERVICE_FEE_ONETIME;

	const invoice = {
		Line: [
			{
				Amount: GOVERNMENT_FEE,
				DetailType: 'SalesItemLineDetail',
				Description: 'NEQ (QC) ANNUAL RENEWAL FEE',
				SalesItemLineDetail: {
					UnitPrice: GOVERNMENT_FEE,
					Qty: 1,
					TaxCodeRef: { value: 'TAX' }
				}
			},
			{
				Amount: service_fee,
				DetailType: 'SalesItemLineDetail',
				Description: 'NEQ RENEWAL FEE',
				SalesItemLineDetail: {
					UnitPrice: service_fee,
					Qty: 1,
					TaxCodeRef: { value: 'TAX' }
				}
			}
		],
		CustomerRef: {
			value: await find_or_create_customer(tokens, params.company_name, params.email)
		},
		BillEmail: { Address: params.email },
		TxnTaxDetail: {
			TxnTaxCodeRef: { value: 'TAX' }
		}
	};

	const result = await qb_api_request(tokens, 'POST', 'invoice?minorversion=73', invoice) as { Invoice: { Id: string } };
	return result.Invoice.Id;
}

async function find_or_create_customer(tokens: QBTokens, name: string, email: string): Promise<string> {
	const query = encodeURIComponent(`select * from Customer where DisplayName = '${name.replace(/'/g, "\\'")}'`);
	const search = await qb_api_request(tokens, 'GET', `query?query=${query}&minorversion=73`) as {
		QueryResponse: { Customer?: { Id: string }[] }
	};

	if (search.QueryResponse.Customer && search.QueryResponse.Customer.length > 0) {
		return search.QueryResponse.Customer[0].Id;
	}

	const result = await qb_api_request(tokens, 'POST', 'customer?minorversion=73', {
		DisplayName: name,
		PrimaryEmailAddr: { Address: email }
	}) as { Customer: { Id: string } };

	return result.Customer.Id;
}
