import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type Course, type SyllabusItem } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default async function CourseDetailPage({
  params: { locale, slug },
}: { params: { locale: Locale; slug: string } }) {
  const t = await getTranslations('courses');
  const tCommon = await getTranslations('common');
  const supabase = createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle<Course>();

  if (!course) notFound();

  const title = pick(course, 'title', locale);
  const description = pick(course, 'description', locale);
  const syllabus = (locale === 'th' ? course.syllabus_th : course.syllabus_en) || [];
  const benefits = (locale === 'th' ? course.benefits_th : course.benefits_en) || [];
  const levelLabel =
    course.level === 'beginner' ? t('levelBeginner')
      : course.level === 'intermediate' ? t('levelIntermediate')
        : t('levelAdvanced');

  return (
    <PageShell locale={locale}>
      <article className="container-page py-12">
        <Link href={`/${locale}/courses`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ChevronLeft className="size-4" /> {tCommon('back')}
        </Link>

        <div className="mt-6">
          <Badge variant="secondary">{levelLabel}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
          <p className="mt-6 text-3xl font-bold text-primary">{formatPrice(course.price, locale)}</p>
          <div className="mt-4">
            <PurchaseModal
              triggerLabel={t('enrollOrInquire')}
              itemName={title}
              itemType="course"
              itemId={course.id}
              price={course.price}
              locale={locale}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">{t('syllabus')}</h2>
            <div className="space-y-4">
              {syllabus.map((item: SyllabusItem) => (
                <Card key={item.chapter}>
                  <CardHeader>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-bold uppercase tracking-wide text-accent">
                        {t('chapter')} {item.chapter}
                      </span>
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {item.topics.map((topic, j) => (
                        <li key={j} className="text-muted-foreground">• {topic}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="mb-4 text-2xl font-bold">{t('benefits')}</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
