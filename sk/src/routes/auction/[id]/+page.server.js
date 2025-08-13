/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    try {
        console.log('Loading auction items for auction:', params.id);
        
        // Fetch the auction details
        const auctionResponse = await locals.pb.collection('auctions').getOne(params.id);
        
        if (!auctionResponse) {
            throw new Error('Auction not found');
        }

        // Fetch all auction items for this auction
        const itemsResponse = await locals.pb.collection('auction_items').getList(1, 100, {
            filter: `auction = "${params.id}"`,
            sort: 'created'
        });

        console.log(`Found ${itemsResponse.items.length} items for auction ${params.id}`);

        // Transform auction data
        const auction = {
            id: auctionResponse.id,
            title: auctionResponse.title || 'Untitled Auction',
            description: auctionResponse.description || 'No description available',
            startDate: auctionResponse.start_time || auctionResponse.auction_date,
            endDate: auctionResponse.end_time || auctionResponse.auction_date,
            auctionDate: auctionResponse.auction_date,
            theme: auctionResponse.theme || 'General',
            status: auctionResponse.status || 'scheduled',
            featuredImage: auctionResponse.featured_image ? locals.pb.files.getUrl(auctionResponse, auctionResponse.featured_image) : '/placeholder.svg',
            antiSnipeExtension: auctionResponse.anti_snipe_extension || 0
        };

        // Transform auction items data
        const auctionItems = itemsResponse.items.map(item => ({
            id: item.id,
            title: item.title || 'Untitled Item',
            description: item.description || 'No description available',
            startingBid: item.starting_bid || 0,
            currentBid: item.current_bid || item.starting_bid || 0,
            reservePrice: item.reserve_price || 0,
            startTime: item.start_time,
            endTime: item.end_time,
            totalBids: item.total_bids || 0,
            images: item.images ? [locals.pb.files.getUrl(item, item.images)] : ['/placeholder.svg'],
            createdBy: item.created_by,
            winner: item.winner,
            status: item.status || 'active'
        }));

        // Calculate auction statistics
        const stats = {
            totalItems: auctionItems.length,
            totalBids: auctionItems.reduce((sum, item) => sum + item.totalBids, 0),
            highestBid: Math.max(...auctionItems.map(item => item.currentBid), 0),
            lowestStartingBid: Math.min(...auctionItems.map(item => item.startingBid), Infinity)
        };

        return {
            auction,
            auctionItems,
            stats
        };
    } catch (error) {
        console.error('Error loading auction items:', error);
        
        // Return error data to prevent page crash
        throw new Error('Failed to load auction items');
    }
}
