
'use client';

import { quantJourney } from '@/lib/site';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedJourneyCard, StaticJourneyCard } from '@/components/app/animated-journey-card';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';


const AnimationLoader = () => <Skeleton className="h-full w-full" />;

const animationComponents = {
  'linear-algebra': dynamic(() => import('@/components/app/linear-algebra-animation').then(mod => mod.LinearAlgebraAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'mental-math': dynamic(() => import('@/components/app/mental-math-animation').then(mod => mod.MentalMathAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'time-series-analysis': dynamic(() => import('@/components/app/time-series-animation').then(mod => mod.TimeSeriesAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'statistics': dynamic(() => import('@/components/app/statistics-animation').then(mod => mod.StatisticsAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'machine-learning': dynamic(() => import('@/components/app/machine-learning-animation').then(mod => mod.MachineLearningAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'stat-toolkit': dynamic(() => import('@/components/app/confidence-interval-animation').then(mod => mod.ConfidenceIntervalAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'probability': dynamic(() => import('@/components/app/plinko-animation').then(mod => mod.PlinkoAnimation), { loading: () => <AnimationLoader />, ssr: false }),
  'probability-toolkit': dynamic(() => import('@/components/app/probability-animation').then(mod => mod.ProbabilityAnimation), { loading: () => <AnimationLoader />, ssr: false }),
};


export default function RootPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="mb-12 max-w-3xl text-center">
          <AnimatedTagline />
          <p className="mt-4 text-lg text-muted-foreground">
            Master the core pillars of quantitative finance and data science,
            from foundational theory to practical application.
          </p>
        </div>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quantJourney.map((item) => {
            const AnimationComponent = animationComponents[item.id as keyof typeof animationComponents];

            if (AnimationComponent) {
              return <AnimatedJourneyCard key={item.id} item={item} AnimationComponent={AnimationComponent} />
            }
            
            return <StaticJourneyCard key={item.id} item={item} />
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
