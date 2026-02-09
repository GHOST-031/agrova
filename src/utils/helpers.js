/**
 * ID Helper Utilities
 * Handles inconsistencies between MongoDB _id and local id fields
 */

/**
 * Get ID from an item that might have _id or id
 * @param {Object|string} item - Item object or ID string
 * @returns {string|null} The ID or null if not found
 */
export const getId = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  return item._id || item.id;
};

/**
 * Compare two items by their IDs
 * @param {Object|string} item1 - First item or ID
 * @param {Object|string} item2 - Second item or ID
 * @returns {boolean} True if IDs match
 */
export const compareIds = (item1, item2) => {
  const id1 = getId(item1);
  const id2 = getId(item2);
  if (!id1 || !id2) return false;
  return id1 === id2;
};

/**
 * Normalize item to have consistent id field
 * @param {Object} item - Item to normalize
 * @returns {Object} Item with id field
 */
export const normalizeItem = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: getId(item)
  };
};

/**
 * Normalize array of items
 * @param {Array} items - Array of items to normalize
 * @returns {Array} Array with normalized items
 */
export const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeItem);
};

/**
 * Find item in array by ID
 * @param {Array} items - Array to search
 * @param {Object|string} targetItem - Item or ID to find
 * @returns {Object|undefined} Found item or undefined
 */
export const findById = (items, targetItem) => {
  if (!Array.isArray(items)) return undefined;
  const targetId = getId(targetItem);
  return items.find(item => compareIds(item, targetId));
};

/**
 * Filter items by ID
 * @param {Array} items - Array to filter
 * @param {Object|string} targetItem - Item or ID to exclude
 * @returns {Array} Filtered array
 */
export const filterById = (items, targetItem) => {
  if (!Array.isArray(items)) return [];
  const targetId = getId(targetItem);
  return items.filter(item => !compareIds(item, targetId));
};

/**
 * Check if item exists in array by ID
 * @param {Array} items - Array to check
 * @param {Object|string} targetItem - Item or ID to check
 * @returns {boolean} True if exists
 */
export const existsById = (items, targetItem) => {
  return !!findById(items, targetItem);
};

/**
 * Get unique items by ID
 * @param {Array} items - Array with potential duplicates
 * @returns {Array} Array with unique items
 */
export const uniqueById = (items) => {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter(item => {
    const id = getId(item);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

/**
 * Format price to Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price
 */
export const formatPrice = (amount) => {
  if (typeof amount !== 'number') return '₹0.00';
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Result of the function
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (400-499)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // If this wasn't the last attempt, wait before retrying
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Generate random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
