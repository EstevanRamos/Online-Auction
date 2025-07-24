// src/lib/stores/auth.svelte.js
import PocketBase from 'pocketbase';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

// Initialize PocketBase client
const pb = new PocketBase('http://localhost:8090'); // Update with your PocketBase URL

class AuthStore {
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

	async register(email, password, displayName) {
		this.loading = true;
		this.error = null;

		try {
			// Create user account
			const userData = {
				email,
				password,
				passwordConfirm: password,
				displayName,
				verified: false
			};

			await pb.collection('users').create(userData);

			// Auto-login after registration
			await this.login(email, password);

			return { success: true };
		} catch (err) {
			console.error('Registration error:', err);
			this.error = this.parseError(err);
			return { success: false, error: this.error };
		} finally {
			this.loading = false;
		}
	}

	async login(email, password) {
		this.loading = true;
		this.error = null;

		try {
			await pb.collection('users').authWithPassword(email, password);
			this.user = pb.authStore.model;
			
			// Redirect to dashboard or home
			goto('/dashboard');
			
			return { success: true };
		} catch (err) {
			console.error('Login error:', err);
			this.error = this.parseError(err);
			return { success: false, error: this.error };
		} finally {
			this.loading = false;
		}
	}

	async logout() {
		try {
			pb.authStore.clear();
			this.user = null;
			goto('/');
		} catch (err) {
			console.error('Logout error:', err);
		}
	}

	async requestPasswordReset(email) {
		this.loading = true;
		this.error = null;

		try {
			await pb.collection('users').requestPasswordReset(email);
			return { success: true };
		} catch (err) {
			console.error('Password reset error:', err);
			this.error = this.parseError(err);
			return { success: false, error: this.error };
		} finally {
			this.loading = false;
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
}

// Export singleton instance
export const authStore = new AuthStore();
export { pb };
