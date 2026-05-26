import { createClient } from '@supabase/supabase-js';

// Service-role client — bypass RLS ทั้งหมด
// ใช้เฉพาะใน Route Handler / Server Action ที่ตรวจสิทธิ์ admin แล้วเท่านั้น
// **ห้าม** import ไฟล์นี้ใน Client Component เด็ดขาด
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
