<!-- DashboardLoading component -->
<script>
	// Props for loading state management
	let { loading = false, error = null, onRetry } = $props();
</script>

{#if loading}
	<div class="loading-state">
		<div class="loading-spinner"></div>
		<p>Loading your dashboard...</p>
	</div>
{:else if error}
	<div class="error-state">
		<p>Error loading dashboard: {error}</p>
		{#if onRetry}
			<button onclick={onRetry} class="retry-btn">Try Again</button>
		{/if}
	</div>
{/if}

<style>
	.loading-state, .error-state {
		text-align: center;
		padding: 3rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid var(--desert-red);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	.retry-btn {
		padding: 0.75rem 1.5rem;
		background: var(--desert-red);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
	}

	.retry-btn:hover {
		background: #b84a4a;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
