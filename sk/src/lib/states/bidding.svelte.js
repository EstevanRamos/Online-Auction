// src/lib/state/bidding.svelte.js - Bidding state with runes
export const biddingState = $state({
  userBids: [],
  proxyBids: [],
  bidHistory: {},
  loading: false,
  error: null
});

// Derived state
export const activeBids = $derived(
  biddingState.userBids.filter(bid => bid.status === 'active')
);

export const totalBidAmount = $derived(
  biddingState.userBids.reduce((total, bid) => total + bid.amount, 0)
);

export const getItemBidHistory = $derived((itemId) => {
  return biddingState.bidHistory[itemId] || [];
});

// Actions
export function addBid(bid) {
  biddingState.userBids.push(bid);
  
  // Update bid history
  const itemId = bid.itemId;
  if (!biddingState.bidHistory[itemId]) {
    biddingState.bidHistory[itemId] = [];
  }
  biddingState.bidHistory[itemId].push(bid);
}

export function updateProxyBid(itemId, proxyBid) {
  // Remove existing proxy bid for this item
  biddingState.proxyBids = biddingState.proxyBids.filter(bid => bid.itemId !== itemId);
  
  // Add new proxy bid
  if (proxyBid) {
    biddingState.proxyBids.push(proxyBid);
  }
}

export async function placeBid(itemId, amount) {
  biddingState.loading = true;
  biddingState.error = null;
  
  try {
    const response = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, amount })
    });
    
    if (!response.ok) throw new Error('Failed to place bid');
    
    const bid = await response.json();
    addBid(bid);
    
    return { success: true, data: bid };
  } catch (error) {
    biddingState.error = error.message;
    return { success: false, error: error.message };
  } finally {
    biddingState.loading = false;
  }
}

export async function setProxyBid(itemId, maxAmount) {
  biddingState.loading = true;
  biddingState.error = null;
  
  try {
    const response = await fetch('/api/proxy-bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, maxAmount })
    });
    
    if (!response.ok) throw new Error('Failed to set proxy bid');
    
    const proxyBid = await response.json();
    updateProxyBid(itemId, proxyBid);
    
    return { success: true, data: proxyBid };
  } catch (error) {
    biddingState.error = error.message;
    return { success: false, error: error.message };
  } finally {
    biddingState.loading = false;
  }
}