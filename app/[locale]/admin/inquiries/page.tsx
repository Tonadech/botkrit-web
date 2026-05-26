import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { Inquiry, Locale } from '@/types/database';

// ดู inquiries ที่ลูกค้าส่งมา — admin เท่านั้น (RLS guard ใน DB อยู่แล้ว)
export default async function AdminInquiriesPage({
  params: { locale },
}: { params: { locale: Locale } }) {
  const t = await getTranslations('admin');
  const supabase = createClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('viewInquiries')}</h1>

      <div className="space-y-4">
        {(inquiries as Inquiry[] | null)?.length ? (
          (inquiries as Inquiry[]).map((inq) => (
            <div key={inq.id} className="card">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">{inq.name}</p>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1 space-x-3">
                    {inq.email && <span>✉️ {inq.email}</span>}
                    {inq.phone_or_line && <span>📞 {inq.phone_or_line}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-brand-emerald/10 text-brand-emerald font-semibold uppercase">
                    {inq.type}
                  </span>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {formatDate(inq.created_at, locale)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap">{inq.message}</p>
            </div>
          ))
        ) : (
          <p className="text-[hsl(var(--muted-foreground))]">—</p>
        )}
      </div>
    </div>
  );
}
