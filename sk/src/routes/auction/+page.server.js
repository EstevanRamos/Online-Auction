/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    try {
        console.log('Loading auctions from PocketBase...');
        
        // Fetch auctions from PocketBase with basic query first
        const auctionsResponse = await locals.pb.collection('auctions').getList(1, 50, {
            sort: '-created'
        });

        console.log(`Found ${auctionsResponse.items.length} auctions`);

        // Transform the data to match the expected format
        const transformedAuctions = auctionsResponse.items.map(auction => {
            console.log('Processing auction:', auction.id, auction.title);
            
            // Ensure we have valid dates
            const startDate = auction.start_time || auction.auction_date;
            const endDate = auction.end_time || auction.auction_date;
            
            return {
                id: auction.id,
                title: auction.title || 'Untitled Auction',
                description: auction.description || 'No description available',
                startDate: startDate || new Date().toISOString(),
                endDate: endDate || new Date().toISOString(),
                auctionDate: auction.auction_date,
                itemCount: 0, // Will be updated if we can fetch items
                currentHighestBid: 0, // Will be updated if we can fetch bids
                estimatedValue: auction.theme || 'TBD',
                category: auction.theme || 'General',
                image: auction.featured_image ? locals.pb.files.getUrl(auction, auction.featured_image) : '/placeholder.svg',
                status: auction.status || 'scheduled',
                bidderCount: 0, // Will be updated if we can fetch bids
                antiSnipeExtension: auction.anti_snipe_extension || 0
            };
        });

        // Try to fetch additional data for each auction if possible
        for (let auction of transformedAuctions) {
            try {
                // Try to get auction items count
                try {
                    const itemsResponse = await locals.pb.collection('auction_item').getList(1, 1, {
                        filter: `auction = "${auction.id}"`
                    });
                    auction.itemCount = itemsResponse.totalItems || 0;
                } catch (itemsError) {
                    console.log(`Could not fetch items for auction ${auction.id}:`, itemsError.message);
                }

                // Try to get bids count and highest bid
                try {
                    const bidsResponse = await locals.pb.collection('bids').getList(1, 1, {
                        filter: `auction_item.auction = "${auction.id}"`,
                        sort: '-amount'
                    });
                    auction.bidderCount = bidsResponse.totalItems || 0;
                    if (bidsResponse.items.length > 0) {
                        auction.currentHighestBid = bidsResponse.items[0].amount || 0;
                    }
                } catch (bidsError) {
                    console.log(`Could not fetch bids for auction ${auction.id}:`, bidsError.message);
                }
            } catch (error) {
                console.log(`Error processing auction ${auction.id}:`, error.message);
            }
        }

        // Get statistics for the stats cards
        const stats = {
            activeAuctions: transformedAuctions.filter(a => a.status === 'live' || a.status === 'preview').length,
            totalItems: transformedAuctions.reduce((sum, a) => sum + a.itemCount, 0),
            totalBidders: transformedAuctions.reduce((sum, a) => sum + a.bidderCount, 0)
        };

        console.log('Final stats:', stats);
        console.log('Final auctions count:', transformedAuctions.length);

        return {
            auctions: transformedAuctions,
            stats
        };
    } catch (error) {
        console.error('Error loading auctions:', error);
        
        // Return empty data on error to prevent page crash
        return {
            auctions: [],
            stats: {
                activeAuctions: 0,
                totalItems: 0,
                totalBidders: 0
            }
        };
    }
}