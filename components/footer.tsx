import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { TrendingUp, AlertTriangle, MessageCircle, Send, Mail } from 'lucide-react';
import { FacebookIcon } from '@/components/brand-icons';
import { siteConfig } from '@/lib/config';
import type { Locale } from '@/types/database';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="mt-auto border-t bg-secondary text-secondary-foreground">
      <div className="container-page py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <TrendingUp className="size-4" />
            </span>
            <span className="text-xl font-bold text-accent">BOTKRIT</span>
          </Link>
          <p className="mt-3 text-sm text-secondary-foreground/70 max-w-sm">{t('tagline')}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">{t('links')}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={`/${locale}/ea`} className="hover:text-accent transition-colors">{tNav('ea')}</Link></li>
            <li><Link href={`/${locale}/courses`} className="hover:text-accent transition-colors">{tNav('courses')}</Link></li>
            <li><Link href={`/${locale}/blog`} className="hover:text-accent transition-colors">{tNav('blog')}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-accent transition-colors">{tNav('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">{t('contact')}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <MessageCircle className="size-4" /> Line
              </a>
            </li>
            <li>
              <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <FacebookIcon className="size-4" /> Facebook
              </a>
            </li>
            <li>
              <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Send className="size-4" /> Telegram
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2 hover:text-accent break-all">
                <Mail className="size-4 shrink-0" /> {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-4 text-center text-xs text-secondary-foreground/60">
          <p className="inline-flex items-center gap-1.5"><AlertTriangle className="size-3.5 text-accent" /> {t('disclaimer')}</p>
          <p className="mt-2">© {new Date().getFullYear()} BOTKRIT — {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
