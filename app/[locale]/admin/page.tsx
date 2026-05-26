import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

// แดชบอร์ดสรุปจำนวนรายการในแต่ละตาราง
export default async function AdminDashboard({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const supabase = createClient();

  // ใช้ count: 'exact' + head: true เพื่อนับโดยไม่ต้องดึงข้อมูล
  const [eas, courses, posts, inquiries] = await Promise.all([
    supabase.from('eas').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: t('manageEAs'), count: eas.count ?? 0, href: `/${locale}/admin/eas` },
    { label: t('manageCourses'), count: courses.count ?? 0, href: `/${locale}/admin/courses` },
    { label: t('managePosts'), count: posts.count ?? 0, href: `/${locale}/admin/posts` },
    { label: t('viewInquiries'), count: inquiries.count ?? 0, href: `/${locale}/admin/inquiries` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card hover:border-brand-emerald transition-colors"
          >
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-emerald">{s.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
