import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
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
      <section className="container-page py-12">
        <h1 className="text-3xl sm:text-4xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(courses as Course[] | null)?.length ? (
            (courses as Course[]).map((c) => (
              <CourseCard key={c.id} course={c} locale={locale} t={t} />
            ))
          ) : (
            <p className="text-[hsl(var(--muted-foreground))]">{t('noItems')}</p>
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

  return (
    <div className="card flex flex-col">
      {course.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.image_url} alt={title} className="w-full h-40 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-brand-emerald to-brand-gold rounded-md mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {title.charAt(0)}
        </div>
      )}

      <span className="inline-block self-start text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-brand-emerald/10 text-brand-emerald">
        {levelLabel}
      </span>

      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">{description}</p>

      <div className="mt-4">
        <span className="text-xl font-bold text-brand-emerald">{formatPrice(course.price, locale)}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/${locale}/courses/${course.slug}`} className="btn-secondary flex-1 text-center">
          {t('syllabus')}
        </Link>
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
  );
}
