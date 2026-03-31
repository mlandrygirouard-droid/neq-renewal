<script lang="ts">
	import type { PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));
</script>

<svelte:head>
	<title>{t.terms_page_title}</title>
	<meta name="description" content={t.terms_title} />
	<link rel="canonical" href="https://neqrenewal.com/{lang}/terms" />
</svelte:head>

<main>
	<section class="legal-header">
		<div class="container">
			<a href="/{lang}" class="back-link">&larr; {t.back_home}</a>
			<h1>{t.terms_title}</h1>
			<p class="last-updated">{t.terms_last_updated}</p>
		</div>
	</section>

	<section class="legal-content">
		<div class="container">
			<p class="intro">{t.terms_intro}</p>

			<h2>{t.terms_section_service_title}</h2>
			{#each t.terms_section_service_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_pricing_title}</h2>
			{#each t.terms_section_pricing_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_payment_title}</h2>
			{#each t.terms_section_payment_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_refund_title}</h2>
			{#each t.terms_section_refund_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_guarantee_title}</h2>
			<p>{t.terms_section_guarantee_text}</p>

			<h2>{t.terms_section_liability_title}</h2>
			{#each t.terms_section_liability_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_user_responsibilities_title}</h2>
			{#each t.terms_section_user_responsibilities_text.split('\n') as line}
				{#if line.startsWith('- ')}
					<ul><li>{line.slice(2)}</li></ul>
				{:else if line}
					<p>{line}</p>
				{/if}
			{/each}

			<h2>{t.terms_section_modifications_title}</h2>
			<p>{t.terms_section_modifications_text}</p>

			<h2>{t.terms_section_governing_law_title}</h2>
			<p>{t.terms_section_governing_law_text}</p>

			<h2>{t.terms_section_contact_title}</h2>
			<div class="contact-info">
				{#each t.terms_section_contact_text.split('\n') as line}
					{#if line}<p>{line}</p>{/if}
				{/each}
			</div>
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

	.last-updated {
		color: #b0b0c8;
		font-size: 0.95rem;
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

	h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: #1a1a2e;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #f0f0f0;
	}

	p {
		color: #444;
		font-size: 0.98rem;
		margin-bottom: 0.75rem;
		line-height: 1.75;
	}

	ul {
		margin: 0 0 0.25rem 0;
		padding-left: 1.5rem;
	}

	li {
		color: #444;
		font-size: 0.98rem;
		line-height: 1.75;
		margin-bottom: 0.25rem;
	}

	.contact-info {
		background: #f5f5f7;
		border-left: 4px solid #e94560;
		padding: 1.25rem 1.5rem;
		border-radius: 0 8px 8px 0;
		margin-top: 1rem;
	}

	.contact-info p {
		margin: 0.15rem 0;
		font-size: 0.95rem;
		color: #1a1a2e;
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
	}
</style>
