'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
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
    <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/15 hover:text-white">
      <LogOut className="size-3.5" /> {label}
    </Button>
  );
}
