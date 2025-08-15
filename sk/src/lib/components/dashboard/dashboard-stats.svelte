<!-- DashboardStats component -->
<script>
	// Props for stats data
	let { stats } = $props();
</script>

<div class="stats-section">
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">👁️</div>
			<div class="stat-info">
				<div class="stat-label">Watched Items</div>
				<div class="stat-value">{stats.watchedItems}</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🔨</div>
			<div class="stat-info">
				<div class="stat-label">Active Bids</div>
				<div class="stat-value">{stats.activeBids}</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🏆</div>
			<div class="stat-info">
				<div class="stat-label">Items Won</div>
				<div class="stat-value">{stats.itemsWon}</div>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">💰</div>
			<div class="stat-info">
				<div class="stat-label">Total Spent</div>
				<div class="stat-value">${stats.totalSpent.toLocaleString()}</div>
			</div>
		</div>
	</div>
</div>

<style>
	.stats-section {
		grid-row: span 1;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-card {
		background-color: var(--white);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stat-icon {
		font-size: 2rem;
		opacity: 0.8;
	}

	.stat-info {
		flex: 1;
	}

	.stat-label {
		color: var(--earthy-brown);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--dark-brown);
	}

	/* Responsive design */
	@media (max-width: 1024px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
