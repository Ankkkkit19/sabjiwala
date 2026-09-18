import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PREPARATION_LABELS, PreparationType } from './data';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return `₹${price.toFixed(0)}`;
}

export function formatWeight(grams: number): string {
    if (grams >= 1000) {
        return `${grams / 1000}kg`;
    }
    return `${grams}g`;
}

export function formatPrepType(prep: PreparationType): string {
    return PREPARATION_LABELS[prep] ?? prep;
}

export function generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `FC${timestamp}${random}`;
}

export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function validatePhone(phone: string): boolean {
    return /^[6-9]\d{9}$/.test(phone);
}

export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePincode(pincode: string): boolean {
    return /^\d{6}$/.test(pincode);
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const ORDER_STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: '⏳' },
    CONFIRMED: { label: 'Confirmed', color: 'text-green-600 bg-green-50', icon: '✓' },
    PREPARING: { label: 'Preparing', color: 'text-orange-600 bg-orange-50', icon: '👨‍🍳' },
    PACKED: { label: 'Packed', color: 'text-purple-600 bg-purple-50', icon: '📦' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-blue-600 bg-blue-50', icon: '🛵' },
    DELIVERED: { label: 'Delivered', color: 'text-green-700 bg-green-100', icon: '✅' },
    CANCELLED: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: '✕' },
    REFUNDED: { label: 'Refunded', color: 'text-gray-600 bg-gray-100', icon: '↩' },
};

export const PAYMENT_STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
    PAID: { label: 'Paid', color: 'text-green-600 bg-green-50' },
    FAILED: { label: 'Failed', color: 'text-red-600 bg-red-50' },
    REFUNDED: { label: 'Refunded', color: 'text-gray-600 bg-gray-100' },
};
