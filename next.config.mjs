import createNextIntlPlugin from 'next-intl/plugin';

// ใช้ next-intl plugin โดยชี้ไป config ที่ ./lib/i18n.ts
const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // อนุญาตให้โหลดรูปจาก Supabase Storage ของเรา
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
