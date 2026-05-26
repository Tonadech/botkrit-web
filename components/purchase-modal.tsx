'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

// Modal แสดงช่องทางชำระเงิน (static) + ทางเลือก ทักแชท / ส่งฟอร์ม
// ออกแบบให้รับ prop เพิ่มในอนาคต (เช่น paymentMode="stripe") ได้
export function PurchaseModal({ triggerLabel, itemName, itemType, itemId, price, locale }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('purchase');
  const tContact = useTranslations('contact');

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[hsl(var(--background))] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  {itemName} {price ? `— ${formatPrice(price, locale)}` : ''}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                aria-label={t('close')}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* ข้อมูลโอนเงิน */}
              <div className="rounded-lg border border-[hsl(var(--border))] p-4 bg-[hsl(var(--muted))]">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                  {t('transferTo')}
                </p>
                <p className="text-lg font-bold mt-1">{siteConfig.payment.bankName}</p>
                <p className="text-sm mt-2">
                  <span className="text-[hsl(var(--muted-foreground))]">{t('accountName')}:</span>{' '}
                  {siteConfig.payment.accountName}
                </p>
                <p className="text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t('accountNumber')}:</span>{' '}
                  <span className="font-mono font-semibold">{siteConfig.payment.accountNumber}</span>
                </p>
              </div>

              {/* PromptPay QR */}
              <div className="rounded-lg border border-[hsl(var(--border))] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                  {t('promptPay')}
                </p>
                <div className="mt-2 mx-auto w-40 h-40 bg-[hsl(var(--muted))] rounded-md flex items-center justify-center">
                  {/* ใช้ <img> ธรรมดาเพราะรูปอยู่ใน /public — ไม่ต้องผ่าน next/image config */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={siteConfig.payment.promptPayQr}
                    alt="PromptPay QR"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <p className="text-sm text-center text-[hsl(var(--muted-foreground))]">
                {t('afterPayment')}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={siteConfig.contact.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full"
                >
                  {t('chatLine')}
                </a>
                <a
                  href={`/${locale}/contact?type=${itemType}${itemId ? `&id=${itemId}` : ''}`}
                  className="btn-secondary w-full"
                >
                  {t('sendForm')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
