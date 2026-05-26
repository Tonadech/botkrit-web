import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { TrendingUp } from 'lucide-react';
import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/auth';
import type { Locale } from '@/types/database';

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
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-white">
            <TrendingUp className="size-6" />
          </div>
          <CardTitle>{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm locale={locale} />
        </CardContent>
      </Card>
    </div>
  );
}
