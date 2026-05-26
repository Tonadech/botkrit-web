import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

// Server Component — navbar หลัก โชว์ลิงก์ admin ถ้า login แล้ว
export async function Navbar({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');

  // เช็คว่ามี session admin หรือไม่ — เพื่อโชว์ลิงก์ "หลังบ้าน"
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/ea`, label: t('ea') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/botkrit`, label: t('botkrit') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-brand-gold">
            BOTKRIT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-brand-emerald transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href={`/${locale}/admin`}
              className="text-sm font-semibold text-brand-gold hover:text-brand-gold-light"
            >
              {t('admin')}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden border-t border-[hsl(var(--border))] overflow-x-auto">
        <div className="container-page flex gap-4 py-2 whitespace-nowrap">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-[hsl(var(--foreground))]">
              {link.label}
            </Link>
          ))}
          {user && (
            <Link href={`/${locale}/admin`} className="text-sm font-semibold text-brand-gold">
              {t('admin')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
