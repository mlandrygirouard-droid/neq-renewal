export type RenewalFormData = {
	company_name: string;
	neq_number: string;
	contact_email: string;
	contact_phone: string;
	government_fee_included: boolean;
};

export type FormValidationError = {
	field: string;
	message: string;
};

export function validate_renewal_form(data: RenewalFormData): FormValidationError[] {
	const errors: FormValidationError[] = [];

	if (!data.company_name.trim()) {
		errors.push({ field: 'company_name', message: 'Le nom de l\'entreprise est requis.' });
	}

	if (!data.neq_number.trim()) {
		errors.push({ field: 'neq_number', message: 'Le numéro NEQ est requis.' });
	} else if (!/^\d{10}$/.test(data.neq_number.trim())) {
		errors.push({ field: 'neq_number', message: 'Le numéro NEQ doit contenir exactement 10 chiffres.' });
	}

	if (!data.contact_email.trim()) {
		errors.push({ field: 'contact_email', message: 'Le courriel est requis.' });
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email.trim())) {
		errors.push({ field: 'contact_email', message: 'Le courriel n\'est pas valide.' });
	}

	if (!data.contact_phone.trim()) {
		errors.push({ field: 'contact_phone', message: 'Le numéro de téléphone est requis.' });
	}

	return errors;
}
