import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

// Create PocketBase client instance
let pb = null;

if (browser) {
    pb = new PocketBase('http://127.0.0.1:8090');

    // Load auth cookie automatically when in browser
    try {
        if (document.cookie) {
            pb.authStore.loadFromCookie(document.cookie);
        }
    } catch (error) {
        // Silently handle cookie loading errors (e.g., invalid/expired cookies)
        console.warn('Failed to load auth cookie:', error);
        pb.authStore.clear();
    }
}

export { pb };
