<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Lang } from '$lib/i18n';

	let { children, data }: { children: any; data: LayoutData } = $props();

	let lang: Lang = $derived(data.lang);
	let other_lang: Lang = $derived(lang === 'fr' ? 'en' : 'fr');
</script>

<a href="/{other_lang}" class="lang-switcher">{other_lang.toUpperCase()}</a>

{@render children()}

<style>
	.lang-switcher {
		position: fixed;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.95);
		color: #1a1a2e;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.9rem;
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		transition: background 0.2s, color 0.2s;
	}

	.lang-switcher:hover {
		background: #e94560;
		color: white;
	}
</style>
