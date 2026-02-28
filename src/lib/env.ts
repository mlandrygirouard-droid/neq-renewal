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
