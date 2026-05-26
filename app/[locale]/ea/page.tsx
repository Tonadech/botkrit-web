import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type EA } from '@/types/database';
import { formatPrice } from '@/lib/utils';

// หน้า /ea — รายการ EA ทั้งหมดที่ publish แล้ว
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
      <section className="container-page py-12">
        {/* ส่วนให้ความรู้ EA คืออะไร */}
        <div className="card bg-brand-navy/5 dark:bg-white/5 border-brand-emerald/30 mb-10">
          <h2 className="text-xl font-bold text-brand-emerald">{t('knowledgeTitle')}</h2>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{t('knowledgeDesc')}</p>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(eas as EA[] | null)?.length ? (
            (eas as EA[]).map((ea) => (
              <EACard key={ea.id} ea={ea} locale={locale} t={t} />
            ))
          ) : (
            <p className="text-[hsl(var(--muted-foreground))]">{t('noItems')}</p>
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
    <div className="card flex flex-col">
      {ea.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ea.image_url} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-brand-navy to-brand-emerald rounded-md mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {name.charAt(0)}
        </div>
      )}

      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">{description}</p>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-xl font-bold text-brand-emerald">{formatPrice(ea.price, locale)}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/${locale}/ea/${ea.slug}`} className="btn-secondary flex-1 text-center">
          {t('features')}
        </Link>
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
  );
}
