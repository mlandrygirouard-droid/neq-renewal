import { get_airtable_config } from '$lib/env';
import type { RenewalFormData } from '../models/renewal_form';

type AirtableRecord = {
	id: string;
	fields: Record<string, unknown>;
};

type AirtableResponse = {
	records: AirtableRecord[];
};

export async function create_company_record(data: RenewalFormData): Promise<AirtableRecord> {
	const { token, base_id, table_name } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			records: [
				{
					fields: {
						'Company Name': data.company_name.trim(),
						'NEQ Number': data.neq_number.trim(),
						'Email': data.contact_email.trim(),
						'Government Fee Included': true,
						'Info Changed': data.info_changed
					}
				}
			]
		})
	});

	if (!response.ok) {
		const error_body = await response.text();
		throw new Error(`Airtable API error: ${response.status} - ${error_body}`);
	}

	const result: AirtableResponse = await response.json();
	return result.records[0];
}

export async function update_company_record(record_id: string, changes: string): Promise<void> {
	const { token, base_id, table_name } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}/${record_id}`;

	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fields: {
				'Information Changes': changes
			}
		})
	});

	if (!response.ok) {
		const error_body = await response.text();
		throw new Error(`Airtable API error: ${response.status} - ${error_body}`);
	}
}

export async function set_quickbooks_invoice_id(record_id: string, qb_invoice_id: string): Promise<void> {
	const { token, base_id, table_name } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}/${record_id}`;

	await fetch(url, {
		method: 'PATCH',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fields: { 'QuickBooks Invoice ID': qb_invoice_id }
		})
	});
}

function escape_formula(value: string): string {
	return value.replace(/'/g, "\\'");
}

export async function find_company_by_neq_email(neq_number: string, email: string): Promise<AirtableRecord[]> {
	const { token, base_id, table_name } = get_airtable_config();
	const formula = encodeURIComponent(`AND({NEQ Number}='${escape_formula(neq_number)}',LOWER({Email})=LOWER('${escape_formula(email)}'))`);
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}?filterByFormula=${formula}`;

	const response = await fetch(url, {
		headers: { 'Authorization': `Bearer ${token}` }
	});

	if (!response.ok) return [];

	const data: AirtableResponse = await response.json();
	return data.records;
}

export async function get_company_record(record_id: string): Promise<AirtableRecord | null> {
	const { token, base_id, table_name } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent(table_name)}/${record_id}`;

	const response = await fetch(url, {
		headers: { 'Authorization': `Bearer ${token}` }
	});

	if (!response.ok) return null;
	return response.json();
}
