import createMiddleware from 'next-intl/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

// next-intl middleware — จัดการ /th, /en และ redirect
const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always', // ใช้ /th, /en เสมอ
});

export async function middleware(request: NextRequest) {
  // 1) ปล่อยให้ next-intl rewrite/redirect ก่อน เพื่อให้ pathname เป็น /th/... หรือ /en/...
  const intlResponse = intlMiddleware(request);

  // 2) สำหรับเส้นทาง /admin ทุกอันที่ไม่ใช่ /admin/login → ต้องล็อกอินก่อน
  const { pathname } = request.nextUrl;
  const adminMatch = pathname.match(/^\/(th|en)\/admin(\/.*)?$/);
  if (adminMatch) {
    const subPath = adminMatch[2] || '';
    // อนุญาตหน้า /admin/login เข้าได้โดยไม่ต้อง auth
    if (subPath !== '/login') {
      // ใช้ supabase client เพื่อเช็ค session
      let supabaseResponse = NextResponse.next({ request });
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              supabaseResponse.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              supabaseResponse.cookies.set({ name, value: '', ...options });
            },
          },
        },
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const locale = adminMatch[1];
        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
      // หมายเหตุ: เช็ค role = 'admin' อีกชั้นในหน้า /admin ผ่าน server component
      // (middleware เช็คแค่ว่า login แล้วหรือยัง — เร็วและไม่ query DB ในทุก request)
    }
  }

  return intlResponse;
}

export const config = {
  // match ทุกเส้นทาง ยกเว้น api, _next, favicon, ไฟล์ static
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
