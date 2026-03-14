<script lang="ts">
	import type { PageData } from './$types';
	import { get_t, type Lang } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	let lang = $derived(data.lang as Lang);
	let t = $derived(get_t(lang));
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
