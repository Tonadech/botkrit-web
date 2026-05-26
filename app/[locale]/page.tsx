import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import type { Locale } from '@/types/database';

// หน้าแรก — hero + 3 บริการหลัก + CTA
export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('home');

  return (
    <PageShell locale={locale}>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-emerald-dark text-white">
        <div className="container-page py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href={`/${locale}/ea`} className="btn-gold">
              {t('ctaExploreEA')}
            </Link>
            <Link href={`/${locale}/courses`} className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
              {t('ctaExploreCourses')}
            </Link>
          </div>
        </div>
      </section>

      {/* 3 บริการหลัก */}
      <section className="container-page py-20">
        <h2 className="text-3xl font-bold text-center mb-12">{t('servicesTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard
            href={`/${locale}/ea`}
            title={t('service1Title')}
            description={t('service1Desc')}
            icon="🤖"
          />
          <ServiceCard
            href={`/${locale}/courses`}
            title={t('service2Title')}
            description={t('service2Desc')}
            icon="🎓"
          />
          <ServiceCard
            href={`/${locale}/botkrit`}
            title={t('service3Title')}
            description={t('service3Desc')}
            icon="📈"
          />
        </div>
      </section>
    </PageShell>
  );
}

function ServiceCard({
  href, title, description, icon,
}: {
  href: string; title: string; description: string; icon: string;
}) {
  return (
    <Link
      href={href}
      className="card hover:border-brand-emerald hover:shadow-lg transition-all group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold group-hover:text-brand-emerald transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
    </Link>
  );
}
