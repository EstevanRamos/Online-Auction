# Tomorrow's Development Plans

## Overview
Tomorrow's focus will be on improving user experience, code organization, and adding essential functionality to the auction system.

## 🎯 Main Tasks

### 1. Create User Watchlist Component
**Priority: High**
- **Location**: `src/lib/components/watchlist-button.svelte`
- **Requirements**:
  - Only visible when user is logged in
  - Add/remove items from watchlist functionality
  - Heart icon with filled/unfilled states
  - Tooltip showing "Add to Watchlist" / "Remove from Watchlist"
  - Integrate with existing watchlist functionality in auction cards

**Current State**: Basic watchlist buttons exist in `src/routes/+page.svelte` but need proper componentization and authentication checks.

### 2. Refactor DateTime Functions to Utils
**Priority: High**
- **Location**: `src/lib/utils/datetime.js`
- **Current Functions to Move**:
  - `formatDateTime()` from `src/routes/auction/[id]/item/[itemId]/+page.svelte` (line 52)
  - Any other date formatting functions scattered throughout components

**Benefits**:
- Centralized date handling
- Consistent formatting across the app
- Easier maintenance and updates
- Reusable across components

### 3. Implement Authentication-Based Bid Button
**Priority: High**
- **Location**: `src/routes/auction/[id]/item/[itemId]/+page.svelte`
- **Current State**: "Place Bid" button shows for all users (line 264)
- **Required Changes**:
  - Hide bid button unless user is authenticated
  - Show "Login to Bid" message for unauthenticated users
  - Maintain existing bidding functionality for logged-in users

**Code Location**: 
```svelte
<!-- Place Bid Button -->
<button class="place-bid-btn" on:click={placeBid} disabled={getItemStatus() !== 'active'}>
    Place Bid
</button>
```

### 4. Enhance Item Sorting System
**Priority: Medium**
- **Location**: `src/lib/components/filter-section.svelte`
- **Current State**: Basic sorting exists with options like "ending-soon", "newest", "price-low", "price-high"
- **Enhancements Needed**:
  - Add more sorting options (e.g., "most bids", "ending today", "reserve met/not met")
  - Improve sort dropdown UI/UX
  - Add sort persistence across page refreshes
  - Consider adding filter combinations (sort + filter)

**Existing Sort Options**:
- ending-soon
- newest
- price-low
- price-high

## 🔧 Technical Implementation Details

### Authentication Integration
- Need to check user authentication state
- Integrate with existing auth system
- Handle unauthenticated user states gracefully

### Component Architecture
- Create reusable watchlist component
- Implement proper prop passing
- Add event handling for watchlist actions

### DateTime Utils Structure
```javascript
// src/lib/utils/datetime.js
export function formatDateTime(dateString) { /* ... */ }
export function formatRelativeTime(dateString) { /* ... */ }
export function formatDate(dateString) { /* ... */ }
export function formatTime(dateString) { /* ... */ }
```

## 📁 Files to Modify

### New Files
- `src/lib/components/watchlist-button.svelte`

### Files to Update
- `src/lib/utils/datetime.js` - Add datetime functions
- `src/routes/auction/[id]/item/[itemId]/+page.svelte` - Remove datetime functions, add auth checks
- `src/lib/components/filter-section.svelte` - Enhance sorting options
- `src/routes/+page.svelte` - Replace watchlist buttons with new component

## 🎨 UI/UX Considerations

### Watchlist Button
- Heart icon (outline when not in watchlist, filled when added)
- Smooth hover animations
- Clear visual feedback for actions
- Consistent with existing design system

### Authentication States
- Clear messaging for unauthenticated users
- Smooth transitions between states
- Maintain visual hierarchy

### Sorting Interface
- Intuitive dropdown design
- Clear labeling for sort options
- Visual indicators for current sort
- Responsive design considerations

## 🧪 Testing Considerations

### Watchlist Component
- Test authentication states
- Test add/remove functionality
- Test component reusability
- Test error handling

### DateTime Utils
- Test various date formats
- Test edge cases (null, invalid dates)
- Test consistency across components

### Authentication Integration
- Test logged-in vs logged-out states
- Test bid button visibility
- Test user experience flow

## 📋 Success Criteria

- [ ] Watchlist component works for authenticated users only
- [ ] All datetime functions moved to utils/datetime.js
- [ ] Bid button hidden for unauthenticated users
- [ ] Enhanced sorting system with more options
- [ ] No breaking changes to existing functionality
- [ ] Consistent UI/UX across all components
- [ ] Code follows project patterns and conventions

## 🔍 Future Considerations

- Watchlist management page for users
- Advanced filtering options
- Sort preferences saved to user profile
- Real-time updates for watchlist items
- Analytics for most popular sorting options

---

**Estimated Time**: 4-6 hours
**Dependencies**: Authentication system, existing component structure
**Risk Level**: Low (mostly refactoring and enhancement)
