import Stripe from 'stripe';
import { get_stripe_config } from '$lib/env';
import type { RenewalFormData } from '../models/renewal_form';

export type PlanType = 'annual' | 'onetime';

function get_client(): Stripe {
	const { secret_key } = get_stripe_config();
	return new Stripe(secret_key);
}

let cached_tax_rate_ids: string[] | null = null;

async function get_quebec_tax_rates(stripe: Stripe): Promise<string[]> {
	if (cached_tax_rate_ids) return cached_tax_rate_ids;

	const existing = await stripe.taxRates.list({ limit: 100, active: true });

	let tps = existing.data.find((r) => r.display_name === 'TPS' && r.percentage === 5);
	let tvq = existing.data.find((r) => r.display_name === 'TVQ' && r.percentage === 9.975);

	if (!tps) {
		tps = await stripe.taxRates.create({
			display_name: 'TPS',
			description: 'Taxe sur les produits et services',
			jurisdiction: 'CA',
			percentage: 5,
			inclusive: false
		});
	}

	if (!tvq) {
		tvq = await stripe.taxRates.create({
			display_name: 'TVQ',
			description: 'Taxe de vente du Québec',
			jurisdiction: 'QC',
			percentage: 9.975,
			inclusive: false
		});
	}

	cached_tax_rate_ids = [tps.id, tvq.id];
	return cached_tax_rate_ids;
}

export async function create_checkout_session(
	data: RenewalFormData,
	plan: PlanType,
	lang: string,
	origin: string,
	airtable_record_id: string
): Promise<string> {
	const stripe = get_client();
	const { price_id, price_id_onetime } = get_stripe_config();
	const tax_rate_ids = await get_quebec_tax_rates(stripe);

	const is_subscription = plan === 'annual';
	const selected_price = is_subscription ? price_id : price_id_onetime;

	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		mode: is_subscription ? 'subscription' : 'payment',
		payment_method_types: ['card'],
		customer_email: data.contact_email.trim(),
		line_items: [
			{
				price: selected_price,
				quantity: 1,
				tax_rates: tax_rate_ids
			}
		],
		metadata: {
			company_name: data.company_name.trim(),
			neq_number: data.neq_number.trim(),
			contact_phone: data.contact_phone.trim(),
			plan,
			info_changed: data.info_changed ? 'true' : 'false',
			airtable_record_id
		},
		return_url: `${origin}/${lang}/success?session_id={CHECKOUT_SESSION_ID}`
	});

	if (!session.client_secret) {
		throw new Error('Stripe did not return a client secret');
	}

	return session.client_secret;
}

export async function get_checkout_session(session_id: string) {
	const stripe = get_client();
	return stripe.checkout.sessions.retrieve(session_id);
}

export async function find_subscriptions_by_email(email: string): Promise<Stripe.Subscription[]> {
	const stripe = get_client();
	const customers = await stripe.customers.list({ email, limit: 10 });

	const subscriptions: Stripe.Subscription[] = [];
	for (const customer of customers.data) {
		const subs = await stripe.subscriptions.list({ customer: customer.id, limit: 10 });
		subscriptions.push(...subs.data);
	}
	return subscriptions;
}

export async function cancel_subscription(subscription_id: string): Promise<Stripe.Subscription> {
	const stripe = get_client();
	return stripe.subscriptions.update(subscription_id, {
		cancel_at_period_end: true
	});
}
