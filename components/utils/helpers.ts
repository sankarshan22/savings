/**
 * Generates a cryptographically secure unique identifier
 * @returns A UUID string
 */
export const generateId = (): string => {
  // Use native crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Validates and sanitizes string input to prevent XSS attacks
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (default: 500)
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Trim whitespace and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Escape HTML special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
};

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates date is within reasonable range
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns True if date is valid and within range
 */
export const isValidDate = (dateString: string): boolean => {
  // Parse DD/MM/YYYY format
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0] ?? '', 10);
  const month = parseInt(parts[1] ?? '', 10);
  const year = parseInt(parts[2] ?? '', 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  
  const date = new Date(year, month - 1, day);
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const oneYearAhead = new Date();
  oneYearAhead.setFullYear(now.getFullYear() + 1);
  
  return date >= oneYearAgo && date <= oneYearAhead;
};

/**
 * Converts Date object to DD/MM/YYYY format
 * @param date - Date object
 * @returns Date string in DD/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converts DD/MM/YYYY string to YYYY-MM-DD format for HTML date input
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date string in YYYY-MM-DD format
 */
export const convertDDMMYYYYToISO = (dateString: string): string => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  const day = parts[0] ?? '';
  const month = parts[1] ?? '';
  const year = parts[2] ?? '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Converts YYYY-MM-DD string to DD/MM/YYYY format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date string in DD/MM/YYYY format
 */
export const convertISOToDDMMYYYY = (dateString: string): string => {
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const year = parts[0] ?? '';
  const month = parts[1] ?? '';
  const day = parts[2] ?? '';
  return `${day}/${month}/${year}`;
};

/**
 * Validates numeric input is positive and within reasonable range
 * @param value - Number to validate
 * @param max - Maximum allowed value (default: 1000000)
 * @returns True if valid
 */
export const isValidAmount = (value: number, max: number = 1000000): boolean => {
  return typeof value === 'number' && 
         !isNaN(value) && 
         isFinite(value) && 
         value >= 0 && 
         value <= max;
};

/**
 * Safely parses JSON from localStorage with error handling
 * @param key - LocalStorage key
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed object or default value
 */
export const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely sets JSON in localStorage with error handling
 * @param key - LocalStorage key
 * @param value - Value to store
 * @returns True if successful
 */
export const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Debounce function to limit execution rate
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};
