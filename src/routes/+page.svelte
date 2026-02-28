<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);

	function get_field_error(field: string): string | undefined {
		if (!form || !('errors' in form)) return undefined;
		const match = form.errors?.find((e: { field: string; message: string }) => e.field === field);
		return match?.message;
	}
</script>

<svelte:head>
	<title>NEQ Renewal - Renouvellement de votre immatriculation</title>
	<meta name="description" content="Service de renouvellement NEQ rapide et simple. Renouvelez votre numéro d'entreprise du Québec en quelques minutes." />
</svelte:head>

<main>
	<section class="hero">
		<div class="container">
			<h1>Renouvelez votre <span class="highlight">NEQ</span> en toute simplicité</h1>
			<p class="subtitle">
				Service professionnel de renouvellement de votre immatriculation au Registraire des entreprises du Québec. Rapide, fiable et sans tracas.
			</p>
			<a href="#formulaire" class="cta-button">Commencer le renouvellement</a>
			<div class="authorized-badge">
				<img src="/Logo-Permits-Canada-Web.png" alt="Permits Canada" class="partner-logo" />
				<span>Tiers autorisé par le gouvernement du Québec via Permits Canada</span>
			</div>
		</div>
	</section>

	<section class="features">
		<div class="container">
			<div class="features-grid">
				<div class="feature-card">
					<div class="feature-icon">&#9889;</div>
					<h3>Rapide</h3>
					<p>Remplissez le formulaire en moins de 2 minutes. On s'occupe du reste.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">&#128274;</div>
					<h3>Sécuritaire</h3>
					<p>Vos informations sont protégées et traitées de manière confidentielle.</p>
				</div>
				<div class="feature-card">
					<div class="feature-icon">&#9989;</div>
					<h3>Garanti</h3>
					<p>Renouvellement complété ou remboursé. Service à 299,99 $ + taxes. Frais gouvernementaux inclus.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="formulaire" class="form-section">
		<div class="container">
			<h2>Formulaire de renouvellement</h2>
			<p class="form-intro">Remplissez les informations ci-dessous et notre équipe s'occupera de votre renouvellement.</p>

			{#if form && 'success' in form && form.success}
				<div class="success-message">
					<div class="success-icon">&#10003;</div>
					<h3>Demande envoyée avec succès!</h3>
					<p>Notre équipe traitera votre renouvellement dans les plus brefs délais. Vous recevrez une confirmation par courriel.</p>
				</div>
			{:else}
				<form method="POST" use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}>
					<div class="form-group">
						<label for="company_name">Nom de l'entreprise</label>
						<input
							type="text"
							id="company_name"
							name="company_name"
							placeholder="Ex: Les Entreprises ABC inc."
							value={form && 'values' in form ? form.values?.company_name ?? '' : ''}
							class:error={get_field_error('company_name')}
							required
						/>
						{#if get_field_error('company_name')}
							<span class="field-error">{get_field_error('company_name')}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="neq_number">Numéro NEQ</label>
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
							<label for="contact_email">Courriel</label>
							<input
								type="email"
								id="contact_email"
								name="contact_email"
								placeholder="vous@exemple.com"
								value={form && 'values' in form ? form.values?.contact_email ?? '' : ''}
								class:error={get_field_error('contact_email')}
								required
							/>
							{#if get_field_error('contact_email')}
								<span class="field-error">{get_field_error('contact_email')}</span>
							{/if}
						</div>

						<div class="form-group">
							<label for="contact_phone">Téléphone</label>
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

					<div class="pricing-note">
						<p>299,99 $ + taxes — Frais gouvernementaux inclus</p>
					</div>

					{#if get_field_error('form')}
						<div class="form-error">{get_field_error('form')}</div>
					{/if}

					<button type="submit" class="submit-button" disabled={submitting}>
						{#if submitting}
							Envoi en cours...
						{:else}
							Soumettre ma demande
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</section>

	<footer>
		<div class="container">
			<p>&copy; {new Date().getFullYear()} NEQ Renewal. Tous droits réservés.</p>
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

	.success-message {
		text-align: center;
		background: white;
		padding: 3rem 2rem;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
	}

	.success-icon {
		width: 64px;
		height: 64px;
		background: #22c55e;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		margin: 0 auto 1.5rem;
	}

	.success-message h3 {
		font-size: 1.5rem;
		margin-bottom: 0.75rem;
		color: #1a1a2e;
	}

	.success-message p {
		color: #666;
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

		form {
			padding: 1.5rem;
		}
	}
</style>
