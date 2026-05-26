'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';

// helper: แยกข้อความที่คั่นด้วย newline เป็น array (ไว้สำหรับ features)
function linesToArray(text: string | undefined | null): string[] {
  if (!text) return [];
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

// ทุก action เช็คสิทธิ์ admin ก่อนเสมอ
async function assertAdmin() {
  const ok = await isAdmin();
  if (!ok) throw new Error('Forbidden');
}

// สร้าง/แก้ไข EA (ถ้ามี id = แก้ ถ้าไม่มี = สร้างใหม่)
export async function saveEA(formData: FormData) {
  await assertAdmin();
  const supabase = createClient();

  const id = formData.get('id') as string | null;
  const payload = {
    slug: String(formData.get('slug')).trim(),
    name_th: String(formData.get('name_th')).trim(),
    name_en: String(formData.get('name_en')).trim(),
    description_th: String(formData.get('description_th') ?? ''),
    description_en: String(formData.get('description_en') ?? ''),
    features_th: linesToArray(formData.get('features_th') as string),
    features_en: linesToArray(formData.get('features_en') as string),
    price: Number(formData.get('price') || 0),
    image_url: (formData.get('image_url') as string) || null,
    backtest_result: (formData.get('backtest_result') as string) || null,
    is_published: formData.get('is_published') === 'on',
  };

  const result = id
    ? await supabase.from('eas').update(payload).eq('id', id)
    : await supabase.from('eas').insert(payload);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const locale = (formData.get('locale') as string) || 'th';
  revalidatePath(`/${locale}/admin/eas`);
  revalidatePath(`/${locale}/ea`);
  redirect(`/${locale}/admin/eas`);
}

export async function deleteEA(id: string, locale: string) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('eas').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${locale}/admin/eas`);
  revalidatePath(`/${locale}/ea`);
}
