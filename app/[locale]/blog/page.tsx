import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Calendar } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('pageTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(posts as Post[] | null)?.length ? (
            (posts as Post[]).map((p) => {
              const title = pick(p, 'title', locale);
              return (
                <Link key={p.id} href={`/${locale}/blog/${p.slug}`} className="group">
                  <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                    {p.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_image} alt={title} className="h-40 w-full rounded-t-lg object-cover" />
                    )}
                    <CardHeader>
                      <CardDescription className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        {t('publishedAt')} {formatDate(p.created_at, locale)}
                      </CardDescription>
                      <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {t('readMore')} <ArrowRight className="size-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <p className="text-muted-foreground">{t('noItems')}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
