<script lang="ts">
	let password = $state('');
	let logged_in = $state(false);
	let login_error = $state(false);
	let loading = $state(false);

	let partners = $state<any[]>([]);
	let commissions = $state<any[]>([]);
	let total_pending = $state(0);
	let by_partner = $state<Record<string, { name: string; total: number; count: number }>>({});

	let filter_status = $state('pending');

	async function api_call(action: string, extra: Record<string, unknown> = {}) {
		return fetch('/api/admin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-admin-password': password
			},
			body: JSON.stringify({ action, ...extra })
		});
	}

	async function handle_login(e: Event) {
		e.preventDefault();
		loading = true;
		login_error = false;

		const response = await api_call('list');
		if (!response.ok) {
			login_error = true;
			loading = false;
			return;
		}

		const data = await response.json();
		partners = data.partners;
		commissions = data.commissions;
		total_pending = data.total_pending;
		by_partner = data.by_partner;
		logged_in = true;
		loading = false;
	}

	async function pay_commission(id: string) {
		await api_call('pay', { commission_id: id });
		await refresh();
	}

	async function activate(partner_id: string) {
		await api_call('activate_partner', { partner_id });
		await refresh();
	}

	async function pay_all(ref: string) {
		if (!confirm(`Pay all pending commissions for ${by_partner[ref]?.name}?`)) return;
		await api_call('pay_all_partner', { partner_ref: ref });
		await refresh();
	}

	async function refresh() {
		const response = await api_call('list');
		if (response.ok) {
			const data = await response.json();
			partners = data.partners;
			commissions = data.commissions;
			total_pending = data.total_pending;
			by_partner = data.by_partner;
		}
	}

	let filtered_commissions = $derived(
		filter_status === 'all'
			? commissions
			: commissions.filter(c => c.status === filter_status)
	);

	function format_currency(amount: number): string {
		return `$${amount.toFixed(2)}`;
	}
</script>

<svelte:head>
	<title>Admin - NEQ Renewal</title>
</svelte:head>

