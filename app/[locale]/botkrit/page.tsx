import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { siteConfig } from '@/lib/config';
import type { Locale } from '@/types/database';

// หน้าเกี่ยวกับ BOTKRIT
export default async function BotkritPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('botkrit');
  const tNav = await getTranslations('nav');

  return (
    <PageShell locale={locale}>
      <section className="container-page py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">{t('pageTitle')}</h1>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-brand-emerald">{t('story')}</h2>
            <p className="mt-3 text-[hsl(var(--muted-foreground))]">{t('storyBody')}</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-brand-gold">{t('vision')}</h2>
            <p className="mt-3 text-[hsl(var(--muted-foreground))]">{t('visionBody')}</p>
          </div>
        </div>

        {/* ช่องทางติดต่อ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">{tNav('contact')}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Line
            </a>
            <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Facebook
            </a>
            <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Telegram
            </a>
            <Link href={`/${locale}/contact`} className="btn-primary">
              {tNav('contact')}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
