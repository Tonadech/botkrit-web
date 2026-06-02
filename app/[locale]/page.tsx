import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Bot, GraduationCap, Lightbulb, ArrowRight, Network, Download, LineChart, Zap } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types/database';

// หน้าแรก — hero (bleed) + services + How It Works + CTA banner
export default async function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('home');

  return (
    <PageShell locale={locale} bleedContent>
      {/* Hero section (full-bleed) */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            {/* live trading terminal badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-primary">{t('heroEyebrow')}</span>
            </span>
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

      {/* How It Works — 3 ขั้นตอน */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('howTitle')}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t('howSubtitle')}</p>
          </div>
          <div className="relative mt-12 grid gap-10 md:grid-cols-3">
            {/* เส้นเชื่อมขั้นตอน (เฉพาะ desktop) */}
            <div className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px bg-border md:block" aria-hidden />
            <Step n="01" title={t('step1Title')} desc={t('step1Desc')} icon={<Network className="size-8" />} />
            <Step n="02" title={t('step2Title')} desc={t('step2Desc')} icon={<Download className="size-8" />} highlight />
            <Step n="03" title={t('step3Title')} desc={t('step3Desc')} icon={<LineChart className="size-8" />} />
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border bg-secondary px-6 py-14 text-center text-white">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.2),transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Zap className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{t('ctaBannerTitle')}</h2>
            <p className="mt-3 max-w-xl text-white/75">{t('ctaBannerSubtitle')}</p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={`/${locale}/ea`}>{t('ctaBannerButton')} <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
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

function Step({
  n, title, desc, icon, highlight,
}: { n: string; title: string; desc: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div
        className={cn(
          'flex size-20 items-center justify-center rounded-full border-2 bg-card',
          highlight
            ? 'border-primary/50 text-primary shadow-[0_0_24px_hsl(var(--primary)/0.18)]'
            : 'border-border text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <div className="mt-5 text-sm font-semibold tracking-widest text-primary">{n}</div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
