<!-- src/routes/dashboard/+page.svelte -->
<script>
	import { userStore } from '$lib/stores/user.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import UserProfileCard from '$lib/components/user-profile-card.svelte';
	import { pb } from '$lib/pocketbase.js';
	import { timeAgo } from '$lib/utils/datetime.js';

	// Redirect to login if not authenticated
	onMount(async () => {
		if (!userStore.isAuthenticated) {
			goto('/login');
			return;
		}
		
		// Load real dashboard data
		await loadDashboardData();
	});

	// Dashboard data
	let stats = $state({
		watchedItems: 0,
		activeBids: 0,
		itemsWon: 0,
		totalSpent: 0
	});

	let recentActivity = $state([]);
	let watchlistItems = $state([]);
	let loading = $state(true);
	let error = $state(null);

	// Load dashboard data
	async function loadDashboardData() {
		try {
			loading = true;
			error = null;

			if (!userStore.user?.id) {
				throw new Error('User not found');
			}

			const userId = userStore.user.id;

			// Load watchlist count
			const watchlistResponse = await pb.collection('watchlist').getList(1, 1, {
				filter: `user_id="${userId}"`,
				totalItems: true
			});
			stats.watchedItems = watchlistResponse.totalItems;

			// Load active bids
			const activeBidsResponse = await pb.collection('bids').getList(1, 1, {
				filter: `user_id="${userId}" && is_winning=true`,
				totalItems: true
			});
			stats.activeBids = activeBidsResponse.totalItems;

			// Load recent activity (recent bids)
			const recentBidsResponse = await pb.collection('bids').getList(1, 10, {
				filter: `user_id="${userId}"`,
				sort: '-created',
				expand: 'item_id'
			});

			recentActivity = recentBidsResponse.items.map(bid => ({
				type: bid.is_winning ? 'bid' : 'outbid',
				item: bid.expand?.item_id?.title || 'Unknown Item',
				amount: bid.amount,
				time: timeAgo(bid.created),
				id: bid.id
			}));

			// Load recent watchlist items
			const watchlistResponse2 = await pb.collection('watchlist').getList(1, 5, {
				filter: `user_id="${userId}"`,
				sort: '-created',
				expand: 'item_id'
			});

			watchlistItems = watchlistResponse2.items.map(item => ({
				id: item.id,
				itemId: item.item_id,
				title: item.expand?.item_id?.title || 'Unknown Item',
				currentBid: item.expand?.item_id?.current_bid || 0,
				image: item.expand?.item_id?.images?.[0] || '/placeholder.svg',
				addedTime: timeAgo(item.created)
			}));

		} catch (err) {
			console.error('Error loading dashboard data:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	// Remove item from watchlist
	async function removeFromWatchlist(watchlistId) {
		try {
			await pb.collection('watchlist').delete(watchlistId);
			
			// Update local state
			watchlistItems = watchlistItems.filter(item => item.id !== watchlistId);
			stats.watchedItems = Math.max(0, stats.watchedItems - 1);
		} catch (err) {
			console.error('Error removing from watchlist:', err);
		}
	}

	function getActivityIcon(type) {
		switch (type) {
			case 'bid':
				return { icon: '💰', color: 'text-blue-600', bg: 'bg-blue-100' };
			case 'outbid':
				return { icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-100' };
			case 'won':
				return { icon: '🎉', color: 'text-green-600', bg: 'bg-green-100' };
			default:
				return { icon: '📝', color: 'text-gray-600', bg: 'bg-gray-100' };
		}
	}
</script>

<svelte:head>
	<title>Dashboard - Auction Platform</title>
</svelte:head>

<div class="dashboard-container">
  <div class="dashboard-header">
    <h1 class="dashboard-title">Welcome to your Dashboard</h1>
    {#if !loading}
      <p class="dashboard-subtitle">Track your bids, manage your watchlist, and monitor your auction activity</p>
    {/if}
  </div>

  {#if loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p>Error loading dashboard: {error}</p>
      <button onclick={loadDashboardData} class="retry-btn">Try Again</button>
    </div>
  {:else}
    <div class="dashboard-grid">
      <!-- User Profile Section -->
      <div class="profile-section">
        <UserProfileCard />
      </div>

      <!-- Stats Section -->
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

      <!-- Watchlist Section -->
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
                  <a href="/auction/item/{item.itemId}" class="view-btn">View</a>
                  <button onclick={() => removeFromWatchlist(item.id)} class="remove-btn" title="Remove from watchlist">
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

      <!-- Recent Activity Section -->
      <div class="activity-section">
        <div class="activity-card">
          <h2 class="activity-title">Recent Activity</h2>
          {#if recentActivity.length > 0}
            <ul class="activity-list">
              {#each recentActivity as activity (activity.id)}
                <li class="activity-item">
                  <span class={`activity-icon ${getActivityIcon(activity.type).color} ${getActivityIcon(activity.type).bg}`}>
                    {getActivityIcon(activity.type).icon}
                  </span>
                  <span class="activity-content">
                    <span class="activity-text">{activity.item}</span> - 
                    {activity.type === 'bid' ? 'Bid placed' : 'You were outbid'} for 
                    <span class="activity-amount">${activity.amount.toFixed(2)}</span>
                  </span>
                  <span class="activity-time">{activity.time}</span>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="no-activity">
              <p>No recent bidding activity</p>
              <a href="/auction" class="browse-btn">Start Bidding</a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
	.dashboard-container {
		max-width: 64rem;
		margin: 2rem auto 0;
		padding: 0 1rem;
	}

	.dashboard-title {
		font-size: 1.875rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: var(--dark-brown);
		font-family: 'Montserrat', sans-serif;
	}

	.dashboard-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.dashboard-subtitle {
		color: var(--earthy-brown);
		font-size: 1.1rem;
		margin-top: 0.5rem;
	}

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

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.profile-section {
		grid-row: span 1;
	}

	.stats-section {
		grid-row: span 1;
	}

	.watchlist-section, .activity-section {
		grid-column: span 2;
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

	.activity-card {
		background-color: var(--white);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.activity-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--dark-brown);
	}

	.activity-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.activity-item {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.activity-item:last-child {
		margin-bottom: 0;
	}

	.activity-icon {
		margin-right: 0.75rem;
		border-radius: 9999px;
		padding: 0.25rem 0.5rem;
		font-size: 1.125rem;
	}

	.activity-content {
		flex: 1;
		color: var(--dark-brown);
	}

	.activity-text {
		font-weight: 500;
	}

	.activity-amount {
		font-weight: 600;
	}

	.activity-time {
		color: var(--earthy-brown);
		font-size: 0.875rem;
		margin-left: 1rem;
	}

	.no-activity {
		color: var(--earthy-brown);
	}

	/* Activity icon colors */
	.text-blue-600 {
		color: #2563eb;
	}

	.bg-blue-100 {
		background-color: #dbeafe;
	}

	.text-yellow-600 {
		color: #d97706;
	}

	.bg-yellow-100 {
		background-color: #fef3c7;
	}

	.text-green-600 {
		color: #059669;
	}

	.bg-green-100 {
		background-color: #d1fae5;
	}

	.text-gray-600 {
		color: #4b5563;
	}

	.bg-gray-100 {
		background-color: #f3f4f6;
	}

	/* New dashboard sections */
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

	.watchlist-section, .activity-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
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
		.dashboard-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.watchlist-section, .activity-section {
			grid-column: span 1;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

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

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>