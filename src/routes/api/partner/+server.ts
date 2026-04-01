import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	get_partner_by_ref_and_email,
	get_partner_by_email,
	get_commissions_by_ref,
	get_reserved_neqs_by_ref,
	reserve_neq,
	get_partner_by_ref
} from '../../../services/partner';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { action } = body;

	if (action === 'login') {
		const { ref, email } = body;
		if (!email) return json({ error: 'Missing email' }, { status: 400 });

		const partner = ref
			? await get_partner_by_ref_and_email(ref, email)
			: await get_partner_by_email(email);
		if (!partner) return json({ error: 'Invalid credentials' }, { status: 401 });

		const commissions = await get_commissions_by_ref(partner.ref_code);
		const reserved = await get_reserved_neqs_by_ref(partner.ref_code);

		const total_earned = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
		const total_pending = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0);
		const total_clients = new Set(commissions.map(c => c.client_neq)).size;

		return json({
			partner,
			commissions,
			reserved,
			stats: { total_earned, total_pending, total_clients }
		});
	}

	if (action === 'reserve') {
		const { ref, email, neq_number, company_name } = body;
		if (!ref || !email || !neq_number) return json({ error: 'Missing fields' }, { status: 400 });

		const partner = await get_partner_by_ref_and_email(ref, email);
		if (!partner) return json({ error: 'Unauthorized' }, { status: 401 });

		await reserve_neq(partner, neq_number.trim(), (company_name || '').trim());

		const reserved = await get_reserved_neqs_by_ref(ref);
		return json({ success: true, reserved });
	}

	return json({ error: 'Unknown action' }, { status: 400 });
};
