import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteEA } from './actions';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { EA, Locale } from '@/types/database';

export default async function AdminEAsListPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  const supabase = createClient();
  const { data: eas } = await supabase.from('eas').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('manageEAs')}</h1>
        <Button asChild>
          <Link href={`/${locale}/admin/eas/new`}><Plus className="size-4" /> {t('newItem')}</Link>
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Name (TH)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">—</th>
            </tr>
          </thead>
          <tbody>
            {(eas as EA[] | null)?.map((ea) => (
              <tr key={ea.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{ea.name_th}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ea.slug}</td>
                <td className="px-4 py-3">{formatPrice(ea.price, locale)}</td>
                <td className="px-4 py-3">
                  <Badge variant={ea.is_published ? 'default' : 'outline'}>
                    {ea.is_published ? tCommon('published') : tCommon('draft')}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/${locale}/admin/eas/${ea.id}`}>
                      <Pencil className="size-3.5" /> {tCommon('edit')}
                    </Link>
                  </Button>
                  <DeleteButton id={ea.id} locale={locale} action={deleteEA}
                    confirmLabel={t('confirmDelete')} label={tCommon('delete')} />
                </td>
              </tr>
            ))}
            {!eas?.length && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">—</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
