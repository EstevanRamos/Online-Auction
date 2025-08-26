<script>
    import { userStore } from '$lib/stores/user.svelte';
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase.js';
    import { browser } from '$app/environment';
    
    // Props
    let { itemId, size = 'default', className = '' } = $props();
    
    // State
    let isInWatchlist = $state(false);
    let loading = $state(false);
    let error = $state(null);
    let showTooltip = $state(false);
    
    // Check if item is in watchlist on mount
    onMount(async () => {
        if (userStore.isAuthenticated && itemId) {
            await checkWatchlistStatus();
        }
    });
    
    async function checkWatchlistStatus() {
        if (!userStore.user || !itemId) return;
        console.log(itemId)
        try{
            if(await userStore.checkWatchlist(itemId)){
                isInWatchlist = true;
            } else {
                isInWatchlist = false;
            }
        } catch (error) {
            console.error('Error checking watchlist status:', error);
        }
    }
    
    async function toggleWatchlist() {
        if (!userStore.isAuthenticated) {
            // Could trigger login modal or redirect to login
            window.location.href = '/login';
            return;
        }
        
        if (!userStore.user || !itemId) return;
        
        loading = true;
        error = null;
        
        try {
            if (isInWatchlist) {
                // Remove from watchlist
                if (userStore.checkWatchlist(itemId) != null) {
                    await userStore.removeFromWatchlist(itemId);
                    
                    // Update item watch count
                    try {
                        const item = await pb.collection('auction_items').getOne(itemId);
                        await pb.collection('auction_items').update(itemId, {
                            watch_count: Math.max(0, (item.watch_count || 1) - 1)
                        });
                    } catch (itemErr) {
                        console.warn('Could not update item watch count:', itemErr);
                    }
                }
                
                isInWatchlist = false;
            } else {
                // Add to watchlist
                isInWatchlist = await userStore.addToWatchlist(itemId);
                
                // Update item watch count
                try {
                    const item = await pb.collection('auction_items').getOne(itemId);
                    await pb.collection('auction_items').update(itemId, {
                        watch_count: (item.watch_count || 0) + 1
                    });
                } catch (itemErr) {
                    console.warn('Could not update item watch count:', itemErr);
                }
                
            }
        } catch (err) {
            console.error('Error toggling watchlist:', err);
            error = 'Failed to update watchlist';
            
            // Reset state on error
            setTimeout(() => {
                error = null;
            }, 3000);
        } finally {
            loading = false;
        }
    }
    
    // Determine button classes based on size
    function getButtonClasses() {
        const baseClasses = 'watchlist-btn';
        const sizeClasses = size === 'small' ? 'watchlist-btn--small' : 
                           size === 'large' ? 'watchlist-btn--large' : '';
        return `${baseClasses} ${sizeClasses} ${className}`.trim();
    }
    
    // Get tooltip text
    function getTooltipText() {
        if (!userStore.isAuthenticated) return 'Login to add to watchlist';
        return isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist';
    }
</script>

<!-- Only show if user is authenticated -->
{#if userStore.isAuthenticated}
    <div class="watchlist-container">
        <button 
            class={getButtonClasses()}
            onclick={toggleWatchlist}
            disabled={loading}
            onmouseenter={() => showTooltip = true}
            onmouseleave={() => showTooltip = false}
            aria-label={getTooltipText()}
        >
            {#if loading}
                <svg class="icon loading" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            {:else if isInWatchlist}
                <!-- Filled heart -->
                <svg class="icon filled" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            {:else}
                <!-- Empty heart -->
                <svg class="icon empty" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            {/if}
        </button>
        
        <!-- Tooltip -->
        {#if showTooltip}
            <div class="tooltip">
                {getTooltipText()}
            </div>
        {/if}
        
        <!-- Error message -->
        {#if error}
            <div class="error-message">
                {error}
            </div>
        {/if}
    </div>
{/if}

<style>
    .watchlist-container {
        position: relative;
        display: inline-block;
    }
    
    .watchlist-btn {
        background-color: rgba(253, 251, 247, 0.9);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .watchlist-btn:hover {
        background-color: rgba(253, 251, 247, 1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .watchlist-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        transform: none;
    }
    
    .watchlist-btn--small {
        width: 28px;
        height: 28px;
    }
    
    .watchlist-btn--large {
        width: 44px;
        height: 44px;
    }
    
    .icon {
        width: 20px;
        height: 20px;
        transition: all 0.3s ease;
    }
    
    .watchlist-btn--small .icon {
        width: 16px;
        height: 16px;
    }
    
    .watchlist-btn--large .icon {
        width: 24px;
        height: 24px;
    }
    
    .icon.empty {
        color: var(--desert-red, #cd5c5c);
        stroke-width: 2;
    }
    
    .icon.filled {
        color: var(--desert-red, #cd5c5c);
        animation: heartBeat 0.6s ease-in-out;
    }
    
    .icon.loading {
        color: var(--golden-orange, #d99530);
        animation: spin 1s linear infinite;
    }
    
    .watchlist-btn:hover .icon.empty {
        color: var(--golden-orange, #d99530);
        stroke-width: 2.5;
    }
    
    .watchlist-btn:hover .icon.filled {
        transform: scale(1.1);
    }
    
    .tooltip {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--dark-brown, #2c1810);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0.95;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: var(--dark-brown, #2c1810);
    }
    
    .error-message {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background-color: #ef4444;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
    }
    
    @keyframes heartBeat {
        0% { transform: scale(1); }
        30% { transform: scale(1.25); }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .tooltip {
            font-size: 11px;
            padding: 4px 8px;
        }
        
        .watchlist-btn {
            width: 32px;
            height: 32px;
        }
        
        .icon {
            width: 18px;
            height: 18px;
        }
    }
</style>
