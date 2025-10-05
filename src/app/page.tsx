import dynamic from 'next/dynamic';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the client-side heavy component
const HomePageClient = dynamic(
  () => import('@/components/app/home-page-client'),
  {
    ssr: false, // This component will only be rendered on the client
    loading: () => (
      // Provide a loading skeleton that matches the structure of the client component
      <div className="flex flex-1 flex-col items-center p-4 md:p-8">
        <div className="my-12 max-w-3xl text-center">
          <Skeleton className="h-14 w-96 mb-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4 mt-2" />
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
    ),
  }
);


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
