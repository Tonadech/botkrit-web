import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getTranslations } from 'next-intl/server';
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
        <Link href={`/${locale}/blog`} className="text-sm text-brand-emerald hover:underline">
          ← {tCommon('back')}
        </Link>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image} alt={title} className="mt-6 w-full rounded-xl object-cover" />
        )}

        <p className="mt-6 text-xs text-[hsl(var(--muted-foreground))]">
          {t('publishedAt')} {formatDate(post.created_at, locale)}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold">{title}</h1>

        <div className="mt-8 prose-content">
          <ReactMarkdownContent content={content || ''} />
        </div>
      </article>
    </PageShell>
  );
}

// ใช้ component แยกเพื่อใส่ style ของ markdown แบบ minimal
function ReactMarkdownContent({ content }: { content: string }) {
  return (
    <div className="space-y-4 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2 text-brand-emerald">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-[hsl(var(--foreground))]">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
          strong: ({ children }) => <strong className="font-semibold text-brand-gold">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
