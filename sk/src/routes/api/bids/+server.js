import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const { itemId, amount, isProxyBid = false, maxAmount } = await request.json();
    
    // Check authentication
    if (!locals.user) {
      return json({ error: 'Authentication required' }, { status: 401 });
    }

    // Validate input
    if (!itemId || !amount || amount <= 0) {
      return json({ error: 'Invalid bid data' }, { status: 400 });
    }

    // Get item details
    const item = await locals.pb.collection('auction_items').getOne(itemId, {
      expand: 'auction_id'
    });

    // Check if auction is active
    const now = new Date();
    const auctionEndTime = new Date(item.expand?.auction_id?.end_time || item.end_time);
    
    if (now >= auctionEndTime) {
      return json({ error: 'Auction has ended' }, { status: 400 });
    }

    // Check if auction has started
    const auctionStartTime = new Date(item.expand?.auction_id?.start_time || now);
    if (now < auctionStartTime) {
      return json({ error: 'Auction has not started yet' }, { status: 400 });
    }

    // Calculate minimum bid
    const currentBid = item.current_bid || item.starting_bid || 0;
    const bidIncrement = item.bid_increment || 10;
    const minBid = currentBid + bidIncrement;

    if (amount < minBid) {
      return json({ 
        error: `Minimum bid is $${minBid}`,
        minBid 
      }, { status: 400 });
    }

    // Check if user is bidding against themselves
    if (item.highest_bidder === locals.user.id) {
      return json({ error: 'You are already the highest bidder' }, { status: 400 });
    }

    // Handle anti-sniping (extend auction if bid placed in last 2 minutes)
    let newEndTime = auctionEndTime;
    const timeRemaining = auctionEndTime - now;
    if (timeRemaining <= 2 * 60 * 1000) { // 2 minutes
      newEndTime = new Date(now.getTime() + 2 * 60 * 1000); // Add 2 minutes
      
      // Update auction end time
      if (item.expand?.auction_id) {
        await locals.pb.collection('auctions').update(item.expand.auction_id.id, {
          end_time: newEndTime.toISOString()
        });
      }
      
      // Update item end time if it has one
      if (item.end_time) {
        await locals.pb.collection('auction_items').update(itemId, {
          end_time: newEndTime.toISOString()
        });
      }
    }

    // Create bid record
    const bidData = {
      item_id: itemId,
      user_id: locals.user.id,
      amount: amount,
      bid_type: isProxyBid ? 'proxy' : 'manual',
      timestamp: new Date().toISOString(),
      is_winning: true // Will be updated if outbid
    };

    const bid = await locals.pb.collection('bids').create(bidData);

    // Update previous winning bid status
    if (item.highest_bidder) {
      try {
        const previousBids = await locals.pb.collection('bids').getList(1, 1, {
          filter: `item_id="${itemId}" && user_id="${item.highest_bidder}" && is_winning=true`,
          sort: '-created'
        });
        
        for (const prevBid of previousBids.items) {
          await locals.pb.collection('bids').update(prevBid.id, { is_winning: false });
        }
      } catch (error) {
        console.warn('Could not update previous bid status:', error);
      }
    }

    // Update item with new highest bid
    const updatedItem = await locals.pb.collection('auction_items').update(itemId, {
      current_bid: amount,
      bid_count: (item.bid_count || 0) + 1,
      highest_bidder: locals.user.id
    });

    // Handle proxy bid setup
    let proxyBidResult = null;
    if (isProxyBid && maxAmount > amount) {
      try {
        // Remove any existing proxy bid for this user/item
        const existingProxyBids = await locals.pb.collection('proxy_bids').getList(1, 1, {
          filter: `item_id="${itemId}" && user_id="${locals.user.id}"`
        });
        
        for (const existingBid of existingProxyBids.items) {
          await locals.pb.collection('proxy_bids').delete(existingBid.id);
        }

        // Create new proxy bid
        proxyBidResult = await locals.pb.collection('proxy_bids').create({
          item_id: itemId,
          user_id: locals.user.id,
          max_amount: maxAmount,
          current_amount: amount,
          is_active: true
        });
      } catch (error) {
        console.warn('Could not set up proxy bid:', error);
      }
    }

    return json({
      success: true,
      bid,
      item: updatedItem,
      newEndTime: newEndTime.toISOString(),
      proxyBid: proxyBidResult,
      message: 'Bid placed successfully',
      antiSnipingTriggered: newEndTime > auctionEndTime
    });

  } catch (error) {
    console.error('Bid placement error:', error);
    return json({ 
      error: 'Failed to place bid',
      details: error.message 
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const itemId = url.searchParams.get('itemId');
    const userId = url.searchParams.get('userId');
    
    if (!itemId) {
      return json({ error: 'Item ID required' }, { status: 400 });
    }

    // Build filter
    let filter = `item_id="${itemId}"`;
    if (userId) {
      filter += ` && user_id="${userId}"`;
    }

    // Get bid history
    const bids = await locals.pb.collection('bids').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'user_id'
    });

    return json({
      bids: bids.items,
      totalItems: bids.totalItems
    });

  } catch (error) {
    console.error('Error fetching bids:', error);
    return json({ error: 'Failed to fetch bid history' }, { status: 500 });
  }
}