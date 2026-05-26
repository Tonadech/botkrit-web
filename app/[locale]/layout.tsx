import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { locales, type AppLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'BOTKRIT — Forex EA & Course',
  description: 'พัฒนา EA และสอนสร้าง EA ด้วยมือตัวเอง',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// public pages ใช้ navbar ที่อ่าน cookies (เช็ค user) → ต้อง render เป็น dynamic
// ถ้าอยากให้บางหน้า static ค่อย override ใน page นั้นเฉพาะ
export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // เช็ค locale ที่รองรับ
  if (!locales.includes(locale as AppLocale)) notFound();

  // โหลด messages ของ locale นั้น
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
