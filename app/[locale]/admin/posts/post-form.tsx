import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { savePost } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import type { Locale, Post } from '@/types/database';

export async function PostForm({ post, locale }: { post?: Post; locale: Locale }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  return (
    <div className="max-w-3xl">
      <Link href={`/${locale}/admin/posts`} className="text-sm text-brand-emerald hover:underline">
        ← {tCommon('back')}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {post ? `${tCommon('edit')}: ${post.title_th}` : t('newItem')}
      </h1>

      <form action={savePost} className="mt-6 space-y-5">
        {post && <input type="hidden" name="id" value={post.id} />}
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label className="label" htmlFor="slug">{t('slug')}</label>
          <input id="slug" name="slug" required defaultValue={post?.slug ?? ''} className="input font-mono" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="title_th">Title ({t('thai')})</label>
            <input id="title_th" name="title_th" required defaultValue={post?.title_th ?? ''} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="title_en">Title ({t('english')})</label>
            <input id="title_en" name="title_en" required defaultValue={post?.title_en ?? ''} className="input" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <input id="category" name="category" defaultValue={post?.category ?? 'general'} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="cover_image">Cover image URL</label>
            <input id="cover_image" name="cover_image" defaultValue={post?.cover_image ?? ''} className="input" />
            <ImageUploader folder="posts" targetInputId="cover_image" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="content_th">Content ({t('thai')}) — Markdown</label>
          <textarea id="content_th" name="content_th" rows={12} defaultValue={post?.content_th ?? ''} className="input font-mono text-sm" />
        </div>

        <div>
          <label className="label" htmlFor="content_en">Content ({t('english')}) — Markdown</label>
          <textarea id="content_en" name="content_en" rows={12} defaultValue={post?.content_en ?? ''} className="input font-mono text-sm" />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? false} />
          <span className="text-sm">{t('publish')}</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">{tCommon('save')}</button>
          <Link href={`/${locale}/admin/posts`} className="btn-secondary">{tCommon('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
