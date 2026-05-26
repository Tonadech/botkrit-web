'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// อัปโหลดรูปไป Supabase Storage (bucket "public") แล้วเอา public URL
// เซ็ตค่ากลับเข้าใน <input id={targetInputId}> ของฟอร์ม
export function ImageUploader({
  folder,
  targetInputId,
}: {
  folder: string;
  targetInputId: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(filename);
    const input = document.getElementById(targetInputId) as HTMLInputElement | null;
    if (input) input.value = publicUrl;
    setUploading(false);
  }

  return (
    <div className="mt-2">
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={uploading}
        className="text-xs file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-brand-emerald file:text-white file:cursor-pointer hover:file:bg-brand-emerald-light"
      />
      {uploading && <p className="mt-1 text-xs text-brand-emerald">Uploading...</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
