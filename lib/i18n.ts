import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// รายชื่อ locale ที่รองรับ — ไทยเป็นค่าเริ่มต้น
export const locales = ['th', 'en'] as const;
export const defaultLocale = 'th' as const;
export type AppLocale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // ป้องกัน locale แปลก ๆ ที่ไม่รองรับ
  if (!locales.includes(locale as AppLocale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Bangkok',
  };
});
