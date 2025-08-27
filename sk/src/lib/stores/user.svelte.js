// src/lib/stores/auth.svelte.js
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { pb } from '$lib/utils/pocketbase.js';

class UserStore {
    user = $state(null);
    loading = $state(false);
    error = $state(null);
    // Computed properties using $derived
    isAuthenticated = $derived(this.user != null);
    isAdmin = $derived(this.user?.role === 'admin');

    constructor() {
        // Initialize auth state from PocketBase on client side
        if (browser) {
            // The auth state is already loaded from cookies in the PocketBase config
            this.user = pb.authStore.model;
            
            // Listen for auth changes
            pb.authStore.onChange((auth) => {
                this.user = pb.authStore.model;
                console.log('Auth state changed:', this.user);
            });
        }
    }



    // Login method
    async login(email, password) {
        this.loading = true;
        this.error = null;
        
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            this.user = authData.record;
            console.log('Login successful:', this.user);
            return { success: true };
        } catch (error) {
            this.error = this.parseError(error);
            console.error('Login failed:', error);
            return { success: false, error: this.error };
        } finally {
            this.loading = false;
        }
    }

    // Logout method
    async logout() {
        try {
            pb.authStore.clear();
            this.user = null;
            console.log('Logout successful');
            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error);
            return { success: false, error: error.message };
        }
    }

    parseError(err) {
        if (err.response?.data) {
            const data = err.response.data;
            
            // Handle validation errors
            if (data.data) {
                const field = Object.keys(data.data)[0];
                const message = data.data[field].message;
                return `${field}: ${message}`;
            }
            
            // Handle general errors
            if (data.message) {
                return data.message;
            }
        }
        
        return err.message || 'An unexpected error occurred';
    }

    clearError() {
        this.error = null;
    }

    async addToWatchlist(itemId) {
        console.log('adding to watchlist')
        try{
        await pb.collection('watchlist').create({
            user: this.user.id,
            item: itemId,
        });
        console.log('Added to watchlist');
        return true;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            return false;
        }
    }

    async removeFromWatchlist(itemId) {
        console.log("removingh from watchlist")
        try{
            console.log('Removing from watchlist:', itemId);
            const existing = await pb.collection('watchlist').getFirstListItem(`user = "${this.user.id}" && item = "${itemId}"`);
            await pb.collection('watchlist').delete(existing.id);
            return true;
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            return false;
        }
    }
    
    async checkWatchlist(itemId) {
        try{
            await pb.collection('watchlist').getFirstListItem(`user = "${this.user.id}" && item = "${itemId}"`);
            return true;
        } catch (error) {
            console.error('Error checking watchlist:', error);
            return false;
        }
    }
}

// Export singleton instance
export const userStore = new UserStore();