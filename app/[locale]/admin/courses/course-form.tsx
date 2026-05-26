import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { saveCourse } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import type { Course, Locale, SyllabusItem } from '@/types/database';

// helper: แปลง syllabus array → text สำหรับ textarea
function syllabusToText(items: SyllabusItem[] = []): string {
  return items
    .map((it) => `${it.chapter}. ${it.title}\n${it.topics.map((t) => `- ${t}`).join('\n')}`)
    .join('\n\n');
}

export async function CourseForm({ course, locale }: { course?: Course; locale: Locale }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  return (
    <div className="max-w-3xl">
      <Link href={`/${locale}/admin/courses`} className="text-sm text-brand-emerald hover:underline">
        ← {tCommon('back')}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {course ? `${tCommon('edit')}: ${course.title_th}` : t('newItem')}
      </h1>

      <form action={saveCourse} className="mt-6 space-y-5">
        {course && <input type="hidden" name="id" value={course.id} />}
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label className="label" htmlFor="slug">{t('slug')}</label>
          <input id="slug" name="slug" required defaultValue={course?.slug ?? ''} className="input font-mono" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="title_th">Title ({t('thai')})</label>
            <input id="title_th" name="title_th" required defaultValue={course?.title_th ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="title_en">Title ({t('english')})</label>
            <input id="title_en" name="title_en" required defaultValue={course?.title_en ?? ''} className="input" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="description_th">Description ({t('thai')})</label>
            <textarea id="description_th" name="description_th" rows={3} defaultValue={course?.description_th ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="description_en">Description ({t('english')})</label>
            <textarea id="description_en" name="description_en" rows={3} defaultValue={course?.description_en ?? ''} className="input" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="label" htmlFor="level">Level</label>
            <select id="level" name="level" defaultValue={course?.level ?? 'beginner'} className="input">
              <option value="beginner">beginner</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="price">Price (THB)</label>
            <input id="price" name="price" type="number" step="0.01" min="0" defaultValue={course?.price ?? 0} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" defaultValue={course?.image_url ?? ''} className="input" />
            <ImageUploader folder="courses" targetInputId="image_url" />
          </div>
        </div>

        {/* syllabus: รูปแบบ "1. ชื่อบท\n- หัวข้อ1\n- หัวข้อ2" */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="syllabus_th">Syllabus ({t('thai')})</label>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              รูปแบบ: <code>1. ชื่อบท</code> ตามด้วย <code>- หัวข้อย่อย</code>
            </p>
            <textarea id="syllabus_th" name="syllabus_th" rows={8}
              defaultValue={syllabusToText(course?.syllabus_th)} className="input font-mono text-xs" />
          </div>
          <div>
            <label className="label" htmlFor="syllabus_en">Syllabus ({t('english')})</label>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
              Format: <code>1. Chapter title</code> then <code>- topic</code>
            </p>
            <textarea id="syllabus_en" name="syllabus_en" rows={8}
              defaultValue={syllabusToText(course?.syllabus_en)} className="input font-mono text-xs" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="benefits_th">Benefits ({t('thai')}) — บรรทัดละ 1</label>
            <textarea id="benefits_th" name="benefits_th" rows={4}
              defaultValue={(course?.benefits_th ?? []).join('\n')} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="benefits_en">Benefits ({t('english')}) — one per line</label>
            <textarea id="benefits_en" name="benefits_en" rows={4}
              defaultValue={(course?.benefits_en ?? []).join('\n')} className="input" />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={course?.is_published ?? false} />
          <span className="text-sm">{t('publish')}</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{tCommon('save')}</button>
          <Link href={`/${locale}/admin/courses`} className="btn-secondary">{tCommon('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
