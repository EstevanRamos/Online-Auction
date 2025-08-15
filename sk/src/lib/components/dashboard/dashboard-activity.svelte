<!-- DashboardActivity component -->
<script>
	// Props for activity data
	let { recentActivity = [] } = $props();

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

<style>
	.activity-section {
		grid-column: span 2;
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

	.browse-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--desert-red);
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		margin-top: 1rem;
	}

	.browse-btn:hover {
		background: #b84a4a;
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

	/* Responsive design */
	@media (max-width: 1024px) {
		.activity-section {
			grid-column: span 1;
		}
	}
</style>
