// ค่าคงที่ที่ใช้ทั่วทั้งเว็บ — อ่านจาก env (มี fallback ให้)

export const siteConfig = {
  name: 'BOTKRIT',
  tagline_th: 'พัฒนา EA และสอนสร้าง EA ด้วยมือตัวเอง',
  tagline_en: 'Build EAs and learn to build them yourself',

  contact: {
    line: process.env.NEXT_PUBLIC_LINE_URL || '#',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || '#',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@botkrit.com',
  },

  payment: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'ธนาคารกสิกรไทย',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'นาย ตัวอย่าง รับเงิน',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '123-4-56789-0',
    promptPayQr: process.env.NEXT_PUBLIC_PROMPTPAY_QR_URL || '/payment/promptpay-qr.png',
  },
};
