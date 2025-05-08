/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Jun 15, 2023")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 days")
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Calculate difference in days
  const diffTime = compareDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`;
  } else {
    return `In ${diffDays} days`;
  }
}

/**
 * Check if a date is in the past
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(dateString) {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Set both dates to midnight for accurate day comparison
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    return date < now;
  } catch (error) {
    console.error('Error checking if date is in the past:', error);
    return false;
  }
} 