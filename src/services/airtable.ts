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
						'Government Fee Included': data.government_fee_included
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
