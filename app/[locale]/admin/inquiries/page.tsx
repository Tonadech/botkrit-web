import { getTranslations } from 'next-intl/server';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { Inquiry, Locale } from '@/types/database';

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
      <h1 className="mb-6 text-2xl font-bold">{t('viewInquiries')}</h1>

      <div className="space-y-4">
        {(inquiries as Inquiry[] | null)?.length ? (
          (inquiries as Inquiry[]).map((inq) => (
            <Card key={inq.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{inq.name}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap gap-3 text-xs">
                      {inq.email && (
                        <span className="inline-flex items-center gap-1"><Mail className="size-3" /> {inq.email}</span>
                      )}
                      {inq.phone_or_line && (
                        <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {inq.phone_or_line}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="uppercase">{inq.type}</Badge>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" /> {formatDate(inq.created_at, locale)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{inq.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">—</p>
        )}
      </div>
    </div>
  );
}
