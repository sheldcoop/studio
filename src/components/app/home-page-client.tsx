
'use client';

import { quantJourney } from '@/lib/site';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import { AnimatedJourneyCard, StaticJourneyCard } from '@/components/app/animated-journey-card';

export default function HomePageClient() {
  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-8">
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
    </div>
  );
}
