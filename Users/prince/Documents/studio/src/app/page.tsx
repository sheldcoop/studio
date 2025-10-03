
'use client';

import { quantJourney } from '@/lib/site';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import { AnimatedJourneyCard, StaticJourneyCard } from '@/components/app/animated-journey-card';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

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
            // The AnimatedJourneyCard now handles its own navigation.
            // We no longer wrap it in a <Link> component here.
            if (item.animation) {
               return <AnimatedJourneyCard key={item.id} item={item} />
            }
            // The StaticJourneyCard is still wrapped in a Link as it has no complex interaction.
            return <StaticJourneyCard key={item.id} item={item} />
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
