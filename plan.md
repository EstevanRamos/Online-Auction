# Project Issues and Tasks

## Current Issues to Address

1. **Authentication not working due to new user store**
   - Authentication system broken after user store changes
   - Need to investigate and fix authentication flow

2. **Bidding API issues**
   - Not handling "no bids" case properly
   - Not updating correctly after bids are placed
   - Need to fix API response handling and state updates

3. **Watchlist button visibility**
   - Watchlist button is shown even when user isn't authenticated
   - Need to add proper authentication checks before showing watchlist functionality

4. **Item carousel needed**
   - Need to implement an item carousel component
   - Should display items in an attractive, scrollable format

5. **Real-time subscriptions broken**
   - Fix real-time subscriptions for auctions
   - Fix real-time subscriptions for items
   - Ensure live updates work properly

6. **Bidding component validation**
   - Check if bidding component works properly with items that haven't ended
   - Ensure proper state handling for active auctions

7. **User profile button on dashboard**
   - Need a user profile button on the dashboard
   - Button should take users to the user dashboard/profile page
