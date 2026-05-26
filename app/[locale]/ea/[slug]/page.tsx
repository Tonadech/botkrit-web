import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type EA } from '@/types/database';
import { formatPrice } from '@/lib/utils';

// หน้ารายละเอียด EA แต่ละตัว
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
        <Link href={`/${locale}/ea`} className="text-sm text-brand-emerald hover:underline">
          ← {tCommon('back')}
        </Link>

        <div className="mt-6 grid lg:grid-cols-2 gap-10">
          {/* รูป */}
          <div>
            {ea.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ea.image_url} alt={name} className="w-full rounded-xl object-cover" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-brand-navy to-brand-emerald rounded-xl flex items-center justify-center text-white text-6xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* รายละเอียด */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">{name}</h1>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">{description}</p>

            <div className="mt-6">
              <p className="text-3xl font-bold text-brand-emerald">{formatPrice(ea.price, locale)}</p>
            </div>

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

        {/* จุดเด่น */}
        {features.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold">{t('features')}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-brand-emerald">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Backtest */}
        {ea.backtest_result && (
          <div className="mt-12 card bg-brand-navy/5 dark:bg-white/5">
            <h2 className="text-2xl font-bold">{t('backtest')}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm">{ea.backtest_result}</p>
          </div>
        )}
      </article>
    </PageShell>
  );
}
