'use client';

import { quantJourney } from '@/lib/site';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import { JourneyCard } from '@/components/app/journey-card';

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
        {quantJourney.map((item) => (
          <JourneyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
