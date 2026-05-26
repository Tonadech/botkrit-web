import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BookOpen, Compass, MessageCircle, Send } from 'lucide-react';
import { FacebookIcon } from '@/components/brand-icons';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/lib/config';
import type { Locale } from '@/types/database';

export default async function BotkritPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('botkrit');
  const tNav = await getTranslations('nav');

  return (
    <PageShell locale={locale}>
      <section className="container-page py-16">
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t('pageTitle')}</h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpen className="size-5" />
              </div>
              <CardTitle>{t('story')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('storyBody')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                <Compass className="size-5" />
              </div>
              <CardTitle>{t('vision')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('visionBody')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-6 text-2xl font-bold">{tNav('contact')}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Line
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="size-4" /> Facebook
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer">
                <Send className="size-4" /> Telegram
              </a>
            </Button>
            <Button asChild>
              <Link href={`/${locale}/contact`}>{tNav('contact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
