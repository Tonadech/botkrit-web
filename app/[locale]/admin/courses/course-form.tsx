import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, Save } from 'lucide-react';
import { saveCourse } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Course, Locale, SyllabusItem } from '@/types/database';

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
      <Link href={`/${locale}/admin/courses`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ChevronLeft className="size-4" /> {tCommon('back')}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {course ? `${tCommon('edit')}: ${course.title_th}` : t('newItem')}
      </h1>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form action={saveCourse} className="space-y-5">
            {course && <input type="hidden" name="id" value={course.id} />}
            <input type="hidden" name="locale" value={locale} />

            <div className="space-y-1.5">
              <Label htmlFor="slug">{t('slug')}</Label>
              <Input id="slug" name="slug" required defaultValue={course?.slug ?? ''} className="font-mono" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title_th">Title ({t('thai')})</Label>
                <Input id="title_th" name="title_th" required defaultValue={course?.title_th ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title ({t('english')})</Label>
                <Input id="title_en" name="title_en" required defaultValue={course?.title_en ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="description_th">Description ({t('thai')})</Label>
                <Textarea id="description_th" name="description_th" rows={3} defaultValue={course?.description_th ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_en">Description ({t('english')})</Label>
                <Textarea id="description_en" name="description_en" rows={3} defaultValue={course?.description_en ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="level">Level</Label>
                <select id="level" name="level" defaultValue={course?.level ?? 'beginner'}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (THB)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={course?.price ?? 0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" name="image_url" defaultValue={course?.image_url ?? ''} />
                <ImageUploader folder="courses" targetInputId="image_url" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="syllabus_th">Syllabus ({t('thai')})</Label>
                <p className="text-xs text-muted-foreground">รูปแบบ: <code>1. ชื่อบท</code> ตามด้วย <code>- หัวข้อย่อย</code></p>
                <Textarea id="syllabus_th" name="syllabus_th" rows={8}
                  defaultValue={syllabusToText(course?.syllabus_th)} className="font-mono text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="syllabus_en">Syllabus ({t('english')})</Label>
                <p className="text-xs text-muted-foreground">Format: <code>1. Title</code> then <code>- topic</code></p>
                <Textarea id="syllabus_en" name="syllabus_en" rows={8}
                  defaultValue={syllabusToText(course?.syllabus_en)} className="font-mono text-xs" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="benefits_th">Benefits ({t('thai')}) — บรรทัดละ 1</Label>
                <Textarea id="benefits_th" name="benefits_th" rows={4}
                  defaultValue={(course?.benefits_th ?? []).join('\n')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="benefits_en">Benefits ({t('english')}) — one per line</Label>
                <Textarea id="benefits_en" name="benefits_en" rows={4}
                  defaultValue={(course?.benefits_en ?? []).join('\n')} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked={course?.is_published ?? false} className="size-4 rounded border-input" />
              <span>{t('publish')}</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit"><Save className="size-4" /> {tCommon('save')}</Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/courses`}>{tCommon('cancel')}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
