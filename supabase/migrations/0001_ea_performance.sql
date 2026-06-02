-- ============================================================
-- Migration: เพิ่มฟิลด์ตัวเลขผลงานให้ตาราง eas (EA performance card)
-- ปลอดภัยกับข้อมูลเดิม — ทุกคอลัมน์ nullable, รันซ้ำได้ (idempotent)
-- รันบน prod ผ่าน Supabase SQL editor หรือ `supabase db push`
-- ============================================================

alter table public.eas
  add column if not exists risk_level text,
  add column if not exists monthly_return numeric(6,2),
  add column if not exists max_drawdown numeric(6,2),
  add column if not exists win_rate numeric(5,2);

-- จำกัดค่า risk_level (เพิ่ม constraint เฉพาะเมื่อยังไม่มี)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'eas_risk_level_check'
  ) then
    alter table public.eas
      add constraint eas_risk_level_check
      check (risk_level is null or risk_level in ('low', 'medium', 'high'));
  end if;
end $$;
