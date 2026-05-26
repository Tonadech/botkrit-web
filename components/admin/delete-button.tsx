'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/types/database';

type DeleteAction = (id: string, locale: string) => Promise<void>;

export function DeleteButton({
  id, locale, action, label, confirmLabel,
}: {
  id: string;
  locale: Locale;
  action: DeleteAction;
  label: string;
  confirmLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        if (!confirm(confirmLabel)) return;
        startTransition(async () => {
          await action(id, locale);
          router.refresh();
        });
      }}
    >
      <Trash2 className="size-3.5" /> {label}
    </Button>
  );
}
