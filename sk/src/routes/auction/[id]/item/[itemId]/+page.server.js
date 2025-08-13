/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    try {
        console.log('Loading auction item details:', params.itemId, 'from auction:', params.id);
        
        // Fetch the auction details
        const auctionResponse = await locals.pb.collection('auctions').getOne(params.id);
        
        if (!auctionResponse) {
            throw new Error('Auction not found');
        }

        // Fetch the specific auction item with expanded relations
        const itemResponse = await locals.pb.collection('auction_items').getOne(params.itemId, {
            expand: 'created_by,winner,current_highest_bid.bidder'
        });
        
        if (!itemResponse) {
            throw new Error('Auction item not found');
        }

        // Verify the item belongs to the specified auction
        if (itemResponse.auction !== params.id) {
            throw new Error('Item does not belong to this auction');
        }

        // Fetch all bids for this item to show bidding history
        const bidsResponse = await locals.pb.collection('bids').getList(1, 50, {
            filter: `auction_item = "${params.itemId}"`,
            sort: '-amount',
            expand: 'bidder'
        });

        console.log(`Found ${bidsResponse.items.length} bids for item ${params.itemId}`);

        // Transform auction data
        const auction = {
            id: auctionResponse.id,
            title: auctionResponse.title || 'Untitled Auction',
            description: auctionResponse.description || 'No description available',
            startDate: auctionResponse.start_time || auctionResponse.auction_date,
            endDate: auctionResponse.end_time || auctionResponse.auction_date,
            theme: auctionResponse.theme || 'General',
            status: auctionResponse.status || 'scheduled',
            featuredImage: auctionResponse.featured_image ? locals.pb.files.getUrl(auctionResponse, auctionResponse.featured_image) : '/placeholder.svg'
        };

        // Transform auction item data
        const auctionItem = {
            id: itemResponse.id,
            title: itemResponse.title || 'Untitled Item',
            description: itemResponse.description || 'No description available',
            startingBid: itemResponse.starting_bid || 0,
            currentBid: itemResponse.current_bid || itemResponse.starting_bid || 0,
            reservePrice: itemResponse.reserve_price || 0,
            startTime: itemResponse.start_time,
            endTime: itemResponse.end_time,
            totalBids: itemResponse.total_bids || 0,
            status: itemResponse.status || 'active',
            createdBy: itemResponse.expand?.created_by || null,
            winner: itemResponse.expand?.winner || null,
            // Handle current highest bid relation
            currentHighestBid: itemResponse.expand?.current_highest_bid || null,
            // Handle multiple images - create array of image URLs
            images: itemResponse.images ? 
                Array.isArray(itemResponse.images) ? 
                    itemResponse.images.map(img => locals.pb.files.getUrl(itemResponse, img)) :
                    [locals.pb.files.getUrl(itemResponse, itemResponse.images)] :
                ['/placeholder.svg'],
            // Additional item details
            condition: itemResponse.condition || 'Not specified',
            dimensions: itemResponse.dimensions || 'Not specified',
            weight: itemResponse.weight || 'Not specified',
            provenance: itemResponse.provenance || 'Not specified',
            certificates: itemResponse.certificates || 'Not specified'
        };

        // Transform bids data
        const bids = bidsResponse.items.map(bid => ({
            id: bid.id,
            amount: bid.amount || 0,
            timestamp: bid.created,
            bidder: bid.expand?.bidder ? {
                id: bid.expand.bidder.id,
                name: bid.expand.bidder.name || 'Anonymous',
                avatar: bid.expand.bidder.avatar ? locals.pb.files.getUrl(bid.expand.bidder, bid.expand.bidder.avatar) : null
            } : null
        }));

        // Calculate item statistics
        const stats = {
            totalBids: bids.length,
            highestBid: auctionItem.currentHighestBid ? auctionItem.currentHighestBid.amount : auctionItem.startingBid,
            lowestBid: bids.length > 0 ? Math.min(...bids.map(b => b.amount)) : auctionItem.startingBid,
            averageBid: bids.length > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length : auctionItem.startingBid,
            timeRemaining: calculateTimeRemaining(auctionItem.endTime)
        };

        // Check if reserve price is met
        const reserveMet = auctionItem.reservePrice > 0 ? stats.highestBid >= auctionItem.reservePrice : true;

        return {
            auction,
            auctionItem,
            bids,
            stats,
            reserveMet
        };
    } catch (error) {
        console.error('Error loading auction item details:', error);
        throw new Error('Failed to load auction item details');
    }
}

// Helper function to calculate time remaining
function calculateTimeRemaining(endTime) {
    if (!endTime) return null;
    
    try {
        const now = new Date();
        const end = new Date(endTime);
        
        if (isNaN(end.getTime())) return null;
        
        const diff = end.getTime() - now.getTime();
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    } catch (error) {
        console.error('Error calculating time remaining:', error);
        return null;
    }
}
