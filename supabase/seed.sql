-- ============================================================
-- BOTKRIT — Seed / Mock Data (Bilingual)
-- รันหลัง schema.sql ใน Supabase SQL Editor
-- ============================================================

-- ---------- EAs (2 ตัวอย่าง) ----------
insert into public.eas (slug, name_th, name_en, description_th, description_en,
  features_th, features_en, price, image_url, backtest_result, is_published)
values
(
  'botkrit-trend-master',
  'BotKrit Trend Master',
  'BotKrit Trend Master',
  'EA จับเทรนด์อัตโนมัติด้วย logic Multi-Timeframe เหมาะกับคู่ XAUUSD และ EURUSD เปิด-ปิดออเดอร์อย่างมีระบบ พร้อมระบบจัดการความเสี่ยง',
  'A multi-timeframe trend-following EA optimized for XAUUSD and EURUSD with systematic entry/exit and built-in risk management.',
  '["จับเทรนด์ด้วย Multi-Timeframe", "ระบบ Trailing Stop อัตโนมัติ", "จำกัด Drawdown ต่อวัน", "ตั้งค่าผ่านไฟล์ .set ได้"]'::jsonb,
  '["Multi-timeframe trend detection", "Automatic trailing stop", "Daily drawdown limiter", "Configurable via .set files"]'::jsonb,
  4990.00,
  null,
  'Backtest 2019–2024 บนคู่ XAUUSD H1: Net Profit +312%, Max DD 18.2%, Profit Factor 1.74',
  true
),
(
  'botkrit-scalper-pro',
  'BotKrit Scalper Pro',
  'BotKrit Scalper Pro',
  'EA Scalping ความถี่สูง เน้นช่วง London/New York Session มีระบบ Spread Filter และ News Filter',
  'A high-frequency scalping EA focused on London/New York sessions with spread filter and news filter.',
  '["Spread Filter ป้องกันเปิดในช่วง spread กว้าง", "News Filter หลีกเลี่ยงข่าวแรง", "Session Filter เลือกเทรดเฉพาะช่วงคุ้ม", "รองรับ ECN Broker"]'::jsonb,
  '["Spread filter to avoid wide-spread periods", "News filter to skip high-impact news", "Session filter for optimal hours", "ECN broker friendly"]'::jsonb,
  3990.00,
  null,
  'Backtest 2021–2024 บน EURUSD M5: Win rate 71%, Profit Factor 1.52, Max DD 9.8%',
  true
);

-- ---------- Courses (2 คอร์ส) ----------
insert into public.courses (slug, title_th, title_en, description_th, description_en,
  level, price, syllabus_th, syllabus_en, benefits_th, benefits_en, image_url, is_published)
values
(
  'mql5-foundation',
  'พื้นฐาน MQL5 สำหรับสร้าง EA',
  'MQL5 Foundation for Building EAs',
  'คอร์สเริ่มต้นเรียนรู้ภาษา MQL5 ตั้งแต่ syntax พื้นฐานไปจนถึงการสร้าง EA ตัวแรกของคุณ',
  'A beginner course on MQL5 — from basic syntax to building your very first EA from scratch.',
  'beginner',
  2990.00,
  '[
    {"chapter": 1, "title": "แนะนำ MetaTrader 5 และภาษา MQL5", "topics": ["ติดตั้ง MT5", "MetaEditor", "Hello World"]},
    {"chapter": 2, "title": "พื้นฐาน Syntax", "topics": ["ตัวแปร", "เงื่อนไข", "ลูป", "ฟังก์ชัน"]},
    {"chapter": 3, "title": "Indicator พื้นฐาน", "topics": ["iMA", "iRSI", "iATR"]},
    {"chapter": 4, "title": "สร้าง EA ตัวแรก", "topics": ["OnInit", "OnTick", "การเปิด/ปิดออเดอร์"]}
  ]'::jsonb,
  '[
    {"chapter": 1, "title": "Intro to MetaTrader 5 and MQL5", "topics": ["Install MT5", "MetaEditor", "Hello World"]},
    {"chapter": 2, "title": "Syntax Fundamentals", "topics": ["Variables", "Conditions", "Loops", "Functions"]},
    {"chapter": 3, "title": "Basic Indicators", "topics": ["iMA", "iRSI", "iATR"]},
    {"chapter": 4, "title": "Build Your First EA", "topics": ["OnInit", "OnTick", "Order open/close"]}
  ]'::jsonb,
  '["วิดีโอเรียน 8+ ชั่วโมง", "Source code ครบทุกบท", "กลุ่ม Line ถามตอบตลอดชีพ", "ใบประกาศจบหลักสูตร"]'::jsonb,
  '["8+ hours of video lessons", "Full source code for every chapter", "Lifetime Line group support", "Course completion certificate"]'::jsonb,
  null,
  true
),
(
  'advanced-ea-systems',
  'สร้างระบบ EA ขั้นสูง',
  'Advanced EA Systems',
  'เจาะลึกการออกแบบระบบ EA ขั้นสูง — Money Management, Multi-Strategy, การทำ Optimization และ Forward Test ที่ถูกต้อง',
  'Deep dive into advanced EA design — money management, multi-strategy frameworks, proper optimization and forward testing.',
  'advanced',
  6990.00,
  '[
    {"chapter": 1, "title": "Money Management ขั้นสูง", "topics": ["Risk per trade", "Equity protection", "Kelly criterion"]},
    {"chapter": 2, "title": "Multi-Strategy Framework", "topics": ["Strategy isolation", "Capital allocation"]},
    {"chapter": 3, "title": "Optimization & Walk Forward", "topics": ["Strategy Tester", "Walk-forward analysis", "Overfitting prevention"]},
    {"chapter": 4, "title": "Deploy บน VPS", "topics": ["เลือก VPS", "ตั้งค่า MT5", "Monitoring"]}
  ]'::jsonb,
  '[
    {"chapter": 1, "title": "Advanced Money Management", "topics": ["Risk per trade", "Equity protection", "Kelly criterion"]},
    {"chapter": 2, "title": "Multi-Strategy Framework", "topics": ["Strategy isolation", "Capital allocation"]},
    {"chapter": 3, "title": "Optimization & Walk Forward", "topics": ["Strategy Tester", "Walk-forward analysis", "Avoiding overfitting"]},
    {"chapter": 4, "title": "VPS Deployment", "topics": ["Choosing a VPS", "MT5 setup", "Monitoring"]}
  ]'::jsonb,
  '["วิดีโอ 15+ ชั่วโมง", "Template EA ขั้นสูง", "1-on-1 review โค้ด 1 ชั่วโมง", "เข้ากลุ่ม VIP"]'::jsonb,
  '["15+ hours of video", "Advanced EA templates", "1-hour 1-on-1 code review", "VIP group access"]'::jsonb,
  null,
  true
);

