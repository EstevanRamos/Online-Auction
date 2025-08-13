# Auction Item Detail Page

This document describes the comprehensive auction item detail page that provides users with detailed information about individual auction items, including an image carousel, bidding details, and comprehensive item specifications.

## Overview

When a user clicks on an auction item from the auction items page (`/auction/[id]`), they are navigated to a dedicated detail page that shows comprehensive information about that specific item, including multiple images in a carousel format.

## Route Structure

```
/auction/[id]/item/[itemId] - Dynamic route for individual auction items
├── +page.server.js - Server-side data loading
├── +page.svelte - Main auction item detail page
└── +error.svelte - Error handling page
```

## Features

### 1. Image Carousel
- **Main Image Display**: Large, high-quality image display with responsive sizing
- **Navigation Controls**: Previous/Next arrow buttons for easy navigation
- **Thumbnail Navigation**: Clickable thumbnails below the main image for quick access
- **Multiple Image Support**: Handles both single images and multiple image arrays
- **Fallback Handling**: Graceful fallback when no images are available
- **Responsive Design**: Adapts to different screen sizes

### 2. Item Information
- **Item Header**: Title, description, status, and condition
- **Bidding Information**: Starting bid, current bid, reserve price, total bids
- **Item Specifications**: Dimensions, weight, provenance, certificates
- **Auction Context**: Parent auction information and timing

### 3. Bidding Interface
- **Bid Display**: Clear presentation of current bidding status
- **Reserve Price Indicator**: Visual indication of whether reserve is met
- **Time Remaining**: Countdown timer for active auctions
- **Place Bid Button**: Ready for future bidding functionality
- **Status-Based UI**: Different button states based on item status

### 4. Bidding History
- **Bid Table**: Comprehensive list of all bids with timestamps
- **Bidder Information**: Bidder names and avatars when available
- **Chronological Order**: Bids sorted by amount (highest first)
- **No Bids State**: Friendly message when no bids have been placed
- **Responsive Design**: Adapts to mobile with stacked layout

### 5. Statistics Dashboard
- **Bid Statistics**: Total bids, highest bid, lowest bid, average bid
- **No Bids Handling**: Graceful display when no bids exist
- **Visual Cards**: Clean, easy-to-read statistical information
- **Real-Time Data**: Calculated from actual bidding data

### 6. Navigation & UX
- **Breadcrumb Navigation**: Clear path back to auctions and auction items
- **Responsive Layout**: Two-column layout on desktop, single column on mobile
- **Error Handling**: Comprehensive error pages with navigation options
- **Accessibility**: Proper ARIA labels, keyboard navigation, semantic HTML

## Data Flow

1. **Server Load Function** (`+page.server.js`):
   - Fetches auction details from `auctions` collection
   - Retrieves specific item from `auction_items` collection with expanded relations
   - Fetches all bids for the item with bidder information
   - Calculates real-time statistics and time remaining
   - Verifies item belongs to specified auction
   - Handles multiple image formats and URLs
   - Supports new schema with `current_highest_bid` relation to bids collection

2. **Page Component** (`+page.svelte`):
   - Receives comprehensive data via `$props()`
   - Manages image carousel state and navigation
   - Renders responsive layout with all item details
   - Handles user interactions and navigation

3. **Error Handling** (`+error.svelte`):
   - Catches and displays errors gracefully
   - Provides contextual navigation options
   - Extracts auction ID from URL for proper navigation

## Image Carousel Implementation

### Features
- **State Management**: Tracks current image index and total count
- **Navigation Functions**: Next, previous, and direct image selection
- **Responsive Controls**: Arrow buttons and thumbnail navigation
- **Image Handling**: Supports both single images and image arrays
- **Fallback Support**: Graceful handling of missing images

### Technical Details
- Uses Svelte reactive state for current image index
- Implements circular navigation (last to first, first to last)
- Responsive image sizing with CSS Grid and Flexbox
- Optimized for performance with proper event handling

## Bidding Information Display

