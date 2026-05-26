import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/admin/delete-button';
import { deletePost } from './actions';
import { createClient } from '@/lib/supabase/server';
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('managePosts')}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/posts/new`}><Plus className="size-4" /> {t('newItem')}</Link>
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Title (TH)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">—</th>
            </tr>
          </thead>
          <tbody>
            {(posts as Post[] | null)?.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.title_th}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.created_at, locale)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.is_published ? 'default' : 'outline'}>
                    {p.is_published ? tCommon('published') : tCommon('draft')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/${locale}/admin/posts/${p.id}`}>
                      <Pencil className="size-3.5" /> {tCommon('edit')}
                    </Link>
                  </Button>
                  <DeleteButton id={p.id} locale={locale} action={deletePost}
                    confirmLabel={t('confirmDelete')} label={tCommon('delete')} />
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">—</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
