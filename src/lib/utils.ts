import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounces a function
 * 
 * @param fn The function to debounce
 * @param ms The debounce time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, ms);
  };
}

/**
 * Formats a date to a locale string
 * 
 * @param date The date to format
 * @param options The date formatting options
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Truncates a string to a maximum length
 * 
 * @param text The text to truncate
 * @param length The maximum length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  
  return text.slice(0, length) + '...';
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param text The text to capitalize
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Formats a price
 * 
 * @param price The price to format
 * @param currency The currency code
 */
export function formatPrice(
  price: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Safely access nested object properties
 * 
 * @param obj The object to access
 * @param path The path to the property
 * @param defaultValue The default value if the property doesn't exist
 */
export function get<T>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    
    result = result[key];
  }
  
  return (result as T) ?? defaultValue;
}
