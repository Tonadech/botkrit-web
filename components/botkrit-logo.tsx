import { cn } from '@/lib/utils';

// โลโก้ BOTKRIT — ตัว "B" ไล่เฉดทอง สไตล์ terminal (prompt > + เส้นเทรนด์)
// ใช้แทนไอคอนเดิมใน topbar / footer ปรับขนาดผ่าน className (เช่น "size-8")
export function BotkritLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="BOTKRIT"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="botkrit-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f9d976" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      {/* พื้นหลังโค้งมน navy */}
      <rect width="200" height="200" rx="40" fill="#07122a" />
      {/* ตัว B monogram */}
      <path
        d="M60 50 V150 L85 130 H115 C135 130 145 120 145 100 C145 80 135 70 115 70 H85 L110 50 H60Z"
        fill="url(#botkrit-gold)"
      />
      {/* terminal prompt > */}
      <path
        d="M75 90 L90 100 L75 110"
        stroke="#07122a"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* เส้นเทรนด์ */}
      <path
        d="M120 110 L135 95 L150 100"
        stroke="#f9d976"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
