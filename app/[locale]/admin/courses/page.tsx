import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteCourse } from './actions';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Course, Locale } from '@/types/database';

export default async function AdminCoursesPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');
  const supabase = createClient();
  const { data: courses } = await supabase.from('courses').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('manageCourses')}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/courses/new`}><Plus className="size-4" /> {t('newItem')}</Link>
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Title (TH)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">—</th>
            </tr>
          </thead>
          <tbody>
            {(courses as Course[] | null)?.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.title_th}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3"><Badge variant="outline">{c.level}</Badge></td>
                <td className="px-4 py-3">{formatPrice(c.price, locale)}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.is_published ? 'default' : 'outline'}>
                    {c.is_published ? tCommon('published') : tCommon('draft')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/${locale}/admin/courses/${c.id}`}>
                      <Pencil className="size-3.5" /> {tCommon('edit')}
                    </Link>
                  </Button>
                  <DeleteButton id={c.id} locale={locale} action={deleteCourse}
                    confirmLabel={t('confirmDelete')} label={tCommon('delete')} />
                </td>
              </tr>
            ))}
            {!courses?.length && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">—</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
