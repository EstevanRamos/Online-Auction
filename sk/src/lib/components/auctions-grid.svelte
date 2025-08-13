<script>
	import AuctionCard from "./auction-card.svelte";

	/** @type {import('./$types').PageProps} */
	let { auctions = [] } = $props();

	function loadMoreAuctions() {
		console.log("Loading more auctions...");
		// TODO: Implement pagination or load more functionality
	}
</script>

<div class="auctionsGrid">
	{#if auctions.length > 0}
		{#each auctions as auction (auction.id)}
			<AuctionCard {auction} />
		{/each}
	{:else}
		<div class="no-auctions">
			<p>No auctions available at the moment.</p>
			<p>Check back later for new listings!</p>
		</div>
	{/if}
</div>

<!-- Load More Button - Only show if there are auctions -->
{#if auctions.length > 0}
	<div class="loadMoreWrapper">
		<button class="loadMoreButton" on:click={loadMoreAuctions}>Load More Auctions</button>
	</div>
{/if}

<style>
  .auctionsGrid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px; /* Tailwind gap-6 */
  }

  @media (min-width: 768px) { /* md */
    .auctionsGrid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1280px) { /* xl */
    .auctionsGrid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .no-auctions {
    text-align: center;
    padding: 48px 24px;
    color: var(--earthy-brown);
  }

  .no-auctions p {
    margin: 8px 0;
    font-family: 'Open Sans', sans-serif;
  }

  .no-auctions p:first-child {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .loadMoreWrapper {
    display: flex;
    justify-content: center; /* Tailwind justify-center */
    margin-top: 48px; /* Tailwind mt-12 */
  }

  .loadMoreButton {
    background-color: var(--golden-orange); /* maps Tailwind bg-primary */
    color: var(--white); /* Tailwind text-white */
    padding: 12px 32px; /* py-3 px-8 */
    border-radius: var(--radius-lg); /* Tailwind rounded-lg approx */
    font-weight: 500; /* Tailwind font-medium */
    font-family: 'Open Sans', sans-serif;
    transition: background-color 150ms ease, color 150ms ease; /* Tailwind transition-colors */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Tailwind shadow-sm */
    border: none;
    cursor: pointer;
  }

  .loadMoreButton:hover {
    background-color: #c27f2a; /* approx bg-primary/90, aligns with global .btn-primary:hover */
  }

  .loadMoreButton:focus-visible {
    outline: 2px solid var(--golden-orange);
    outline-offset: 2px;
  }
</style>
