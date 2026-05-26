'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/types/database';

// ฟอร์ม login — เรียก Supabase Auth ตรง ๆ ฝั่ง browser
// หลัง login สำเร็จ ตรวจ role จาก profiles อีกชั้น
export function LoginForm({ locale }: { locale: Locale }) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(t('loginError'));
      setLoading(false);
      return;
    }

    // เช็ค role จากตาราง profiles
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        setError(t('notAdmin'));
        setLoading(false);
        return;
      }
    }

    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">{t('email')}</label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">{t('password')}</label>
        <input id="password" name="password" type="password" required className="input" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? t('loggingIn') : t('login')}
      </button>
    </form>
  );
}
