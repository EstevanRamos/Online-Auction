import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

// Create PocketBase client instance
export const pb = browser ? new PocketBase('http://127.0.0.1:8090') : null;

// Export default
export default pb;