/**
 * Centralized datetime utilities for the auction application
 * Provides consistent date formatting across all components
 */

/**
 * Format a date string to a localized date and time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateString) {
    if (!dateString) return 'TBD';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'TBD';
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric", 
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch (error) {
        console.error('Error formatting date time:', error);
        return 'TBD';
    }
}

/**
 * Format a date string to just the date portion
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
    if (!dateString) return 'TBD';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'TBD';
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'TBD';
    }
}

/**
 * Format a date string to just the time portion
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time
 */
export function formatTime(dateString) {
    if (!dateString) return 'TBD';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'TBD';
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'TBD';
    }
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateString) {
    if (!dateString) return 'TBD';
    try {
        const date = new Date(dateString);
        const now = new Date();
        if (isNaN(date.getTime())) return 'TBD';
        
        const diffMs = date.getTime() - now.getTime();
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        
        if (Math.abs(diffMinutes) < 60) {
            if (diffMinutes > 0) return `in ${diffMinutes}m`;
            return `${Math.abs(diffMinutes)}m ago`;
        } else if (Math.abs(diffHours) < 24) {
            if (diffHours > 0) return `in ${diffHours}h`;
            return `${Math.abs(diffHours)}h ago`;
        } else {
            if (diffDays > 0) return `in ${diffDays}d`;
            return `${Math.abs(diffDays)}d ago`;
        }
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return 'TBD';
    }
}

/**
 * Get time remaining until a future date
 * @param {string} dateString - ISO date string
 * @returns {string} Time remaining string
 */
export function getTimeRemaining(dateString) {
    if (!dateString) return 'TBD';
    try {
        const endDate = new Date(dateString);
        const now = new Date();
        if (isNaN(endDate.getTime())) return 'TBD';
        
        const diffMs = endDate.getTime() - now.getTime();
        
        if (diffMs <= 0) return 'Ended';
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    } catch (error) {
        console.error('Error calculating time remaining:', error);
        return 'TBD';
    }
}

/**
 * Check if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
export function isDatePast(dateString) {
    if (!dateString) return false;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return false;
        return date.getTime() < new Date().getTime();
    } catch (error) {
        console.error('Error checking if date is past:', error);
        return false;
    }
}

/**
 * Check if a date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is today
 */
export function isToday(dateString) {
    if (!dateString) return false;
    try {
        const date = new Date(dateString);
        const today = new Date();
        if (isNaN(date.getTime())) return false;
        
        return date.toDateString() === today.toDateString();
    } catch (error) {
        console.error('Error checking if date is today:', error);
        return false;
    }
}

/**
 * Get human-readable time ago string (e.g., "2 minutes ago", "1 hour ago", "3 days ago")
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {string} Human-readable time ago string
 */
export function timeAgo(dateInput) {
    if (!dateInput) return 'unknown';
    
    try {
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        const now = new Date();
        
        if (isNaN(date.getTime())) return 'unknown';
        
        // Calculate difference in seconds
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        
        // If date is in the future, return "just now"
        if (diffSeconds < 0) return 'just now';
        
        // Less than a minute
        if (diffSeconds < 60) {
            return diffSeconds <= 5 ? 'just now' : `${diffSeconds} seconds ago`;
        }
        
        // Less than an hour
        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
        }
        
        // Less than a day
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        }
        
        // Less than a week
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) {
            return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
        }
        
        // Less than a month
        const diffWeeks = Math.floor(diffDays / 7);
        if (diffWeeks < 4) {
            return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
        }
        
        // Less than a year
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) {
            return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
        }
        
        // Years
        const diffYears = Math.floor(diffDays / 365);
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
        
    } catch (error) {
        console.error('Error calculating time ago:', error);
        return 'unknown';
    }
}
