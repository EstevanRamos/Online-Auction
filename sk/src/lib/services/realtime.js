import { pb } from '$lib/pocketbase.js';
import { browser } from '$app/environment';

/**
 * Real-time service for auction updates using PocketBase subscriptions
 */
class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  /**
   * Initialize the real-time connection
   */
  async init() {
    if (!browser || !pb) return;

    try {
      // PocketBase automatically handles WebSocket connections for subscriptions
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('Real-time service initialized');
    } catch (error) {
      console.error('Failed to initialize real-time service:', error);
      this._scheduleReconnect();
    }
  }

  /**
   * Subscribe to item bid updates
   * @param {string} itemId - The item ID to subscribe to
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToItemBids(itemId, callback) {
    if (!browser || !pb || !itemId) return () => {};

    const subscriptionKey = `item_bids_${itemId}`;
    
    try {
      // Subscribe to bids collection with filter for specific item
      const unsubscribe = pb.collection('bids').subscribe('*', (e) => {
        // Filter for bids related to this specific item
        if (e.record?.item_id === itemId) {
          callback({
            action: e.action, // 'create', 'update', 'delete'
            record: e.record,
            type: 'bid'
          });
        }
      }, {
        filter: `item_id="${itemId}"`
      });

      this.subscriptions.set(subscriptionKey, unsubscribe);
      console.log(`Subscribed to bids for item: ${itemId}`);

      return () => this.unsubscribe(subscriptionKey);
    } catch (error) {
      console.error(`Failed to subscribe to item bids for ${itemId}:`, error);
      return () => {};
    }
  }

  /**
   * Subscribe to item updates (current bid, status, etc.)
   * @param {string} itemId - The item ID to subscribe to
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToItemUpdates(itemId, callback) {
    if (!browser || !pb || !itemId) return () => {};

    const subscriptionKey = `item_updates_${itemId}`;
    
    try {
      const unsubscribe = pb.collection('auction_items').subscribe(itemId, (e) => {
        callback({
          action: e.action,
          record: e.record,
          type: 'item'
        });
      });

      this.subscriptions.set(subscriptionKey, unsubscribe);
      console.log(`Subscribed to updates for item: ${itemId}`);

      return () => this.unsubscribe(subscriptionKey);
    } catch (error) {
      console.error(`Failed to subscribe to item updates for ${itemId}:`, error);
      return () => {};
    }
  }

  /**
   * Subscribe to auction updates (end time extensions, status changes)
   * @param {string} auctionId - The auction ID to subscribe to
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToAuctionUpdates(auctionId, callback) {
    if (!browser || !pb || !auctionId) return () => {};

    const subscriptionKey = `auction_updates_${auctionId}`;
    
    try {
      const unsubscribe = pb.collection('auctions').subscribe(auctionId, (e) => {
        callback({
          action: e.action,
          record: e.record,
          type: 'auction'
        });
      });

      this.subscriptions.set(subscriptionKey, unsubscribe);
      console.log(`Subscribed to updates for auction: ${auctionId}`);

      return () => this.unsubscribe(subscriptionKey);
    } catch (error) {
      console.error(`Failed to subscribe to auction updates for ${auctionId}:`, error);
      return () => {};
    }
  }

  /**
   * Subscribe to proxy bid updates for a user
   * @param {string} userId - The user ID to subscribe to
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToUserProxyBids(userId, callback) {
    if (!browser || !pb || !userId) return () => {};

    const subscriptionKey = `proxy_bids_${userId}`;
    
    try {
      const unsubscribe = pb.collection('proxy_bids').subscribe('*', (e) => {
        if (e.record?.user_id === userId) {
          callback({
            action: e.action,
            record: e.record,
            type: 'proxy_bid'
          });
        }
      }, {
        filter: `user_id="${userId}"`
      });

      this.subscriptions.set(subscriptionKey, unsubscribe);
      console.log(`Subscribed to proxy bids for user: ${userId}`);

      return () => this.unsubscribe(subscriptionKey);
    } catch (error) {
      console.error(`Failed to subscribe to user proxy bids for ${userId}:`, error);
      return () => {};
    }
  }

  /**
   * Subscribe to all auction items in a specific auction
   * @param {string} auctionId - The auction ID to subscribe to
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToAuctionItems(auctionId, callback) {
    if (!browser || !pb || !auctionId) return () => {};

    const subscriptionKey = `auction_items_${auctionId}`;
    
    try {
      const unsubscribe = pb.collection('auction_items').subscribe('*', (e) => {
        if (e.record?.auction_id === auctionId) {
          callback({
            action: e.action,
            record: e.record,
            type: 'auction_item'
          });
        }
      }, {
        filter: `auction_id="${auctionId}"`
      });

      this.subscriptions.set(subscriptionKey, unsubscribe);
      console.log(`Subscribed to items for auction: ${auctionId}`);

      return () => this.unsubscribe(subscriptionKey);
    } catch (error) {
      console.error(`Failed to subscribe to auction items for ${auctionId}:`, error);
      return () => {};
    }
  }

  /**
   * Unsubscribe from a specific subscription
   * @param {string} subscriptionKey - The subscription key to unsubscribe from
   */
  unsubscribe(subscriptionKey) {
    const unsubscribeFn = this.subscriptions.get(subscriptionKey);
    if (unsubscribeFn) {
      try {
        unsubscribeFn();
        this.subscriptions.delete(subscriptionKey);
        console.log(`Unsubscribed from: ${subscriptionKey}`);
      } catch (error) {
        console.error(`Failed to unsubscribe from ${subscriptionKey}:`, error);
      }
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll() {
    for (const [key, unsubscribeFn] of this.subscriptions) {
      try {
        unsubscribeFn();
        console.log(`Unsubscribed from: ${key}`);
      } catch (error) {
        console.error(`Failed to unsubscribe from ${key}:`, error);
      }
    }
    this.subscriptions.clear();
  }

  /**
   * Check if connected
   * @returns {boolean} Connection status
   */
  get connected() {
    return this.isConnected;
  }

  /**
   * Get number of active subscriptions
   * @returns {number} Number of active subscriptions
   */
  get subscriptionCount() {
    return this.subscriptions.size;
  }

  /**
   * Schedule a reconnection attempt
   * @private
   */
  _scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Exponential backoff
    this.reconnectAttempts++;

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.init();
    }, delay);
  }

  /**
   * Clean up all subscriptions (call on component unmount)
   */
  destroy() {
    this.unsubscribeAll();
    this.isConnected = false;
    console.log('Real-time service destroyed');
  }
}

// Create and export singleton instance
export const realtimeService = new RealtimeService();

// Auto-initialize on module load if in browser
if (browser) {
  realtimeService.init();
}

// Export for manual initialization
export default realtimeService;