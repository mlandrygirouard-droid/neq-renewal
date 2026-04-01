<script lang="ts">
	import type { PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));

	let neq_number = $state('');
	let email = $state('');
	let searching = $state(false);
	let searched = $state(false);
	let canceling = $state(false);
	let cancel_success = $state(false);

	type RenewalRecord = {
		id: string;
		company_name: string;
		neq_number: string;
		email: string;
		qb_invoice_id?: string;
	};

	type SubscriptionData = {
		id: string;
		status: string;
		cancel_at_period_end: boolean;
		current_period_end: number;
		created: number;
	};

	let records = $state<RenewalRecord[]>([]);
	let subscriptions = $state<SubscriptionData[]>([]);

	async function handle_lookup(e: Event) {
		e.preventDefault();
		searching = true;
		searched = false;
		cancel_success = false;

		try {
			const response = await fetch('/api/my-renewal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ neq_number: neq_number.trim(), email: email.trim().toLowerCase() })
			});
			const data = await response.json();
			records = data.records || [];
			subscriptions = data.subscriptions || [];
		} catch {
			records = [];
			subscriptions = [];
		} finally {
			searching = false;
			searched = true;
		}
	}

	async function handle_cancel(sub_id: string) {
		if (!confirm(t.renewal_cancel_confirm)) return;
		canceling = true;

		try {
			const response = await fetch('/api/my-renewal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'cancel', subscription_id: sub_id })
			});
			if (response.ok) {
				cancel_success = true;
				const sub = subscriptions.find((s) => s.id === sub_id);
				if (sub) sub.cancel_at_period_end = true;
			}
		} finally {
			canceling = false;
		}
	}

	function format_date(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function get_status_label(sub: SubscriptionData): string {
		if (sub.cancel_at_period_end) return t.renewal_status_canceled;
		if (sub.status === 'active') return t.renewal_status_active;
		return sub.status;
	}
</script>

<svelte:head>
	<title>{t.renewal_page_title}</title>
	<meta name="description" content={t.renewal_intro} />
	<link rel="canonical" href="https://neqrenewal.com/{lang}/my-renewal" />
</svelte:head>

<main>
	<section class="legal-header">
		<div class="container">
			<a href="/{lang}" class="back-link">&larr; {t.back_home}</a>
			<h1>{t.renewal_title}</h1>
		</div>
	</section>

	<section class="legal-content">
		<div class="container">
			<p class="intro">{t.renewal_intro}</p>

			<form onsubmit={handle_lookup} class="lookup-form">
				<div class="form-group">
					<label for="neq">{t.renewal_label_neq}</label>
					<input type="text" id="neq" bind:value={neq_number} placeholder="1234567890" required />
				</div>
				<div class="form-group">
					<label for="email">{t.renewal_label_email}</label>
					<input type="email" id="email" bind:value={email} placeholder={lang === 'fr' ? 'vous@exemple.com' : 'you@example.com'} required />
				</div>
				<button type="submit" disabled={searching}>
					{searching ? t.renewal_searching : t.renewal_submit}
				</button>
			</form>

			{#if searched && records.length === 0}
				<div class="no-results">
					<p>{t.renewal_no_results}</p>
					<a href="/{lang}" class="renew-link">{t.renewal_renew_again}</a>
				</div>
			{/if}

			{#if records.length > 0}
				<div class="results">
					<div class="info-card">
						<div class="info-row">
							<span class="info-label">{t.renewal_company}</span>
							<span class="info-value">{records[0].company_name}</span>
						</div>
						<div class="info-row">
							<span class="info-label">{t.renewal_neq}</span>
							<span class="info-value">{records[0].neq_number}</span>
						</div>
					</div>

					{#if subscriptions.length > 0}
						{#each subscriptions as sub}
							<div class="subscription-card">
								<div class="info-row">
									<span class="info-label">{t.renewal_plan}</span>
									<span class="info-value">{t.renewal_plan_annual}</span>
								</div>
								<div class="info-row">
									<span class="info-label">{t.renewal_status}</span>
									<span class="info-value status" class:active={sub.status === 'active' && !sub.cancel_at_period_end} class:canceled={sub.cancel_at_period_end}>
										{get_status_label(sub)}
									</span>
								</div>
								<div class="info-row">
									<span class="info-label">{t.renewal_next_renewal}</span>
									<span class="info-value">{format_date(sub.current_period_end)}</span>
								</div>

								{#if cancel_success}
									<div class="success-box">
										<p>{t.renewal_canceled_success}</p>
									</div>
								{/if}

								{#if sub.status === 'active' && !sub.cancel_at_period_end}
									<button class="cancel-btn" onclick={() => handle_cancel(sub.id)} disabled={canceling}>
										{t.renewal_cancel_sub}
									</button>
								{/if}
							</div>
						{/each}
					{:else}
						<div class="subscription-card">
							<div class="info-row">
								<span class="info-label">{t.renewal_plan}</span>
								<span class="info-value">{t.renewal_plan_onetime}</span>
							</div>
							<div class="info-row">
								<span class="info-label">{t.renewal_status}</span>
								<span class="info-value status active">{t.renewal_status_completed}</span>
							</div>
							<a href="/{lang}" class="renew-link">{t.renewal_renew_again}</a>
						</div>
					{/if}
				</div>
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

	.lookup-form {
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
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
	}

	input:focus {
		outline: none;
		border-color: #0f3460;
		background: white;
	}

	button {
		background: linear-gradient(135deg, #0f3460, #16213e);
		color: white;
		border: none;
		padding: 0.9rem 2.5rem;
		font-size: 1rem;
		font-weight: 700;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(15, 52, 96, 0.3);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.no-results {
		background: #fef3c7;
		border-left: 4px solid #f59e0b;
		padding: 1.25rem 1.5rem;
		border-radius: 0 8px 8px 0;
		margin-top: 1rem;
	}

	.no-results p {
		color: #92400e;
		margin: 0 0 1rem 0;
	}

	.results {
		margin-top: 2rem;
	}

	.info-card, .subscription-card {
		background: #f5f5f7;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.subscription-card {
		border-left: 4px solid #0f3460;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.6rem 0;
		border-bottom: 1px solid #e8e8ea;
	}

	.info-row:last-of-type {
		border-bottom: none;
	}

	.info-label {
		font-weight: 600;
		color: #666;
		font-size: 0.9rem;
	}

	.info-value {
		font-weight: 600;
		color: #1a1a2e;
		font-size: 0.95rem;
	}

	.status.active {
		color: #16a34a;
	}

	.status.canceled {
		color: #dc2626;
	}

	.cancel-btn {
		margin-top: 1.25rem;
		background: white;
		color: #dc2626;
		border: 2px solid #dc2626;
		padding: 0.6rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.cancel-btn:hover:not(:disabled) {
		background: #dc2626;
		color: white;
	}

	.success-box {
		background: #f0fdf4;
		border-left: 4px solid #22c55e;
		padding: 1rem 1.25rem;
		border-radius: 0 8px 8px 0;
		margin-top: 1rem;
	}

	.success-box p {
		color: #166534;
		margin: 0;
		font-size: 0.9rem;
	}

	.renew-link {
		display: inline-block;
		background: linear-gradient(135deg, #e94560, #c73650);
		color: white;
		text-decoration: none;
		padding: 0.7rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.9rem;
		margin-top: 1rem;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.renew-link:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
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

		.legal-content {
			padding: 2rem 0 3rem;
		}

		.info-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.2rem;
		}
	}
</style>
