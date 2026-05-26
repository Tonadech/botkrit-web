'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';
import type { SyllabusItem } from '@/types/database';

async function assertAdmin() {
  const ok = await isAdmin();
  if (!ok) throw new Error('Forbidden');
}

function linesToArray(text: string | undefined | null): string[] {
  if (!text) return [];
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

// แปลง textarea แบบ structured เป็น syllabus array
// รูปแบบที่รับ:
//   1. ชื่อบทที่ 1
//   - หัวข้อย่อย 1
//   - หัวข้อย่อย 2
//   2. ชื่อบทที่ 2
//   - ...
function parseSyllabus(text: string | undefined | null): SyllabusItem[] {
  if (!text) return [];
  const lines = text.split('\n');
  const items: SyllabusItem[] = [];
  let current: SyllabusItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const chapterMatch = line.match(/^(\d+)\.\s*(.+)$/);
    if (chapterMatch) {
      if (current) items.push(current);
      current = { chapter: Number(chapterMatch[1]), title: chapterMatch[2], topics: [] };
    } else if (line.startsWith('-') || line.startsWith('•')) {
      if (current) current.topics.push(line.replace(/^[-•]\s*/, ''));
    }
  }
  if (current) items.push(current);
  return items;
}

export async function saveCourse(formData: FormData) {
  await assertAdmin();
  const supabase = createClient();

  const id = formData.get('id') as string | null;
  const payload = {
    slug: String(formData.get('slug')).trim(),
    title_th: String(formData.get('title_th')).trim(),
    title_en: String(formData.get('title_en')).trim(),
    description_th: String(formData.get('description_th') ?? ''),
    description_en: String(formData.get('description_en') ?? ''),
    level: String(formData.get('level') ?? 'beginner'),
    price: Number(formData.get('price') || 0),
    syllabus_th: parseSyllabus(formData.get('syllabus_th') as string),
    syllabus_en: parseSyllabus(formData.get('syllabus_en') as string),
    benefits_th: linesToArray(formData.get('benefits_th') as string),
    benefits_en: linesToArray(formData.get('benefits_en') as string),
    image_url: (formData.get('image_url') as string) || null,
    is_published: formData.get('is_published') === 'on',
  };

  const result = id
    ? await supabase.from('courses').update(payload).eq('id', id)
    : await supabase.from('courses').insert(payload);

  if (result.error) throw new Error(result.error.message);

  const locale = (formData.get('locale') as string) || 'th';
  revalidatePath(`/${locale}/admin/courses`);
  revalidatePath(`/${locale}/courses`);
  redirect(`/${locale}/admin/courses`);
}

export async function deleteCourse(id: string, locale: string) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${locale}/admin/courses`);
  revalidatePath(`/${locale}/courses`);
}