<main>
	<section class="header">
		<div class="container">
			<h1>Admin Panel</h1>
		</div>
	</section>

	<section class="content">
		<div class="container">
			{#if !logged_in}
				<div class="login-card">
					<h2>Admin access</h2>
					<form onsubmit={handle_login}>
						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" id="password" bind:value={password} required />
						</div>
						{#if login_error}
							<p class="error-text">Invalid password.</p>
						{/if}
						<button type="submit" disabled={loading}>
							{loading ? 'Loading...' : 'Login'}
						</button>
					</form>
				</div>
			{:else}
				<!-- Summary -->
				<div class="summary-card">
					<h2>Pending Payouts</h2>
					<p class="total">{format_currency(total_pending)}</p>
					{#each Object.entries(by_partner) as [ref, data]}
						<div class="payout-row">
							<div class="payout-info">
								<strong>{data.name}</strong>
								<span class="payout-detail">{data.count} commission{data.count > 1 ? 's' : ''} — {format_currency(data.total)}</span>
							</div>
							<button class="pay-btn" onclick={() => pay_all(ref)}>Pay all</button>
						</div>
					{/each}
					{#if Object.keys(by_partner).length === 0}
						<p class="empty">No pending payouts.</p>
					{/if}
				</div>

				<!-- Pending Approval -->
				{#if partners.filter(p => !p.active).length > 0}
					<div class="section-card approval-card">
						<h2>Pending Approval ({partners.filter(p => !p.active).length})</h2>
						{#each partners.filter(p => !p.active) as p}
							<div class="payout-row">
								<div class="payout-info">
									<strong>{p.name}</strong>
									<span class="payout-detail">{p.email} — {p.ref_code}</span>
								</div>
								<button class="approve-btn" onclick={() => activate(p.id)}>Activate</button>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Partners -->
				<div class="section-card">
					<h2>Active Partners ({partners.filter(p => p.active).length})</h2>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Ref Code</th>
								<th>Email</th>
								<th>1st Sale</th>
								<th>Renewal</th>
								<th>Link</th>
							</tr>
						</thead>
						<tbody>
							{#each partners.filter(p => p.active) as p}
								<tr>
									<td>{p.name}</td>
									<td><code>{p.ref_code}</code></td>
									<td>{p.email}</td>
									<td>{p.commission_rate_first}%</td>
									<td>{p.commission_rate_renewal}%</td>
									<td><code>neqrenewal.com/partner/{p.ref_code}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Commissions -->
				<div class="section-card">
					<div class="section-header">
						<h2>Commissions ({filtered_commissions.length})</h2>
						<select bind:value={filter_status}>
							<option value="pending">Pending</option>
							<option value="paid">Paid</option>
							<option value="all">All</option>
						</select>
					</div>
					<table>
						<thead>
							<tr>
								<th>Date</th>
								<th>Partner</th>
								<th>Client</th>
								<th>Type</th>
								<th>Service Fee</th>
								<th>Rate</th>
								<th>Commission</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{#each filtered_commissions as c}
								<tr>
									<td>{c.date}</td>
									<td>{c.partner_name}</td>
									<td>{c.client_company}</td>
									<td>{c.type === 'first_sale' ? '1st' : 'Renew'}</td>
									<td>{format_currency(c.service_fee)}</td>
									<td>{c.commission_rate}%</td>
									<td class="amount">{format_currency(c.commission_amount)}</td>
									<td>
										<span class="badge" class:pending={c.status === 'pending'} class:paid={c.status === 'paid'}>
											{c.status}
										</span>
									</td>
									<td>
										{#if c.status === 'pending'}
											<button class="small-btn" onclick={() => pay_commission(c.id)}>Pay</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</section>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		color: #1a1a2e;
		background: #f5f5f7;
		line-height: 1.6;
		margin: 0;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.header {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		color: white;
		padding: 2rem 0;
	}

	.header h1 {
		font-size: 1.8rem;
		font-weight: 800;
		margin: 0;
	}

	.content {
		padding: 2rem 0 4rem;
	}

	.login-card {
		max-width: 350px;
		margin: 2rem auto;
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 2px 12px rgba(0,0,0,0.08);
	}

	.login-card h2 {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	label {
		display: block;
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 0.4rem;
	}

	input, select {
		padding: 0.65rem 0.85rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.9rem;
		font-family: inherit;
		background: #fafafa;
	}

	input { width: 100%; box-sizing: border-box; }

	input:focus, select:focus {
		outline: none;
		border-color: #0f3460;
		background: white;
	}

	button {
		background: linear-gradient(135deg, #0f3460, #16213e);
		color: white;
		border: none;
		padding: 0.65rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 700;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover:not(:disabled) { transform: translateY(-1px); }
	button:disabled { opacity: 0.6; cursor: not-allowed; }

	.error-text { color: #dc2626; font-size: 0.9rem; margin-bottom: 1rem; }

	.summary-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
		border-left: 4px solid #e94560;
	}

	.summary-card h2 { font-size: 1.1rem; margin-bottom: 0.5rem; }

	.total {
		font-size: 2rem;
		font-weight: 800;
		color: #e94560;
		margin-bottom: 1rem;
	}

	.payout-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-top: 1px solid #f0f0f0;
	}

	.payout-info strong { display: block; }
	.payout-detail { color: #666; font-size: 0.85rem; }

	.pay-btn {
		background: linear-gradient(135deg, #16a34a, #15803d);
		padding: 0.5rem 1.2rem;
		font-size: 0.85rem;
	}

	.section-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 8px rgba(0,0,0,0.06);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-card h2 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}

	th {
		text-align: left;
		padding: 0.5rem 0.4rem;
		border-bottom: 2px solid #f0f0f0;
		color: #666;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	td {
		padding: 0.5rem 0.4rem;
		border-bottom: 1px solid #f5f5f5;
	}

	code {
		background: #f0f4ff;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85rem;
		color: #0f3460;
	}

	.amount { font-weight: 700; color: #16a34a; }

	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		border-radius: 20px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.badge.pending { background: #fef3c7; color: #92400e; }
	.badge.paid { background: #dcfce7; color: #166534; }

	.approval-card {
		border-left: 4px solid #f59e0b;
	}

	.approve-btn {
		background: linear-gradient(135deg, #16a34a, #15803d);
		padding: 0.5rem 1.2rem;
		font-size: 0.85rem;
	}

	.small-btn {
		padding: 0.3rem 0.8rem;
		font-size: 0.75rem;
		background: #0f3460;
	}

	.empty { color: #999; text-align: center; padding: 1rem; font-style: italic; }

	@media (max-width: 768px) {
		table { font-size: 0.75rem; }
		.header h1 { font-size: 1.4rem; }
	}
</style>
