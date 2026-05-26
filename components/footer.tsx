import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/lib/config';
import type { Locale } from '@/types/database';

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="mt-auto border-t border-[hsl(var(--border))] bg-brand-navy text-white dark:bg-brand-navy-dark">
      <div className="container-page py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-brand-gold">BOTKRIT</h3>
          <p className="mt-2 text-sm text-white/70">{t('tagline')}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            {t('links')}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={`/${locale}/ea`} className="hover:text-brand-gold-light">{tNav('ea')}</Link></li>
            <li><Link href={`/${locale}/courses`} className="hover:text-brand-gold-light">{tNav('courses')}</Link></li>
            <li><Link href={`/${locale}/blog`} className="hover:text-brand-gold-light">{tNav('blog')}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-brand-gold-light">{tNav('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
            {t('contact')}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-light">Line</a></li>
            <li><a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-light">Facebook</a></li>
            <li><a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-light">Telegram</a></li>
            <li><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-gold-light">{siteConfig.contact.email}</a></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer ความเสี่ยง — แสดงทั้งภาษาตามที่ user ของ locale เลือก */}
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-center text-xs text-white/60">
          <p>⚠ {t('disclaimer')}</p>
          <p className="mt-2">© {new Date().getFullYear()} BOTKRIT — {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
