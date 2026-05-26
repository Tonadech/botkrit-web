import { PostForm } from '../post-form';
import type { Locale } from '@/types/database';

export default function NewPostPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <PostForm locale={locale} />;
}
