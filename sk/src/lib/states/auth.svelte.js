// src/lib/state/auth.svelte.js - Global auth state with runes
export const authState = $state({
  user: null,
  isAuthenticated: false,
  loading: false
});

// Reactive derived state
export const isAdmin = $derived(authState.user?.role === 'admin');
export const userName = $derived(authState.user?.name || 'Guest');

// Actions that manipulate state
export function setUser(user) {
  authState.user = user;
  authState.isAuthenticated = !!user;
}

export function clearUser() {
  authState.user = null;
  authState.isAuthenticated = false;
}

export function setLoading(loading) {
  authState.loading = loading;
}

// Async actions
export async function login(credentials) {
  authState.loading = true;
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const user = await response.json();
    setUser(user);
    
    return { success: true };
  } catch (error) {
    authState.loading = false;
    return { success: false, error: error.message };
  }
}

export async function logout() {
  authState.loading = true;
  
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    return { success: true };
  } catch (error) {
    authState.loading = false;
    return { success: false, error: error.message };
  }