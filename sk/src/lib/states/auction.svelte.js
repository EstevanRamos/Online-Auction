// src/lib/state/auction.svelte.js - Auction state with runes
export const auctionState = $state({
  auctions: [],
  upcomingAuctions: [],
  currentAuction: null,
  filters: {},
  loading: false,
  error: null
});

// Derived state
export const activeAuctions = $derived(
  auctionState.auctions.filter(auction => auction.status === 'active')
);

export const filteredAuctions = $derived(() => {
  const { auctions, filters } = auctionState;
  
  return auctions.filter(auction => {
    if (filters.category && auction.category !== filters.category) return false;
    if (filters.status && auction.status !== filters.status) return false;
    if (filters.priceMin && auction.currentBid < filters.priceMin) return false;
    if (filters.priceMax && auction.currentBid > filters.priceMax) return false;
    return true;
  });
});

// Actions
export function updateFilters(newFilters) {
  auctionState.filters = { ...auctionState.filters, ...newFilters };
}

export function clearFilters() {
  auctionState.filters = {};
}

export function setCurrentAuction(auction) {
  auctionState.currentAuction = auction;
}

export async function loadAuctions(filters = {}) {
  auctionState.loading = true;
  auctionState.error = null;
  
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/auctions?${queryParams}`);
    
    if (!response.ok) throw new Error('Failed to load auctions');
    
    const auctions = await response.json();
    auctionState.auctions = auctions;
    auctionState.filters = filters;
    
    return { success: true, data: auctions };
  } catch (error) {
    auctionState.error = error.message;
    return { success: false, error: error.message };
  } finally {
    auctionState.loading = false;
  }
}

export async function loadUpcomingAuctions() {
  auctionState.loading = true;
  auctionState.error = null;
  
  try {
    const response = await fetch('/api/auctions/upcoming');
    
    if (!response.ok) throw new Error('Failed to load upcoming auctions');
    
    const upcomingAuctions = await response.json();
    auctionState.upcomingAuctions = upcomingAuctions;
    
    return { success: true, data: upcomingAuctions };
  } catch (error) {
    auctionState.error = error.message;
    return { success: false, error: error.message };
  } finally {
    auctionState.loading = false;
  }
}
