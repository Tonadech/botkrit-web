import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteCourse } from './actions';
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('manageCourses')}</h1>
        <Link href={`/${locale}/admin/courses/new`} className="btn-primary">+ {t('newItem')}</Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--muted))]">
            <tr className="text-left">
              <th className="px-4 py-3">Title (TH)</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">—</th>
            </tr>
          </thead>
          <tbody>
            {(courses as Course[] | null)?.map((c) => (
              <tr key={c.id} className="border-t border-[hsl(var(--border))]">
                <td className="px-4 py-3 font-medium">{c.title_th}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">{c.level}</td>
                <td className="px-4 py-3">{formatPrice(c.price, locale)}</td>
                <td className="px-4 py-3">
                  <span className={c.is_published ? 'text-brand-emerald' : 'text-[hsl(var(--muted-foreground))]'}>
                    {c.is_published ? tCommon('published') : tCommon('draft')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/${locale}/admin/courses/${c.id}`} className="text-brand-emerald hover:underline">
                    {tCommon('edit')}
                  </Link>
                  <DeleteButton id={c.id} locale={locale} action={deleteCourse}
                    confirmLabel={t('confirmDelete')} label={tCommon('delete')} />
                </td>
              </tr>
            ))}
            {!courses?.length && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]">—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
