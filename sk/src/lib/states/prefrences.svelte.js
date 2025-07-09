// src/lib/state/preferences.svelte.js - User preferences with persistence
import { browser } from '$app/environment';

// Initialize from localStorage if available
function getInitialPreferences() {
  if (!browser) return {};
  
  try {
    return JSON.parse(localStorage.getItem('preferences') || '{}');
  } catch {
    return {};
  }
}

export const preferencesState = $state({
  theme: 'light',
  currency: 'USD',
  notifications: true,
  autoRefresh: true,
  ...getInitialPreferences()
});

// Auto-save to localStorage when preferences change
$effect(() => {
  if (browser) {
    localStorage.setItem('preferences', JSON.stringify(preferencesState));
  }
});

// Actions
export function updatePreference(key, value) {
  preferencesState[key] = value;
}

export function resetPreferences() {
  preferencesState.theme = 'light';
  preferencesState.currency = 'USD';
  preferencesState.notifications = true;
  preferencesState.autoRefresh = true;
}
