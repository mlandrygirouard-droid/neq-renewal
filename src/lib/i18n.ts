export type Lang = 'fr' | 'en';

export const default_lang: Lang = 'en';

export const langs: Lang[] = ['fr', 'en'];

export function is_valid_lang(value: string): value is Lang {
	return langs.includes(value as Lang);
}

export type Translations = {
	page_title: string;
	meta_description: string;
	hero_title_start: string;
	hero_title_end: string;
	hero_subtitle: string;
	cta_button: string;
	authorized_badge: string;
	feature_fast_title: string;
	feature_fast_desc: string;
	feature_secure_title: string;
	feature_secure_desc: string;
	feature_guaranteed_title: string;
	feature_guaranteed_desc: string;
	form_title: string;
	form_intro: string;
	label_company_name: string;
	placeholder_company_name: string;
	label_neq: string;
	label_email: string;
	placeholder_email: string;
	label_phone: string;
	pricing_note: string;
	submit_button: string;
	submitting_text: string;
	success_title: string;
	success_message: string;
	error_company_required: string;
	error_neq_required: string;
	error_neq_format: string;
	error_email_required: string;
	error_email_invalid: string;
	error_phone_required: string;
	plan_title: string;
	plan_annual_label: string;
	plan_annual_price: string;
	plan_annual_desc: string;
	plan_onetime_label: string;
	plan_onetime_price: string;
	plan_onetime_desc: string;
	plan_best_value: string;
	info_same_question: string;
	info_same_yes: string;
	info_same_no: string;
	error_server: string;
	footer_rights: string;
	success_page_title: string;
	payment_success_title: string;
	payment_success_message: string;
	back_home: string;
	changes_label: string;
	changes_placeholder: string;
	changes_submit: string;
	changes_submitted: string;
};

const fr: Translations = {
	page_title: 'NEQ Renewal - Renouvellement de votre immatriculation',
	meta_description:
		"Service de renouvellement NEQ rapide et simple. Renouvelez votre numéro d'entreprise du Québec en quelques minutes.",
	hero_title_start: 'Renouvelez votre ',
	hero_title_end: ' en toute simplicité',
	hero_subtitle:
		"Service professionnel de renouvellement de votre immatriculation au Registraire des entreprises du Québec. Rapide, fiable et sans tracas.",
	cta_button: 'Commencer le renouvellement',
	authorized_badge: 'Tiers autorisé par le gouvernement du Québec via Permits Canada',
	feature_fast_title: 'Rapide',
	feature_fast_desc:
		"Remplissez le formulaire en moins de 2 minutes. On s'occupe du reste.",
	feature_secure_title: 'Sécuritaire',
	feature_secure_desc:
		'Vos informations sont protégées et traitées de manière confidentielle.',
	feature_guaranteed_title: 'Garanti',
	feature_guaranteed_desc:
		'Renouvellement complété ou remboursé. Service à 299,99 $ + taxes. Frais gouvernementaux inclus.',
	form_title: 'Formulaire de renouvellement',
	form_intro:
		"Remplissez les informations ci-dessous et notre équipe s'occupera de votre renouvellement.",
	label_company_name: "Nom de l'entreprise",
	placeholder_company_name: 'Ex: Les Entreprises ABC inc.',
	label_neq: 'Numéro NEQ',
	label_email: 'Courriel',
	placeholder_email: 'vous@exemple.com',
	label_phone: 'Téléphone',
	pricing_note: 'Taxes en sus — Frais gouvernementaux inclus',
	submit_button: 'Soumettre ma demande',
	submitting_text: 'Envoi en cours...',
	success_title: 'Demande envoyée avec succès!',
	success_message:
		'Notre équipe traitera votre renouvellement dans les plus brefs délais. Vous recevrez une confirmation par courriel.',
	error_company_required: "Le nom de l'entreprise est requis.",
	error_neq_required: 'Le numéro NEQ est requis.',
	error_neq_format: 'Le numéro NEQ doit contenir exactement 10 chiffres.',
	error_email_required: 'Le courriel est requis.',
	error_email_invalid: "Le courriel n'est pas valide.",
	error_phone_required: 'Le numéro de téléphone est requis.',
	plan_title: 'Choisissez votre plan',
	plan_annual_label: 'Abonnement annuel',
	plan_annual_price: '299,99 $ / an',
	plan_annual_desc: 'Renouvellement automatique chaque année. Annulable en tout temps.',
	plan_onetime_label: 'Paiement unique',
	plan_onetime_price: '349,99 $',
	plan_onetime_desc: 'Un seul paiement, sans engagement.',
	plan_best_value: 'Meilleure valeur',
	info_same_question: 'Vos informations sont-elles les mêmes que l\u2019an dernier?',
	info_same_yes: 'Oui, aucun changement',
	info_same_no: 'Non, des informations ont changé',
	error_server: 'Une erreur est survenue. Veuillez réessayer.',
	footer_rights: 'Tous droits réservés.',
	success_page_title: 'Paiement confirmé - NEQ Renewal',
	payment_success_title: 'Paiement confirmé!',
	payment_success_message:
		'Votre abonnement de renouvellement NEQ est maintenant actif. Notre équipe traitera votre demande dans les plus brefs délais. Vous recevrez une confirmation par courriel.',
	back_home: "Retour à l'accueil",
	changes_label: 'Décrivez les changements à apporter',
	changes_placeholder: 'Ex: Nouvelle adresse du siège social, changement de dirigeants, etc.',
	changes_submit: 'Envoyer les changements',
	changes_submitted: 'Vos changements ont été envoyés avec succès. Notre équipe en tiendra compte.'
};

