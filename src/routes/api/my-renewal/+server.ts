import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { find_company_by_neq_email } from '../../../services/airtable';
import { find_subscriptions_by_email, cancel_subscription } from '../../../services/stripe';

export const POST: RequestHandler = async ({ request }) => {
	const { neq_number, email, action, subscription_id } = await request.json();

	if (action === 'cancel' && subscription_id) {
		try {
			await cancel_subscription(subscription_id);
			return json({ success: true });
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			return json({ error: message }, { status: 500 });
		}
	}

	if (!neq_number || !email) {
		return json({ error: 'NEQ and email required' }, { status: 400 });
	}

	const records = await find_company_by_neq_email(neq_number.trim(), email.trim().toLowerCase());

	if (records.length === 0) {
		return json({ records: [], subscriptions: [] });
	}

	const subscriptions = await find_subscriptions_by_email(email.trim().toLowerCase());

	const renewal_records = records.map((r) => ({
		id: r.id,
		company_name: r.fields['Company Name'] as string,
		neq_number: r.fields['NEQ Number'] as string,
		email: r.fields['Email'] as string,
		qb_invoice_id: r.fields['QuickBooks Invoice ID'] as string | undefined
	}));

	const sub_data = subscriptions.map((s) => ({
		id: s.id,
		status: s.status,
		cancel_at_period_end: s.cancel_at_period_end,
		current_period_end: s.current_period_end,
		created: s.created
	}));

	return json({ records: renewal_records, subscriptions: sub_data });
};
