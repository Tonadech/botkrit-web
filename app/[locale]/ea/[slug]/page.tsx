import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, CheckCircle2, TrendingUp } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type EA } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default async function EADetailPage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  const t = await getTranslations('ea');
  const tCommon = await getTranslations('common');
  const supabase = createClient();

  const { data: ea } = await supabase
    .from('eas')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle<EA>();

  if (!ea) notFound();

  const name = pick(ea, 'name', locale);
  const description = pick(ea, 'description', locale);
  const features = (locale === 'th' ? ea.features_th : ea.features_en) || [];

  return (
    <PageShell locale={locale}>
      <article className="container-page py-12">
        <Link href={`/${locale}/ea`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" /> {tCommon('back')}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            {ea.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ea.image_url} alt={name} className="w-full rounded-xl object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-secondary via-secondary/85 to-primary text-6xl font-bold text-white">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{name}</h1>
            <p className="mt-4 text-muted-foreground">{description}</p>
            <p className="mt-6 text-3xl font-bold text-primary">{formatPrice(ea.price, locale)}</p>
            <div className="mt-6">
              <PurchaseModal
                triggerLabel={t('buyOrInquire')}
                itemName={name}
                itemType="ea"
                itemId={ea.id}
                price={ea.price}
                locale={locale}
              />
            </div>
          </div>
        </div>

        {features.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold">{t('features')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ea.backtest_result && (
          <Card className="mt-12 border-accent/30 bg-accent/5">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <TrendingUp className="size-5 text-accent" />
              <CardTitle>{t('backtest')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{ea.backtest_result}</p>
            </CardContent>
          </Card>
        )}
      </article>
    </PageShell>
  );
}
