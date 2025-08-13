<script>
	import { goto } from '$app/navigation';
	export let auction;

	// Format date and time with error handling
	function formatDate(dateString) {
		if (!dateString) return 'TBD';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return 'TBD';
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'TBD';
		}
	}

	function formatTime(dateString) {
		if (!dateString) return 'TBD';
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return 'TBD';
			return date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		} catch (error) {
			console.error('Error formatting time:', error);
			return 'TBD';
		}
	}

	// Calculate time until auction ends
	function getTimeUntilEnd(endDate) {
		if (!endDate) return 'TBD';
		try {
			const now = new Date();
			const end = new Date(endDate);
			if (isNaN(end.getTime())) return 'TBD';
			
			const diff = end.getTime() - now.getTime();

			if (diff <= 0) return "Ended";

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

			if (days > 0) return `${days}d ${hours}h`;
			if (hours > 0) return `${hours}h ${minutes}m`;
			return `${minutes}m`;
		} catch (error) {
			console.error('Error calculating time until end:', error);
			return 'TBD';
		}
	}

	// Calculate time until auction starts
	function getTimeUntilStart(startDate) {
		if (!startDate) return 'TBD';
		try {
			const now = new Date();
			const start = new Date(startDate);
			if (isNaN(start.getTime())) return 'TBD';
			
			const diff = start.getTime() - now.getTime();

			if (diff <= 0) return "Live now";

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

			if (days > 0) return `${days}d ${hours}h`;
			return `${hours}h`;
		} catch (error) {
			console.error('Error calculating time until start:', error);
			return 'TBD';
		}
	}

	// Get auction status with fallback
	function getAuctionStatus() {
		if (!auction?.status) return 'scheduled';
		return auction.status;
	}

	// Get status display text
	function getStatusText(status) {
		switch (status) {
			case 'live': return 'Live Now';
			case 'preview': return 'Preview';
			case 'ended': return 'Ended';
			case 'cancelled': return 'Cancelled';
			default: return 'Scheduled';
		}
	}

	function handleAuctionClick() {
		// Navigate to auction details showing items for that day
		goto(`/auction/${auction.id}`);
	}

	function handleViewItems(event) {
		event.stopPropagation();
		goto(`/auction/${auction.id}`);
	}

	function handleKeydown(event) {
		const key = event.key;
		if (key === 'Enter' || key === ' ') {
			event.preventDefault();
			handleAuctionClick();
		}
	}
</script>

