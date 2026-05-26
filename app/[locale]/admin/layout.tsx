import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LogoutButton } from '@/components/logout-button';
import { isAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

// Layout หลังบ้าน — เช็คสิทธิ์ admin (ยกเว้นหน้า login)
export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const t = await getTranslations('admin');
  const tNav = await getTranslations('nav');

  // ดึง session — middleware ได้กรอง user ที่ยังไม่ login ออกไปแล้วในเส้นทาง /admin (ยกเว้น /login)
  // ที่นี่เช็คเพิ่มเฉพาะเรื่อง role admin
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ถ้ายังไม่ login → ปล่อยให้แสดง (จะเป็นหน้า login ที่ render เนื้อหาเอง)
  if (!user) {
    return <>{children}</>;
  }

  // login แล้วแต่ไม่ใช่ admin → kick ออกหน้าแรก
  const adminOk = await isAdmin();
  if (!adminOk) {
    redirect(`/${locale}`);
  }

  const links = [
    { href: `/${locale}/admin`, label: t('dashboard') },
    { href: `/${locale}/admin/eas`, label: t('manageEAs') },
    { href: `/${locale}/admin/courses`, label: t('manageCourses') },
    { href: `/${locale}/admin/posts`, label: t('managePosts') },
    { href: `/${locale}/admin/inquiries`, label: t('viewInquiries') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href={`/${locale}`} className="text-2xl font-bold text-brand-gold">BOTKRIT</Link>
          <p className="text-xs text-white/60 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-white/60 truncate">{user.email}</p>
          <LogoutButton locale={locale} label={t('logout')} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
          <div className="flex h-14 items-center justify-end px-6 gap-3">
            <Link href={`/${locale}`} className="text-xs text-[hsl(var(--muted-foreground))] hover:text-brand-emerald">
              ← {tNav('home')}
            </Link>
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6 bg-[hsl(var(--muted))]">{children}</main>
      </div>
    </div>
  );
}
