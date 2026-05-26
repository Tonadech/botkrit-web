'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/types/database';

type DeleteAction = (id: string, locale: string) => Promise<void>;

// ปุ่มลบ — รับ server action เป็น prop ทำให้ใช้กับหลายตารางได้
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
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmLabel)) return;
        startTransition(async () => {
          await action(id, locale);
          router.refresh();
        });
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {label}
    </button>
  );
}