<div class="auction-card" role="button" tabindex="0" on:click={handleAuctionClick} on:keydown={handleKeydown}>
	<!-- Auction Image -->
	<div class="image-wrapper">
		<img src={auction?.image || '/placeholder.svg?size=wide'} alt={auction?.title || 'Auction'} class="image" />
		<div class="badge-left">
			<span class="badge badge--primary">
				{auction?.category || 'General'}
			</span>
		</div>
		<div class="badge-right">
			<span class="badge badge--background">
				{auction?.itemCount || 0} items
			</span>
		</div>
	</div>

	<!-- Auction Content -->
	<div class="content">
		<!-- Title and Description -->
		<div class="header">
			<h3 class="title">
				{auction?.title || 'Untitled Auction'}
			</h3>
			<p class="description">
				{auction?.description || 'No description available'}
			</p>
		</div>

		<!-- Auction Details -->
		<div class="details">
			<!-- Start Date and Time -->
			<div class="row">
				<div class="row-item muted">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
					<span>
						Starts: {formatDate(auction?.startDate)}
					</span>
				</div>
				<div class="row-item muted">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>
						{formatTime(auction?.startDate)}
					</span>
				</div>
			</div>

			<!-- End Date and Time -->
			<div class="row">
				<div class="row-item muted">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
					<span>
						Ends: {formatDate(auction?.endDate)}
					</span>
				</div>
				<div class="row-item muted">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>
						{formatTime(auction?.endDate)}
					</span>
				</div>
			</div>

			<!-- Stats -->
			<div class="stats">
				<div class="row-item muted">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
					</svg>
					<span>
						{auction?.bidderCount || 0} bidders
					</span>
				</div>
				<div class="row-item primary">
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
					</svg>
					<span class="stat-amount">
						{auction?.estimatedValue || 'TBD'}
					</span>
				</div>
			</div>
		</div>

		<!-- Auction Status -->
		<div class="status-section">
			<div class="status-info">
				<span class="status-label">Status:</span>
				<span class="status-value status--{getAuctionStatus()}">
					{getStatusText(getAuctionStatus())}
				</span>
			</div>
		</div>

		<!-- Time Until Start/End -->
		<div class="card-footer">
			<div class="footer-text">
				{#if getAuctionStatus() === 'live'}
					<span class="footer-label">Ends in:</span>
					<span class="footer-value">
						{getTimeUntilEnd(auction?.endDate)}
					</span>
				{:else if getAuctionStatus() === 'ended' || getAuctionStatus() === 'cancelled'}
					<span class="footer-label">Auction {getAuctionStatus() === 'cancelled' ? 'cancelled' : 'ended'}</span>
				{:else}
					<span class="footer-label">Starts in:</span>
					<span class="footer-value">
						{getTimeUntilStart(auction?.startDate)}
					</span>
				{/if}
			</div>
			<button class="view-items-btn" on:click={handleViewItems}>View Items</button>
		</div>
	</div>
</div>

<style>
  .auction-card {
    background-color: var(--white);
    border: 1px solid var(--earthy-brown);
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 300ms ease, transform 300ms ease, color 300ms ease;
  }

  .auction-card:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10);
    transform: translateY(-2px);
  }

  .image-wrapper {
    position: relative;
    overflow: hidden;
  }

  .image {
    width: 100%;
    height: 12rem; /* h-48 */
    object-fit: cover;
    transition: transform 300ms ease;
  }

  .auction-card:hover .image {
    transform: scale(1.05);
  }

  .badge-left,
  .badge-right {
    position: absolute;
    top: 1rem; /* top-4 */
  }

  .badge-left { left: 1rem; }
  .badge-right { right: 1rem; }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.5rem; /* px-2 py-1 */
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
  }

  .badge--primary {
    background-color: var(--golden-orange);
    color: var(--white);
  }

  .badge--background {
    background-color: var(--earthy-brown);
    color: var(--white);
  }

  .content {
    padding: 1.5rem; /* p-6 */
  }

  .header { margin-bottom: 1rem; }

  .title {
    font-size: 1.25rem; /* text-xl */
    font-weight: 700; /* font-bold */
    color: var(--dark-brown);
    margin-bottom: 0.5rem; /* mb-2 */
    transition: color 200ms ease;
    font-family: 'Montserrat', sans-serif;
  }

  .auction-card:hover .title { color: var(--golden-orange); }

  .description {
    font-size: 0.875rem; /* text-sm */
    color: var(--earthy-brown);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-family: 'Open Sans', sans-serif;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* gap-3 */
    margin-bottom: 1rem; /* mb-4 */
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem; /* gap-4 */
    font-size: 0.875rem; /* text-sm */
  }

  .row-item {
    display: flex;
    align-items: center;
    gap: 0.25rem; /* gap-1 */
  }

  .row-item.muted { color: var(--earthy-brown); }
  .row-item.primary { color: var(--golden-orange); }

  .icon { width: 1rem; height: 1rem; }

  .stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem; /* text-sm */
    padding: 0.75rem;
    background-color: var(--light-sand);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }

  .stat-amount { 
    font-weight: 600; 
    font-family: 'Montserrat', sans-serif;
  }

  .status-section {
    background-color: var(--light-sand);
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.75rem; /* p-3 */
    margin-bottom: 1rem; /* mb-4 */
  }

  .status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-label {
    font-size: 0.75rem; /* text-xs */
    color: var(--earthy-brown);
  }

  .status-value {
    font-size: 0.875rem; /* text-sm */
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .status--live {
    background-color: #10b981;
    color: var(--white);
  }

  .status--preview {
    background-color: var(--golden-orange);
    color: var(--white);
  }

  .status--ended {
    background-color: #6b7280;
    color: var(--white);
  }

  .status--scheduled {
    background-color: #3b82f6;
    color: var(--white);
  }

  .status--cancelled {
    background-color: #ef4444;
    color: var(--white);
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .footer-text { 
    font-size: 0.875rem; 
    font-family: 'Open Sans', sans-serif;
  }
  
  .footer-label { 
    color: var(--earthy-brown); 
    margin-right: 0.5rem;
  }
  
  .footer-value { 
    color: var(--dark-brown); 
    font-weight: 600; 
    font-family: 'Montserrat', sans-serif;
  }

  .view-items-btn {
    background-color: var(--golden-orange);
    color: var(--white);
    padding: 0.5rem 1rem; /* px-4 py-2 */
    border: none;
    border-radius: 0.5rem; /* rounded-lg */
    font-size: 0.875rem; /* text-sm */
    font-weight: 500;
    transition: background-color 200ms ease;
    cursor: pointer;
  }

  .view-items-btn:hover {
    background-color: #c27f2a;
  }
</style>
