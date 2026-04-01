<script lang="ts">
	import type { PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));

	// Signup
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let company = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state(false);

	// Login
	let login_email = $state('');
	let logging_in = $state(false);
	let login_error = $state(false);
	let logged_in = $state(false);
	let partner = $state<any>(null);
	let commissions = $state<any[]>([]);
	let reserved = $state<any[]>([]);
	let stats = $state<any>({ total_earned: 0, total_pending: 0, total_clients: 0 });
	let reserve_neq = $state('');
	let reserve_company = $state('');
	let reserving = $state(false);

	async function handle_submit(e: Event) {
		e.preventDefault();
		submitting = true;
		error = false;

		try {
			const response = await fetch('/api/partner-signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, phone, company })
			});

			if (!response.ok) throw new Error('Failed');
			submitted = true;
		} catch {
			error = true;
		} finally {
			submitting = false;
		}
	}

	async function handle_login(e: Event) {
		e.preventDefault();
		logging_in = true;
		login_error = false;

		try {
			const response = await fetch('/api/partner', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'login', email: login_email.trim().toLowerCase() })
			});

			if (!response.ok) {
				login_error = true;
				return;
			}

			const data = await response.json();
			partner = data.partner;
			commissions = data.commissions;
			reserved = data.reserved;
			stats = data.stats;
			logged_in = true;
		} catch {
			login_error = true;
		} finally {
			logging_in = false;
		}
	}

	async function handle_reserve(e: Event) {
		e.preventDefault();
		if (!reserve_neq.trim()) return;
		reserving = true;

		try {
			const response = await fetch('/api/partner', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'reserve',
					ref: partner.ref_code,
					email: partner.email,
					neq_number: reserve_neq.trim(),
					company_name: reserve_company.trim()
				})
			});

			if (response.ok) {
				const data = await response.json();
				reserved = data.reserved;
				reserve_neq = '';
				reserve_company = '';
			}
		} finally {
			reserving = false;
		}
	}

	function copy_link() {
		navigator.clipboard.writeText(`https://neqrenewal.com/partner/${partner.ref_code}`);
	}

	function format_currency(amount: number): string {
		return `$${amount.toFixed(2)}`;
	}
</script>

<svelte:head>
	<title>{t.partner_page_title}</title>
	<meta name="description" content={t.partner_intro} />
	<link rel="canonical" href="https://neqrenewal.com/{lang}/partner" />
</svelte:head>

