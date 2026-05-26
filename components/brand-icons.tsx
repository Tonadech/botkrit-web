import type { SVGProps } from 'react';

// Brand icons แบบ inline SVG (lucide-react v1.x ไม่มี brand icons แล้ว)

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function LineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.06 2C6.566 2 2.103 5.617 2.103 10.07c0 3.99 3.542 7.34 8.314 7.96.324.07.766.215.878.494.1.253.066.65.032.906l-.144.857c-.044.253-.202.99.86.539 1.063-.451 5.738-3.382 7.83-5.794 1.443-1.585 2.135-3.193 2.135-4.962C21.918 5.617 17.554 2 12.06 2z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.05 2.387 1.595 10.27c-1.396.561-1.388 1.34-.255 1.687l5.252 1.638 12.155-7.668c.574-.349 1.099-.161.668.222l-9.852 8.892h-.002l.002.001-.362 5.418c.531 0 .765-.244 1.063-.531l2.55-2.48 5.305 3.918c.977.539 1.68.262 1.923-.906l3.481-16.4c.357-1.434-.547-2.082-1.474-1.663z" />
    </svg>
  );
}
