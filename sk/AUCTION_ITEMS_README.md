# Auction Items Page

This document describes the new auction items functionality that allows users to view all items within a specific auction.

## Overview

When a user clicks on an auction card from the main auctions page (`/auction`), they are now navigated to a dedicated page that shows all auction items for that specific auction.

## Route Structure

```
/auction/[id] - Dynamic route for individual auctions
├── +page.server.js - Server-side data loading
├── +page.svelte - Main auction items page
└── +error.svelte - Error handling page
```

## Features

### 1. Auction Details Header
- Displays auction title, description, and theme
- Shows auction status (Live, Preview, Ended, etc.)
- Displays auction statistics (total items, total bids, highest bid, starting prices)
- Shows auction featured image
- Displays start and end dates/times

### 2. Auction Items Grid
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Each item card shows:
  - Item image
  - Title and description
  - Starting bid and current bid
  - Reserve price (if set)
  - Total number of bids
  - Item status (Active, Sold, Ended)
  - End time for the item

### 3. Navigation
- Back button to return to auctions list
- Proper SvelteKit navigation using `goto()`
- Error handling with dedicated error page

## Data Flow

1. **Server Load Function** (`+page.server.js`):
   - Fetches auction details from `auctions` collection
   - Fetches all auction items from `auction_item` collection filtered by auction ID
   - Calculates statistics (total items, bids, highest bid, etc.)
   - Transforms data for frontend consumption

2. **Page Component** (`+page.svelte`):
   - Receives data via `$props()`
   - Renders auction header with statistics
   - Displays items in responsive grid
   - Handles user interactions

3. **Error Handling** (`+error.svelte`):
   - Catches and displays errors gracefully
   - Provides navigation options back to auctions or home

## SvelteKit Best Practices Used

- **Dynamic Routes**: Uses `[id]` parameter for auction-specific pages
- **Server-Side Loading**: Data fetching happens on the server for better performance
- **Proper Navigation**: Uses `goto()` from `$app/navigation` instead of `onclick`
- **Error Boundaries**: Dedicated error pages for better user experience
- **Type Safety**: Proper TypeScript annotations with `$types`
- **Responsive Design**: Mobile-first approach with CSS Grid
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML

## Usage

1. Navigate to `/auction` to see the list of auctions
2. Click on any auction card to view its items
3. Browse through the auction items
4. Use the back button to return to the auctions list

## Future Enhancements

- Individual item detail pages
- Bidding functionality
- Real-time updates for live auctions
- Advanced filtering and sorting of items
- Search functionality within auction items
- User authentication and bid history

## Technical Notes

- Uses PocketBase collections: `auctions` and `auction_item`
- Implements proper error handling and fallbacks
- Follows Svelte 5 syntax with `$props()` and runes
- Responsive design using CSS custom properties and media queries
- Optimized for performance with server-side rendering
