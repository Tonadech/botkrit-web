import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Info, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type EA } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default async function EAListPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations('ea');
  const supabase = createClient();
  const { data: eas } = await supabase
    .from('eas')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <PageShell locale={locale}>
      <section>
        {/* knowledge card */}
        <Card className="mb-10 border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary shrink-0">
              <Info className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base text-primary">{t('knowledgeTitle')}</CardTitle>
              <CardDescription className="mt-1">{t('knowledgeDesc')}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('pageTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(eas as EA[] | null)?.length ? (
            (eas as EA[]).map((ea) => <EACard key={ea.id} ea={ea} locale={locale} t={t} />)
          ) : (
            <p className="text-muted-foreground">{t('noItems')}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function EACard({
  ea, locale, t,
}: { ea: EA; locale: Locale; t: (key: string) => string }) {
  const name = pick(ea, 'name', locale);
  const description = pick(ea, 'description', locale);

  return (
    <Card className="flex flex-col overflow-hidden">
      {ea.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ea.image_url} alt={name} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-secondary via-secondary/85 to-primary text-3xl font-bold text-white">
          {name.charAt(0)}
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-bold text-primary">{formatPrice(ea.price, locale)}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/${locale}/ea/${ea.slug}`}>
            {t('features')} <ArrowRight className="size-4" />
          </Link>
        </Button>
        <PurchaseModal
          triggerLabel={t('buyOrInquire')}
          itemName={name}
          itemType="ea"
          itemId={ea.id}
          price={ea.price}
          locale={locale}
        />
      </CardFooter>
    </Card>
  );
}
