import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, Calendar } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type Post } from '@/types/database';
import { formatDate } from '@/lib/utils';

// หน้ารายละเอียดบทความ — render markdown
export default async function BlogDetailPage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  const t = await getTranslations('blog');
  const tCommon = await getTranslations('common');
  const supabase = createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle<Post>();

  if (!post) notFound();

  const title = pick(post, 'title', locale);
  const content = locale === 'th' ? post.content_th : post.content_en;

  return (
    <PageShell locale={locale}>
      <article className="container-page py-12 max-w-3xl">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" /> {tCommon('back')}
        </Link>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image} alt={title} className="mt-6 w-full rounded-xl object-cover" />
        )}

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          {t('publishedAt')} {formatDate(post.created_at, locale)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>

        <div className="mt-8">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="mt-6 text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="mt-5 text-xl font-bold text-primary">{children}</h2>,
              h3: ({ children }) => <h3 className="mt-4 text-lg font-semibold">{children}</h3>,
              p: ({ children }) => <p className="mt-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mt-3 list-inside list-disc space-y-1.5">{children}</ul>,
              strong: ({ children }) => <strong className="font-semibold text-accent">{children}</strong>,
            }}
          >
            {content || ''}
          </ReactMarkdown>
        </div>
      </article>
    </PageShell>
  );
}
