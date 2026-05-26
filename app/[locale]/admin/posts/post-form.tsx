import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, Save } from 'lucide-react';
import { savePost } from './actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Locale, Post } from '@/types/database';

export async function PostForm({ post, locale }: { post?: Post; locale: Locale }) {
  const t = await getTranslations('admin');
  const tCommon = await getTranslations('common');

  return (
    <div className="max-w-3xl">
      <Link href={`/${locale}/admin/posts`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ChevronLeft className="size-4" /> {tCommon('back')}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">
        {post ? `${tCommon('edit')}: ${post.title_th}` : t('newItem')}
      </h1>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form action={savePost} className="space-y-5">
            {post && <input type="hidden" name="id" value={post.id} />}
            <input type="hidden" name="locale" value={locale} />

            <div className="space-y-1.5">
              <Label htmlFor="slug">{t('slug')}</Label>
              <Input id="slug" name="slug" required defaultValue={post?.slug ?? ''} className="font-mono" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title_th">Title ({t('thai')})</Label>
                <Input id="title_th" name="title_th" required defaultValue={post?.title_th ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title ({t('english')})</Label>
                <Input id="title_en" name="title_en" required defaultValue={post?.title_en ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={post?.category ?? 'general'} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cover_image">Cover image URL</Label>
                <Input id="cover_image" name="cover_image" defaultValue={post?.cover_image ?? ''} />
                <ImageUploader folder="posts" targetInputId="cover_image" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content_th">Content ({t('thai')}) — Markdown</Label>
              <Textarea id="content_th" name="content_th" rows={12} defaultValue={post?.content_th ?? ''} className="font-mono text-sm" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content_en">Content ({t('english')}) — Markdown</Label>
              <Textarea id="content_en" name="content_en" rows={12} defaultValue={post?.content_en ?? ''} className="font-mono text-sm" />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? false} className="size-4 rounded border-input" />
              <span>{t('publish')}</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit"><Save className="size-4" /> {tCommon('save')}</Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/admin/posts`}>{tCommon('cancel')}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
