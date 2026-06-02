import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PurchaseModal } from '@/components/purchase-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, formatPrice, formatPercent, formatSignedPercent } from '@/lib/utils';
import { pick, type EA, type Locale, type RiskLevel } from '@/types/database';

// สี badge ตามระดับความเสี่ยง — เขียว=ต่ำ, ทอง=กลาง, แดง=สูง
const RISK_STYLES: Record<RiskLevel, string> = {
  low: 'border-primary/30 bg-primary/10 text-primary',
  medium: 'border-accent/40 bg-accent/10 text-accent',
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
};

/**
 * การ์ด EA แบบ "dashboard-in-a-box" — โชว์ตัวเลขผลงาน (ผลตอบแทน 30 วัน,
 * drawdown, win rate) เมื่อมีข้อมูล และ fallback เป็นการ์ดเรียบเมื่อยังไม่มี
 * accent ทอง = ตัวเลขผลตอบแทน + ปุ่ม Buy License
 */
export function EACard({
  ea,
  locale,
  t,
}: {
  ea: EA;
  locale: Locale;
  t: (key: string) => string;
}) {
  const name = pick(ea, 'name', locale);
  const description = pick(ea, 'description', locale);
  const hasReturn = ea.monthly_return != null;
  const hasMetrics = ea.max_drawdown != null || ea.win_rate != null;

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0 transition-colors hover:border-accent/40">
      {/* header: ชื่อ + risk badge / ผลตอบแทน 30 วัน */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold leading-tight">{name}</h3>
          {ea.risk_level && (
            <Badge
              variant="outline"
              className={cn('mt-2 uppercase tracking-wide', RISK_STYLES[ea.risk_level])}
            >
              {t(`risk.${ea.risk_level}`)}
            </Badge>
          )}
        </div>
        {hasReturn && (
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold leading-none text-accent">
              {formatSignedPercent(ea.monthly_return!)}
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {t('monthlyReturn')}
            </p>
          </div>
        )}
      </div>

      {/* metrics grid 2 คอลัมน์ — เส้นแบ่งด้วย gap บนพื้น border */}
      {hasMetrics && (
        <div className="mx-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
          <Metric
            label={t('maxDrawdown')}
            value={ea.max_drawdown != null ? formatPercent(ea.max_drawdown) : '—'}
          />
          <Metric
            label={t('winRate')}
            value={ea.win_rate != null ? formatPercent(ea.win_rate) : '—'}
          />
        </div>
      )}

      {description && (
        <p className="line-clamp-2 px-5 pt-4 text-sm text-muted-foreground">{description}</p>
      )}

      {/* footer: ราคา + ปุ่ม */}
      <div className="mt-auto space-y-3 p-5 pt-4">
        <p className="text-xl font-bold">{formatPrice(ea.price, locale)}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/${locale}/ea/${ea.slug}`}>
              {t('features')} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <PurchaseModal
            triggerLabel={t('buyOrInquire')}
            triggerClassName="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            itemName={name}
            itemType="ea"
            itemId={ea.id}
            price={ea.price}
            locale={locale}
          />
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}
