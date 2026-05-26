import { createClient } from '@/lib/supabase/server';

// ดึง session ปัจจุบันจาก cookie
export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// เช็คว่า user ปัจจุบันเป็น admin หรือไม่ (อ่านจากตาราง profiles)
export async function isAdmin(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return data?.role === 'admin';
}
