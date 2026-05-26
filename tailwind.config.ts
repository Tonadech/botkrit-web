import type { Config } from 'tailwindcss';

// ธีม BOTKRIT: น้ำเงินเข้ม (navy), เขียวมรกต (emerald), ทอง (gold)
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // สีหลักของแบรนด์
        brand: {
          navy: {
            DEFAULT: '#0B1F3A',
            light: '#173B68',
            dark: '#06122A',
          },
          emerald: {
            DEFAULT: '#0E9F6E',
            light: '#10B981',
            dark: '#065F46',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F0CB54',
            dark: '#A88820',
          },
        },
      },
      fontFamily: {
        // ใช้ system font ก่อน (ติดตั้ง font ภายหลังได้)
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
