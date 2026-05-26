import { getTranslations } from 'next-intl/server';
import { MessageCircle, Send, Mail } from 'lucide-react';
import { FacebookIcon } from '@/components/brand-icons';
import { PageShell } from '@/components/page-shell';
import { InquiryForm } from '@/components/inquiry-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/lib/config';
import type { InquiryType, Locale } from '@/types/database';

export default async function ContactPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { type?: string; id?: string };
}) {
  const t = await getTranslations('contact');

  const defaultType: InquiryType = ['ea', 'course', 'general'].includes(searchParams.type ?? '')
    ? (searchParams.type as InquiryType)
    : 'general';

  return (
    <PageShell locale={locale}>
      <section>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('pageTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('pageSubtitle')}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('formTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <InquiryForm defaultType={defaultType} relatedId={searchParams.id} />
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>{t('channelsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <ChannelLink href={siteConfig.contact.line} icon={<MessageCircle className="size-4 text-primary" />} label="Line" />
                  <ChannelLink href={siteConfig.contact.facebook} icon={<FacebookIcon className="size-4 text-primary" />} label="Facebook" />
                  <ChannelLink href={siteConfig.contact.telegram} icon={<Send className="size-4 text-primary" />} label="Telegram" />
                  <ChannelLink href={`mailto:${siteConfig.contact.email}`} icon={<Mail className="size-4 text-primary" />} label={siteConfig.contact.email} external={false} />
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function ChannelLink({ href, icon, label, external = true }: {
  href: string; icon: React.ReactNode; label: string; external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex items-center gap-2 hover:text-primary transition-colors break-all"
      >
        {icon} <span>{label}</span>
      </a>
    </li>
  );
}
