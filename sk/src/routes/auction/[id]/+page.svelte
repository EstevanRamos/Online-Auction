<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();

    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { formatDate, formatTime } from '$lib/utils/datetime.js';
    import WatchlistButton from '$lib/components/watchlist-button.svelte';

    // Extract data with fallbacks
    const { auction, auctionItems = [], stats = {} } = data;
    const { totalItems = 0, totalBids = 0, highestBid = 0, lowestStartingBid = 0 } = stats;

    // Check if we have data
    const hasItems = auctionItems.length > 0;
    // Date and time formatting functions now imported from utils

    // Get auction status
    function getAuctionStatus() {
        if (!auction?.status) return 'scheduled';
        return auction.status;
    }

    function getStatusText(status) {
        switch (status) {
            case 'live': return 'Live Now';
            case 'preview': return 'Preview';
            case 'ended': return 'Ended';
            case 'cancelled': return 'Cancelled';
            default: return 'Scheduled';
        }
    }

    // Navigate back to auctions list
    function goBackToAuctions() {
        goto('/auction');
    }

    // Navigate to item details
    function viewItem(itemId) {
        goto(`/auction/${auction.id}/item/${itemId}`);
    }
</script>

<svelte:head>
    <title>{auction?.title || 'Auction'} - Auction Items</title>
    <meta name="description" content="Browse auction items for {auction?.title || 'this auction'}" />
</svelte:head>

