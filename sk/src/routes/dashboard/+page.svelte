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

<div class="max-w-4xl mx-auto mt-8">
  <h1 class="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

  <div class="grid grid-cols-2 gap-6 mb-8">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="text-gray-500">Watched Items</div>
      <div class="text-2xl font-bold">{stats.watchedItems}</div>
    </div>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="text-gray-500">Active Bids</div>
      <div class="text-2xl font-bold">{stats.activeBids}</div>
    </div>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="text-gray-500">Items Won</div>
      <div class="text-2xl font-bold">{stats.itemsWon}</div>
    </div>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="text-gray-500">Total Spent</div>
      <div class="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
    </div>
  </div>

  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
    {#if recentActivity.length > 0}
      <ul>
        {#each recentActivity as activity}
          <li class="flex items-center mb-3 last:mb-0">
            <span class={`mr-3 rounded-full px-2 py-1 text-lg ${getActivityIcon(activity.type).color} ${getActivityIcon(activity.type).bg}`}>{getActivityIcon(activity.type).icon}</span>
            <span class="flex-1">
              <span class="font-medium">{activity.item}</span> - {activity.type === 'bid' ? 'Bid placed' : activity.type === 'outbid' ? 'You were outbid' : 'You won'} for <span class="font-semibold">${activity.amount.toFixed(2)}</span>
            </span>
            <span class="text-gray-400 text-sm ml-4">{activity.time}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-gray-500">No recent activity.</div>
    {/if}
  </div>
</div>