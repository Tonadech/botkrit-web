import { Navbar } from './navbar';
import { Footer } from './footer';
import type { Locale } from '@/types/database';

// Layout บางๆ ที่หน้า public หลายหน้าใช้ร่วมกัน (navbar + content + footer)
export async function PageShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
