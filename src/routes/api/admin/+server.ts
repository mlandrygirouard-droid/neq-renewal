import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import {
	get_all_commissions,
	get_all_partners,
	mark_commission_paid,
	activate_partner
} from '../../../services/partner';

function check_auth(request: Request): boolean {
	const auth = request.headers.get('x-admin-password');
	return auth === env.ADMIN_PASSWORD;
}

export const POST: RequestHandler = async ({ request }) => {
	if (!check_auth(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { action } = body;

	if (action === 'list') {
		const partners = await get_all_partners();
		const commissions = await get_all_commissions();

		const pending = commissions.filter(c => c.status === 'pending');
		const total_pending = pending.reduce((sum, c) => sum + c.commission_amount, 0);

		const by_partner: Record<string, { name: string; total: number; count: number }> = {};
		for (const c of pending) {
			if (!by_partner[c.partner_ref]) {
				by_partner[c.partner_ref] = { name: c.partner_name, total: 0, count: 0 };
			}
			by_partner[c.partner_ref].total += c.commission_amount;
			by_partner[c.partner_ref].count += 1;
		}

		return json({ partners, commissions, total_pending, by_partner });
	}

	if (action === 'pay') {
		const { commission_id } = body;
		if (!commission_id) return json({ error: 'Missing commission_id' }, { status: 400 });
		await mark_commission_paid(commission_id);
		return json({ success: true });
	}

	if (action === 'pay_all_partner') {
		const { partner_ref } = body;
		if (!partner_ref) return json({ error: 'Missing partner_ref' }, { status: 400 });

		const commissions = await get_all_commissions('pending');
		const partner_commissions = commissions.filter(c => c.partner_ref === partner_ref);

		for (const c of partner_commissions) {
			await mark_commission_paid(c.id);
		}

		return json({ success: true, paid_count: partner_commissions.length });
	}

	if (action === 'activate_partner') {
		const { partner_id } = body;
		if (!partner_id) return json({ error: 'Missing partner_id' }, { status: 400 });
		await activate_partner(partner_id);
		return json({ success: true });
	}

	return json({ error: 'Unknown action' }, { status: 400 });
};