<main>
	<section class="legal-header">
		<div class="container">
			<a href="/{lang}" class="back-link">&larr; {t.back_home}</a>
			<h1>{t.partner_title}</h1>
		</div>
	</section>

	<section class="legal-content">
		<div class="container">
			{#if logged_in}
				<!-- Dashboard -->
				<div class="stats-grid">
					<div class="stat-card">
						<span class="stat-value">{stats.total_clients}</span>
						<span class="stat-label">{lang === 'fr' ? 'Clients référés' : 'Clients referred'}</span>
					</div>
					<div class="stat-card">
						<span class="stat-value">{format_currency(stats.total_earned)}</span>
						<span class="stat-label">{lang === 'fr' ? 'Total gagné' : 'Total earned'}</span>
					</div>
					<div class="stat-card highlight">
						<span class="stat-value">{format_currency(stats.total_pending)}</span>
						<span class="stat-label">{lang === 'fr' ? 'En attente' : 'Pending payout'}</span>
					</div>
				</div>

				<div class="section-card">
					<h2>{lang === 'fr' ? 'Votre lien de référencement' : 'Your referral link'}</h2>
					<div class="share-row">
						<input type="text" value={`https://neqrenewal.com/partner/${partner.ref_code}`} readonly class="share-input" />
						<button onclick={copy_link} class="copy-btn">{lang === 'fr' ? 'Copier' : 'Copy'}</button>
					</div>
				</div>

				<div class="section-card">
					<h2>{lang === 'fr' ? 'Réserver un client' : 'Reserve a client'}</h2>
					<p class="section-desc">{lang === 'fr' ? 'Réservez un numéro NEQ pour un client que vous apportez. Sa commission sera automatiquement suivie.' : 'Reserve a NEQ number for a client you\'re bringing in. The commission will be automatically tracked.'}</p>
					<form onsubmit={handle_reserve} class="reserve-form">
						<div class="reserve-row">
							<input type="text" bind:value={reserve_neq} placeholder={lang === 'fr' ? 'Numéro NEQ (10 chiffres)' : 'NEQ Number (10 digits)'} pattern="[0-9]{10}" title={lang === 'fr' ? 'Le NEQ doit contenir exactement 10 chiffres' : 'NEQ must be exactly 10 digits'} required />
							<input type="text" bind:value={reserve_company} placeholder={lang === 'fr' ? 'Nom entreprise (optionnel)' : 'Company name (optional)'} />
							<button type="submit" disabled={reserving}>
								{reserving ? '...' : lang === 'fr' ? 'Réserver' : 'Reserve'}
							</button>
						</div>
					</form>

					{#if reserved.length > 0}
						<table>
							<thead>
								<tr>
									<th>NEQ</th>
									<th>{lang === 'fr' ? 'Entreprise' : 'Company'}</th>
									<th>Date</th>
									<th>{lang === 'fr' ? 'Statut' : 'Status'}</th>
								</tr>
							</thead>
							<tbody>
								{#each reserved as r}
									<tr>
										<td>{r.neq_number}</td>
										<td>{r.company_name || '—'}</td>
										<td>{r.reserved_date}</td>
										<td><span class="badge" class:reserved={r.status === 'reserved'} class:converted={r.status === 'converted'}>{r.status}</span></td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>

				<div class="section-card">
					<h2>{lang === 'fr' ? 'Historique des commissions' : 'Commission history'}</h2>
					{#if commissions.length === 0}
						<p class="empty">{lang === 'fr' ? 'Aucune commission pour le moment. Partagez votre lien pour commencer!' : 'No commissions yet. Share your link to start earning!'}</p>
					{:else}
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>{lang === 'fr' ? 'Client' : 'Client'}</th>
									<th>Type</th>
									<th>{lang === 'fr' ? 'Commission' : 'Commission'}</th>
									<th>{lang === 'fr' ? 'Statut' : 'Status'}</th>
								</tr>
							</thead>
							<tbody>
								{#each commissions as c}
									<tr>
										<td>{c.date}</td>
										<td>{c.client_company}</td>
										<td>{c.type === 'first_sale' ? (lang === 'fr' ? '1ère année' : '1st year') : (lang === 'fr' ? '2e année' : '2nd year')}</td>
										<td class="amount">{format_currency(c.commission_amount)}</td>
										<td><span class="badge" class:pending={c.status === 'pending'} class:paid={c.status === 'paid'}>{c.status === 'pending' ? (lang === 'fr' ? 'En attente' : 'Pending') : (lang === 'fr' ? 'Payé' : 'Paid')}</span></td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			{:else}
				<!-- Login -->
				<div class="login-section">
					<h2>{t.partner_login_title}</h2>
					<form onsubmit={handle_login} class="login-form">
						<div class="login-row">
							<input type="email" bind:value={login_email} placeholder={t.partner_placeholder_email} required />
							<button type="submit" disabled={logging_in}>
								{logging_in ? '...' : t.partner_login_submit}
							</button>
						</div>
						{#if login_error}
							<p class="error-text">{t.partner_login_error}</p>
						{/if}
					</form>
				</div>

				<hr class="divider" />

				<!-- Signup -->
				<p class="intro">{t.partner_intro}</p>

				<div class="benefits">
					<div class="benefit">
						<span class="benefit-icon">40%</span>
						<p>{t.partner_benefit_1}</p>
					</div>
					<div class="benefit">
						<span class="benefit-icon">20%</span>
						<p>{t.partner_benefit_2}</p>
					</div>
					<div class="benefit">
						<svg class="benefit-svg" viewBox="0 0 24 24" fill="none" stroke="#e94560" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/><line x1="2" y1="22" x2="22" y2="22" stroke-opacity="0.3"/></svg>
						<p>{t.partner_benefit_3}</p>
					</div>
				</div>

				<h2>{t.partner_form_title}</h2>

				{#if submitted}
					<div class="success-box">
						<p>{t.partner_success}</p>
					</div>
				{:else}
					<form onsubmit={handle_submit}>
						<div class="form-row">
							<div class="form-group">
								<label for="name">{t.partner_label_name}</label>
								<input type="text" id="name" bind:value={name} placeholder={t.partner_placeholder_name} required />
							</div>
							<div class="form-group">
								<label for="email">{t.partner_label_email}</label>
								<input type="email" id="email" bind:value={email} placeholder={t.partner_placeholder_email} required />
							</div>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="phone">{t.partner_label_phone}</label>
								<input type="tel" id="phone" bind:value={phone} placeholder={t.partner_placeholder_phone} required />
							</div>
							<div class="form-group">
								<label for="company">{t.partner_label_company}</label>
								<input type="text" id="company" bind:value={company} placeholder={t.partner_placeholder_company} />
							</div>
						</div>

						{#if error}
							<p class="error-text">{t.partner_error}</p>
						{/if}

						<button type="submit" disabled={submitting}>
							{submitting ? t.partner_submitting : t.partner_submit}
						</button>
					</form>
				{/if}
			{/if}
		</div>
	</section>

	<footer>
		<div class="container">
			<p>&copy; {new Date().getFullYear()} NEQ Renewal. {t.footer_rights}</p>
		</div>
	</footer>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		color: #1a1a2e;
		background: #fafafa;
		line-height: 1.6;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.legal-header {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		color: white;
		padding: 3rem 0 3rem;
	}

	.back-link {
		display: inline-block;
		color: #b0b0c8;
		text-decoration: none;
		font-size: 0.95rem;
		margin-bottom: 1.5rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #e94560;
	}

	.legal-header h1 {
		font-size: 2.2rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
	}

	.legal-content {
		padding: 3rem 0 4rem;
		background: white;
	}

	.intro {
		font-size: 1.05rem;
		color: #444;
		margin-bottom: 2rem;
		line-height: 1.8;
	}

	.benefits {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.benefit {
		text-align: center;
		padding: 1.5rem 1rem;
		background: #f5f5f7;
		border-radius: 12px;
		border: 1px solid #e8e8ea;
	}

	.benefit-icon {
		display: block;
		font-size: 1.8rem;
		font-weight: 800;
		color: #e94560;
		margin-bottom: 0.75rem;
	}

	.benefit-svg {
		width: 40px;
		height: 40px;
		margin-bottom: 0.75rem;
	}

	.benefit p {
		color: #444;
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0;
	}

	h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: #1a1a2e;
		margin-top: 0;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #f0f0f0;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.form-group {
		margin-bottom: 0;
	}

	label {
		display: block;
		font-weight: 600;
		font-size: 0.95rem;
		color: #1a1a2e;
		margin-bottom: 0.4rem;
	}

	input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		transition: border-color 0.2s;
		background: #fafafa;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #0f3460;
		background: white;
	}

	button {
		background: linear-gradient(135deg, #e94560, #c73650);
		color: white;
		border: none;
		padding: 0.9rem 2.5rem;
		font-size: 1rem;
		font-weight: 700;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		margin-top: 0.5rem;
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success-box {
		background: #f0fdf4;
		border-left: 4px solid #22c55e;
		padding: 1.25rem 1.5rem;
		border-radius: 0 8px 8px 0;
	}

	.success-box p {
		color: #166534;
		margin: 0;
	}

	.error-text {
		color: #e94560;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.login-section {
		background: #f5f5f7;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.login-section h2 {
		margin-top: 0;
		border-bottom: none;
		padding-bottom: 0;
	}

	.login-form {
		margin-top: 0.75rem;
	}

	.login-row {
		display: flex;
		gap: 0.5rem;
	}

	.login-row input {
		flex: 1;
	}

	.login-row button {
		white-space: nowrap;
		background: linear-gradient(135deg, #0f3460, #16213e);
	}

	.divider {
		border: none;
		border-top: 2px solid #f0f0f0;
		margin: 2.5rem 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: #f5f5f7;
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
	}

	.stat-card.highlight {
		background: linear-gradient(135deg, #0f3460, #16213e);
		color: white;
	}

	.stat-value {
		display: block;
		font-size: 1.8rem;
		font-weight: 800;
	}

	.stat-label {
		display: block;
		font-size: 0.85rem;
		color: #666;
		margin-top: 0.3rem;
	}

	.stat-card.highlight .stat-label {
		color: #b0b0c8;
	}

	.section-card {
		background: #f5f5f7;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.section-card h2 {
		margin-top: 0;
		font-size: 1.1rem;
		border-bottom: 2px solid #e8e8ea;
	}

	.section-desc {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.share-row {
		display: flex;
		gap: 0.5rem;
	}

	.share-input {
		flex: 1;
		background: white;
		color: #0f3460;
		font-weight: 600;
		font-size: 0.85rem;
	}

	.copy-btn {
		background: linear-gradient(135deg, #0f3460, #16213e);
		white-space: nowrap;
	}

	.reserve-form {
		margin-bottom: 1rem;
	}

	.reserve-row {
		display: flex;
		gap: 0.5rem;
	}

	.reserve-row input {
		flex: 1;
	}

	.reserve-row button {
		white-space: nowrap;
		background: linear-gradient(135deg, #0f3460, #16213e);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
		font-size: 0.9rem;
	}

	th {
		text-align: left;
		padding: 0.5rem;
		border-bottom: 2px solid #e0e0e0;
		color: #666;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	td {
		padding: 0.5rem;
		border-bottom: 1px solid #eee;
	}

	.amount {
		font-weight: 700;
		color: #16a34a;
	}

	.badge {
		display: inline-block;
		padding: 0.15rem 0.5rem;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge.pending, .badge.reserved {
		background: #fef3c7;
		color: #92400e;
	}

	.badge.paid, .badge.converted {
		background: #dcfce7;
		color: #166534;
	}

	.empty {
		color: #999;
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}

	footer {
		background: #1a1a2e;
		color: #888;
		text-align: center;
		padding: 2rem 0;
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.legal-header h1 {
			font-size: 1.7rem;
		}

		.benefits, .stats-grid {
			grid-template-columns: 1fr;
		}

		.form-row, .login-row, .share-row, .reserve-row {
			flex-direction: column;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.legal-content {
			padding: 2rem 0 3rem;
		}
	}
</style>
