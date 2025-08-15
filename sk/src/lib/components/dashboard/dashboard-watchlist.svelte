<!-- DashboardWatchlist component -->
<script>
	import { userStore } from '$lib/stores/user.svelte.js';

	// Props for watchlist data
	let { watchlistItems = [], onRemoveItem } = $props();

</script>

<div class="watchlist-section">
	<div class="section-header">
		<h2 class="section-title">Your Watchlist</h2>
		<a href="/dashboard/watchlist" class="view-all-link">View All</a>
	</div>
	
	{#if watchlistItems.length > 0}
		<div class="watchlist-grid">
			{#each watchlistItems as item (item.id)}
				<div class="watchlist-item">
					<div class="item-image">
						<img src={item.image} alt={item.title} />
					</div>
					<div class="item-info">
						<h4 class="item-title">{item.title}</h4>
						<p class="current-bid">Current: ${item.currentBid}</p>
						<p class="added-time">Added {item.addedTime}</p>
					</div>
					<div class="item-actions">
						<a href="/auction/{item.auctionId}/item/{item.itemId}" class="view-btn">View</a>
						<button 
							onclick={() => userStore.removeFromWatchlist(item.itemId)} 
							class="remove-btn" 
							title="Remove from watchlist"
							aria-label="Remove from watchlist"
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-watchlist">
			<svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>
			<h3>No items in your watchlist</h3>
			<p>Browse auctions and add items you're interested in</p>
			<a href="/auction" class="browse-btn">Browse Auctions</a>
		</div>
	{/if}
</div>

<style>
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--dark-brown);
		margin: 0;
	}

	.view-all-link {
		color: var(--desert-red);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.watchlist-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
		grid-column: span 2;
	}

	.watchlist-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.watchlist-item {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid #eee;
		border-radius: 8px;
		transition: box-shadow 0.2s;
	}

	.watchlist-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.item-image {
		width: 80px;
		height: 80px;
		border-radius: 6px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-info {
		flex: 1;
		min-width: 0;
	}

	.item-title {
		font-size: 1rem;
		font-weight: 600;
		color: #333;
		margin: 0 0 0.5rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.current-bid {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--desert-red);
		margin: 0 0 0.25rem 0;
	}

	.added-time {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
	}

	.item-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.view-btn {
		padding: 0.5rem 1rem;
		background: var(--desert-red);
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.remove-btn {
		background: none;
		border: 1px solid #ddd;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		color: #666;
		transition: all 0.2s;
	}

	.remove-btn:hover {
		background: #fee;
		border-color: #fcc;
		color: #c33;
	}

	.remove-btn svg {
		width: 16px;
		height: 16px;
	}

	.empty-watchlist {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
		opacity: 0.5;
	}

	.empty-watchlist h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.empty-watchlist p {
		margin: 0 0 1.5rem 0;
	}

	.browse-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--desert-red);
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
	}

	.browse-btn:hover {
		background: #b84a4a;
	}

	/* Responsive design */
	@media (max-width: 1024px) {
		.watchlist-section {
			grid-column: span 1;
		}
	}

	@media (max-width: 768px) {
		.watchlist-grid {
			grid-template-columns: 1fr;
		}

		.watchlist-item {
			flex-direction: column;
			text-align: center;
		}

		.item-actions {
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
	}
</style>
