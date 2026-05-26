import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  Home, Bot, GraduationCap, Lightbulb, FileText, Mail, ShieldCheck,
  MessageCircle, Send,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FacebookIcon } from '@/components/brand-icons';
import { createClient } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/config';
import type { Locale } from '@/types/database';

// Sidebar เมนูซ้ายสำหรับหน้า public — ใช้ใน PageShell
// แสดงเสมอ บน desktop (md+), บน mobile ซ่อนแล้วเปิดผ่าน Sheet drawer ใน topbar
export async function PublicSidebar({ locale }: { locale: Locale }) {
  const t = await getTranslations('nav');
  const tFooter = await getTranslations('footer');

  // เช็ค user เพื่อโชว์ admin shortcut
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const links = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/ea`, label: t('ea'), icon: Bot },
    { href: `/${locale}/courses`, label: t('courses'), icon: GraduationCap },
    { href: `/${locale}/botkrit`, label: t('botkrit'), icon: Lightbulb },
    { href: `/${locale}/blog`, label: t('blog'), icon: FileText },
    { href: `/${locale}/contact`, label: t('contact'), icon: Mail },
  ];

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <l.icon className="size-4" />
            {l.label}
          </Link>
        ))}
      </div>

      {user && (
        <>
          <Separator className="my-3" />
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 rounded-md bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            <ShieldCheck className="size-4" />
            {t('admin')}
          </Link>
        </>
      )}

      <div className="mt-auto pt-4">
        <Separator className="mb-3" />
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tFooter('contact')}
        </p>
        <div className="mt-2 space-y-1 px-3">
          <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <MessageCircle className="size-3.5" /> Line
          </a>
          <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <FacebookIcon className="size-3.5" /> Facebook
          </a>
          <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <Send className="size-3.5" /> Telegram
          </a>
        </div>
      </div>
    </nav>
  );
}
