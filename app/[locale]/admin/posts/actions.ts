'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';

async function assertAdmin() {
  const ok = await isAdmin();
  if (!ok) throw new Error('Forbidden');
}

export async function savePost(formData: FormData) {
  await assertAdmin();
  const supabase = createClient();

  const id = formData.get('id') as string | null;
  const payload = {
    slug: String(formData.get('slug')).trim(),
    title_th: String(formData.get('title_th')).trim(),
    title_en: String(formData.get('title_en')).trim(),
    content_th: String(formData.get('content_th') ?? ''),
    content_en: String(formData.get('content_en') ?? ''),
    category: String(formData.get('category') ?? 'general'),
    cover_image: (formData.get('cover_image') as string) || null,
    is_published: formData.get('is_published') === 'on',
  };

  const result = id
    ? await supabase.from('posts').update(payload).eq('id', id)
    : await supabase.from('posts').insert(payload);

  if (result.error) throw new Error(result.error.message);

  const locale = (formData.get('locale') as string) || 'th';
  revalidatePath(`/${locale}/admin/posts`);
  revalidatePath(`/${locale}/blog`);
  redirect(`/${locale}/admin/posts`);
}

export async function deletePost(id: string, locale: string) {
  await assertAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${locale}/admin/posts`);
  revalidatePath(`/${locale}/blog`);
}
