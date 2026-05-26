import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { saveEA } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import type { EA, Locale } from '@/types/database';

// ฟอร์ม EA — ใช้ทั้งสร้างใหม่ (ea = undefined) และแก้ไข (ea = ของเดิม)
export async function EAForm({ ea, locale }: { ea?: EA; locale: Locale }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  return (
    <div className="max-w-3xl">
      <Link href={`/${locale}/admin/eas`} className="text-sm text-brand-emerald hover:underline">
        ← {tCommon('back')}
      </Link>

      <h1 className="mt-2 text-2xl font-bold">
        {ea ? `${tCommon('edit')}: ${ea.name_th}` : t('newItem')}
      </h1>

      <form action={saveEA} className="mt-6 space-y-5">
        {ea && <input type="hidden" name="id" value={ea.id} />}
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label className="label" htmlFor="slug">{t('slug')}</label>
          <input id="slug" name="slug" required defaultValue={ea?.slug ?? ''} className="input font-mono" placeholder="my-ea-name" />
        </div>

        {/* ฟิลด์ไทย + อังกฤษ side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="name_th">Name ({t('thai')})</label>
            <input id="name_th" name="name_th" required defaultValue={ea?.name_th ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="name_en">Name ({t('english')})</label>
            <input id="name_en" name="name_en" required defaultValue={ea?.name_en ?? ''} className="input" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="description_th">Description ({t('thai')})</label>
            <textarea id="description_th" name="description_th" rows={4} defaultValue={ea?.description_th ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="description_en">Description ({t('english')})</label>
            <textarea id="description_en" name="description_en" rows={4} defaultValue={ea?.description_en ?? ''} className="input" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="features_th">Features ({t('thai')}) — บรรทัดละ 1 ข้อ</label>
            <textarea
              id="features_th" name="features_th" rows={5}
              defaultValue={(ea?.features_th ?? []).join('\n')}
              className="input"
              placeholder="จุดเด่นที่ 1&#10;จุดเด่นที่ 2"
            />
          </div>
          <div>
            <label className="label" htmlFor="features_en">Features ({t('english')}) — one per line</label>
            <textarea
              id="features_en" name="features_en" rows={5}
              defaultValue={(ea?.features_en ?? []).join('\n')}
              className="input"
              placeholder="Feature 1&#10;Feature 2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="price">Price (THB)</label>
            <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={ea?.price ?? 0} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" defaultValue={ea?.image_url ?? ''} className="input" placeholder="https://..." />
            <ImageUploader folder="eas" targetInputId="image_url" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="backtest_result">Backtest result</label>
          <textarea id="backtest_result" name="backtest_result" rows={4} defaultValue={ea?.backtest_result ?? ''} className="input" />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={ea?.is_published ?? false} />
          <span className="text-sm">{t('publish')}</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{tCommon('save')}</button>
          <Link href={`/${locale}/admin/eas`} className="btn-secondary">{tCommon('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
