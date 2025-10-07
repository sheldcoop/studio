
'use client';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import HomePageClient from '@/components/app/home-page-client';


export default function RootPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HomePageClient />
      </main>
      <Footer />
    </div>
  );
}
