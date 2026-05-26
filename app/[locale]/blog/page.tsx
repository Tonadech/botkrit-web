import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type Post } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default async function BlogListPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('blog');
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <PageShell locale={locale}>
      <section className="container-page py-12">
        <h1 className="text-3xl sm:text-4xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(posts as Post[] | null)?.length ? (
            (posts as Post[]).map((p) => {
              const title = pick(p, 'title', locale);
              return (
                <Link key={p.id} href={`/${locale}/blog/${p.slug}`} className="card hover:border-brand-emerald transition-colors">
                  {p.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
                  )}
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {t('publishedAt')} {formatDate(p.created_at, locale)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm text-brand-emerald font-medium">
                    {t('readMore')} →
                  </p>
                </Link>
              );
            })
          ) : (
            <p className="text-[hsl(var(--muted-foreground))]">{t('noItems')}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
