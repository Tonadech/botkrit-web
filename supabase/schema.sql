-- ============================================================
-- BOTKRIT — Supabase Schema + RLS Policies
-- รันสคริปต์นี้ใน Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

-- เปิด extension uuid (มาตรฐาน Supabase มีอยู่แล้ว แต่กันพลาดไว้)
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1) profiles — โปรไฟล์ผู้ใช้ (เชื่อมกับ auth.users)
--    role = 'admin' ใช้กำหนดสิทธิ์เข้าหลังบ้าน
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- ทุกครั้งที่มี user ใหม่ใน auth.users ให้สร้าง row ใน profiles อัตโนมัติ
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: เช็คว่า user ปัจจุบันเป็น admin หรือไม่
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 2) eas — Expert Advisors ที่วางขาย
-- ============================================================
create table if not exists public.eas (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  description_th text,
  description_en text,
  features_th jsonb default '[]'::jsonb,         -- รายการจุดเด่นภาษาไทย ["...", "..."]
  features_en jsonb default '[]'::jsonb,
  price numeric(12,2) default 0,                 -- ราคา (บาท)
  image_url text,
  backtest_result text,                          -- สรุปผล backtest (markdown ได้)
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_eas_published on public.eas(is_published);
create index if not exists idx_eas_slug on public.eas(slug);

-- ============================================================
-- 3) courses — คอร์สสอนสร้าง EA
-- ============================================================
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title_th text not null,
  title_en text not null,
  description_th text,
  description_en text,
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  price numeric(12,2) default 0,
  syllabus_th jsonb default '[]'::jsonb,         -- [{ "chapter": 1, "title": "...", "topics": ["..."] }, ...]
  syllabus_en jsonb default '[]'::jsonb,
  benefits_th jsonb default '[]'::jsonb,         -- รายการสิ่งที่จะได้รับ
  benefits_en jsonb default '[]'::jsonb,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_published on public.courses(is_published);
create index if not exists idx_courses_slug on public.courses(slug);

-- ============================================================
-- 4) posts — บทความบล็อก
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title_th text not null,
  title_en text not null,
  content_th text,                               -- markdown
  content_en text,                               -- markdown
  category text default 'general',
  cover_image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_published on public.posts(is_published);
create index if not exists idx_posts_slug on public.posts(slug);

-- ============================================================
-- 5) inquiries — คำถาม/คำสั่งซื้อจากลูกค้า
-- ============================================================
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone_or_line text,
  message text not null,
  type text not null default 'general' check (type in ('ea', 'course', 'general')),
  related_id uuid,                               -- id ของ EA/course ที่อ้างถึง (optional)
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_created on public.inquiries(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- เปิด RLS ทุกตาราง
alter table public.profiles enable row level security;
alter table public.eas enable row level security;
alter table public.courses enable row level security;
alter table public.posts enable row level security;
alter table public.inquiries enable row level security;

-- ลบ policy เก่าก่อน (เผื่อรันซ้ำ)
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_admin_all" on public.profiles;

drop policy if exists "eas_public_read" on public.eas;
drop policy if exists "eas_admin_all" on public.eas;

drop policy if exists "courses_public_read" on public.courses;
drop policy if exists "courses_admin_all" on public.courses;

drop policy if exists "posts_public_read" on public.posts;
drop policy if exists "posts_admin_all" on public.posts;

drop policy if exists "inquiries_public_insert" on public.inquiries;
drop policy if exists "inquiries_admin_select" on public.inquiries;
drop policy if exists "inquiries_admin_all" on public.inquiries;

-- ---------- profiles ----------
-- user เห็นโปรไฟล์ตัวเองได้
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- admin จัดการได้ทุกแถว
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- eas ----------
-- public อ่านได้เฉพาะที่ publish แล้ว / admin อ่านได้ทุก row
create policy "eas_public_read" on public.eas
  for select using (is_published = true or public.is_admin());

-- admin จัดการได้ทั้งหมด (insert/update/delete)
create policy "eas_admin_all" on public.eas
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- courses ----------
create policy "courses_public_read" on public.courses
  for select using (is_published = true or public.is_admin());

create policy "courses_admin_all" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- posts ----------
create policy "posts_public_read" on public.posts
  for select using (is_published = true or public.is_admin());

create policy "posts_admin_all" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- inquiries ----------
-- ใครก็ส่งฟอร์มเข้ามาได้ (anonymous insert)
create policy "inquiries_public_insert" on public.inquiries
  for insert with check (true);

-- เฉพาะ admin ที่อ่าน/แก้/ลบได้
create policy "inquiries_admin_all" on public.inquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- STORAGE — bucket สำหรับเก็บรูป EA / course / post
-- ============================================================
-- รันใน Supabase Dashboard → Storage → New bucket → "public"
-- หรือใช้ SQL ด้านล่าง:

insert into storage.buckets (id, name, public)
values ('public', 'public', true)
on conflict (id) do nothing;

-- public bucket: ทุกคนอ่านได้, admin upload/แก้/ลบ
drop policy if exists "storage_public_read" on storage.objects;
drop policy if exists "storage_admin_write" on storage.objects;

create policy "storage_public_read" on storage.objects
  for select using (bucket_id = 'public');

create policy "storage_admin_write" on storage.objects
  for all
  using (bucket_id = 'public' and public.is_admin())
  with check (bucket_id = 'public' and public.is_admin());
