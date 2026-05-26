import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { TrendingUp } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

// navbar หลัก — มี logo, links, ปุ่มสลับภาษา/ธีม
// ตรวจ session เพื่อโชว์ลิงก์ "หลังบ้าน" เมื่อ admin login แล้ว
export async function Navbar({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/ea`, label: t('ea') },
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/botkrit`, label: t('botkrit') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <TrendingUp className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">BOTKRIT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {user && (
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={`/${locale}/admin`}>{t('admin')}</Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden border-t overflow-x-auto">
        <div className="container-page flex gap-1 py-2 whitespace-nowrap">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {user && (
            <Button asChild size="sm" className="bg-accent text-accent-foreground">
              <Link href={`/${locale}/admin`}>{t('admin')}</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
