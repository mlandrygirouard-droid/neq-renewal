<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';

	let { form, data }: { form: ActionData; data: PageData } = $props();
	let submitting = $state(false);
	let selected_plan = $state<'annual' | 'onetime'>('annual');
	let checkout_container: HTMLDivElement | undefined = $state();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));

	let show_checkout = $derived(form && 'client_secret' in form && form.client_secret);

	$effect(() => {
		if (show_checkout && checkout_container && form && 'client_secret' in form) {
			mount_checkout(form.client_secret as string);
		}
	});

	async function mount_checkout(client_secret: string) {
		const stripe = (window as any).Stripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
		const checkout = await stripe.initEmbeddedCheckout({ clientSecret: client_secret });
		checkout.mount(checkout_container);
	}

	function get_field_error(field: string): string | undefined {
		if (!form || !('errors' in form)) return undefined;
		const match = form.errors?.find((e: { field: string; message: string }) => e.field === field);
		return match?.message;
	}
</script>

<svelte:head>
	<title>{t.page_title}</title>
	<meta name="description" content={t.meta_description} />
	<link rel="canonical" href="https://neqrenewal.com/{lang}" />
	<link rel="alternate" hreflang="fr" href="https://neqrenewal.com/fr" />
	<link rel="alternate" hreflang="en" href="https://neqrenewal.com/en" />
	<link rel="alternate" hreflang="x-default" href="https://neqrenewal.com/fr" />
	<meta property="og:title" content={t.page_title} />
	<meta property="og:description" content={t.meta_description} />
	<meta property="og:image" content="https://neqrenewal.com/og-image.png" />
	<meta property="og:url" content="https://neqrenewal.com/{lang}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={t.page_title} />
	<meta name="twitter:description" content={t.meta_description} />
	<meta name="twitter:image" content="https://neqrenewal.com/og-image.png" />
	<script src="https://js.stripe.com/v3/"></script>
</svelte:head>

