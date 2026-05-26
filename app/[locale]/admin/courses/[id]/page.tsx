import { notFound } from 'next/navigation';
import { CourseForm } from '../course-form';
import { createClient } from '@/lib/supabase/server';
import type { Course, Locale } from '@/types/database';

export default async function EditCoursePage({
  params: { locale, id },
}: { params: { locale: Locale; id: string } }) {
  const supabase = createClient();
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle<Course>();

  if (!course) notFound();
  return <CourseForm locale={locale} course={course} />;
}
