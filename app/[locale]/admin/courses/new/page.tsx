import { CourseForm } from '../course-form';
import type { Locale } from '@/types/database';

export default function NewCoursePage({ params: { locale } }: { params: { locale: Locale } }) {
  return <CourseForm locale={locale} />;
}
