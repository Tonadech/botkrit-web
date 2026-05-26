import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type Course } from '@/types/database';
import { formatPrice } from '@/lib/utils';

export default async function CoursesListPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('courses');
  const supabase = createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <PageShell locale={locale}>
      <section>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('pageTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(courses as Course[] | null)?.length ? (
            (courses as Course[]).map((c) => <CourseCard key={c.id} course={c} locale={locale} t={t} />)
          ) : (
            <p className="text-muted-foreground">{t('noItems')}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function CourseCard({
  course, locale, t,
}: { course: Course; locale: Locale; t: (key: string) => string }) {
  const title = pick(course, 'title', locale);
  const description = pick(course, 'description', locale);
  const levelLabel =
    course.level === 'beginner' ? t('levelBeginner')
      : course.level === 'intermediate' ? t('levelIntermediate')
        : t('levelAdvanced');
  const levelVariant: 'default' | 'secondary' | 'outline' =
    course.level === 'beginner' ? 'secondary'
      : course.level === 'intermediate' ? 'default'
        : 'outline';

  return (
    <Card className="flex flex-col overflow-hidden">
      {course.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.image_url} alt={title} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-accent text-3xl font-bold text-white">
          {title.charAt(0)}
        </div>
      )}
      <CardHeader>
        <Badge variant={levelVariant} className="self-start">{levelLabel}</Badge>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-bold text-primary">{formatPrice(course.price, locale)}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/${locale}/courses/${course.slug}`}>
            {t('syllabus')} <ArrowRight className="size-4" />
          </Link>
        </Button>
        <PurchaseModal
          triggerLabel={t('enrollOrInquire')}
          itemName={title}
          itemType="course"
          itemId={course.id}
          price={course.price}
          locale={locale}
        />
      </CardFooter>
    </Card>
  );
}
