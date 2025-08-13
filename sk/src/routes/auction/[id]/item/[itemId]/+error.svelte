<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    /** @type {import('./$types').ErrorProps} */
    let { error, status } = $props();

    function goBackToAuctionItems() {
        // Extract auction ID from the current URL
        const auctionId = page.url.pathname.split('/')[2];
        goto(`/auction/${auctionId}`);
    }

    function goBackToAuctions() {
        goto('/auction');
    }

    function goHome() {
        goto('/');
    }
</script>

<svelte:head>
    <title>Error {status} - Auction Item</title>
</svelte:head>

<div class="error-page">
    <main class="container error-main">
        <div class="error-content">
            <div class="error-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            
            <h1 class="error-title">Oops! Something went wrong</h1>
            
            <div class="error-details">
                <p class="error-message">
                    {status === 404 
                        ? "The auction item you're looking for doesn't exist or has been removed."
                        : "We encountered an error while loading the auction item details. Please try again."
                    }
                </p>
                
                {#if error?.message}
                    <div class="error-technical">
                        <details>
                            <summary>Technical Details</summary>
                            <code>{error.message}</code>
                        </details>
                    </div>
                {/if}
            </div>

            <div class="error-actions">
                <button class="btn btn-primary" on:click={goBackToAuctionItems}>
                    Back to Auction Items
                </button>
                <button class="btn btn-outline" on:click={goBackToAuctions}>
                    Back to Auctions
                </button>
                <button class="btn btn-outline" on:click={goHome}>
                    Go Home
                </button>
            </div>
        </div>
    </main>
</div>

<style>
    .error-page {
        background-color: var(--light-sand);
        color: var(--dark-brown);
        min-height: 100vh;
        display: flex;
        align-items: center;
    }

    .error-main {
        padding-block: var(--spacing-xl);
    }

    .error-content {
        max-width: 32rem;
        margin: 0 auto;
        text-align: center;
        background-color: var(--white);
        padding: 3rem 2rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .error-icon {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 2rem;
        color: var(--golden-orange);
    }

    .error-icon svg {
        width: 100%;
        height: 100%;
    }

    .error-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--dark-brown);
        margin-bottom: 1.5rem;
    }

    .error-details {
        margin-bottom: 2rem;
    }

    .error-message {
        font-family: 'Open Sans', sans-serif;
        font-size: 1.125rem;
        color: var(--earthy-brown);
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .error-technical {
        margin-top: 1rem;
    }

    .error-technical details {
        text-align: left;
    }

    .error-technical summary {
        font-family: 'Open Sans', sans-serif;
        font-weight: 600;
        color: var(--dark-brown);
        cursor: pointer;
        margin-bottom: 0.5rem;
    }

    .error-technical code {
        display: block;
        background-color: var(--light-sand);
        padding: 1rem;
        border-radius: var(--radius-md);
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.875rem;
        color: var(--earthy-brown);
        overflow-x: auto;
    }

    .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-lg);
        font-family: 'Open Sans', sans-serif;
        font-weight: 500;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: all 200ms ease;
        font-size: 1rem;
    }

    .btn-primary {
        background-color: var(--golden-orange);
        color: var(--white);
    }

    .btn-primary:hover {
        background-color: #c27f2a;
    }

    .btn-outline {
        background-color: transparent;
        color: var(--golden-orange);
        border: 2px solid var(--golden-orange);
    }

    .btn-outline:hover {
        background-color: var(--golden-orange);
        color: var(--white);
    }

    @media (max-width: 640px) {
        .error-content {
            padding: 2rem 1rem;
        }

        .error-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
        }
    }
</style>
