# BOTKRIT — Forex EA & Course Web

เว็บไซต์ full-stack สำหรับโปรเจกต์ **BOTKRIT** (Forex Expert Advisor + คอร์สสอนสร้าง EA) ที่รองรับ 2 ภาษา (ไทย/อังกฤษ) พร้อมระบบหลังบ้านสำหรับ admin จัดการเนื้อหา

## 🧱 Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **i18n:** [next-intl](https://next-intl-docs.vercel.app/) (path-based: `/th`, `/en`)
- **Backend:** [Supabase](https://supabase.com/) — Postgres + Auth + Storage + Row Level Security
- **Deploy:** Vercel (เชื่อม GitHub auto-deploy)

---

## 📂 โครงสร้างไฟล์สำคัญ

```
app/
├── [locale]/                     # i18n routing
│   ├── layout.tsx                # root layout ของแต่ละภาษา
│   ├── page.tsx                  # หน้าแรก
│   ├── ea/, courses/, blog/      # หน้า list + [slug] รายละเอียด
│   ├── botkrit/, contact/        # หน้าคงที่
│   └── admin/                    # หลังบ้าน (Supabase Auth)
│       ├── login/                # หน้า login
│       ├── eas/, courses/, posts/ # CRUD
│       └── inquiries/            # ดูคำถามจากลูกค้า
└── api/inquiries/                # POST endpoint ฟอร์มติดต่อ

components/                        # UI components
lib/
├── supabase/{client,server,admin}.ts
├── i18n.ts, auth.ts, utils.ts, config.ts
messages/{th,en}.json              # คำแปล
supabase/{schema,seed}.sql         # SQL สำหรับสร้างฐานข้อมูล
types/database.ts                  # TypeScript types
middleware.ts                      # i18n routing + admin guard
```

---

## 🚀 ขั้นตอนการติดตั้งและ deploy

### 1) ติดตั้ง dependencies

```bash
npm install
```

### 2) สร้างโปรเจกต์ Supabase

1. ไปที่ [supabase.com](https://supabase.com/) → **New Project**
2. ตั้งชื่อโปรเจกต์ (เช่น `botkrit`) เลือก region ใกล้ผู้ใช้ (Singapore สำหรับไทย)
3. รอ Supabase สร้างฐานข้อมูลเสร็จ (~2 นาที)

### 3) รัน schema + seed ใน Supabase

1. ใน Supabase Dashboard → **SQL Editor** → **New query**
2. คัดลอกเนื้อหาทั้งหมดของ `supabase/schema.sql` แปะแล้วกด **Run**  
   *(สร้างตาราง, RLS policies, triggers, storage bucket "public")*
3. New query อีกครั้ง → คัดลอก `supabase/seed.sql` แปะแล้วกด **Run**  
   *(ใส่ EA / คอร์ส / บทความตัวอย่าง)*

### 4) สร้าง admin user

1. Supabase Dashboard → **Authentication** → **Users** → **Add user**
2. ใส่ email + password (เช่น `admin@botkrit.com`)
3. หลังสร้าง user แล้ว — กลับไปที่ **SQL Editor** แล้วรัน:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@botkrit.com';
```

*(trigger `handle_new_user()` จะสร้าง row ใน profiles ให้อัตโนมัติด้วย role = 'user' ต้อง update เป็น admin เอง)*

### 5) ตั้งค่า env vars

1. คัดลอก `.env.example` → `.env.local`

```bash
cp .env.example .env.local
```

2. กรอกค่าจาก Supabase Dashboard → **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` ← Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← anon `public` key
   - `SUPABASE_SERVICE_ROLE_KEY` ← `service_role` (secret) key ⚠️ **ห้าม commit**

3. กรอกข้อมูลช่องทางติดต่อ + บัญชีรับเงินตามจริง

### 6) ทดสอบในเครื่อง

```bash
npm run dev
```

เปิด `http://localhost:3000` — จะ redirect ไป `/th` อัตโนมัติ  
เข้าหลังบ้านที่ `http://localhost:3000/th/admin/login`

### 7) Push ขึ้น GitHub

```bash
git init
git add .
git commit -m "feat: initial BOTKRIT setup"
git branch -M main
git remote add origin git@github.com:YOUR-USER/botkrit.git
git push -u origin main
```

### 8) Deploy บน Vercel

1. ไปที่ [vercel.com](https://vercel.com) → **Add New → Project**
2. เลือก repository `botkrit` ที่ push ขึ้นไป
3. **Environment Variables** — กรอกค่าทั้งหมดจาก `.env.local`  
   *(ใส่ทั้ง 3 environment: Production / Preview / Development)*
4. กด **Deploy** — รอประมาณ 2-3 นาที
5. เปิด URL ที่ได้ (เช่น `https://botkrit.vercel.app`)

### 9) ตั้งค่าหลัง deploy

- กลับมาใส่ `NEXT_PUBLIC_SITE_URL` ใน Vercel env ให้เป็น URL จริง
- ใน Supabase → **Authentication → URL Configuration**:
  - **Site URL:** `https://YOUR-DOMAIN.vercel.app`
  - **Redirect URLs:** `https://YOUR-DOMAIN.vercel.app/**`

---

## 🔐 RLS Policies (สรุป)

| ตาราง | Public | Admin |
|--------|--------|-------|
| `eas`, `courses`, `posts` | อ่านได้เฉพาะที่ `is_published = true` | ทำทุกอย่าง |
| `inquiries` | insert ได้เท่านั้น | อ่าน/แก้/ลบ ทุกแถว |
| `profiles` | อ่าน profile ของตัวเอง | จัดการได้ |

`is_admin()` function เช็คจาก `profiles.role = 'admin'`

---

## 📝 การจัดการเนื้อหา

หลังจาก login เป็น admin ที่ `/admin/login`:

1. **หลังบ้าน → Manage EAs** — เพิ่ม/แก้ EA (กรอกข้อมูลทั้งไทยและอังกฤษในฟอร์มเดียว)
2. **Manage Courses** — เพิ่มคอร์ส, syllabus กรอกในรูปแบบ:
   ```
   1. ชื่อบทที่ 1
   - หัวข้อย่อย 1
   - หัวข้อย่อย 2
   2. ชื่อบทที่ 2
   - หัวข้อย่อย 1
   ```
3. **Manage Posts** — บทความเขียนเป็น Markdown
4. **View Inquiries** — ดูคำถาม/คำสั่งซื้อจากลูกค้า

อัปโหลดรูปได้ผ่านปุ่มในฟอร์ม (จะเก็บใน Supabase Storage bucket `public`)

---

## 💳 ระบบจ่ายเงิน (เฟสแรก)

ตอนนี้ใช้แบบ **static** — popup แสดงเลขบัญชี + PromptPay QR (เก็บใน `/public/payment/`) แล้วลูกค้าทักแชท Line ส่งสลิป

### เพิ่ม Stripe ในอนาคต

โครงสร้างถูกออกแบบมารองรับแล้ว — แก้แค่ `components/purchase-modal.tsx`:
1. เพิ่ม prop `paymentMode: 'manual' | 'stripe'`
2. ถ้า `stripe` → เรียก `/api/checkout/create-session` แทนการโชว์ static info
3. สร้าง webhook endpoint `/api/stripe/webhook` ที่ insert ลงตาราง `orders` (เพิ่มใหม่)

---

## ⚠️ Disclaimer

เว็บนี้แสดง risk disclaimer ใน footer ทั้ง 2 ภาษา:
- **TH:** การลงทุนมีความเสี่ยง ผลตอบแทนในอดีตไม่รับประกันผลในอนาคต
- **EN:** Trading involves risk. Past performance does not guarantee future results.

---

## 🛠️ คำสั่งที่ใช้บ่อย

```bash
npm run dev          # dev server
npm run build        # build production
npm run start        # start production server
npm run typecheck    # ตรวจ TypeScript
npm run lint         # ตรวจ ESLint
```

---

## 📜 License

© BOTKRIT — สงวนลิขสิทธิ์
