import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteEA } from './actions';
import { formatPrice } from '@/lib/utils';
import type { EA, Locale } from '@/types/database';

export default async function AdminEAsListPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');
  const tEA = await getTranslations('ea');

  const supabase = createClient();
  const { data: eas } = await supabase.from('eas').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('manageEAs')}</h1>
        <Link href={`/${locale}/admin/eas/new`} className="btn-primary">
          + {t('newItem')}
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--muted))]">
            <tr className="text-left">
              <th className="px-4 py-3">Name (TH)</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">{tEA('price')}</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">—</th>
            </tr>
          </thead>
          <tbody>
            {(eas as EA[] | null)?.map((ea) => (
              <tr key={ea.id} className="border-t border-[hsl(var(--border))]">
                <td className="px-4 py-3 font-medium">{ea.name_th}</td>
                <td className="px-4 py-3 font-mono text-xs">{ea.slug}</td>
                <td className="px-4 py-3">{formatPrice(ea.price, locale)}</td>
                <td className="px-4 py-3">
                  <span className={ea.is_published ? 'text-brand-emerald' : 'text-[hsl(var(--muted-foreground))]'}>
                    {ea.is_published ? tCommon('published') : tCommon('draft')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    href={`/${locale}/admin/eas/${ea.id}`}
                    className="text-brand-emerald hover:underline"
                  >
                    {tCommon('edit')}
                  </Link>
                  <DeleteButton
                    id={ea.id}
                    locale={locale}
                    action={deleteEA}
                    confirmLabel={t('confirmDelete')}
                    label={tCommon('delete')}
                  />
                </td>
              </tr>
            ))}
            {!eas?.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]">—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
