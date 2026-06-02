-- ============================================================
-- Migration: เพิ่มฟิลด์ category (กลยุทธ์) ให้ตาราง eas
-- ใช้กรอง EA ในหน้า catalog — nullable, idempotent
-- ============================================================

alter table public.eas
  add column if not exists category text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'eas_category_check'
  ) then
    alter table public.eas
      add constraint eas_category_check
      check (category is null or category in ('scalping', 'trend', 'grid', 'portfolio'));
  end if;
end $$;
