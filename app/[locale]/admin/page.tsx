import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Bot, GraduationCap, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/types/database';

export default async function AdminDashboard({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const supabase = createClient();

  const [eas, courses, posts, inquiries] = await Promise.all([
    supabase.from('eas').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: t('manageEAs'), count: eas.count ?? 0, href: `/${locale}/admin/eas`, icon: Bot, color: 'text-primary bg-primary/10' },
    { label: t('manageCourses'), count: courses.count ?? 0, href: `/${locale}/admin/courses`, icon: GraduationCap, color: 'text-accent bg-accent/10' },
    { label: t('managePosts'), count: posts.count ?? 0, href: `/${locale}/admin/posts`, icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
    { label: t('viewInquiries'), count: inquiries.count ?? 0, href: `/${locale}/admin/inquiries`, icon: MessageSquare, color: 'text-purple-500 bg-purple-500/10' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t('dashboard')}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <Card className="transition-all hover:border-primary hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`flex size-9 items-center justify-center rounded-md ${s.color}`}>
                  <s.icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{s.count}</div>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Manage <ArrowRight className="size-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
