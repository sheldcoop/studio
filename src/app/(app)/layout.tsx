'use client';

import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">{children}</main>
      <Footer />
    </div>
  );
}
