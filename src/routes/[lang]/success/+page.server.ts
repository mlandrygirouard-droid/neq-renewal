import type { Actions, PageServerLoad } from './$types';
import type { Lang } from '$lib/i18n';
import { get_checkout_session } from '../../../services/stripe';
import { update_company_record, get_company_record, set_quickbooks_invoice_id } from '../../../services/airtable';
import { create_invoice } from '../../../services/quickbooks';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const lang = params.lang as Lang;
	const session_id = url.searchParams.get('session_id');

	let info_changed = false;
	let airtable_record_id = '';

	if (session_id) {
		const session = await get_checkout_session(session_id);
		info_changed = session.metadata?.info_changed === 'true';
		airtable_record_id = session.metadata?.airtable_record_id ?? '';

		if (session.payment_status === 'paid' && session.metadata && airtable_record_id) {
			const record = await get_company_record(airtable_record_id);
			const already_invoiced = record?.fields?.['QuickBooks Invoice ID'];

			if (!already_invoiced) {
				try {
					const qb_invoice_id = await create_invoice({
						company_name: session.metadata.company_name ?? '',
						email: session.customer_email ?? '',
						plan: (session.metadata.plan as 'annual' | 'onetime') ?? 'annual'
					});
					await set_quickbooks_invoice_id(airtable_record_id, qb_invoice_id);
				} catch (error) {
					console.error('QuickBooks invoice creation failed:', error);
				}
			}
		}
	}

	return {
		lang,
		session_id,
		info_changed,
		airtable_record_id
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();
		const airtable_record_id = form_data.get('airtable_record_id') as string;
		const changes = (form_data.get('changes') as string)?.trim();

		if (!airtable_record_id || !changes) {
			return fail(400, { error: true });
		}

		await update_company_record(airtable_record_id, changes);
		return { success: true };
	}
};
