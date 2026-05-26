import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// schema สำหรับตรวจ payload จาก form
const InquirySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().nullable().optional().or(z.literal('')),
  phone_or_line: z.string().max(120).nullable().optional().or(z.literal('')),
  message: z.string().min(1).max(5000),
  type: z.enum(['ea', 'course', 'general']).default('general'),
  related_id: z.string().uuid().nullable().optional(),
});

// POST /api/inquiries — รับฟอร์มจาก public
// RLS อนุญาตให้ anonymous insert ได้ (policy inquiries_public_insert)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = createClient();
    const { error } = await supabase.from('inquiries').insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone_or_line: parsed.data.phone_or_line || null,
      message: parsed.data.message,
      type: parsed.data.type,
      related_id: parsed.data.related_id || null,
    });

    if (error) {
      console.error('inquiry insert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('inquiry route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
