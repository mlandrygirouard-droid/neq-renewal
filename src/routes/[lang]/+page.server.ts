import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { validate_renewal_form, type RenewalFormData } from '../../models/renewal_form';
import { create_company_record } from '../../services/airtable';
import { create_checkout_session, type PlanType } from '../../services/stripe';
import { get_t, type Lang } from '$lib/i18n';

export const actions: Actions = {
	default: async ({ request, params, url }) => {
		const lang = params.lang as Lang;
		const t = get_t(lang);
		const form_data = await request.formData();

		const data: RenewalFormData = {
			company_name: (form_data.get('company_name') as string) ?? '',
			neq_number: (form_data.get('neq_number') as string) ?? '',
			contact_email: (form_data.get('contact_email') as string) ?? '',
			contact_phone: (form_data.get('contact_phone') as string) ?? ''
		};

		const plan = (form_data.get('plan') as PlanType) ?? 'annual';

		const errors = validate_renewal_form(data, t);

		if (errors.length > 0) {
			return fail(400, { errors, values: data });
		}

		try {
			await create_company_record(data);
			const client_secret = await create_checkout_session(data, plan, lang, url.origin);
			return { client_secret };
		} catch (error) {
			console.error('Form submission error:', error);
			return fail(500, {
				errors: [{ field: 'form', message: t.error_server }],
				values: data
			});
		}
	}
};
