<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();

    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    // Extract data with fallbacks
    const { auction, auctionItem, bids = [], stats = {}, reserveMet = true } = data;
    const { totalBids = 0, highestBid = 0, lowestBid = 0, averageBid = 0, timeRemaining = null } = stats;

    // Image carousel state
    let currentImageIndex = 0;
    let totalImages = auctionItem?.images?.length || 1;

    // Check if we have data
    const hasImages = auctionItem?.images && auctionItem.images.length > 0;
    const hasBids = bids.length > 0;

    // Format date and time
    function formatDate(dateString) {
        if (!dateString) return 'TBD';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'TBD';
            return date.toLocaleDateString("en-US", {
                month: "long",
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

    function formatDateTime(dateString) {
        if (!dateString) return 'TBD';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'TBD';
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } catch (error) {
            console.error('Error formatting date time:', error);
            return 'TBD';
        }
    }

    // Image carousel functions
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
    }

    function previousImage() {
        currentImageIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    }

    function goToImage(index) {
        currentImageIndex = index;
    }

    // Navigation functions
    function goBackToAuctionItems() {
        goto(`/auction/${auction.id}`);
    }

    function goBackToAuctions() {
        goto('/auction');
    }

    // Placeholder for future bidding functionality
    function placeBid() {
        console.log('Place bid functionality to be implemented');
        // TODO: Implement bidding interface
    }

    // Get item status
    function getItemStatus() {
        if (!auctionItem?.status) return 'active';
        return auctionItem.status;
    }

    function getStatusText(status) {
        switch (status) {
            case 'active': return 'Active';
            case 'sold': return 'Sold';
            case 'ended': return 'Ended';
            case 'cancelled': return 'Cancelled';
            default: return 'Active';
        }
    }

    // Get status color
    function getStatusColor(status) {
        switch (status) {
            case 'active': return '#10b981';
            case 'sold': return '#3b82f6';
            case 'ended': return '#6b7280';
            case 'cancelled': return '#ef4444';
            default: return '#10b981';
        }
    }
</script>

<svelte:head>
    <title>{auctionItem?.title || 'Auction Item'} - {auction?.title || 'Auction'}</title>
    <meta name="description" content="{auctionItem?.description || 'Auction item details'}" />
</svelte:head>

<div class="item-detail-page">
    <main class="container item-detail-main">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb-nav" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <button class="breadcrumb-link" on:click={goBackToAuctions}>Auctions</button>
                </li>
                <li class="breadcrumb-separator">/</li>
                <li class="breadcrumb-item">
                    <button class="breadcrumb-link" on:click={goBackToAuctionItems}>{auction?.title || 'Auction'}</button>
                </li>
                <li class="breadcrumb-separator">/</li>
                <li class="breadcrumb-item current" aria-current="page">
                    {auctionItem?.title || 'Item'}
                </li>
            </ol>
        </nav>

        <div class="item-detail-content">
            <!-- Left Column: Image Carousel -->
            <div class="image-section">
                <div class="image-carousel">
                    {#if hasImages}
                        <div class="main-image-container">
                            <img 
                                src={auctionItem.images[currentImageIndex]} 
                                alt="{auctionItem.title} - Image {currentImageIndex + 1}" 
                                class="main-image" 
                            />
                            
                            <!-- Navigation Arrows -->
                            {#if totalImages > 1}
                                <button class="carousel-nav carousel-prev" on:click={previousImage} aria-label="Previous image">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button class="carousel-nav carousel-next" on:click={nextImage} aria-label="Next image">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            {/if}
                        </div>

                        <!-- Thumbnail Navigation -->
                        {#if totalImages > 1}
                            <div class="thumbnail-nav">
                                {#each auctionItem.images as image, index (index)}
                                    <button 
                                        class="thumbnail {index === currentImageIndex ? 'active' : ''}" 
                                        on:click={() => goToImage(index)}
                                        aria-label="Go to image {index + 1}"
                                    >
                                        <img src={image} alt="Thumbnail {index + 1}" />
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    {:else}
                        <div class="no-image">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p>No images available</p>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Right Column: Item Details -->
            <div class="details-section">
                <!-- Item Header -->
                <div class="item-header">
                    <div class="item-title-section">
                        <h1 class="item-title">{auctionItem?.title || 'Untitled Item'}</h1>
                        <div class="item-meta">
                            <span class="item-status" style="background-color: {getStatusColor(getItemStatus())}">
                                {getStatusText(getItemStatus())}
                            </span>
                            {#if auctionItem?.condition && auctionItem.condition !== 'Not specified'}
                                <span class="item-condition">{auctionItem.condition}</span>
                            {/if}
                        </div>
                    </div>
                    
                    <div class="item-description">
                        {auctionItem?.description || 'No description available'}
                    </div>
                </div>

                <!-- Bidding Section -->
                <div class="bidding-section">
                    <div class="bid-info">
                        <div class="bid-row">
                            <span class="bid-label">Starting Bid:</span>
                            <span class="bid-value">${auctionItem?.startingBid || 0}</span>
                        </div>
                        <div class="bid-row">
                            <span class="bid-label">Current Bid:</span>
                            <span class="bid-value current-bid">
                                {#if totalBids > 0}
                                    ${highestBid}
                                {:else}
                                    No bids yet
                                {/if}
                            </span>
                        </div>
                        {#if auctionItem?.reservePrice > 0}
                            <div class="bid-row">
                                <span class="bid-label">Reserve Price:</span>
                                <span class="bid-value reserve-price {reserveMet ? 'met' : 'not-met'}">
                                    ${auctionItem.reservePrice} {reserveMet ? '(Met)' : '(Not Met)'}
                                </span>
                            </div>
                        {/if}
                        <div class="bid-row">
                            <span class="bid-label">Total Bids:</span>
                            <span class="bid-value">{totalBids}</span>
                        </div>
                        {#if totalBids > 0 && auctionItem?.currentHighestBid}
                            <div class="bid-row">
                                <span class="bid-label">Highest Bidder:</span>
                                <span class="bid-value">
                                    {auctionItem.currentHighestBid.bidder?.name || 'Anonymous'}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <!-- Place Bid Button -->
                    <button class="place-bid-btn" on:click={placeBid} disabled={getItemStatus() !== 'active'}>
                        {#if getItemStatus() === 'active'}
                            Place Bid
                        {:else if getItemStatus() === 'sold'}
                            Item Sold
                        {:else}
                            Bidding Ended
                        {/if}
                    </button>

                    <!-- Time Remaining -->
                    {#if timeRemaining && getItemStatus() === 'active'}
                        <div class="time-remaining">
                            <span class="time-label">Time Remaining:</span>
                            <span class="time-value">{timeRemaining}</span>
                        </div>
                    {/if}
                </div>

                <!-- Item Specifications -->
                <div class="specifications-section">
                    <h3 class="section-title">Item Specifications</h3>
                    <div class="specs-grid">
                        {#if auctionItem?.dimensions && auctionItem.dimensions !== 'Not specified'}
                            <div class="spec-item">
                                <span class="spec-label">Dimensions:</span>
                                <span class="spec-value">{auctionItem.dimensions}</span>
                            </div>
                        {/if}
                        {#if auctionItem?.weight && auctionItem.weight !== 'Not specified'}
                            <div class="spec-item">
                                <span class="spec-label">Weight:</span>
                                <span class="spec-value">{auctionItem.weight}</span>
                            </div>
                        {/if}
                        {#if auctionItem?.provenance && auctionItem.provenance !== 'Not specified'}
                            <div class="spec-item">
                                <span class="spec-label">Provenance:</span>
                                <span class="spec-value">{auctionItem.provenance}</span>
                            </div>
                        {/if}
                        {#if auctionItem?.certificates && auctionItem.certificates !== 'Not specified'}
                            <div class="spec-item">
                                <span class="spec-label">Certificates:</span>
                                <span class="spec-value">{auctionItem.certificates}</span>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Auction Information -->
                <div class="auction-info-section">
                    <h3 class="section-title">Auction Information</h3>
                    <div class="auction-info">
                        <div class="info-row">
                            <span class="info-label">Auction:</span>
                            <span class="info-value">{auction?.title}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Theme:</span>
                            <span class="info-value">{auction?.theme}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Start Date:</span>
                            <span class="info-value">{formatDate(auction?.startDate)} at {formatTime(auction?.startDate)}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">End Date:</span>
                            <span class="info-value">{formatDate(auction?.endDate)} at {formatTime(auction?.endDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bidding History Section -->
        <div class="bidding-history-section">
            <h3 class="section-title">Bidding History</h3>
            {#if hasBids}
                <div class="bids-table">
                    <div class="bids-header">
                        <div class="bid-header-cell">Bidder</div>
                        <div class="bid-header-cell">Amount</div>
                        <div class="bid-header-cell">Time</div>
                    </div>
                    {#each bids as bid (bid.id)}
                        <div class="bid-row">
                            <div class="bid-cell bidder">
                                {#if bid.bidder?.avatar}
                                    <img src={bid.bidder.avatar} alt={bid.bidder.name} class="bidder-avatar" />
                                {/if}
                                <span class="bidder-name">{bid.bidder?.name || 'Anonymous'}</span>
                            </div>
                            <div class="bid-cell amount">${bid.amount}</div>
                            <div class="bid-cell time">{formatDateTime(bid.timestamp)}</div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-bids-message">
                    <div class="no-bids-content">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <h4>No Bids Yet</h4>
                        <p>Be the first to place a bid on this item!</p>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Statistics Section -->
        <div class="statistics-section">
            <h3 class="section-title">Bidding Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">{totalBids}</div>
                    <div class="stat-label">Total Bids</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">
                        {#if totalBids > 0}
                            ${highestBid}
                        {:else}
                            No bids
                        {/if}
                    </div>
                    <div class="stat-label">Highest Bid</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">
                        {#if totalBids > 0}
                            ${lowestBid}
                        {:else}
                            No bids
                        {/if}
                    </div>
                    <div class="stat-label">Lowest Bid</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">
                        {#if totalBids > 0}
                            ${Math.round(averageBid)}
                        {:else}
                            No bids
                        {/if}
                    </div>
                    <div class="stat-label">Average Bid</div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .item-detail-page {
        background-color: var(--light-sand);
        color: var(--dark-brown);
        min-height: 100vh;
    }

    .item-detail-main {
        padding-block: var(--spacing-xl);
    }

    /* Breadcrumb Navigation */
    .breadcrumb-nav {
        margin-bottom: 2rem;
    }

    .breadcrumb-list {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
    }

    .breadcrumb-item {
        display: flex;
        align-items: center;
    }

    .breadcrumb-separator {
        color: var(--earthy-brown);
        font-weight: 500;
    }

    .breadcrumb-link {
        background: none;
        border: none;
        color: var(--golden-orange);
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        cursor: pointer;
        padding: 0.25rem 0;
        transition: color 200ms ease;
        text-decoration: underline;
    }

    .breadcrumb-link:hover {
        color: #c27f2a;
    }

    .breadcrumb-item.current {
        color: var(--earthy-brown);
        font-weight: 500;
    }

    /* Main Content Layout */
    .item-detail-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }

    @media (min-width: 1024px) {
        .item-detail-content {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
        }
    }

    /* Image Carousel */
    .image-carousel {
        position: relative;
    }

    .main-image-container {
        position: relative;
        border-radius: var(--radius-lg);
        overflow: hidden;
        background-color: var(--white);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .main-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        display: block;
    }

    @media (min-width: 768px) {
        .main-image {
            height: 500px;
        }
    }

    .carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 200ms ease;
        color: var(--dark-brown);
    }

    .carousel-nav:hover {
        background-color: var(--white);
        transform: translateY(-50%) scale(1.1);
    }

    .carousel-prev {
        left: 1rem;
    }

    .carousel-next {
        right: 1rem;
    }

    .carousel-nav svg {
        width: 1.5rem;
        height: 1.5rem;
    }

    /* Thumbnail Navigation */
    .thumbnail-nav {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }

    .thumbnail {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: border-color 200ms ease;
        background: none;
        padding: 0;
    }

    .thumbnail.active {
        border-color: var(--golden-orange);
    }

    .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        background-color: var(--white);
        border-radius: var(--radius-lg);
        color: var(--earthy-brown);
    }

    .no-image svg {
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
    }

    /* Item Details */
    .item-header {
        margin-bottom: 2rem;
    }

    .item-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--dark-brown);
        margin-bottom: 1rem;
        line-height: 1.2;
    }

    @media (min-width: 768px) {
        .item-title {
            font-size: 2.5rem;
        }
    }

    .item-meta {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }

    .item-status {
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--white);
    }

    .item-condition {
        padding: 0.5rem 1rem;
        background-color: var(--light-sand);
        border: 1px solid var(--earthy-brown);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        color: var(--earthy-brown);
    }

    .item-description {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem;
        color: var(--earthy-brown);
        line-height: 1.6;
    }

    /* Bidding Section */
    .bidding-section {
        background-color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
        margin-bottom: 2rem;
    }

    .bid-info {
        margin-bottom: 1.5rem;
    }

    .bid-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .bid-row:last-child {
        border-bottom: none;
    }

    .bid-label {
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        color: var(--earthy-brown);
    }

    .bid-value {
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
        color: var(--dark-brown);
    }

    .current-bid {
        font-size: 1.25rem;
        color: var(--golden-orange);
    }

    .reserve-price.met {
        color: #10b981;
    }

    .reserve-price.not-met {
        color: #ef4444;
    }

    .place-bid-btn {
        width: 100%;
        background-color: var(--golden-orange);
        color: var(--white);
        padding: 1rem 2rem;
        border: none;
        border-radius: var(--radius-lg);
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 200ms ease;
        margin-bottom: 1rem;
    }

    .place-bid-btn:hover:not(:disabled) {
        background-color: #c27f2a;
    }

    .place-bid-btn:disabled {
        background-color: #6b7280;
        cursor: not-allowed;
    }

    .time-remaining {
        text-align: center;
        padding: 1rem;
        background-color: var(--light-sand);
        border-radius: var(--radius-md);
    }

    .time-label {
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        color: var(--earthy-brown);
        margin-right: 0.5rem;
    }

    .time-value {
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
        color: var(--golden-orange);
        font-size: 1.125rem;
    }

    /* No Bids Message */
    .no-bids-message {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        text-align: center;
        background-color: var(--light-sand);
        border-radius: var(--radius-md);
        border: 2px dashed var(--earthy-brown);
    }

    .no-bids-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .no-bids-content svg {
        width: 3rem;
        height: 3rem;
        color: var(--earthy-brown);
    }

    .no-bids-content h4 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--dark-brown);
        margin: 0;
    }

    .no-bids-content p {
        font-family: 'Open Sans', sans-serif;
        color: var(--earthy-brown);
        margin: 0;
        font-size: 1rem;
    }

    /* Specifications Section */
    .specifications-section,
    .auction-info-section {
        background-color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
        margin-bottom: 2rem;
    }

    .section-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--dark-brown);
        margin-bottom: 1.5rem;
    }

    .specs-grid {
        display: grid;
        gap: 1rem;
    }

    .spec-item,
    .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .spec-item:last-child,
    .info-row:last-child {
        border-bottom: none;
    }

    .spec-label,
    .info-label {
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        color: var(--earthy-brown);
    }

    .spec-value,
    .info-value {
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
        color: var(--dark-brown);
        text-align: right;
        max-width: 60%;
    }

    /* Bidding History */
    .bidding-history-section {
        background-color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
        margin-bottom: 2rem;
    }

    .bids-table {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .bids-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        background-color: var(--light-sand);
        padding: 1rem;
        font-weight: 600;
        color: var(--dark-brown);
        font-family: 'Open Sans', sans-serif;
    }

    .bid-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        align-items: center;
    }

    .bid-row:last-child {
        border-bottom: none;
    }

    .bid-cell {
        font-family: 'Open Sans', sans-serif;
        color: var(--dark-brown);
    }

    .bidder {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .bidder-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .bidder-name {
        font-weight: 500;
    }

    .amount {
        font-weight: 600;
        color: var(--golden-orange);
    }

    .time {
        font-size: 0.875rem;
        color: var(--earthy-brown);
    }

    /* Statistics Section */
    .statistics-section {
        background-color: var(--white);
        padding: 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    @media (min-width: 640px) {
        .stats-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .stat-card {
        text-align: center;
        padding: 1.5rem;
        background-color: var(--light-sand);
        border-radius: var(--radius-md);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .stat-value {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--golden-orange);
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .item-detail-content {
            gap: 2rem;
        }

        .bidding-section,
        .specifications-section,
        .auction-info-section,
        .bidding-history-section,
        .statistics-section {
            padding: 1.5rem;
        }

        .bids-header,
        .bid-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .bids-header {
            display: none;
        }

        .bid-row {
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            padding: 1rem;
        }

        .bid-cell {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bid-cell::before {
            content: attr(data-label);
            font-weight: 600;
            color: var(--earthy-brown);
        }

        .bidder {
            justify-content: space-between;
        }
    }
</style>
