import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { validate_renewal_form, type RenewalFormData } from '../models/renewal_form';
import { create_company_record } from '../services/airtable';

export const actions: Actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const data: RenewalFormData = {
			company_name: (form_data.get('company_name') as string) ?? '',
			neq_number: (form_data.get('neq_number') as string) ?? '',
			contact_email: (form_data.get('contact_email') as string) ?? '',
			contact_phone: (form_data.get('contact_phone') as string) ?? '',
			government_fee_included: form_data.get('government_fee_included') === 'on'
		};

		const errors = validate_renewal_form(data);

		if (errors.length > 0) {
			return fail(400, { errors, values: data });
		}

		try {
			await create_company_record(data);
			return { success: true };
		} catch {
			return fail(500, {
				errors: [{ field: 'form', message: 'Une erreur est survenue. Veuillez réessayer.' }],
				values: data
			});
		}
	}
};
