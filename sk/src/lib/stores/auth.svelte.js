// src/lib/stores/auth.svelte.js
import { browser } from '$app/environment';
import { goto } from '$app/navigation';


class UserStore {
	user = $state(null);
	loading = $state(false);
	error = $state(null);

	constructor() {
		// Initialize auth state from PocketBase on client side
		if (browser) {
			this.user = pb.authStore.model;
			
			// Listen for auth changes
			pb.authStore.onChange((auth) => {
				this.user = pb.authStore.model;
			});
		}
	}

	// Computed properties using $derived
	get isAuthenticated() {
		return !!this.user;
	}

	get isAdmin() {
		return this.user?.role === 'admin';
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
}

// Export singleton instance
export const userStore = new UserStore();