### Current Bid Status
- **Starting Bid**: Initial auction price
- **Current Bid**: Highest bid received (or "No bids yet" if none)
- **Reserve Price**: Minimum price required (if set)
- **Total Bids**: Number of bids placed
- **Time Remaining**: Countdown for active auctions
- **Highest Bidder**: Name of the current highest bidder (when bids exist)

### Reserve Price Logic
- **Met**: Green indicator when highest bid ≥ reserve price
- **Not Met**: Red indicator when highest bid < reserve price
- **No Reserve**: Hidden when no reserve price is set

## Item Specifications

### Available Fields
- **Dimensions**: Physical size measurements
- **Weight**: Item weight information
- **Provenance**: Item history and origin
- **Certificates**: Authentication and appraisal documents
- **Condition**: Item quality and state

### Conditional Display
- Only shows fields that have actual data
- Graceful fallback for missing information
- Consistent formatting and layout

## Responsive Design

### Layout Breakpoints
- **Mobile (< 768px)**: Single column layout, stacked sections
- **Tablet (768px - 1024px)**: Optimized spacing and sizing
- **Desktop (> 1024px)**: Two-column layout with side-by-side content

### Mobile Optimizations
- **Bidding History**: Stacked layout with inline labels
- **Image Carousel**: Full-width images with touch-friendly controls
- **Navigation**: Optimized button sizes and spacing
- **Typography**: Readable font sizes on small screens

## SvelteKit Best Practices

### Routing & Navigation
- **Dynamic Routes**: Uses `[id]` and `[itemId]` parameters
- **Proper Navigation**: Uses `goto()` from `$app/navigation`
- **Breadcrumb Navigation**: Clear user path and context
- **Error Boundaries**: Dedicated error pages for better UX

### Data Loading
- **Server-Side Rendering**: Data fetching on server for performance
- **Type Safety**: Proper TypeScript annotations with `$types`
- **Error Handling**: Comprehensive error catching and display
- **Data Validation**: Verifies item belongs to auction

### Component Architecture
- **Modern Svelte 5**: Uses `$props()` and proper event handling
- **Reactive State**: Image carousel state management
- **Event Handling**: Proper `on:click` and `on:keydown` usage
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Future Enhancements

### Bidding Functionality
- **Real-Time Bidding**: Live bid updates and notifications
- **Bid Validation**: Minimum bid increments and validation
- **User Authentication**: Secure bidding with user accounts
- **Bid History**: Detailed bid tracking and analytics

### Advanced Features
- **Image Zoom**: Click to zoom functionality for detailed viewing
- **360° Views**: Rotating image views for 3D items
- **Video Support**: Video content for complex items
- **Social Sharing**: Share items on social media platforms

### Performance Optimizations
- **Image Lazy Loading**: Progressive image loading
- **Caching**: Intelligent caching strategies
- **CDN Integration**: Content delivery network for images
- **Progressive Web App**: Offline functionality and app-like experience

## Usage

1. Navigate to `/auction` to see the list of auctions
2. Click on an auction to view its items (`/auction/[id]`)
3. Click on any item card to view detailed information
4. Use the image carousel to browse through item images
5. View bidding information, history, and statistics
6. Navigate back using breadcrumbs or back buttons

## Technical Notes

- **PocketBase Integration**: Uses `auctions`, `auction_items`, and `bids` collections
- **New Schema Support**: Handles `current_highest_bid` relation to bids collection
- **No Bids Handling**: Graceful display when items have no bids yet
- **Image Handling**: Supports multiple image formats and fallbacks
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized data loading and rendering
- **Accessibility**: WCAG compliant design and navigation
- **Mobile-First**: Responsive design with mobile optimization

## File Structure

```
sk/src/routes/auction/[id]/item/[itemId]/
├── +page.server.js      # Server-side data loading
├── +page.svelte         # Main item detail component
└── +error.svelte        # Error handling page
```

The implementation provides a comprehensive, user-friendly interface for viewing auction item details with professional-grade image carousel functionality and all the information users need to make informed bidding decisions.
