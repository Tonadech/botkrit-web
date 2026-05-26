'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, QrCode, MessageCircle, FileText, Copy, Check } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/lib/config';
import { formatPrice } from '@/lib/utils';
import type { Locale } from '@/types/database';

type Props = {
  triggerLabel: string;
  itemName: string;
  itemType: 'ea' | 'course' | 'general';
  itemId?: string;
  price?: number;
  locale: Locale;
};

// Dialog ของ shadcn — popup ช่องทางชำระเงิน + ปุ่มทักแชท/ส่งฟอร์ม
// ออกแบบให้รับ prop เพิ่มในอนาคต (เช่น paymentMode="stripe") ได้
export function PurchaseModal({ triggerLabel, itemName, itemType, itemId, price, locale }: Props) {
  const t = useTranslations('purchase');
  const [copied, setCopied] = useState(false);

  function copyAccount() {
    navigator.clipboard.writeText(siteConfig.payment.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {itemName}{price ? ` — ${formatPrice(price, locale)}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ข้อมูลโอนเงิน */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Building2 className="size-3.5" />
              {t('transferTo')}
            </div>
            <p className="mt-1 text-base font-bold">{siteConfig.payment.bankName}</p>
            <Separator className="my-2" />
            <p className="text-sm">
              <span className="text-muted-foreground">{t('accountName')}:</span>{' '}
              {siteConfig.payment.accountName}
            </p>
            <div className="mt-1 flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">{t('accountNumber')}:</span>{' '}
                <span className="font-mono font-semibold">{siteConfig.payment.accountNumber}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={copyAccount}>
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          </div>

          {/* PromptPay QR */}
          <div className="rounded-lg border p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <QrCode className="size-3.5" />
              {t('promptPay')}
            </div>
            <div className="mx-auto mt-2 flex h-40 w-40 items-center justify-center rounded-md bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.payment.promptPayQr}
                alt="PromptPay QR"
                className="max-h-full max-w-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">{t('afterPayment')}</p>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={siteConfig.contact.line} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> {t('chatLine')}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`/${locale}/contact?type=${itemType}${itemId ? `&id=${itemId}` : ''}`}>
                <FileText className="size-4" /> {t('sendForm')}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
