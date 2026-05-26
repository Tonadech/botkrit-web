// root layout — เป็นเปลือกบางๆ เพราะ html/body จริงอยู่ใน app/[locale]/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
