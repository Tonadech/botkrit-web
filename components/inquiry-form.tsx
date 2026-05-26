'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import type { InquiryType } from '@/types/database';

type Props = {
  defaultType?: InquiryType;
  relatedId?: string;
};

// ฟอร์มติดต่อ — ใช้ใน /contact และเรียกผ่าน purchase modal ได้
export function InquiryForm({ defaultType = 'general', relatedId }: Props) {
  const t = useTranslations('contact');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [type, setType] = useState<InquiryType>(defaultType);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone_or_line: formData.get('phone_or_line'),
      message: formData.get('message'),
      type,
      related_id: relatedId ?? null,
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">{t('name')}</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone_or_line">{t('phoneOrLine')}</Label>
          <Input id="phone_or_line" name="phone_or_line" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="type">{t('type')}</Label>
        <Select value={type} onValueChange={(v) => setType(v as InquiryType)}>
          <SelectTrigger id="type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="general">{t('typeGeneral')}</SelectItem>
            <SelectItem value="ea">{t('typeEA')}</SelectItem>
            <SelectItem value="course">{t('typeCourse')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">{t('message')}</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? t('submitting') : t('submit')}
      </Button>

      {status === 'success' && (
        <p className="flex items-center gap-2 text-sm text-primary font-medium">
          <CheckCircle2 className="size-4" /> {t('success')}
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-destructive font-medium">
          <AlertCircle className="size-4" /> {t('error')}
        </p>
      )}
    </form>
  );
}
