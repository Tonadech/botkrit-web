import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, Save } from 'lucide-react';
import { saveEA } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { EA, Locale } from '@/types/database';

export async function EAForm({ ea, locale }: { ea?: EA; locale: Locale }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  return (
    <div className="max-w-3xl">
      <Link href={`/${locale}/admin/eas`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ChevronLeft className="size-4" /> {tCommon('back')}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {ea ? `${tCommon('edit')}: ${ea.name_th}` : t('newItem')}
      </h1>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form action={saveEA} className="space-y-5">
            {ea && <input type="hidden" name="id" value={ea.id} />}
            <input type="hidden" name="locale" value={locale} />

            <div className="space-y-1.5">
              <Label htmlFor="slug">{t('slug')}</Label>
              <Input id="slug" name="slug" required defaultValue={ea?.slug ?? ''} className="font-mono" placeholder="my-ea-name" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name_th">Name ({t('thai')})</Label>
                <Input id="name_th" name="name_th" required defaultValue={ea?.name_th ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name_en">Name ({t('english')})</Label>
                <Input id="name_en" name="name_en" required defaultValue={ea?.name_en ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="description_th">Description ({t('thai')})</Label>
                <Textarea id="description_th" name="description_th" rows={4} defaultValue={ea?.description_th ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_en">Description ({t('english')})</Label>
                <Textarea id="description_en" name="description_en" rows={4} defaultValue={ea?.description_en ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="features_th">Features ({t('thai')}) — บรรทัดละ 1 ข้อ</Label>
                <Textarea id="features_th" name="features_th" rows={5}
                  defaultValue={(ea?.features_th ?? []).join('\n')}
                  placeholder="จุดเด่นที่ 1&#10;จุดเด่นที่ 2" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="features_en">Features ({t('english')}) — one per line</Label>
                <Textarea id="features_en" name="features_en" rows={5}
                  defaultValue={(ea?.features_en ?? []).join('\n')}
                  placeholder="Feature 1&#10;Feature 2" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (THB)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={ea?.price ?? 0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" name="image_url" defaultValue={ea?.image_url ?? ''} placeholder="https://..." />
                <ImageUploader folder="eas" targetInputId="image_url" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="backtest_result">Backtest result</Label>
              <Textarea id="backtest_result" name="backtest_result" rows={4} defaultValue={ea?.backtest_result ?? ''} />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked={ea?.is_published ?? false} className="size-4 rounded border-input" />
              <span>{t('publish')}</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit"><Save className="size-4" /> {tCommon('save')}</Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/eas`}>{tCommon('cancel')}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
