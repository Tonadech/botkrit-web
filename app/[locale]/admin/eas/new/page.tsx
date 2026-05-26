import { EAForm } from '../ea-form';
import type { Locale } from '@/types/database';

export default function NewEAPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <EAForm locale={locale} />;
}
