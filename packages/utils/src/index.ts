import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistance } from 'date-fns';
import { z } from 'zod';

// CSS class utilities
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Date utilities
export const formatDate = (date: Date | string, formatStr: string = 'PP') => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

export const formatDateDistance = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
};

// String utilities
export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

export const slugify = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

// Number utilities
export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

// Array utilities
export const groupBy = <T, K extends keyof any>(array: T[], getKey: (item: T) => K): Record<K, T[]> => {
    return array.reduce(
        (groups, item) => {
            const key = getKey(item);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        },
        {} as Record<K, T[]>,
    );
};

export const unique = <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
};

export const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
};

// Validation utilities
export const isEmail = (email: string): boolean => {
    const emailSchema = z.string().email();
    return emailSchema.safeParse(email).success;
};

export const isUrl = (url: string): boolean => {
    const urlSchema = z.string().url();
    return urlSchema.safeParse(url).success;
};

export const isPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
};

// Object utilities
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
};

// API utilities
export const createApiUrl = (baseUrl: string, path: string, params?: Record<string, any>) => {
    const url = new URL(path, baseUrl);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return url.toString();
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Error handling
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public isOperational: boolean = true,
    ) {
        super(message);
        this.name = this.constructor.name;
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

export const safeJsonParse = <T>(json: string, fallback: T): T => {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
};
