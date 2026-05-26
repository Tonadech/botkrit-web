import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { InquiryForm } from '@/components/inquiry-form';
import { siteConfig } from '@/lib/config';
import type { InquiryType, Locale } from '@/types/database';

// หน้าติดต่อ — รับ query string ?type=ea&id=... จาก purchase modal
export default async function ContactPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { type?: string; id?: string };
}) {
  const t = await getTranslations('contact');

  const defaultType: InquiryType = ['ea', 'course', 'general'].includes(searchParams.type ?? '')
    ? (searchParams.type as InquiryType)
    : 'general';

  return (
    <PageShell locale={locale}>
      <section className="container-page py-12">
        <h1 className="text-3xl sm:text-4xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">{t('pageSubtitle')}</p>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-6">{t('formTitle')}</h2>
              <InquiryForm defaultType={defaultType} relatedId={searchParams.id} />
            </div>
          </div>

          <aside>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">{t('channelsTitle')}</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-emerald hover:underline">
                    💬 Line
                  </a>
                </li>
                <li>
                  <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-brand-emerald">
                    📘 Facebook
                  </a>
                </li>
                <li>
                  <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-brand-emerald">
                    ✈️ Telegram
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-2 hover:text-brand-emerald">
                    ✉️ {siteConfig.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
