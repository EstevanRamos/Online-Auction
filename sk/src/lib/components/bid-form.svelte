<script>
  import { biddingState, placeBid, setProxyBid } from '$lib/stores/bidding.svelte.js';
  import { userStore } from '$lib/stores/user.svelte.js';

  // Props
  let { 
    itemId, 
    currentBid = 0, 
    minBid = 0, 
    bidIncrement = 10,
    endTime = null,
    isAuctionEnded = false,
    onBidSuccess = () => {},
    className = ''
  } = $props();

  // State
  let bidAmount = $state(minBid);
  let maxProxyAmount = $state(0);
  let bidType = $state('manual'); // 'manual' or 'proxy'
  let showConfirmation = $state(false);
  let error = $state(null);
  let success = $state(null);

  // Derived states
  const isLoggedIn = $derived(userStore.isAuthenticated);
  const isLoading = $derived(biddingState.loading);
  const canBid = $derived(isLoggedIn && !isAuctionEnded && bidAmount >= minBid);

  // Quick bid amounts
  const quickBids = $derived([
    minBid,
    minBid + bidIncrement,
    minBid + (bidIncrement * 2),
    minBid + (bidIncrement * 5)
  ]);

  // Validate bid amount
  function validateBid(amount) {
    if (amount < minBid) {
      return `Minimum bid is $${minBid}`;
    }
    if (bidType === 'proxy' && maxProxyAmount <= amount) {
      return 'Maximum proxy amount must be higher than current bid';
    }
    return null;
  }

  // Set quick bid amount
  function setQuickBid(amount) {
    bidAmount = amount;
    error = null;
  }

  // Handle bid submission
  async function handleBidSubmit() {
    error = null;
    success = null;

    const validationError = validateBid(bidAmount);
    if (validationError) {
      error = validationError;
      return;
    }

    try {
      let result;
      
      if (bidType === 'proxy') {
        result = await setProxyBid(itemId, maxProxyAmount);
      } else {
        result = await placeBid(itemId, bidAmount);
      }

      if (result.success) {
        success = result.data?.message || 'Bid placed successfully!';
        showConfirmation = false;
        onBidSuccess(result.data);
        
        // Reset form
        bidAmount = minBid;
        maxProxyAmount = 0;
      } else {
        error = result.error || 'Failed to place bid';
      }
    } catch (err) {
      error = err.message || 'An error occurred while placing bid';
    }
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    
    if (!canBid) return;
    
    // Show confirmation for large bids
    if (bidAmount > minBid + (bidIncrement * 10) || bidType === 'proxy') {
      showConfirmation = true;
    } else {
      handleBidSubmit();
    }
  }

  // Clear messages after timeout
  $effect(() => {
    if (success) {
      const timer = setTimeout(() => {
        success = null;
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  $effect(() => {
    if (error) {
      const timer = setTimeout(() => {
        error = null;
      }, 8000);
      return () => clearTimeout(timer);
    }
  });
</script>

<div class="bid-form {className}">
  {#if !isLoggedIn}
    <div class="login-prompt">
      <p>Please <a href="/login">log in</a> to place bids</p>
    </div>
  {:else if isAuctionEnded}
    <div class="auction-ended">
      <p>This auction has ended</p>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="bid-form__form">
      <!-- Bid Type Selector -->
      <div class="bid-type-selector">
        <label class="radio-option {bidType === 'manual' ? 'active' : ''}">
          <input 
            type="radio" 
            bind:group={bidType} 
            value="manual"
            name="bidType"
          />
          <span>Manual Bid</span>
        </label>
        <label class="radio-option {bidType === 'proxy' ? 'active' : ''}">
          <input 
            type="radio" 
            bind:group={bidType} 
            value="proxy"
            name="bidType"
          />
          <span>Proxy Bid</span>
        </label>
      </div>

      <!-- Bid Amount Input -->
      <div class="bid-amount-section">
        <label for="bidAmount" class="bid-label">
          {bidType === 'manual' ? 'Bid Amount' : 'Starting Bid'}
        </label>
        <div class="bid-input-container">
          <span class="currency-symbol">$</span>
          <input
            id="bidAmount"
            type="number"
            bind:value={bidAmount}
            min={minBid}
            step={bidIncrement}
            class="bid-input"
            placeholder={minBid.toString()}
            disabled={isLoading}
          />
        </div>
        <p class="bid-help">Minimum bid: ${minBid}</p>
      </div>

      <!-- Proxy Max Amount (shown for proxy bids) -->
      {#if bidType === 'proxy'}
        <div class="proxy-amount-section">
          <label for="maxProxyAmount" class="bid-label">Maximum Amount</label>
          <div class="bid-input-container">
            <span class="currency-symbol">$</span>
            <input
              id="maxProxyAmount"
              type="number"
              bind:value={maxProxyAmount}
              min={bidAmount + bidIncrement}
              step={bidIncrement}
              class="bid-input"
              placeholder={(bidAmount + bidIncrement).toString()}
              disabled={isLoading}
            />
          </div>
          <p class="bid-help">We'll bid up to this amount automatically</p>
        </div>
      {/if}

      <!-- Quick Bid Buttons -->
      <div class="quick-bids">
        <p class="quick-bids-label">Quick bid:</p>
        <div class="quick-bid-buttons">
          {#each quickBids as amount}
            <button
              type="button"
              class="quick-bid-btn"
              onclick={() => setQuickBid(amount)}
              disabled={isLoading}
            >
              ${amount}
            </button>
          {/each}
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="bid-submit-btn"
        disabled={!canBid || isLoading}
      >
        {#if isLoading}
          <svg class="loading-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"/>
            <path d="M12,2 A10,10 0 0,1 22,12" stroke="currentColor" stroke-width="4" fill="none"/>
          </svg>
          Placing Bid...
        {:else}
          {bidType === 'manual' ? `Bid $${bidAmount}` : `Set Proxy Bid $${maxProxyAmount}`}
        {/if}
      </button>

      <!-- Messages -->
      {#if error}
        <div class="error-message">
          <svg viewBox="0 0 24 24" class="error-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {error}
        </div>
      {/if}

      {#if success}
        <div class="success-message">
          <svg viewBox="0 0 24 24" class="success-icon">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          {success}
        </div>
      {/if}
    </form>

    <!-- Confirmation Modal -->
    {#if showConfirmation}
      <div class="confirmation-overlay">
        <div class="confirmation-modal">
          <h3>Confirm Your Bid</h3>
          <div class="confirmation-details">
            {#if bidType === 'proxy'}
              <p>You're about to set a proxy bid with a maximum of <strong>${maxProxyAmount}</strong></p>
              <p class="proxy-explanation">We'll automatically bid on your behalf up to this amount, increasing by ${bidIncrement} increments when outbid.</p>
            {:else}
              <p>You're about to bid <strong>${bidAmount}</strong> on this item.</p>
            {/if}
          </div>
          <div class="confirmation-buttons">
            <button 
              class="confirm-btn"
              onclick={handleBidSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Bid'}
            </button>
            <button 
              class="cancel-btn"
              onclick={() => showConfirmation = false}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .bid-form {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .login-prompt, .auction-ended {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .login-prompt a {
    color: var(--desert-red, #cd5c5c);
    text-decoration: none;
    font-weight: 600;
  }

  .bid-type-selector {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .radio-option:hover {
    background-color: #f9f9f9;
  }

  .radio-option.active {
    background-color: #fdf3f3;
    color: var(--desert-red, #cd5c5c);
  }

  .radio-option input[type="radio"] {
    margin: 0;
  }

  .bid-amount-section, .proxy-amount-section {
    margin-bottom: 1.5rem;
  }

  .bid-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .bid-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .currency-symbol {
    position: absolute;
    left: 12px;
    color: #666;
    font-weight: 600;
    z-index: 1;
  }

  .bid-input {
    width: 100%;
    padding: 12px 12px 12px 32px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    transition: border-color 0.2s;
  }

  .bid-input:focus {
    outline: none;
    border-color: var(--desert-red, #cd5c5c);
  }

  .bid-help {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    color: #666;
  }

  .proxy-explanation {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  .quick-bids {
    margin-bottom: 1.5rem;
  }

  .quick-bids-label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .quick-bid-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .quick-bid-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
  }

  .quick-bid-btn:hover {
    border-color: var(--desert-red, #cd5c5c);
    color: var(--desert-red, #cd5c5c);
  }

  .bid-submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--desert-red, #cd5c5c);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .bid-submit-btn:hover:not(:disabled) {
    background: #b84a4a;
  }

  .bid-submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .loading-icon {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  .error-message, .success-message {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .error-message {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
  }

  .success-message {
    background: #efe;
    color: #363;
    border: 1px solid #cfc;
  }

  .error-icon, .success-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  .confirmation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .confirmation-modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
  }

  .confirmation-modal h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }

  .confirmation-details {
    margin-bottom: 1.5rem;
  }

  .confirmation-details p {
    margin: 0.5rem 0;
  }

  .confirmation-buttons {
    display: flex;
    gap: 1rem;
  }

  .confirm-btn, .cancel-btn {
    flex: 1;
    padding: 0.75rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }

  .confirm-btn {
    background: var(--desert-red, #cd5c5c);
    color: white;
    border: none;
  }

  .cancel-btn {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>