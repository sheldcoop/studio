'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex" />
        <h1 className="text-lg font-semibold">QuantPrep</h1>
      </div>
    </header>
  );
}