-- ---------- Posts (2 บทความ) ----------
insert into public.posts (slug, title_th, title_en, content_th, content_en, category, cover_image, is_published)
values
(
  'what-is-ea',
  'EA (Expert Advisor) คืออะไร?',
  'What is an Expert Advisor (EA)?',
  E'# EA คืออะไร?\n\nExpert Advisor หรือ **EA** คือโปรแกรมเทรดอัตโนมัติที่ทำงานบนแพลตฟอร์ม MetaTrader (MT4/MT5) โดยอาศัย logic ที่เราเขียนขึ้นเพื่อ:\n\n- เปิด/ปิดออเดอร์อัตโนมัติ\n- จัดการความเสี่ยง (Stop Loss, Take Profit, Trailing)\n- ทำงาน 24 ชั่วโมงโดยไม่ต้องเฝ้าหน้าจอ\n\n## ข้อดี\n- ตัดอารมณ์ออกจากการเทรด\n- Backtest ได้ก่อนใช้จริง\n- ทำงานได้แม้คุณไม่อยู่หน้าจอ\n\n## ความเสี่ยง\nEA ที่ดี **ไม่ใช่** เครื่องพิมพ์เงิน — ทุก EA มีความเสี่ยง การลงทุนอาจขาดทุนได้ ควรทดสอบบน Demo ก่อนเสมอ',
  E'# What is an EA?\n\nAn **Expert Advisor (EA)** is an automated trading program that runs on the MetaTrader platform (MT4/MT5), executing logic you defined to:\n\n- Open/close orders automatically\n- Manage risk (Stop Loss, Take Profit, Trailing)\n- Trade 24/7 without requiring you to watch the screen\n\n## Benefits\n- Removes emotion from trading\n- Backtestable before going live\n- Works while you sleep\n\n## Risks\nA good EA is **not** a money printer — every EA carries risk. Always test on Demo before going live.',
  'education',
  null,
  true
),
(
  'backtest-vs-forward-test',
  'Backtest vs Forward Test ต่างกันยังไง?',
  'Backtest vs Forward Test — What''s the Difference?',
  E'# Backtest vs Forward Test\n\n## Backtest\nคือการทดสอบ EA กับข้อมูลย้อนหลัง เพื่อดูว่า strategy ใช้ได้ในอดีตหรือไม่\n\n**ข้อระวัง:** อย่า over-optimize parameter กับข้อมูลย้อนหลัง เพราะอาจ overfitting\n\n## Forward Test\nคือการรัน EA บนข้อมูลจริงแบบ real-time (มักจะรันบน Demo account) เพื่อยืนยันว่าผลทดสอบยังคงสอดคล้องกับสภาพตลาดจริง\n\n## สรุป\n- Backtest = ทดสอบในอดีต\n- Forward Test = ทดสอบในปัจจุบัน\n- ใช้ทั้งคู่ก่อนเอาเงินจริงเสมอ',
  E'# Backtest vs Forward Test\n\n## Backtest\nTesting your EA against historical data to see if the strategy worked in the past.\n\n**Warning:** Don''t over-optimize parameters against historical data — that''s overfitting.\n\n## Forward Test\nRunning your EA against live market data in real-time (usually on a Demo account) to confirm the strategy still holds in current conditions.\n\n## Summary\n- Backtest = past performance check\n- Forward Test = present performance check\n- Always use both before going live with real money.',
  'education',
  null,
  true
);
