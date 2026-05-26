import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { MobileNavTrigger } from './mobile-nav-trigger';
import { PublicSidebar } from './public-sidebar';
import type { Locale } from '@/types/database';

// Top bar เรียบๆ — logo + hamburger (mobile) + language/theme toggle
// ตัวเมนูหลักไปอยู่ใน sidebar ซ้ายแทน
export async function Topbar({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
        <MobileNavTrigger
          label={t('home')}
          sidebar={<PublicSidebar locale={locale} />}
        />
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <TrendingUp className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">BOTKRIT</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
