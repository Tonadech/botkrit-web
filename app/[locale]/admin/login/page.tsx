import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from './login-form';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';
import type { Locale } from '@/types/database';

// หน้า /admin/login — public access
// ถ้าล็อกอินอยู่แล้วและเป็น admin → redirect ไป dashboard
export default async function LoginPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const adminOk = await isAdmin();
    if (adminOk) redirect(`/${locale}/admin`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy p-4">
      <div className="w-full max-w-md bg-white dark:bg-brand-navy-light rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-navy dark:text-brand-gold">{t('loginTitle')}</h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{t('loginSubtitle')}</p>
        </div>
        <LoginForm locale={locale} />
      </div>
    </div>
  );
}
