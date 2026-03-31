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
	footer_privacy: string;
	footer_terms: string;
	privacy_page_title: string;
	privacy_title: string;
	privacy_last_updated: string;
	privacy_intro: string;
	privacy_company_info: string;
	privacy_section_data_collected_title: string;
	privacy_section_data_collected_text: string;
	privacy_section_data_use_title: string;
	privacy_section_data_use_text: string;
	privacy_section_third_parties_title: string;
	privacy_section_third_parties_text: string;
	privacy_section_retention_title: string;
	privacy_section_retention_text: string;
	privacy_section_rights_title: string;
	privacy_section_rights_text: string;
	privacy_section_cookies_title: string;
	privacy_section_cookies_text: string;
	privacy_section_security_title: string;
	privacy_section_security_text: string;
	privacy_section_law_title: string;
	privacy_section_law_text: string;
	privacy_section_changes_title: string;
	privacy_section_changes_text: string;
	privacy_section_contact_title: string;
	privacy_section_contact_text: string;
	terms_page_title: string;
	terms_title: string;
	terms_last_updated: string;
	terms_intro: string;
	terms_section_service_title: string;
	terms_section_service_text: string;
	terms_section_pricing_title: string;
	terms_section_pricing_text: string;
	terms_section_payment_title: string;
	terms_section_payment_text: string;
	terms_section_refund_title: string;
	terms_section_refund_text: string;
	terms_section_guarantee_title: string;
	terms_section_guarantee_text: string;
	terms_section_liability_title: string;
	terms_section_liability_text: string;
	terms_section_user_responsibilities_title: string;
	terms_section_user_responsibilities_text: string;
	terms_section_modifications_title: string;
	terms_section_modifications_text: string;
	terms_section_governing_law_title: string;
	terms_section_governing_law_text: string;
	terms_section_contact_title: string;
	terms_section_contact_text: string;
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
	changes_submitted: 'Vos changements ont été envoyés avec succès. Notre équipe en tiendra compte.',
	footer_privacy: 'Politique de confidentialité',
	footer_terms: "Conditions d'utilisation",
	privacy_page_title: 'Politique de confidentialité - NEQ Renewal',
	privacy_title: 'Politique de confidentialité',
	privacy_last_updated: 'Dernière mise à jour : 30 mars 2026',
	privacy_intro:
		"La présente politique de confidentialité décrit comment PERMITS CANADA INC. (ci-après « nous », « notre » ou « Permits Canada ») collecte, utilise et protège vos renseignements personnels dans le cadre du service de renouvellement NEQ offert sur neqrenewal.com.",
	privacy_company_info:
		'PERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuébec (QC) CA G1P 4C6\nCourriel : permits@permitscanada.com\nTéléphone : (418) 650-5757',
	privacy_section_data_collected_title: '1. Renseignements collectés',
	privacy_section_data_collected_text:
		"Dans le cadre de notre service de renouvellement NEQ, nous collectons les renseignements suivants :\n\n- Nom de l'entreprise\n- Numéro NEQ (numéro d'entreprise du Québec)\n- Adresse courriel de contact\n- Numéro de téléphone de contact\n- Informations de paiement (traitées de manière sécurisée via Stripe — nous ne stockons jamais vos numéros de carte de crédit)\n- Toute modification aux informations de l'entreprise que vous nous transmettez",
	privacy_section_data_use_title: '2. Utilisation des renseignements',
	privacy_section_data_use_text:
		"Vos renseignements personnels sont utilisés exclusivement aux fins suivantes :\n\n- Traitement de votre demande de renouvellement NEQ auprès du Registraire des entreprises du Québec\n- Communication avec vous concernant votre demande\n- Émission de factures via QuickBooks\n- Gestion de votre dossier client dans notre système (Airtable)\n- Traitement sécurisé de vos paiements via Stripe\n- Envoi de rappels de renouvellement si vous avez souscrit à l'abonnement annuel",
	privacy_section_third_parties_title: '3. Services tiers',
	privacy_section_third_parties_text:
		"Nous utilisons les services tiers suivants dans le cadre de nos opérations :\n\n- Stripe : traitement sécurisé des paiements par carte de crédit. Stripe est certifié PCI DSS niveau 1. Consultez la politique de confidentialité de Stripe à stripe.com/privacy.\n- Airtable : stockage et gestion sécurisés des données de nos clients. Les données sont hébergées sur des serveurs sécurisés aux États-Unis.\n- QuickBooks : émission et gestion des factures.\n- Vercel : hébergement de notre site web. Vercel peut collecter des données techniques de navigation (adresse IP, type de navigateur) à des fins de performance et de sécurité.\n\nNous ne vendons, ne louons et ne partageons jamais vos renseignements personnels à des fins publicitaires ou de marketing avec des tiers.",
	privacy_section_retention_title: '4. Conservation des données',
	privacy_section_retention_text:
		"Vos renseignements personnels sont conservés aussi longtemps que nécessaire pour fournir notre service et respecter nos obligations légales. Les données relatives à votre renouvellement NEQ sont conservées pour une durée minimale de 7 ans conformément aux exigences fiscales et comptables applicables au Québec et au Canada. Si vous annulez votre abonnement annuel, vos données de paiement sont supprimées de Stripe dans un délai de 90 jours suivant l'annulation.",
	privacy_section_rights_title: '5. Vos droits',
	privacy_section_rights_text:
		"Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25) et à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE/PIPEDA), vous disposez des droits suivants :\n\n- Droit d'accès : vous pouvez demander une copie des renseignements personnels que nous détenons à votre sujet.\n- Droit de rectification : vous pouvez demander la correction de renseignements inexacts ou incomplets.\n- Droit de suppression : vous pouvez demander la suppression de vos renseignements personnels, sous réserve de nos obligations légales de conservation.\n- Droit de retrait du consentement : vous pouvez retirer votre consentement à la collecte et à l'utilisation de vos renseignements en tout temps.\n\nPour exercer l'un de ces droits, contactez-nous à permits@permitscanada.com ou au (418) 650-5757. Nous répondrons à votre demande dans un délai de 30 jours.",
	privacy_section_cookies_title: '6. Témoins de connexion (cookies)',
	privacy_section_cookies_text:
		"Notre site web utilise un minimum de témoins de connexion (cookies), limités aux cookies strictement nécessaires au fonctionnement du site et au traitement des paiements via Stripe. Nous n'utilisons aucun cookie de suivi publicitaire, de profilage ou d'analyse comportementale. Aucun outil d'analyse tiers (tel que Google Analytics) n'est utilisé sur notre site.",
	privacy_section_security_title: '7. Sécurité',
	privacy_section_security_text:
		"Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos renseignements personnels contre l'accès non autorisé, la perte, la destruction ou l'altération. Les communications entre votre navigateur et notre site sont chiffrées via le protocole HTTPS/TLS. Les paiements sont traités de manière sécurisée par Stripe, certifié PCI DSS niveau 1.",
	privacy_section_law_title: '8. Lois applicables',
	privacy_section_law_text:
		"La présente politique de confidentialité est régie par les lois en vigueur dans la province de Québec et les lois fédérales canadiennes applicables, notamment :\n\n- La Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25)\n- La Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE/PIPEDA)\n\nEn cas de litige, les tribunaux de la ville de Québec auront compétence exclusive.",
	privacy_section_changes_title: '9. Modifications à cette politique',
	privacy_section_changes_text:
		"Nous nous réservons le droit de modifier cette politique de confidentialité en tout temps. Toute modification sera publiée sur cette page avec une date de mise à jour révisée. Si des modifications substantielles sont apportées, nous vous en aviserons par courriel à l'adresse que vous nous avez fournie.",
	privacy_section_contact_title: '10. Nous contacter',
	privacy_section_contact_text:
		"Pour toute question ou préoccupation concernant cette politique de confidentialité ou le traitement de vos renseignements personnels, veuillez nous contacter :\n\nPERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuébec (QC) CA G1P 4C6\nCourriel : permits@permitscanada.com\nTéléphone : (418) 650-5757",
	terms_page_title: "Conditions d'utilisation - NEQ Renewal",
	terms_title: "Conditions d'utilisation",
	terms_last_updated: 'Dernière mise à jour : 30 mars 2026',
	terms_intro:
		"Les présentes conditions d'utilisation (ci-après les « Conditions ») régissent l'utilisation du service de renouvellement NEQ offert par PERMITS CANADA INC. (ci-après « nous », « notre » ou « Permits Canada ») sur le site neqrenewal.com. En utilisant notre service, vous acceptez d'être lié par ces Conditions.",
	terms_section_service_title: '1. Description du service',
	terms_section_service_text:
		"Permits Canada Inc. offre un service de renouvellement de l'immatriculation au Registraire des entreprises du Québec (numéro NEQ) en tant que tiers autorisé par le gouvernement du Québec. Notre service comprend :\n\n- La préparation et la soumission de votre déclaration de mise à jour annuelle auprès du Registraire des entreprises du Québec\n- Le paiement des frais gouvernementaux en votre nom (inclus dans notre tarif)\n- La confirmation de la complétion du renouvellement par courriel\n- Le suivi de votre dossier en cas de problème",
	terms_section_pricing_title: '2. Tarification',
	terms_section_pricing_text:
		"Nos tarifs sont les suivants :\n\n- Abonnement annuel : 299,99 $ par année (plus taxes applicables). Ce forfait inclut le renouvellement automatique chaque année et les frais gouvernementaux.\n- Paiement unique : 349,99 $ (plus taxes applicables). Ce forfait inclut un seul renouvellement et les frais gouvernementaux.\n\nLes taxes applicables (TPS et TVQ) seront ajoutées au montant affiché. Les frais gouvernementaux exigés par le Registraire des entreprises du Québec sont inclus dans nos tarifs et ne font pas l'objet de frais supplémentaires.",
	terms_section_payment_title: '3. Modalités de paiement',
	terms_section_payment_text:
		"Les paiements sont traités de manière sécurisée par Stripe. Nous acceptons les principales cartes de crédit (Visa, Mastercard, American Express).\n\nPour l'abonnement annuel, votre carte sera automatiquement débitée à chaque date anniversaire de votre inscription. Vous pouvez annuler votre abonnement en tout temps en nous contactant à permits@permitscanada.com ou au (418) 650-5757. L'annulation prendra effet à la fin de la période de facturation en cours.\n\nPour le paiement unique, un seul prélèvement est effectué au moment de la soumission de votre demande.",
	terms_section_refund_title: '4. Politique de remboursement',
	terms_section_refund_text:
		"Nous offrons une garantie de remboursement intégral si nous ne sommes pas en mesure de compléter votre renouvellement NEQ. Si votre renouvellement ne peut être effectué pour quelque raison que ce soit attribuable à notre service, vous serez remboursé intégralement dans un délai de 14 jours ouvrables.\n\nAucun remboursement ne sera accordé une fois le renouvellement complété avec succès auprès du Registraire des entreprises du Québec.\n\nLes demandes de remboursement doivent être adressées à permits@permitscanada.com.",
	terms_section_guarantee_title: '5. Garantie de service',
	terms_section_guarantee_text:
		"Nous nous engageons à traiter votre demande de renouvellement NEQ dans les meilleurs délais. Le délai de traitement habituel est de 1 à 5 jours ouvrables suivant la réception de votre demande complète et de votre paiement.\n\nNotre garantie : renouvellement complété ou remboursé. Si nous ne parvenons pas à effectuer votre renouvellement, vous êtes intégralement remboursé.",
	terms_section_liability_title: '6. Limitation de responsabilité',
	terms_section_liability_text:
		"Permits Canada Inc. agit en tant qu'intermédiaire autorisé entre vous et le Registraire des entreprises du Québec. Nous ne sommes pas responsables :\n\n- Des retards ou interruptions de service du Registraire des entreprises du Québec\n- Des conséquences découlant d'informations inexactes ou incomplètes fournies par le client\n- Des dommages indirects, consécutifs ou punitifs de quelque nature que ce soit\n- Des pertes financières résultant d'un défaut de renouvellement causé par des informations erronées fournies par le client\n\nDans tous les cas, notre responsabilité maximale est limitée au montant que vous avez payé pour le service.",
	terms_section_user_responsibilities_title: '7. Responsabilités du client',
	terms_section_user_responsibilities_text:
		"En utilisant notre service, vous vous engagez à :\n\n- Fournir des informations exactes, complètes et à jour concernant votre entreprise\n- Nous informer rapidement de tout changement dans les informations de votre entreprise\n- Vous assurer que vous êtes autorisé à demander le renouvellement NEQ pour l'entreprise en question\n- Maintenir une adresse courriel valide pour recevoir nos communications\n- Nous informer de tout problème ou erreur dans les plus brefs délais",
	terms_section_modifications_title: '8. Modifications aux conditions',
	terms_section_modifications_text:
		"Nous nous réservons le droit de modifier ces conditions d'utilisation en tout temps. Toute modification sera publiée sur cette page avec une date de mise à jour révisée. Les modifications entreront en vigueur dès leur publication. Si des modifications substantielles sont apportées, nous vous en aviserons par courriel. Votre utilisation continue du service après la publication des modifications constitue votre acceptation des nouvelles conditions.",
	terms_section_governing_law_title: '9. Loi applicable et juridiction',
	terms_section_governing_law_text:
		"Les présentes conditions d'utilisation sont régies par les lois en vigueur dans la province de Québec et les lois fédérales canadiennes applicables. En cas de litige découlant de ces conditions ou de l'utilisation de notre service, les tribunaux de la ville de Québec auront compétence exclusive.",
	terms_section_contact_title: '10. Nous contacter',
	terms_section_contact_text:
		"Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter :\n\nPERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuébec (QC) CA G1P 4C6\nCourriel : permits@permitscanada.com\nTéléphone : (418) 650-5757"
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
	changes_submitted: 'Your changes have been submitted successfully. Our team will take them into account.',
	footer_privacy: 'Privacy Policy',
	footer_terms: 'Terms of Service',
	privacy_page_title: 'Privacy Policy - NEQ Renewal',
	privacy_title: 'Privacy Policy',
	privacy_last_updated: 'Last updated: March 30, 2026',
	privacy_intro:
		'This privacy policy describes how PERMITS CANADA INC. (hereinafter "we", "our" or "Permits Canada") collects, uses and protects your personal information in connection with the NEQ renewal service offered on neqrenewal.com.',
	privacy_company_info:
		'PERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuebec (QC) CA G1P 4C6\nEmail: permits@permitscanada.com\nPhone: (418) 650-5757',
	privacy_section_data_collected_title: '1. Information Collected',
	privacy_section_data_collected_text:
		'As part of our NEQ renewal service, we collect the following information:\n\n- Company name\n- NEQ number (Quebec business number)\n- Contact email address\n- Contact phone number\n- Payment information (processed securely via Stripe — we never store your credit card numbers)\n- Any changes to your company information that you provide to us',
	privacy_section_data_use_title: '2. Use of Information',
	privacy_section_data_use_text:
		'Your personal information is used exclusively for the following purposes:\n\n- Processing your NEQ renewal request with the Quebec Enterprise Registrar\n- Communicating with you regarding your request\n- Issuing invoices via QuickBooks\n- Managing your client file in our system (Airtable)\n- Secure processing of your payments via Stripe\n- Sending renewal reminders if you have subscribed to the annual plan',
	privacy_section_third_parties_title: '3. Third-Party Services',
	privacy_section_third_parties_text:
		'We use the following third-party services as part of our operations:\n\n- Stripe: secure credit card payment processing. Stripe is PCI DSS Level 1 certified. See Stripe\'s privacy policy at stripe.com/privacy.\n- Airtable: secure storage and management of our client data. Data is hosted on secure servers in the United States.\n- QuickBooks: invoice issuance and management.\n- Vercel: hosting of our website. Vercel may collect technical browsing data (IP address, browser type) for performance and security purposes.\n\nWe never sell, rent or share your personal information for advertising or marketing purposes with third parties.',
	privacy_section_retention_title: '4. Data Retention',
	privacy_section_retention_text:
		'Your personal information is retained for as long as necessary to provide our service and meet our legal obligations. Data related to your NEQ renewal is retained for a minimum of 7 years in accordance with applicable tax and accounting requirements in Quebec and Canada. If you cancel your annual subscription, your payment data is deleted from Stripe within 90 days of cancellation.',
	privacy_section_rights_title: '5. Your Rights',
	privacy_section_rights_text:
		'In accordance with Quebec\'s Act Respecting the Protection of Personal Information in the Private Sector (Law 25) and the Personal Information Protection and Electronic Documents Act (PIPEDA), you have the following rights:\n\n- Right of access: you may request a copy of the personal information we hold about you.\n- Right of rectification: you may request the correction of inaccurate or incomplete information.\n- Right of deletion: you may request the deletion of your personal information, subject to our legal retention obligations.\n- Right to withdraw consent: you may withdraw your consent to the collection and use of your information at any time.\n\nTo exercise any of these rights, contact us at permits@permitscanada.com or (418) 650-5757. We will respond to your request within 30 days.',
	privacy_section_cookies_title: '6. Cookies',
	privacy_section_cookies_text:
		'Our website uses a minimal amount of cookies, limited to cookies strictly necessary for the operation of the site and the processing of payments via Stripe. We do not use any advertising tracking cookies, profiling cookies, or behavioral analytics cookies. No third-party analytics tools (such as Google Analytics) are used on our site.',
	privacy_section_security_title: '7. Security',
	privacy_section_security_text:
		'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, loss, destruction or alteration. Communications between your browser and our site are encrypted via the HTTPS/TLS protocol. Payments are processed securely by Stripe, which is PCI DSS Level 1 certified.',
	privacy_section_law_title: '8. Applicable Laws',
	privacy_section_law_text:
		"This privacy policy is governed by the laws in force in the Province of Quebec and applicable federal Canadian laws, including:\n\n- Quebec's Act Respecting the Protection of Personal Information in the Private Sector (Law 25)\n- The Personal Information Protection and Electronic Documents Act (PIPEDA)\n\nIn the event of a dispute, the courts of Quebec City shall have exclusive jurisdiction.",
	privacy_section_changes_title: '9. Changes to This Policy',
	privacy_section_changes_text:
		'We reserve the right to modify this privacy policy at any time. Any changes will be posted on this page with a revised update date. If substantial changes are made, we will notify you by email at the address you provided to us.',
	privacy_section_contact_title: '10. Contact Us',
	privacy_section_contact_text:
		'For any questions or concerns regarding this privacy policy or the processing of your personal information, please contact us:\n\nPERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuebec (QC) CA G1P 4C6\nEmail: permits@permitscanada.com\nPhone: (418) 650-5757',
	terms_page_title: 'Terms of Service - NEQ Renewal',
	terms_title: 'Terms of Service',
	terms_last_updated: 'Last updated: March 30, 2026',
	terms_intro:
		'These terms of service (hereinafter the "Terms") govern the use of the NEQ renewal service offered by PERMITS CANADA INC. (hereinafter "we", "our" or "Permits Canada") on neqrenewal.com. By using our service, you agree to be bound by these Terms.',
	terms_section_service_title: '1. Service Description',
	terms_section_service_text:
		'Permits Canada Inc. provides a renewal service for registration with the Quebec Enterprise Registrar (NEQ number) as an authorized third party by the Quebec government. Our service includes:\n\n- Preparation and submission of your annual update declaration with the Quebec Enterprise Registrar\n- Payment of government fees on your behalf (included in our pricing)\n- Confirmation of renewal completion by email\n- Follow-up on your file in case of any issues',
	terms_section_pricing_title: '2. Pricing',
	terms_section_pricing_text:
		'Our rates are as follows:\n\n- Annual subscription: $299.99 per year (plus applicable taxes). This plan includes automatic renewal each year and government fees.\n- One-time payment: $349.99 (plus applicable taxes). This plan includes a single renewal and government fees.\n\nApplicable taxes (GST and QST) will be added to the displayed amount. Government fees required by the Quebec Enterprise Registrar are included in our pricing and are not subject to additional charges.',
	terms_section_payment_title: '3. Payment Terms',
	terms_section_payment_text:
		'Payments are processed securely by Stripe. We accept major credit cards (Visa, Mastercard, American Express).\n\nFor the annual subscription, your card will be automatically charged on each anniversary date of your registration. You may cancel your subscription at any time by contacting us at permits@permitscanada.com or (418) 650-5757. Cancellation will take effect at the end of the current billing period.\n\nFor the one-time payment, a single charge is made at the time of submission of your request.',
	terms_section_refund_title: '4. Refund Policy',
	terms_section_refund_text:
		'We offer a full money-back guarantee if we are unable to complete your NEQ renewal. If your renewal cannot be processed for any reason attributable to our service, you will be fully refunded within 14 business days.\n\nNo refund will be granted once the renewal has been successfully completed with the Quebec Enterprise Registrar.\n\nRefund requests should be sent to permits@permitscanada.com.',
	terms_section_guarantee_title: '5. Service Guarantee',
	terms_section_guarantee_text:
		'We are committed to processing your NEQ renewal request as quickly as possible. The usual processing time is 1 to 5 business days following receipt of your complete request and payment.\n\nOur guarantee: renewal completed or your money back. If we are unable to complete your renewal, you will be fully refunded.',
	terms_section_liability_title: '6. Limitation of Liability',
	terms_section_liability_text:
		'Permits Canada Inc. acts as an authorized intermediary between you and the Quebec Enterprise Registrar. We are not responsible for:\n\n- Delays or service interruptions by the Quebec Enterprise Registrar\n- Consequences arising from inaccurate or incomplete information provided by the client\n- Indirect, consequential or punitive damages of any kind\n- Financial losses resulting from a failure to renew caused by erroneous information provided by the client\n\nIn all cases, our maximum liability is limited to the amount you paid for the service.',
	terms_section_user_responsibilities_title: '7. Client Responsibilities',
	terms_section_user_responsibilities_text:
		'By using our service, you agree to:\n\n- Provide accurate, complete and up-to-date information about your business\n- Inform us promptly of any changes to your business information\n- Ensure that you are authorized to request the NEQ renewal for the business in question\n- Maintain a valid email address to receive our communications\n- Inform us of any problems or errors as soon as possible',
	terms_section_modifications_title: '8. Modifications to Terms',
	terms_section_modifications_text:
		'We reserve the right to modify these terms of service at any time. Any changes will be posted on this page with a revised update date. Changes will take effect upon publication. If substantial changes are made, we will notify you by email. Your continued use of the service after the publication of changes constitutes your acceptance of the new terms.',
	terms_section_governing_law_title: '9. Governing Law and Jurisdiction',
	terms_section_governing_law_text:
		'These terms of service are governed by the laws in force in the Province of Quebec and applicable federal Canadian laws. In the event of a dispute arising from these terms or the use of our service, the courts of Quebec City shall have exclusive jurisdiction.',
	terms_section_contact_title: '10. Contact Us',
	terms_section_contact_text:
		'For any questions regarding these terms of service, please contact us:\n\nPERMITS CANADA INC.\n3055 Boul Wilfrid-Hamel, Suite 225\nQuebec (QC) CA G1P 4C6\nEmail: permits@permitscanada.com\nPhone: (418) 650-5757'
};

const translations: Record<Lang, Translations> = { fr, en };

export function get_t(lang: Lang): Translations {
	return translations[lang];
}
