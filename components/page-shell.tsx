import { Topbar } from './topbar';
import { PublicSidebar } from './public-sidebar';
import { Footer } from './footer';
import type { Locale } from '@/types/database';

// Layout หลักของหน้า public:
//   ┌─────────────────────────────────────────┐
//   │ Topbar (sticky)                          │
//   ├─────────┬───────────────────────────────┤
//   │ Sidebar │ Main content                  │
//   │  ซ้าย   │  ขวา                          │
//   ├─────────┴───────────────────────────────┤
//   │ Footer (full width)                      │
//   └─────────────────────────────────────────┘
export async function PageShell({
  children,
  locale,
  /** ถ้าตั้งเป็น true จะให้ hero ขยายเต็มความกว้าง (ใช้ในหน้าแรก) */
  bleedContent = false,
}: {
  children: React.ReactNode;
  locale: Locale;
  bleedContent?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar locale={locale} />

      <div className="flex flex-1">
        {/* Sidebar (desktop เท่านั้น) — ตำแหน่ง sticky พร้อม scroll independent */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r bg-muted/30 md:block">
          <PublicSidebar locale={locale} />
        </aside>

        <main className={bleedContent ? 'flex-1' : 'flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8'}>
          {children}
        </main>
      </div>

      <Footer locale={locale} />
    </div>
  );
}
