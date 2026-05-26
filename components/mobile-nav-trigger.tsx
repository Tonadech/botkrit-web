'use client';

import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// ปุ่ม hamburger เปิด drawer sidebar บน mobile
// รับ sidebar (server component) มา render ข้างใน Sheet
export function MobileNavTrigger({ sidebar, label }: { sidebar: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={label}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-base">BOTKRIT</SheetTitle>
        </SheetHeader>
        {/* ปิด sheet เมื่อคลิก link ภายใน */}
        <div onClick={() => setOpen(false)}>
          {sidebar}
        </div>
      </SheetContent>
    </Sheet>
  );
}
