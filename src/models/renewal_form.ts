export type RenewalFormData = {
	company_name: string;
	neq_number: string;
	contact_email: string;
	contact_phone: string;
};

export type FormValidationError = {
	field: string;
	message: string;
};

export type ValidationTranslations = {
	error_company_required: string;
	error_neq_required: string;
	error_neq_format: string;
	error_email_required: string;
	error_email_invalid: string;
	error_phone_required: string;
};

export function validate_renewal_form(data: RenewalFormData, t: ValidationTranslations): FormValidationError[] {
	const errors: FormValidationError[] = [];

	if (!data.company_name.trim()) {
		errors.push({ field: 'company_name', message: t.error_company_required });
	}

	if (!data.neq_number.trim()) {
		errors.push({ field: 'neq_number', message: t.error_neq_required });
	} else if (!/^\d{10}$/.test(data.neq_number.trim())) {
		errors.push({ field: 'neq_number', message: t.error_neq_format });
	}

	if (!data.contact_email.trim()) {
		errors.push({ field: 'contact_email', message: t.error_email_required });
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email.trim())) {
		errors.push({ field: 'contact_email', message: t.error_email_invalid });
	}

	if (!data.contact_phone.trim()) {
		errors.push({ field: 'contact_phone', message: t.error_phone_required });
	}

	return errors;
}
