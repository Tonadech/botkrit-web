'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
      type: formData.get('type'),
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
      <div>
        <label className="label" htmlFor="name">{t('name')}</label>
        <input id="name" name="name" required className="input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="email">{t('email')}</label>
          <input id="email" name="email" type="email" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone_or_line">{t('phoneOrLine')}</label>
          <input id="phone_or_line" name="phone_or_line" className="input" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="type">{t('type')}</label>
        <select id="type" name="type" defaultValue={defaultType} className="input">
          <option value="general">{t('typeGeneral')}</option>
          <option value="ea">{t('typeEA')}</option>
          <option value="course">{t('typeCourse')}</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="message">{t('message')}</label>
        <textarea id="message" name="message" required rows={5} className="input" />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? t('submitting') : t('submit')}
      </button>

      {status === 'success' && (
        <p className="text-sm text-brand-emerald font-medium">✓ {t('success')}</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 font-medium">✗ {t('error')}</p>
      )}
    </form>
  );
}
