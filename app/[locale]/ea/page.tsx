import { getTranslations } from 'next-intl/server';
import { Info } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { EACard } from '@/components/ea-card';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { type Locale, type EA } from '@/types/database';

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
