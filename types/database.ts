// ============================================================
// Types ที่สอดคล้องกับโครงสร้างตารางใน Supabase (schema.sql)
// ในอนาคตสามารถ generate อัตโนมัติด้วย `supabase gen types typescript`
// ============================================================

export type Locale = 'th' | 'en';

export type EA = {
  id: string;
  slug: string;
  name_th: string;
  name_en: string;
  description_th: string | null;
  description_en: string | null;
  features_th: string[];
  features_en: string[];
  price: number;
  image_url: string | null;
  backtest_result: string | null;
  is_published: boolean;
  created_at: string;
};

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type SyllabusItem = {
  chapter: number;
  title: string;
  topics: string[];
};

export type Course = {
  id: string;
  slug: string;
  title_th: string;
  title_en: string;
  description_th: string | null;
  description_en: string | null;
  level: CourseLevel;
  price: number;
  syllabus_th: SyllabusItem[];
  syllabus_en: SyllabusItem[];
  benefits_th: string[];
  benefits_en: string[];
  image_url: string | null;
  is_published: boolean;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title_th: string;
  title_en: string;
  content_th: string | null;
  content_en: string | null;
  category: string | null;
  cover_image: string | null;
  is_published: boolean;
  created_at: string;
};

export type InquiryType = 'ea' | 'course' | 'general';

export type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone_or_line: string | null;
  message: string;
  type: InquiryType;
  related_id: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
};

// helper เลือกฟิลด์ตามภาษา — ใช้ pick(item, 'name', locale) แทน item[`name_${locale}`]
export function pick<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
): string {
  const value = obj[`${field}_${locale}`] ?? obj[`${field}_th`];
  return (value as string) ?? '';
}
