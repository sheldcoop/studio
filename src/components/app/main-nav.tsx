'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BookOpenCheck,
  BotMessageSquare,
  Users,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

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
];

export function MainNav() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <SidebarMenuItem key={link.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={isMobile ? undefined : link.label}
            >
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
