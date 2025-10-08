'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Logo } from './logo';
import { MainNav } from './main-nav';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300',
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <MainNav />
          </nav>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="mb-6 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Logo />
            </Link>
            <div className="flex flex-col space-y-3">
              <MainNav onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <div className="w-full flex-1 md:w-auto md:flex-none">
             {/* You can add a search bar here if needed */}
           </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="#">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}