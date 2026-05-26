import { notFound } from 'next/navigation';
import { PostForm } from '../post-form';
import { createClient } from '@/lib/supabase/server';
import type { Locale, Post } from '@/types/database';

export default async function EditPostPage({
  params: { locale, id },
}: { params: { locale: Locale; id: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle<Post>();

  if (!post) notFound();
  return <PostForm locale={locale} post={post} />;
}
