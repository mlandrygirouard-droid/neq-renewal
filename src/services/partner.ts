import { get_airtable_config } from '$lib/env';

type AirtableRecord = {
	id: string;
	fields: Record<string, unknown>;
};

type AirtableResponse = {
	records: AirtableRecord[];
};

function get_base_url(table: string): string {
	const { base_id } = get_airtable_config();
	return `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table)}`;
}

function escape_formula(value: string): string {
	return value.replace(/'/g, "\\'");
}

function get_headers(): Record<string, string> {
	const { token } = get_airtable_config();
	return {
		'Authorization': `Bearer ${token}`,
		'Content-Type': 'application/json'
	};
}

// --- Partners ---

export type Partner = {
	id: string;
	name: string;
	email: string;
	ref_code: string;
	phone: string;
	commission_rate_first: number;
	commission_rate_renewal: number;
	active: boolean;
};

function parse_partner(record: AirtableRecord): Partner {
	return {
		id: record.id,
		name: (record.fields['Name'] as string) || '',
		email: (record.fields['Email'] as string) || '',
		ref_code: (record.fields['Ref Code'] as string) || '',
		phone: (record.fields['Phone'] as string) || '',
		commission_rate_first: (record.fields['Commission Rate First'] as number) || 40,
		commission_rate_renewal: (record.fields['Commission Rate Renewal'] as number) || 20,
		active: (record.fields['Active'] as boolean) || false
	};
}

export async function get_partner_by_ref(ref_code: string): Promise<Partner | null> {
	const formula = encodeURIComponent(`AND({Ref Code}='${escape_formula(ref_code)}',{Active}=TRUE())`);
	const url = `${get_base_url('Partners')}?filterByFormula=${formula}`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return null;

	const data: AirtableResponse = await response.json();
	if (data.records.length === 0) return null;

	return parse_partner(data.records[0]);
}

export async function get_partner_by_email(email: string): Promise<Partner | null> {
	const formula = encodeURIComponent(`AND(LOWER({Email})=LOWER('${escape_formula(email)}'),{Active}=TRUE())`);
	const url = `${get_base_url('Partners')}?filterByFormula=${formula}`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return null;

	const data: AirtableResponse = await response.json();
	if (data.records.length === 0) return null;

	return parse_partner(data.records[0]);
}

export async function get_partner_by_ref_and_email(ref_code: string, email: string): Promise<Partner | null> {
	const formula = encodeURIComponent(`AND({Ref Code}='${escape_formula(ref_code)}',LOWER({Email})=LOWER('${escape_formula(email)}'))`);
	const url = `${get_base_url('Partners')}?filterByFormula=${formula}`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return null;

	const data: AirtableResponse = await response.json();
	if (data.records.length === 0) return null;

	return parse_partner(data.records[0]);
}

export async function get_all_partners(): Promise<Partner[]> {
	const url = get_base_url('Partners');
	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return [];

	const data: AirtableResponse = await response.json();
	return data.records.map(parse_partner);
}

export async function activate_partner(record_id: string): Promise<void> {
	await fetch(`${get_base_url('Partners')}/${record_id}`, {
		method: 'PATCH',
		headers: get_headers(),
		body: JSON.stringify({
			fields: {
				'Active': true,
				'Commission Rate First': 40,
				'Commission Rate Renewal': 20
			}
		})
	});
}

// --- Commissions ---

export type Commission = {
	id: string;
	partner_ref: string;
	partner_name: string;
	client_company: string;
	client_neq: string;
	service_fee: number;
	commission_rate: number;
	commission_amount: number;
	type: 'first_sale' | 'renewal';
	status: 'pending' | 'paid';
	date: string;
};

function parse_commission(record: AirtableRecord): Commission {
	return {
		id: record.id,
		partner_ref: (record.fields['Partner Ref'] as string) || '',
		partner_name: (record.fields['Partner Name'] as string) || '',
		client_company: (record.fields['Client Company'] as string) || '',
		client_neq: (record.fields['Client NEQ'] as string) || '',
		service_fee: (record.fields['Service Fee'] as number) || 0,
		commission_rate: (record.fields['Commission Rate'] as number) || 0,
		commission_amount: (record.fields['Commission Amount'] as number) || 0,
		type: (record.fields['Type'] as string) === 'renewal' ? 'renewal' : 'first_sale',
		status: (record.fields['Status'] as string) === 'paid' ? 'paid' : 'pending',
		date: (record.fields['Date'] as string) || ''
	};
}

export async function create_commission(
	partner: Partner,
	client_company: string,
	client_neq: string,
	service_fee_cents: number,
	is_first_sale: boolean
): Promise<void> {
	const rate = is_first_sale ? partner.commission_rate_first : partner.commission_rate_renewal;
	const service_fee = service_fee_cents / 100;
	const commission_amount = Math.round(service_fee * rate) / 100;

	await fetch(get_base_url('Commissions'), {
		method: 'POST',
		headers: get_headers(),
		body: JSON.stringify({
			records: [{
				fields: {
					'Partner Ref': partner.ref_code,
					'Partner Name': partner.name,
					'Client Company': client_company,
					'Client NEQ': client_neq,
					'Service Fee': service_fee,
					'Commission Rate': rate,
					'Commission Amount': commission_amount,
					'Type': is_first_sale ? 'first_sale' : 'renewal',
					'Status': 'pending',
					'Date': new Date().toISOString().split('T')[0]
				}
			}]
		})
	});
}

export async function get_commissions_by_ref(ref_code: string): Promise<Commission[]> {
	const formula = encodeURIComponent(`{Partner Ref}='${escape_formula(ref_code)}'`);
	const url = `${get_base_url('Commissions')}?filterByFormula=${formula}&sort[0][field]=Date&sort[0][direction]=desc`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return [];

	const data: AirtableResponse = await response.json();
	return data.records.map(parse_commission);
}

export async function get_all_commissions(status?: string): Promise<Commission[]> {
	let url = get_base_url('Commissions');
	if (status) {
		const formula = encodeURIComponent(`{Status}='${status}'`);
		url += `?filterByFormula=${formula}&sort[0][field]=Date&sort[0][direction]=desc`;
	} else {
		url += `?sort[0][field]=Date&sort[0][direction]=desc`;
	}

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return [];

	const data: AirtableResponse = await response.json();
	return data.records.map(parse_commission);
}

export async function mark_commission_paid(record_id: string): Promise<void> {
	await fetch(`${get_base_url('Commissions')}/${record_id}`, {
		method: 'PATCH',
		headers: get_headers(),
		body: JSON.stringify({ fields: { 'Status': 'paid' } })
	});
}

// --- Reserved NEQs ---

export type ReservedNEQ = {
	id: string;
	partner_ref: string;
	partner_name: string;
	neq_number: string;
	company_name: string;
	status: 'reserved' | 'converted' | 'expired';
	reserved_date: string;
};

function parse_reserved_neq(record: AirtableRecord): ReservedNEQ {
	return {
		id: record.id,
		partner_ref: (record.fields['Partner Ref'] as string) || '',
		partner_name: (record.fields['Partner Name'] as string) || '',
		neq_number: (record.fields['NEQ Number'] as string) || '',
		company_name: (record.fields['Company Name'] as string) || '',
		status: (record.fields['Status'] as string) as ReservedNEQ['status'] || 'reserved',
		reserved_date: (record.fields['Reserved Date'] as string) || ''
	};
}

export async function reserve_neq(partner: Partner, neq_number: string, company_name: string): Promise<void> {
	await fetch(get_base_url('Reserved NEQs'), {
		method: 'POST',
		headers: get_headers(),
		body: JSON.stringify({
			records: [{
				fields: {
					'Partner Ref': partner.ref_code,
					'Partner Name': partner.name,
					'NEQ Number': neq_number,
					'Company Name': company_name,
					'Status': 'reserved',
					'Reserved Date': new Date().toISOString().split('T')[0]
				}
			}]
		})
	});
}

export async function get_reserved_neqs_by_ref(ref_code: string): Promise<ReservedNEQ[]> {
	const formula = encodeURIComponent(`{Partner Ref}='${escape_formula(ref_code)}'`);
	const url = `${get_base_url('Reserved NEQs')}?filterByFormula=${formula}&sort[0][field]=Reserved Date&sort[0][direction]=desc`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return [];

	const data: AirtableResponse = await response.json();
	return data.records.map(parse_reserved_neq);
}

export async function find_reserved_neq(neq_number: string): Promise<ReservedNEQ | null> {
	const formula = encodeURIComponent(`AND({NEQ Number}='${escape_formula(neq_number)}',{Status}='reserved')`);
	const url = `${get_base_url('Reserved NEQs')}?filterByFormula=${formula}`;

	const response = await fetch(url, { headers: get_headers() });
	if (!response.ok) return null;

	const data: AirtableResponse = await response.json();
	if (data.records.length === 0) return null;

	return parse_reserved_neq(data.records[0]);
}

export async function mark_reserved_neq_converted(record_id: string): Promise<void> {
	await fetch(`${get_base_url('Reserved NEQs')}/${record_id}`, {
		method: 'PATCH',
		headers: get_headers(),
		body: JSON.stringify({ fields: { 'Status': 'converted' } })
	});
}