<div class="auction-items-page">
    <main class="container auction-items-main">
        <!-- Back Navigation -->
        <div class="back-navigation">
            <button class="back-btn" onclick={goBackToAuctions}>
                <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Auctions
            </button>
        </div>

        <!-- Auction Header -->
        <div class="auction-header">
            <div class="auction-header__content">
                <div class="auction-header__text">
                    <h1 class="auction-title">{auction?.title || 'Untitled Auction'}</h1>
                    <p class="auction-description">{auction?.description || 'No description available'}</p>
                    <div class="auction-meta">
                        <span class="auction-theme">{auction?.theme || 'General'}</span>
                        <span class="auction-status status--{getAuctionStatus()}">{getStatusText(getAuctionStatus())}</span>
                    </div>
                </div>

                <!-- Auction Stats -->
                <div class="auction-stats">
                    <div class="stat-item">
                        <div class="stat-value">{totalItems}</div>
                        <div class="stat-label">Total Items</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{totalBids}</div>
                        <div class="stat-label">Total Bids</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${highestBid}</div>
                        <div class="stat-label">Highest Bid</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${lowestStartingBid}</div>
                        <div class="stat-label">Starting From</div>
                    </div>
                </div>
            </div>

            <!-- Auction Image -->
            {#if auction?.featuredImage}
                <div class="auction-header__image">
                    <img src={auction.featuredImage} alt={auction.title} class="auction-image" />
                </div>
            {/if}
        </div>

        <!-- Auction Schedule -->
        <div class="auction-schedule">
            <div class="schedule-item">
                <div class="schedule-label">Start Date</div>
                <div class="schedule-value">
                    {formatDate(auction?.startDate)} at {formatTime(auction?.startDate)}
                </div>
            </div>
            <div class="schedule-item">
                <div class="schedule-label">End Date</div>
                <div class="schedule-value">
                    {formatDate(auction?.endDate)} at {formatTime(auction?.endDate)}
                </div>
            </div>
        </div>

        <!-- Items Section -->
        <div class="items-section">
            <div class="section-header">
                <h2 class="section-title">Auction Items</h2>
                <p class="section-subtitle">Browse and bid on items in this auction</p>
            </div>

            {#if hasItems}
                <div class="items-grid">
                    {#each auctionItems as item (item.id)}
                        <div class="item-card" role="button" tabindex="0" onclick={() => viewItem(item.id)} onkeydown={(e) => e.key === 'Enter' && viewItem(item.id)}>
                            <!-- Item Image -->
                            <div class="item-image-wrapper">
                                <img src={item.images[0] || '/placeholder.svg'} alt={item.title} class="item-image" />
                                <div class="item-badges">
                                    {#if item.status === 'sold'}
                                        <span class="badge badge--sold">Sold</span>
                                    {:else if item.status === 'ended'}
                                        <span class="badge badge--ended">Ended</span>
                                    {:else}
                                        <span class="badge badge--active">Active</span>
                                    {/if}
                                </div>
                                <!-- Watchlist Button -->
                                <div class="watchlist-btn-wrapper" onclick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}>
                                    <WatchlistButton 
                                        itemId={item.id}
                                        size="small"
                                        className="item-watchlist-btn"
                                    />
                                </div>
                            </div>

                            <!-- Item Content -->
                            <div class="item-content">
                                <h3 class="item-title">{item.title}</h3>
                                <p class="item-description">{item.description}</p>
                                
                                <!-- Item Details -->
                                <div class="item-details">
                                    <div class="detail-row">
                                        <span class="detail-label">Starting Bid:</span>
                                        <span class="detail-value">${item.startingBid}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Current Bid:</span>
                                        <span class="detail-value">${item.currentBid}</span>
                                    </div>
                                    {#if item.reservePrice > 0}
                                        <div class="detail-row">
                                            <span class="detail-label">Reserve:</span>
                                            <span class="detail-value">${item.reservePrice}</span>
                                        </div>
                                    {/if}
                                    <div class="detail-row">
                                        <span class="detail-label">Total Bids:</span>
                                        <span class="detail-value">{item.totalBids}</span>
                                    </div>
                                </div>

                                <!-- Item Schedule -->
                                <div class="item-schedule">
                                    <div class="schedule-mini">
                                        <span class="schedule-mini-label">Ends:</span>
                                        <span class="schedule-mini-value">{formatDate(item.endTime)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-items-message">
                    <div class="no-items-content">
                        <h3>No Items Available</h3>
                        <p>This auction doesn't have any items listed yet. Please check back later.</p>
                    </div>
                </div>
            {/if}
        </div>
    </main>
</div>

<style>
    .auction-items-page {
        background-color: var(--light-sand);
        color: var(--dark-brown);
        min-height: 100vh;
    }

    .auction-items-main {
        padding-block: var(--spacing-xl);
    }

    .back-navigation {
        margin-bottom: 2rem;
    }

    .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: var(--golden-orange);
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        cursor: pointer;
        padding: 0.5rem 0;
        transition: color 200ms ease;
    }

    .back-btn:hover {
        color: #c27f2a;
    }

    .back-icon {
        width: 1.25rem;
        height: 1.25rem;
    }

    .auction-header {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 3rem;
        padding: 2rem;
        background-color: var(--white);
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    @media (min-width: 768px) {
        .auction-header {
            flex-direction: row;
            align-items: flex-start;
        }
    }

    .auction-header__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .auction-header__text {
        flex: 1;
    }

    .auction-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 2.25rem;
        color: var(--dark-brown);
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    @media (min-width: 768px) {
        .auction-title {
            font-size: 3rem;
        }
    }

    .auction-description {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem;
        color: var(--earthy-brown);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .auction-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .auction-theme {
        background-color: var(--golden-orange);
        color: var(--white);
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 500;
    }

    .auction-status {
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--white);
    }

    .status--live { background-color: #10b981; }
    .status--preview { background-color: #3b82f6; }
    .status--ended { background-color: #6b7280; }
    .status--cancelled { background-color: #ef4444; }
    .status--scheduled { background-color: #f59e0b; }

    .auction-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    @media (min-width: 640px) {
        .auction-stats {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .stat-item {
        text-align: center;
        padding: 1rem;
        background-color: var(--light-sand);
        border-radius: var(--radius-md);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .stat-value {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--golden-orange);
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
    }

    .auction-header__image {
        flex-shrink: 0;
    }

    .auction-image {
        width: 100%;
        max-width: 300px;
        height: 200px;
        object-fit: cover;
        border-radius: var(--radius-md);
    }

    .auction-schedule {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 3rem;
        padding: 1.5rem;
        background-color: var(--white);
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    @media (min-width: 640px) {
        .auction-schedule {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .schedule-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .schedule-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        font-weight: 500;
    }

    .schedule-value {
        font-family: 'Open Sans', sans-serif;
        font-size: 1rem;
        color: var(--dark-brown);
        font-weight: 600;
    }

    .items-section {
        margin-bottom: 3rem;
    }

    .section-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .section-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--dark-brown);
        margin-bottom: 0.5rem;
    }

    .section-subtitle {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem;
        color: var(--earthy-brown);
    }

    .items-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    @media (min-width: 640px) {
        .items-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .items-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .item-card {
        background-color: var(--white);
        border: 1px solid var(--earthy-brown);
        border-radius: var(--radius-lg);
        overflow: hidden;
        cursor: pointer;
        transition: box-shadow 300ms ease, transform 300ms ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .item-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .item-image-wrapper {
        position: relative;
        overflow: hidden;
    }

    .item-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 300ms ease;
    }

    .item-card:hover .item-image {
        transform: scale(1.05);
    }

    .item-badges {
        position: absolute;
        top: 1rem;
        left: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .watchlist-btn-wrapper {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 2;
    }

    .watchlist-btn-wrapper :global(.item-watchlist-btn) {
        backdrop-filter: blur(8px);
        background-color: rgba(253, 251, 247, 0.95);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    .badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--white);
    }

    .badge--active { background-color: #10b981; }
    .badge--sold { background-color: #3b82f6; }
    .badge--ended { background-color: #6b7280; }

    .item-content {
        padding: 1.5rem;
    }

    .item-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--dark-brown);
        margin-bottom: 0.75rem;
        line-height: 1.3;
    }

    .item-description {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        line-height: 1.5;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .detail-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        font-weight: 500;
    }

    .detail-value {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--dark-brown);
        font-weight: 600;
    }

    .item-schedule {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding-top: 1rem;
    }

    .schedule-mini {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .schedule-mini-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        font-weight: 500;
    }

    .schedule-mini-value {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--dark-brown);
        font-weight: 600;
    }

    .no-items-message {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        text-align: center;
        background-color: var(--white);
        border-radius: var(--radius-lg);
        padding: 3rem;
    }

    .no-items-content h3 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--dark-brown);
        margin-bottom: 1rem;
    }

    .no-items-content p {
        font-family: 'Open Sans', sans-serif;
        color: var(--earthy-brown);
        line-height: 1.6;
    }
</style>
