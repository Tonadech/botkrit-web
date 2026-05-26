import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LayoutDashboard, Bot, GraduationCap, FileText, MessageSquare, Home, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LogoutButton } from '@/components/logout-button';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { isAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

// บังคับ dynamic เพราะใช้ cookies/auth
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const t = await getTranslations('admin');
  const tNav = await getTranslations('nav');

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ยังไม่ login → ให้ render เนื้อหา (จะเป็นหน้า login)
  if (!user) return <>{children}</>;

  // login แต่ไม่ใช่ admin → kick กลับ home
  const adminOk = await isAdmin();
  if (!adminOk) redirect(`/${locale}`);

  const links = [
    { href: `/${locale}/admin`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/admin/eas`, label: t('manageEAs'), icon: Bot },
    { href: `/${locale}/admin/courses`, label: t('manageCourses'), icon: GraduationCap },
    { href: `/${locale}/admin/posts`, label: t('managePosts'), icon: FileText },
    { href: `/${locale}/admin/inquiries`, label: t('viewInquiries'), icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-secondary text-secondary-foreground md:flex">
        <div className="p-6">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <TrendingUp className="size-5" />
            </span>
            <div>
              <p className="text-lg font-bold text-accent leading-none">BOTKRIT</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-secondary-foreground/60">Admin Panel</p>
            </div>
          </Link>
        </div>
        <Separator className="bg-white/10" />
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-secondary-foreground/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <l.icon className="size-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 p-4">
          <Separator className="bg-white/10" />
          <p className="truncate text-xs text-secondary-foreground/60">{user.email}</p>
          <LogoutButton locale={locale} label={t('logout')} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="flex h-14 items-center justify-end gap-2 px-6">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${locale}`} className="text-xs">
                <Home className="size-3.5" /> {tNav('home')}
              </Link>
            </Button>
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
