import { pb } from "$lib/utils/pocketbase";

export async function addToWatchlist(itemId, user) {
    console.log('adding to watchlist')
    try {
        await pb.collection('watchlist').create({
            user: user.id,
            item: itemId,
        });
        console.log('Added to watchlist');
        return true;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return false;
    }
};

export async function removeFromWatchlist(itemId, user) {
    console.log("removing from watchlist")
    try {
        console.log('Removing from watchlist:', itemId);
        const existing = await pb.collection('watchlist').getFirstListItem(`user = "${user.id}" && item = "${itemId}"`);
        await pb.collection('watchlist').delete(existing.id);
        return true;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return false;
    }
};

export async function checkWatchlist(itemId, user) {
    try {
        await pb.collection('watchlist').getFirstListItem(`user = "${user.id}" && item = "${itemId}"`);
        return true;
    } catch (error) {
        console.error('Error checking watchlist:', error);
        return false;
    }
};
