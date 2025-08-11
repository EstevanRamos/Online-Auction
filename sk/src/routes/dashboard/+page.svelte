<!-- src/routes/dashboard/+page.svelte -->
<script>
	import { authStore } from '$lib/stores/auth.svelte.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Redirect to login if not authenticated
	onMount(() => {
		if (!authStore.isAuthenticated) {
			goto('/login');
		}
	});

	// Mock data for dashboard - replace with real data later
	let stats = $state({
		watchedItems: 12,
		activeBids: 3,
		itemsWon: 8,
		totalSpent: 2450.00
	});

	let recentActivity = $state([
		{ type: 'bid', item: 'Vintage Camera', amount: 125.00, time: '2 hours ago' },
		{ type: 'outbid', item: 'Art Deco Lamp', amount: 85.00, time: '4 hours ago' },
		{ type: 'won', item: 'Antique Clock', amount: 220.00, time: '1 day ago' }
	]);

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
  <h1 class="dashboard-title">Welcome to your Dashboard</h1>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Watched Items</div>
      <div class="stat-value">{stats.watchedItems}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active Bids</div>
      <div class="stat-value">{stats.activeBids}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Items Won</div>
      <div class="stat-value">{stats.itemsWon}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Spent</div>
      <div class="stat-value">${stats.totalSpent.toLocaleString()}</div>
    </div>
  </div>

  <div class="activity-card">
    <h2 class="activity-title">Recent Activity</h2>
    {#if recentActivity.length > 0}
      <ul class="activity-list">
        {#each recentActivity as activity}
          <li class="activity-item">
            <span class={`activity-icon ${getActivityIcon(activity.type).color} ${getActivityIcon(activity.type).bg}`}>{getActivityIcon(activity.type).icon}</span>
            <span class="activity-content">
              <span class="activity-text">{activity.item}</span> - {activity.type === 'bid' ? 'Bid placed' : activity.type === 'outbid' ? 'You were outbid' : 'You won'} for <span class="activity-amount">${activity.amount.toFixed(2)}</span>
            </span>
            <span class="activity-time">{activity.time}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="no-activity">No recent activity.</div>
    {/if}
  </div>
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

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background-color: var(--white);
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		border-radius: 0.5rem;
		padding: 1.5rem;
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
</style>