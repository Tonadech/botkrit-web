import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Supabase client สำหรับ Server Components / Route Handlers / Server Actions
// อ่าน session ของ user ผ่าน cookies (จัดการอัตโนมัติโดย @supabase/ssr)
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // ใน Server Component อาจ set cookie ไม่ได้ — ปล่อยให้ middleware จัดการแทน
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // เหมือนกัน — เงียบไปได้
          }
        },
      },
    },
  );
}
