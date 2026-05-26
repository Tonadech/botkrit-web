'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type AppLocale } from '@/lib/i18n';

// ปุ่มสลับภาษา ไทย ↔ EN
// แค่เปลี่ยน prefix /th, /en ใน path ปัจจุบัน
export function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const otherLocale: AppLocale = currentLocale === 'th' ? 'en' : 'th';

  const switchTo = (newLocale: AppLocale) => {
    // pathname จะเป็น /th/ea/... ต้อง replace แค่ส่วน locale แรก
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as AppLocale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/') || `/${newLocale}`);
  };

  return (
    <button
      onClick={() => switchTo(otherLocale)}
      className="rounded-md border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-brand-navy/5 dark:hover:bg-white/10 transition-colors"
      aria-label="Switch language"
    >
      {otherLocale === 'en' ? t('switchToEnglish') : t('switchToThai')}
    </button>
  );
}
