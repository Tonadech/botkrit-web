import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Bot, GraduationCap, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/types/database';

// หน้าแรก — hero (bleed) + 3 service cards (contained)
export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('home');

  return (
    <PageShell locale={locale} bleedContent>
      {/* Hero section (full-bleed) */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
              <Sparkles className="size-3" /> BOTKRIT 2026
            </Badge>
            <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-white/75 sm:text-lg">
              {t('heroSubtitle')}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={`/${locale}/ea`}>{t('ctaExploreEA')} <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                <Link href={`/${locale}/courses`}>{t('ctaExploreCourses')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 บริการหลัก (contained ภายใน main) */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary">Services</Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{t('servicesTitle')}</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ServiceCard
            href={`/${locale}/ea`}
            title={t('service1Title')}
            description={t('service1Desc')}
            icon={<Bot className="size-6" />}
          />
          <ServiceCard
            href={`/${locale}/courses`}
            title={t('service2Title')}
            description={t('service2Desc')}
            icon={<GraduationCap className="size-6" />}
          />
          <ServiceCard
            href={`/${locale}/botkrit`}
            title={t('service3Title')}
            description={t('service3Desc')}
            icon={<Lightbulb className="size-6" />}
          />
        </div>
      </section>
    </PageShell>
  );
}

function ServiceCard({
  href, title, description, icon,
}: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
          <CardTitle className="mt-4 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowRight className="size-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
