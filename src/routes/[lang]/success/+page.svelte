<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));
	let submitting = $state(false);
	let changes_submitted = $derived(form && 'success' in form && form.success);
</script>

<svelte:head>
	<title>{t.success_page_title}</title>
</svelte:head>

<main>
	<section class="success-section">
		<div class="container">
			<div class="success-card">
				<div class="success-icon">&#10003;</div>
				<h1>{t.payment_success_title}</h1>
				<p>{t.payment_success_message}</p>

				{#if data.info_changed && !changes_submitted}
					<div class="changes-form">
						<form method="POST" use:enhance={() => {
							submitting = true;
							return async ({ update }) => {
								await update({ reset: false });
								submitting = false;
							};
						}}>
							<input type="hidden" name="airtable_record_id" value={data.airtable_record_id} />
							<label for="changes">{t.changes_label}</label>
							<textarea
								id="changes"
								name="changes"
								placeholder={t.changes_placeholder}
								rows="4"
								required
							></textarea>
							<button type="submit" class="submit-button" disabled={submitting}>
								{t.changes_submit}
							</button>
						</form>
					</div>
				{/if}

				{#if changes_submitted}
					<div class="changes-confirmed">
						<p>{t.changes_submitted}</p>
					</div>
				{/if}

				<a href="/{lang}" class="back-button">{t.back_home}</a>
			</div>
		</div>
	</section>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
		color: #1a1a2e;
		background: #fafafa;
		line-height: 1.6;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.success-section {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 0;
	}

	.success-card {
		text-align: center;
		background: white;
		padding: 3rem 2.5rem;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
	}

	.success-icon {
		width: 80px;
		height: 80px;
		background: #22c55e;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		margin: 0 auto 1.5rem;
	}

	h1 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #1a1a2e;
	}

	p {
		color: #666;
		font-size: 1.05rem;
		margin-bottom: 2rem;
	}

	.changes-form {
		text-align: left;
		margin-bottom: 2rem;
		border-top: 1px solid #eee;
		padding-top: 1.5rem;
	}

	.changes-form label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1a1a2e;
		font-size: 0.95rem;
	}

	textarea {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		background: #fafafa;
		transition: border-color 0.2s;
	}

	textarea:focus {
		outline: none;
		border-color: #0f3460;
		background: white;
	}

	.submit-button {
		width: 100%;
		padding: 0.85rem;
		background: #e94560;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		margin-top: 1rem;
	}

	.submit-button:hover:not(:disabled) {
		background: #d63851;
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.changes-confirmed p {
		color: #22c55e;
		font-weight: 600;
		background: #f0fdf4;
		padding: 1rem;
		border-radius: 8px;
	}

	.back-button {
		display: inline-block;
		background: #1a1a2e;
		color: white;
		padding: 0.85rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: background 0.2s;
	}

	.back-button:hover {
		background: #0f3460;
	}
</style>
