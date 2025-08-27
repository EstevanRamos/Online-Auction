<!-- src/routes/dashboard/+page.svelte -->
<script>
	import { userStore} from '$lib/stores/user.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import UserProfileCard from '$lib/components/user-profile-card.svelte';
	import DashboardStats from '$lib/components/dashboard/dashboard-stats.svelte';
	import DashboardWatchlist from '$lib/components/dashboard/dashboard-watchlist.svelte';
	import DashboardActivity from '$lib/components/dashboard/dashboard-activity.svelte';
	import DashboardLoading from '$lib/components/dashboard/dashboard-loading.svelte';
	import { pb } from '$lib/pocketbase.js';
	import { timeAgo } from '$lib/utils/datetime.js';
    import { page } from '$app/state';

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
				filter: `user="${userId}"`,
				totalItems: true
			});
			stats.watchedItems = watchlistResponse.totalItems;

			// Load active bids
			const activeBidsResponse = await pb.collection('bids').getList(1, 1, {
				filter: `bidder="${userId}" && is_winning=true`,
				totalItems: true
			});
			stats.activeBids = activeBidsResponse.totalItems;

			// Load recent activity (recent bids)
			const recentBidsResponse = await pb.collection('bids').getList(1, 10, {
				filter: `bidder="${userId}"`,
				sort: '-created',
				expand: 'item'
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
				filter: `user="${userId}"`,
				sort: '-created',
				expand: 'item'
			});
			console.log('Watchlist response:', watchlistResponse2);

			watchlistItems = watchlistResponse2.items.map(item => ({
				id: item.id,
				itemId: item.item,
				title: item.expand?.item?.title || 'Unknown Item',
				currentBid: item.expand?.item?.current_highest_bid || 0,
				image: item.expand?.item?.images?.[0] || '/placeholder.svg',
				addedTime: timeAgo(item.created),
				auctionId: item.expand?.item?.auction
			}));

		} catch (err) {
			console.error('Error loading dashboard data:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	// Handler for removing items from watchlist
	function handleWatchlistRemove(watchlistId) {
		watchlistItems = watchlistItems.filter(item => item.id !== watchlistId);
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

  <!-- Loading and Error States -->
  <DashboardLoading {loading} {error} onRetry={loadDashboardData} />

  {#if !loading && !error}
    <div class="dashboard-grid">
      <!-- User Profile Section -->
      <div class="profile-section">
        <UserProfileCard />
      </div>

      <!-- Stats Section -->
      <DashboardStats {stats} />

      <!-- Watchlist Section -->
      <DashboardWatchlist {watchlistItems} onRemoveItem={handleWatchlistRemove} />

      <!-- Recent Activity Section -->
      <DashboardActivity {recentActivity} />
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

	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.profile-section {
		grid-row: span 1;
	}

	/* Responsive design */
	@media (max-width: 1024px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>