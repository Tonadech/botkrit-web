'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';
import { locales, type AppLocale } from '@/lib/i18n';

// ปุ่มสลับภาษา ไทย ↔ EN — แค่เปลี่ยน prefix /th, /en ใน path ปัจจุบัน
export function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const otherLocale: AppLocale = currentLocale === 'th' ? 'en' : 'th';

  const switchTo = (newLocale: AppLocale) => {
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as AppLocale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/') || `/${newLocale}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => switchTo(otherLocale)}
      aria-label="Switch language"
    >
      <Languages className="size-4" />
      <span className="text-xs font-semibold uppercase">
        {otherLocale === 'en' ? t('switchToEnglish') : t('switchToThai')}
      </span>
    </Button>
  );
}
