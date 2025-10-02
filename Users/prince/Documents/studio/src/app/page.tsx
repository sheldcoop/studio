
'use client';

import { quantJourney } from '@/lib/site';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import { StaticJourneyCard } from '@/components/app/animated-journey-card';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AnimatedJourneyCard = dynamic(
  () => import('@/components/app/animated-journey-card').then(mod => mod.AnimatedJourneyCard),
  { 
    loading: () => <Skeleton className="h-[250px] w-full" />,
    ssr: false 
  }
);

export default function RootPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center p-4 md:p-8">
        <div className="my-12 max-w-3xl text-center">
          <AnimatedTagline />
          <p className="mt-4 text-lg text-muted-foreground">
            Master the core pillars of quantitative finance and data science,
            from foundational theory to practical application.
          </p>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quantJourney.map((item) => {
            if (item.animation) {
               return <AnimatedJourneyCard key={item.id} item={item} />
            }
            return <StaticJourneyCard key={item.id} item={item} />
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
