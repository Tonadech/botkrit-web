import { notFound } from 'next/navigation';
import { EAForm } from '../ea-form';
import { createClient } from '@/lib/supabase/server';
import type { EA, Locale } from '@/types/database';

export default async function EditEAPage({
  params: { locale, id },
}: { params: { locale: Locale; id: string } }) {
  const supabase = createClient();
  const { data: ea } = await supabase
    .from('eas')
    .select('*')
    .eq('id', id)
    .maybeSingle<EA>();

  if (!ea) notFound();
  return <EAForm locale={locale} ea={ea} />;
}
