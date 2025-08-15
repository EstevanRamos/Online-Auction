import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const { itemId, maxAmount } = await request.json();
    
    // Check authentication
    if (!locals.user) {
      return json({ error: 'Authentication required' }, { status: 401 });
    }

    // Validate input
    if (!itemId || !maxAmount || maxAmount <= 0) {
      return json({ error: 'Invalid proxy bid data' }, { status: 400 });
    }

    // Get item details
    const item = await locals.pb.collection('auction_items').getOne(itemId);

    // Check if auction is still active
    const now = new Date();
    const endTime = new Date(item.end_time);
    
    if (now >= endTime) {
      return json({ error: 'Auction has ended' }, { status: 400 });
    }

    // Validate max amount is higher than current bid
    const currentBid = item.current_bid || item.starting_bid || 0;
    const bidIncrement = item.bid_increment || 10;
    const minProxyBid = currentBid + bidIncrement;

    if (maxAmount < minProxyBid) {
      return json({ 
        error: `Proxy bid must be at least $${minProxyBid}`,
        minProxyBid 
      }, { status: 400 });
    }

    // Remove any existing proxy bid for this user/item combination
    try {
      const existingBids = await locals.pb.collection('proxy_bids').getList(1, 10, {
        filter: `item_id="${itemId}" && user_id="${locals.user.id}"`
      });
      
      for (const existingBid of existingBids.items) {
        await locals.pb.collection('proxy_bids').delete(existingBid.id);
      }
    } catch (error) {
      console.warn('Could not remove existing proxy bids:', error);
    }

    // Create new proxy bid
    const proxyBidData = {
      item_id: itemId,
      user_id: locals.user.id,
      max_amount: maxAmount,
      current_amount: currentBid, // Start at current bid level
      is_active: true
    };

    const proxyBid = await locals.pb.collection('proxy_bids').create(proxyBidData);

    return json({
      success: true,
      proxyBid,
      message: 'Proxy bid set successfully'
    });

  } catch (error) {
    console.error('Proxy bid creation error:', error);
    return json({ 
      error: 'Failed to set proxy bid',
      details: error.message 
    }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const itemId = url.searchParams.get('itemId');
    const userId = url.searchParams.get('userId') || locals.user?.id;
    
    if (!userId) {
      return json({ error: 'Authentication required' }, { status: 401 });
    }

    // Build filter
    let filter = `user_id="${userId}"`;
    if (itemId) {
      filter += ` && item_id="${itemId}"`;
    }

    // Get proxy bids
    const proxyBids = await locals.pb.collection('proxy_bids').getList(1, 50, {
      filter,
      sort: '-created',
      expand: 'item_id'
    });

    return json({
      proxyBids: proxyBids.items,
      totalItems: proxyBids.totalItems
    });

  } catch (error) {
    console.error('Error fetching proxy bids:', error);
    return json({ error: 'Failed to fetch proxy bids' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, locals }) {
  try {
    const proxyBidId = url.searchParams.get('id');
    const itemId = url.searchParams.get('itemId');
    
    if (!locals.user) {
      return json({ error: 'Authentication required' }, { status: 401 });
    }

    if (proxyBidId) {
      // Delete specific proxy bid
      const proxyBid = await locals.pb.collection('proxy_bids').getOne(proxyBidId);
      
      // Verify ownership
      if (proxyBid.user_id !== locals.user.id) {
        return json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      await locals.pb.collection('proxy_bids').delete(proxyBidId);
      
      return json({
        success: true,
        message: 'Proxy bid removed successfully'
      });
    } else if (itemId) {
      // Delete all proxy bids for this user/item
      const proxyBids = await locals.pb.collection('proxy_bids').getList(1, 10, {
        filter: `item_id="${itemId}" && user_id="${locals.user.id}"`
      });
      
      for (const bid of proxyBids.items) {
        await locals.pb.collection('proxy_bids').delete(bid.id);
      }
      
      return json({
        success: true,
        message: 'All proxy bids for item removed successfully'
      });
    } else {
      return json({ error: 'Proxy bid ID or Item ID required' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error deleting proxy bid:', error);
    return json({ error: 'Failed to delete proxy bid' }, { status: 500 });
  }
}