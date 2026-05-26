import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { PurchaseModal } from '@/components/purchase-modal';
import { createClient } from '@/lib/supabase/server';
import { pick, type Locale, type Course, type SyllabusItem } from '@/types/database';
import { formatPrice } from '@/lib/utils';

// หน้ารายละเอียดคอร์ส
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
        <Link href={`/${locale}/courses`} className="text-sm text-brand-emerald hover:underline">
          ← {tCommon('back')}
        </Link>

        <div className="mt-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-brand-emerald/10 text-brand-emerald">
            {levelLabel}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">{title}</h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-2xl">{description}</p>
          <p className="mt-6 text-3xl font-bold text-brand-emerald">{formatPrice(course.price, locale)}</p>
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

        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          {/* Syllabus */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">{t('syllabus')}</h2>
            <div className="space-y-4">
              {syllabus.map((item: SyllabusItem) => (
                <div key={item.chapter} className="card">
                  <div className="flex items-baseline gap-3">
                    <span className="text-brand-gold font-bold">
                      {t('chapter')} {item.chapter}
                    </span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <ul className="mt-3 text-sm space-y-1">
                    {item.topics.map((topic, j) => (
                      <li key={j} className="text-[hsl(var(--muted-foreground))]">• {topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <aside>
            <h2 className="text-2xl font-bold mb-4">{t('benefits')}</h2>
            <ul className="card space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-brand-emerald">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
