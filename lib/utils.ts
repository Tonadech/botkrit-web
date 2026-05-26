import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// รวม class แบบฉลาด (ตัด class ที่ทับซ้อนของ tailwind อัตโนมัติ)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// จัดรูปแบบราคา (THB)
export function formatPrice(amount: number, locale: 'th' | 'en' = 'th'): string {
  return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount);
}

// จัดรูปแบบวันที่
export function formatDate(date: string | Date, locale: 'th' | 'en' = 'th'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
