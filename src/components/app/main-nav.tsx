'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpenCheck,
  BotMessageSquare,
  Users,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/paths',
    label: 'Learning Paths',
    icon: BookOpenCheck,
  },
  {
    href: '/interview-prep',
    label: 'Interview Prep',
    icon: BotMessageSquare,
  },
  {
    href: '/community',
    label: 'Community',
    icon: Users,
  },
  {
    href: '/topics',
    label: 'Topics',
    icon: FolderKanban,
  }
];

type MainNavProps = {
  onLinkClick?: () => void;
};

export function MainNav({ onLinkClick }: MainNavProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard');
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'transition-colors hover:text-foreground/80 text-foreground/60',
               isActive && 'text-foreground',
               'md:text-sm md:font-medium md:hover:text-primary md:text-foreground',
               'flex items-center p-2 rounded-md hover:bg-secondary md:p-0 md:hover:bg-transparent'
            )}
          >
             <link.icon className="mr-2 h-5 w-5 md:hidden" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
