import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get_airtable_config } from '$lib/env';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, phone, company } = await request.json();

	if (!name || !email || !phone) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const ref_code = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);

	const { token, base_id } = get_airtable_config();
	const url = `https://api.airtable.com/v0/${base_id}/${encodeURIComponent('Partners')}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			records: [{
				fields: {
					'Name': name.trim(),
					'Email': email.trim().toLowerCase(),
					'Phone': phone.trim(),
					'Ref Code': ref_code,
					'Commission Rate First': 40,
					'Commission Rate Renewal': 20,
					'Active': false
				}
			}]
		})
	});

	if (!response.ok) {
		console.error('Partner signup failed:', await response.text());
		return json({ error: 'Failed to create partner' }, { status: 500 });
	}

	return json({ success: true });
};
