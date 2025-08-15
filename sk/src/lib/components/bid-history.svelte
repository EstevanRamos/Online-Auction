<script>
  import { onMount } from 'svelte';
  import { formatDateTime, timeAgo } from '$lib/utils/datetime.js';

  // Props
  let { 
    itemId, 
    bids = [], 
    showUserNames = true,
    maxVisible = 10,
    className = '',
    refreshInterval = 0 // in milliseconds, 0 = no auto refresh
  } = $props();

  // State
  let loading = $state(false);
  let error = $state(null);
  let visibleCount = $state(Math.min(maxVisible, bids.length));

  // Auto-refresh functionality
  let refreshTimer = null;

  async function fetchBidHistory() {
    if (!itemId) return;
    
    loading = true;
    error = null;

    try {
      const response = await fetch(`/api/bids?itemId=${itemId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bid history');
      }

      const data = await response.json();
      bids = data.bids || [];
      visibleCount = Math.min(maxVisible, bids.length);
    } catch (err) {
      error = err.message;
      console.error('Error fetching bid history:', err);
    } finally {
      loading = false;
    }
  }

  function showMore() {
    visibleCount = Math.min(visibleCount + 10, bids.length);
  }

  function showLess() {
    visibleCount = Math.min(maxVisible, bids.length);
  }

  // Format bid amount
  function formatBid(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Get bid type display
  function getBidTypeDisplay(bidType) {
    switch (bidType) {
      case 'proxy': return 'Proxy';
      case 'manual': return 'Manual';
      default: return 'Manual';
    }
  }

  // Get user display name
  function getUserDisplay(bid) {
    if (!showUserNames) return 'Anonymous';
    
    const user = bid.expand?.user_id;
    if (!user) return 'Unknown User';
    
    // Show only first name and last initial for privacy
    const firstName = user.first_name || user.name || 'User';
    const lastInitial = user.last_name ? user.last_name.charAt(0) + '.' : '';
    
    return `${firstName} ${lastInitial}`.trim();
  }

  onMount(() => {
    // Fetch initial data if no bids provided
    if (bids.length === 0 && itemId) {
      fetchBidHistory();
    }

    // Set up auto-refresh if specified
    if (refreshInterval > 0) {
      refreshTimer = setInterval(fetchBidHistory, refreshInterval);
    }

    // Cleanup
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  });

  // Derived properties
  const visibleBids = $derived(bids.slice(0, visibleCount));
  const hasMoreBids = $derived(bids.length > visibleCount);
  const canShowLess = $derived(visibleCount > maxVisible);
</script>

<div class="bid-history {className}">
  <div class="bid-history__header">
    <h3>Bid History</h3>
    {#if refreshInterval > 0}
      <button 
        class="refresh-btn"
        onclick={fetchBidHistory}
        disabled={loading}
        aria-label="Refresh bid history"
      >
        <svg class="refresh-icon {loading ? 'spinning' : ''}" viewBox="0 0 24 24">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    {/if}
  </div>

  {#if loading && bids.length === 0}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading bid history...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <svg class="error-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <p>Error loading bid history: {error}</p>
      <button class="retry-btn" onclick={fetchBidHistory}>
        Try Again
      </button>
    </div>
  {:else if bids.length === 0}
    <div class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <p>No bids yet</p>
      <p class="empty-subtitle">Be the first to bid on this item!</p>
    </div>
  {:else}
    <div class="bid-list">
      {#each visibleBids as bid, index (bid.id)}
        <div class="bid-item {bid.is_winning ? 'winning-bid' : ''} {index === 0 ? 'latest-bid' : ''}">
          <div class="bid-main">
            <div class="bid-amount-section">
              <span class="bid-amount">{formatBid(bid.amount)}</span>
              {#if bid.is_winning}
                <span class="winning-badge">Winning</span>
              {/if}
            </div>
            
            <div class="bid-details">
              <div class="bid-user">
                <span class="user-name">{getUserDisplay(bid)}</span>
                <span class="bid-type-badge {bid.bid_type}">
                  {getBidTypeDisplay(bid.bid_type)}
                </span>
              </div>
              
              <div class="bid-time">
                <span class="time-ago" title={formatDateTime(bid.timestamp || bid.created)}>
                  {timeAgo(bid.timestamp || bid.created)}
                </span>
              </div>
            </div>
          </div>

          {#if index === 0 && bid.is_winning}
            <div class="latest-indicator">
              <span>Current Highest Bid</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Show More/Less Controls -->
    {#if hasMoreBids || canShowLess}
      <div class="bid-controls">
        {#if hasMoreBids}
          <button class="show-more-btn" onclick={showMore}>
            Show More ({bids.length - visibleCount} more)
          </button>
        {/if}
        
        {#if canShowLess}
          <button class="show-less-btn" onclick={showLess}>
            Show Less
          </button>
        {/if}
      </div>
    {/if}

    <!-- Bid Summary -->
    {#if bids.length > 0}
      <div class="bid-summary">
        <span class="total-bids">Total Bids: {bids.length}</span>
        {#if bids.length >= 2}
          <span class="bid-range">
            Range: {formatBid(Math.min(...bids.map(b => b.amount)))} - {formatBid(Math.max(...bids.map(b => b.amount)))}
          </span>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .bid-history {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .bid-history__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }

  .bid-history__header h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
  }

  .refresh-btn {
    background: none;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .refresh-btn:hover {
    border-color: var(--desert-red, #cd5c5c);
    color: var(--desert-red, #cd5c5c);
  }

  .refresh-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .refresh-icon.spinning {
    animation: spin 1s linear infinite;
  }

  .loading-state, .error-state, .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--desert-red, #cd5c5c);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  .error-icon, .empty-icon {
    width: 48px;
    height: 48px;
    fill: #ccc;
    margin-bottom: 1rem;
  }

  .retry-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--desert-red, #cd5c5c);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .empty-subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .bid-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .bid-item {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 6px;
    transition: all 0.2s;
    position: relative;
  }

  .bid-item.latest-bid {
    border-color: var(--desert-red, #cd5c5c);
    background: #fdf3f3;
  }

  .bid-item.winning-bid {
    background: #f0f8f0;
    border-color: #28a745;
  }

  .bid-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .bid-amount-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .bid-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
  }

  .winning-badge {
    background: #28a745;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .bid-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .bid-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .user-name {
    font-weight: 600;
    color: #555;
  }

  .bid-type-badge {
    padding: 0.125rem 0.375rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .bid-type-badge.manual {
    background: #e3f2fd;
    color: #1976d2;
  }

  .bid-type-badge.proxy {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .bid-time {
    font-size: 0.8rem;
    color: #888;
  }

  .latest-indicator {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 0.8rem;
    color: var(--desert-red, #cd5c5c);
    font-weight: 600;
  }

  .bid-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .show-more-btn, .show-less-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .show-more-btn:hover, .show-less-btn:hover {
    border-color: var(--desert-red, #cd5c5c);
    color: var(--desert-red, #cd5c5c);
  }

  .bid-summary {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 1rem;
    justify-content: center;
    font-size: 0.9rem;
    color: #666;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .bid-main {
      flex-direction: column;
      gap: 0.5rem;
    }

    .bid-details {
      align-items: flex-start;
    }

    .bid-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .bid-summary {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
