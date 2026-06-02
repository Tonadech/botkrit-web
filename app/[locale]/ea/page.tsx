import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Info, Zap, TrendingUp, LayoutGrid, PieChart, Layers } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { EACard } from '@/components/ea-card';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { EA_CATEGORIES, type EaCategory, type Locale, type EA } from '@/types/database';

const CATEGORY_ICONS: Record<EaCategory, typeof Zap> = {
  scalping: Zap,
  trend: TrendingUp,
  grid: LayoutGrid,
  portfolio: PieChart,
};

export default async function EAListPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { cat?: string };
}) {
  const t = await getTranslations('ea');
  const supabase = createClient();
  const { data: eas } = await supabase
    .from('eas')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const all = (eas as EA[] | null) ?? [];
  const active =
    searchParams?.cat && EA_CATEGORIES.includes(searchParams.cat as EaCategory)
      ? (searchParams.cat as EaCategory)
      : null;
  const filtered = active ? all.filter((ea) => ea.category === active) : all;

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

        {/* แถบกรองตามกลยุทธ์ */}
        {all.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <FilterChip
              href={`/${locale}/ea`}
              label={t('allCategories')}
              icon={<Layers className="size-4" />}
              count={all.length}
              active={!active}
            />
            {EA_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const count = all.filter((ea) => ea.category === cat).length;
              return (
                <FilterChip
                  key={cat}
                  href={`/${locale}/ea?cat=${cat}`}
                  label={t(`cat.${cat}`)}
                  icon={<Icon className="size-4" />}
                  count={count}
                  active={active === cat}
                />
              );
            })}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length ? (
            filtered.map((ea) => <EACard key={ea.id} ea={ea} locale={locale} t={t} />)
          ) : (
            <p className="text-muted-foreground">{t('noItems')}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FilterChip({
  href,
  label,
  icon,
  count,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {icon}
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-xs',
          active ? 'bg-primary-foreground/20' : 'bg-muted',
        )}
      >
        {count}
      </span>
    </Link>
  );
}
