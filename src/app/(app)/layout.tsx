import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/app/logo';
import { MainNav } from '@/components/app/main-nav';
import { UserNav } from '@/components/app/user-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className='flex items-center justify-between p-3'>
          <Logo />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
