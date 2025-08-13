<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();

	import AuctionsGrid from "../../lib/components/auctions-grid.svelte";
	import FilterSection from "../../lib/components/filter-section.svelte";

	// Extract data with fallbacks
	const { auctions = [], stats = {} } = data;
	const { activeAuctions = 0, totalItems = 0, totalBidders = 0 } = stats;

	// Check if we have data
	const hasData = auctions.length > 0;
</script>

<div class="auction-page">
    <main class="container auction-main">
		<!-- Page Header -->
        <div class="page-header">
            <div class="page-header__text">
                <h1 class="page-title">Live & Upcoming Auctions</h1>
                <p class="page-subtitle">Browse our scheduled auctions with start and end times. Click on any auction to view the items available for bidding.</p>
			</div>

			<!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card__value">{activeAuctions}</div>
                    <div class="stat-card__label">Active Auctions</div>
				</div>
                <div class="stat-card">
                    <div class="stat-card__value">{totalItems}</div>
                    <div class="stat-card__label">Items Available</div>
				</div>
                <div class="stat-card">
                    <div class="stat-card__value">{totalBidders}</div>
                    <div class="stat-card__label">Active Bidders</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<FilterSection />

		<!-- Auctions Grid -->
		{#if hasData}
			<AuctionsGrid {auctions} />
		{:else}
			<div class="no-data-message">
				<div class="no-data-content">
					<h2>No Auctions Available</h2>
					<p>There are currently no auctions scheduled. Please check back later or contact us for more information.</p>
					<button class="refresh-btn" on:click={() => window.location.reload()}>
						Refresh Page
					</button>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
    .auction-page {
        background-color: var(--light-sand);
        color: var(--dark-brown);
        min-height: 100vh;
    }

    .auction-main {
        padding-block: var(--spacing-xl);
    }

    .page-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem; /* 24px */
        margin-bottom: 3rem; /* 48px */
    }

    .page-header__text {
        text-align: center;
        max-width: 48rem; /* ~max-w-3xl */
        margin: 0 auto;
    }

    .page-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        color: var(--dark-brown);
        margin-bottom: 1rem; /* 16px */
        font-size: 2.25rem; /* text-4xl */
        line-height: 1.2;
    }

    @media (min-width: 768px) {
        .page-title {
            font-size: 3rem; /* md:text-5xl */
        }
    }

    .page-subtitle {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem; /* text-lg */
        color: var(--earthy-brown); /* muted foreground */
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem; /* 24px */
        width: 100%;
        max-width: 56rem; /* ~max-w-4xl */
        margin: 0 auto;
    }

    @media (min-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    .stat-card {
        background-color: var(--white);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-sm */
        border: 1px solid rgba(0, 0, 0, 0.06); /* border-border */
        text-align: center;
    }

    .stat-card__value {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.875rem; /* text-3xl */
        font-weight: 700;
        color: var(--golden-orange); /* primary */
        margin-bottom: 0.5rem; /* mb-2 */
    }

    .stat-card__label {
        font-family: 'Open Sans', sans-serif;
        font-size: 0.875rem; /* text-sm */
        color: var(--earthy-brown); /* muted */
    }

    .no-data-message {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        text-align: center;
    }

    .no-data-content {
        max-width: 32rem;
    }

    .no-data-content h2 {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--dark-brown);
        margin-bottom: 1rem;
    }

    .no-data-content p {
        font-family: 'Open Sans', sans-serif;
        color: var(--earthy-brown);
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .refresh-btn {
        background-color: var(--golden-orange);
        color: var(--white);
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: var(--radius-lg);
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 200ms ease;
    }

    .refresh-btn:hover {
        background-color: #c27f2a;
    }
</style>