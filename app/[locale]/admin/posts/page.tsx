import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/delete-button';
import { deletePost } from './actions';
import { formatDate } from '@/lib/utils';
import type { Locale, Post } from '@/types/database';

export default async function AdminPostsPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');
  const supabase = createClient();
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('managePosts')}</h1>
        <Link href={`/${locale}/admin/posts/new`} className="btn-primary">+ {t('newItem')}</Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--muted))]">
            <tr className="text-left">
              <th className="px-4 py-3">Title (TH)</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">—</th>
            </tr>
          </thead>
          <tbody>
            {(posts as Post[] | null)?.map((p) => (
              <tr key={p.id} className="border-t border-[hsl(var(--border))]">
                <td className="px-4 py-3 font-medium">{p.title_th}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-3 text-xs">{formatDate(p.created_at, locale)}</td>
                <td className="px-4 py-3">
                  <span className={p.is_published ? 'text-brand-emerald' : 'text-[hsl(var(--muted-foreground))]'}>
                    {p.is_published ? tCommon('published') : tCommon('draft')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/${locale}/admin/posts/${p.id}`} className="text-brand-emerald hover:underline">
                    {tCommon('edit')}
                  </Link>
                  <DeleteButton id={p.id} locale={locale} action={deletePost}
                    confirmLabel={t('confirmDelete')} label={tCommon('delete')} />
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]">—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