<main>
	<section class="hero">
		<div class="container">
			<h1>{t.hero_title_start}<span class="highlight">NEQ</span>{t.hero_title_end}</h1>
			<p class="subtitle">
				{t.hero_subtitle}
			</p>
			<a href="#form" class="cta-button">{t.cta_button}</a>
			<div class="authorized-badge">
				<img src="/Logo-Permits-Canada-Web.png" alt="Permits Canada" class="partner-logo" />
				<span>{t.authorized_badge}</span>
			</div>
		</div>
	</section>

	<section class="features">
		<div class="container">
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">&#9889;</div>
					<h3>{t.feature_fast_title}</h3>
					<p>{t.feature_fast_desc}</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">&#128274;</div>
					<h3>{t.feature_secure_title}</h3>
					<p>{t.feature_secure_desc}</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">&#9989;</div>
					<h3>{t.feature_guaranteed_title}</h3>
					<p>{t.feature_guaranteed_desc}</p>
				</div>
			</div>
		</div>
	</section>

	<section id="form" class="form-section">
		<div class="container">
			<h2>{t.form_title}</h2>
			<p class="form-intro">{t.form_intro}</p>

			{#if show_checkout}
				<div class="checkout-wrapper">
					<div bind:this={checkout_container}></div>
				</div>
			{:else}
				<form method="POST" use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update({ reset: false });
						submitting = false;
					};
				}}>
					<div class="form-group">
						<label for="company_name">{t.label_company_name}</label>
						<input
							type="text"
							id="company_name"
							name="company_name"
							placeholder={t.placeholder_company_name}
							value={form && 'values' in form ? form.values?.company_name ?? '' : ''}
							class:error={get_field_error('company_name')}
							required
						/>
						{#if get_field_error('company_name')}
							<span class="field-error">{get_field_error('company_name')}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="neq_number">{t.label_neq}</label>
						<input
							type="text"
							id="neq_number"
							name="neq_number"
							placeholder="1234567890"
							maxlength="10"
							value={form && 'values' in form ? form.values?.neq_number ?? '' : ''}
							class:error={get_field_error('neq_number')}
							required
						/>
						{#if get_field_error('neq_number')}
							<span class="field-error">{get_field_error('neq_number')}</span>
						{/if}
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="contact_email">{t.label_email}</label>
							<input
								type="email"
								id="contact_email"
								name="contact_email"
								placeholder={t.placeholder_email}
								value={form && 'values' in form ? form.values?.contact_email ?? '' : ''}
								class:error={get_field_error('contact_email')}
								required
							/>
							{#if get_field_error('contact_email')}
								<span class="field-error">{get_field_error('contact_email')}</span>
							{/if}
						</div>

						<div class="form-group">
							<label for="contact_phone">{t.label_phone}</label>
							<input
								type="tel"
								id="contact_phone"
								name="contact_phone"
								placeholder="(514) 555-1234"
								value={form && 'values' in form ? form.values?.contact_phone ?? '' : ''}
								class:error={get_field_error('contact_phone')}
								required
							/>
							{#if get_field_error('contact_phone')}
								<span class="field-error">{get_field_error('contact_phone')}</span>
							{/if}
						</div>
					</div>

					<input type="hidden" name="plan" value={selected_plan} />

					<div class="plan-selector">
						<p class="plan-title">{t.plan_title}</p>
						<div class="plan-options">
							<label class="plan-option" class:selected={selected_plan === 'annual'}>
								<input type="radio" name="plan_toggle" value="annual" bind:group={selected_plan} />
								<div class="plan-content">
									<div class="plan-header">
										<span class="plan-label">{t.plan_annual_label}</span>
										<span class="plan-badge">{t.plan_best_value}</span>
									</div>
									<span class="plan-price">{t.plan_annual_price}</span>
									<span class="plan-desc">{t.plan_annual_desc}</span>
								</div>
							</label>
							<label class="plan-option" class:selected={selected_plan === 'onetime'}>
								<input type="radio" name="plan_toggle" value="onetime" bind:group={selected_plan} />
								<div class="plan-content">
									<div class="plan-header">
										<span class="plan-label">{t.plan_onetime_label}</span>
									</div>
									<span class="plan-price">{t.plan_onetime_price}</span>
									<span class="plan-desc">{t.plan_onetime_desc}</span>
								</div>
							</label>
						</div>
					</div>

					<div class="pricing-note">
						<p>{t.pricing_note}</p>
					</div>

					{#if get_field_error('form')}
						<div class="form-error">{get_field_error('form')}</div>
					{/if}

					<button type="submit" class="submit-button" disabled={submitting}>
						{#if submitting}
							{t.submitting_text}
						{:else}
							{t.submit_button}
						{/if}
					</button>
				</form>
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
	:global(*, *::before, *::after) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

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

	.hero {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		color: white;
		padding: 6rem 0 5rem;
		text-align: center;
	}

	.hero h1 {
		font-size: 2.8rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 1.5rem;
	}

	.highlight {
		color: #e94560;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #b0b0c8;
		max-width: 550px;
		margin: 0 auto 2.5rem;
	}

	.cta-button {
		display: inline-block;
		background: #e94560;
		color: white;
		padding: 1rem 2.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		transition: background 0.2s, transform 0.2s;
	}

	.cta-button:hover {
		background: #d63851;
		transform: translateY(-2px);
	}

	.authorized-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.25rem;
		margin-top: 3rem;
		padding: 1.25rem 2rem;
		background: white;
		border-radius: 12px;
		max-width: 550px;
		margin-left: auto;
		margin-right: auto;
	}

	.partner-logo {
		height: 60px;
		width: auto;
	}

	.authorized-badge span {
		font-size: 1rem;
		color: #1a1a2e;
		text-align: left;
		font-weight: 500;
	}

	.plan-selector {
		margin-bottom: 1.5rem;
	}

	.plan-title {
		font-weight: 600;
		color: #1a1a2e;
		font-size: 0.95rem;
		margin-bottom: 0.75rem;
	}

	.plan-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.plan-option {
		position: relative;
		border: 2px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.25rem;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}

	.plan-option:hover {
		border-color: #b0b0c8;
	}

	.plan-option.selected {
		border-color: #0f3460;
		background: #f0f4ff;
	}

	.plan-option input[type='radio'] {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.plan-content {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.plan-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.plan-label {
		font-weight: 600;
		color: #1a1a2e;
		font-size: 0.95rem;
	}

	.plan-badge {
		background: #e94560;
		color: white;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.plan-price {
		font-size: 1.3rem;
		font-weight: 700;
		color: #0f3460;
	}

	.plan-desc {
		font-size: 0.8rem;
		color: #666;
	}

	.pricing-note {
		background: #f0f4ff;
		border: 1px solid #d0daf0;
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.pricing-note p {
		color: #1a1a2e;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.features {
		padding: 5rem 0;
		background: white;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	.feature-card {
		text-align: center;
		padding: 2rem 1.5rem;
		border-radius: 12px;
		border: 1px solid #eee;
	}

	.feature-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		color: #1a1a2e;
	}

	.feature-card p {
		color: #666;
		font-size: 0.95rem;
	}

	.form-section {
		padding: 5rem 0;
		background: #f5f5f7;
	}

	.form-section h2 {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: #1a1a2e;
	}

	.form-intro {
		text-align: center;
		color: #666;
		margin-bottom: 2.5rem;
	}

	form {
		background: white;
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
	}

	.checkout-wrapper {
		background: white;
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
		min-height: 400px;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1a1a2e;
		font-size: 0.95rem;
	}

	input[type='text'],
	input[type='email'],
	input[type='tel'] {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
		background: #fafafa;
	}

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='tel']:focus {
		outline: none;
		border-color: #0f3460;
		background: white;
	}

	input.error {
		border-color: #e94560;
	}

	.field-error {
		display: block;
		color: #e94560;
		font-size: 0.85rem;
		margin-top: 0.35rem;
	}

	.form-error {
		background: #fff0f0;
		color: #e94560;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background: #e94560;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s, transform 0.2s;
		margin-top: 0.5rem;
	}

	.submit-button:hover:not(:disabled) {
		background: #d63851;
		transform: translateY(-1px);
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	footer {
		background: #1a1a2e;
		color: #888;
		text-align: center;
		padding: 2rem 0;
		font-size: 0.9rem;
	}

	@media (max-width: 640px) {
		.hero h1 {
			font-size: 2rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.plan-options {
			grid-template-columns: 1fr;
		}

		form {
			padding: 1.5rem;
		}

		.checkout-wrapper {
			padding: 1.5rem;
		}
	}
</style>
