import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Number formatting
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatCompact(num: number): string {
  if (num >= 1000000) {
    return formatNumber(num / 1000000, { maximumFractionDigits: 1 }) + 'M';
  }
  if (num >= 1000) {
    return formatNumber(num / 1000, { maximumFractionDigits: 1 }) + 'K';
  }
  return formatNumber(num);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Duration formatting
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

export function formatDurationLong(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`;
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min`;
}

// Date formatting
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// Change calculation
export function calculateChange(current: number, previous: number): {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
} {
  if (previous === 0) {
    return { value: current, percentage: 100, direction: current > 0 ? 'up' : 'neutral' };
  }
  
  const change = current - previous;
  const percentage = (change / previous) * 100;
  
  return {
    value: change,
    percentage: Math.abs(percentage),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
  };
}

// Color utilities
export const chartColors = {
  primary: 'hsl(217, 91%, 60%)',
  secondary: 'hsl(215, 20.2%, 65.1%)',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  orange: '#f97316',
};

export const chartColorArray = [
  chartColors.primary,
  chartColors.success,
  chartColors.warning,
  chartColors.info,
  chartColors.purple,
  chartColors.pink,
  chartColors.cyan,
  chartColors.orange,
];

// URL utilities
export function getPageTitle(url: string): string {
  try {
    const path = new URL(url, 'http://example.com').pathname;
    if (path === '/' || path === '') return 'Home';
    return path
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || url;
  } catch {
    return url;
  }
}

export function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

// Device type helpers
export function getDeviceIcon(deviceType: string): string {
  const icons: Record<string, string> = {
    Desktop: 'monitor',
    Mobile: 'smartphone',
    Tablet: 'tablet',
  };
  return icons[deviceType] || 'help-circle';
}

// Browser helpers
export function getBrowserIcon(browser: string): string {
  const browserLower = browser.toLowerCase();
  if (browserLower.includes('chrome')) return 'chrome';
  if (browserLower.includes('firefox')) return 'firefox';
  if (browserLower.includes('safari')) return 'safari';
  if (browserLower.includes('edge')) return 'edge';
  if (browserLower.includes('opera')) return 'opera';
  return 'globe';
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Local storage helpers
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}
