'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/types/database';

export function LogoutButton({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-md bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium transition-colors"
    >
      {label}
    </button>
  );
}
