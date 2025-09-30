
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpenCheck,
  BotMessageSquare,
  Users,
  FolderKanban,
  Sigma,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/paths',
    label: 'Learning Paths',
    icon: BookOpenCheck,
  },
  {
    href: '/topics/statistics',
    label: 'Statistical Tests',
    icon: Sigma,
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
    label: 'All Topics',
    icon: FolderKanban,
  },
];

type MainNavProps = {
  onLinkClick?: () => void;
};

export function MainNav({ onLinkClick }: MainNavProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          (pathname === '/' && link.href === '/') ||
          (link.href !== '/' && pathname.startsWith(link.href));
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