const en: Translations = {
	page_title: 'NEQ Renewal - Renew your Quebec business registration',
	meta_description:
		'Fast and simple NEQ renewal service. Renew your Quebec business number in just a few minutes.',
	hero_title_start: 'Renew your ',
	hero_title_end: ' with ease',
	hero_subtitle:
		'Professional renewal service for your registration with the Quebec Enterprise Registrar. Fast, reliable and hassle-free.',
	cta_button: 'Start your renewal',
	authorized_badge: 'Authorized third party by the Quebec government via Permits Canada',
	feature_fast_title: 'Fast',
	feature_fast_desc: 'Fill out the form in under 2 minutes. We take care of the rest.',
	feature_secure_title: 'Secure',
	feature_secure_desc: 'Your information is protected and handled confidentially.',
	feature_guaranteed_title: 'Guaranteed',
	feature_guaranteed_desc:
		'Renewal completed or your money back. Service at $299.99 + taxes. Government fees included.',
	form_title: 'Renewal form',
	form_intro: 'Fill in the information below and our team will handle your renewal.',
	label_company_name: 'Company name',
	placeholder_company_name: 'E.g.: ABC Enterprises Inc.',
	label_neq: 'NEQ number',
	label_email: 'Email',
	placeholder_email: 'you@example.com',
	label_phone: 'Phone',
	pricing_note: 'Taxes extra — Government fees included',
	submit_button: 'Submit my request',
	submitting_text: 'Submitting...',
	success_title: 'Request sent successfully!',
	success_message:
		'Our team will process your renewal as soon as possible. You will receive a confirmation by email.',
	error_company_required: 'Company name is required.',
	error_neq_required: 'NEQ number is required.',
	error_neq_format: 'NEQ number must contain exactly 10 digits.',
	error_email_required: 'Email is required.',
	error_email_invalid: 'Email is not valid.',
	error_phone_required: 'Phone number is required.',
	plan_title: 'Choose your plan',
	plan_annual_label: 'Annual subscription',
	plan_annual_price: '$299.99 / year',
	plan_annual_desc: 'Automatic renewal every year. Cancel anytime.',
	plan_onetime_label: 'One-time payment',
	plan_onetime_price: '$349.99',
	plan_onetime_desc: 'Single payment, no commitment.',
	plan_best_value: 'Best value',
	info_same_question: 'Is your company information the same as last year?',
	info_same_yes: 'Yes, no changes',
	info_same_no: 'No, some information has changed',
	error_server: 'An error occurred. Please try again.',
	footer_rights: 'All rights reserved.',
	success_page_title: 'Payment confirmed - NEQ Renewal',
	payment_success_title: 'Payment confirmed!',
	payment_success_message:
		'Your NEQ renewal subscription is now active. Our team will process your request as soon as possible. You will receive a confirmation by email.',
	back_home: 'Back to home',
	changes_label: 'Describe the changes to be made',
	changes_placeholder: 'E.g.: New head office address, change of directors, etc.',
	changes_submit: 'Submit changes',
	changes_submitted: 'Your changes have been submitted successfully. Our team will take them into account.'
};

const translations: Record<Lang, Translations> = { fr, en };

export function get_t(lang: Lang): Translations {
	return translations[lang];
}
