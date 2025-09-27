
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { quantJourney } from '@/lib/data';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/app/header';
import { Skeleton } from '@/components/ui/skeleton';

const AnimationLoader = () => <Skeleton className="h-full w-full" />;

const LinearAlgebraAnimation = dynamic(() => import('@/components/app/linear-algebra-animation').then(mod => mod.LinearAlgebraAnimation), { loading: () => <AnimationLoader /> });
const MentalMathAnimation = dynamic(() => import('@/components/app/mental-math-animation').then(mod => mod.MentalMathAnimation), { loading: () => <AnimationLoader /> });
const TimeSeriesAnimation = dynamic(() => import('@/components/app/time-series-animation').then(mod => mod.TimeSeriesAnimation), { loading: () => <AnimationLoader /> });
const StatisticsAnimation = dynamic(() => import('@/components/app/statistics-animation').then(mod => mod.StatisticsAnimation), { loading: () => <AnimationLoader /> });
const MachineLearningAnimation = dynamic(() => import('@/components/app/machine-learning-animation').then(mod => mod.MachineLearningAnimation), { loading: () => <AnimationLoader /> });
const ConfidenceIntervalAnimation = dynamic(() => import('@/components/app/confidence-interval-animation').then(mod => mod.ConfidenceIntervalAnimation), { loading: () => <AnimationLoader /> });
const ProbabilityAnimation = dynamic(() => import('@/components/app/probability-animation').then(mod => mod.ProbabilityAnimation), { loading: () => <AnimationLoader /> });


export default function RootPage() {
  const [isLaCardActive, setIsLaCardActive] = useState(false);
  const [isMmCardActive, setIsMmCardActive] = useState(false);
  const [isTsCardActive, setIsTsCardActive] = useState(false);
  const [isStatsCardActive, setIsStatsCardActive] = useState(false);
  const [isProbCardActive, setIsProbCardActive] = useState(false);
  const [isMlCardActive, setIsMlCardActive] = useState(false);
  const [isStCardActive, setIsStCardActive] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
          <div className="mb-12 max-w-3xl text-center">
            <AnimatedTagline />
            <p className="mt-4 text-lg text-muted-foreground">
              Master the core pillars of quantitative finance and data science,
              from foundational theory to practical application.
            </p>
          </div>
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quantJourney.map((item) => {
              if (item.id === 'linear-algebra-for-quantitative-finance') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <LinearAlgebraAnimation
                            onPointerEnter={() => setIsLaCardActive(true)}
                            onPointerLeave={() => setIsLaCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isLaCardActive &&
                                    'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isLaCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isLaCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'mental-math') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <MentalMathAnimation
                            onPointerEnter={() => setIsMmCardActive(true)}
                            onPointerLeave={() => setIsMmCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isMmCardActive && 'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isMmCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isMmCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'time-series-analysis-for-quantitative-finance') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <TimeSeriesAnimation
                            onPointerEnter={() => setIsTsCardActive(true)}
                            onPointerLeave={() => setIsTsCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isTsCardActive && 'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isTsCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isTsCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'statistics-for-quantitative-finance') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <StatisticsAnimation
                            onPointerEnter={() => setIsStatsCardActive(true)}
                            onPointerLeave={() => setIsStatsCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isStatsCardActive &&
                                    'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isStatsCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isStatsCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'probability') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <ProbabilityAnimation
                            onPointerEnter={() => setIsProbCardActive(true)}
                            onPointerLeave={() => setIsProbCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isProbCardActive &&
                                    'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isProbCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isProbCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'machine-learning-for-quantitative-finance') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <MachineLearningAnimation
                            onPointerEnter={() => setIsMlCardActive(true)}
                            onPointerLeave={() => setIsMlCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isMlCardActive &&
                                    'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isMlCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isMlCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              if (item.id === 'stat-toolkit') {
                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Link href={item.href} className="h-full w-full">
                      <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <ConfidenceIntervalAnimation
                            onPointerEnter={() => setIsStCardActive(true)}
                            onPointerLeave={() => setIsStCardActive(false)}
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col justify-between p-6">
                          <div>
                            <div className="mb-4">
                              <item.icon
                                className={cn(
                                  'h-8 w-8 text-primary transition-colors',
                                  isStCardActive &&
                                    'text-primary-foreground/80'
                                )}
                              />
                            </div>
                            <CardTitle
                              className={cn(
                                'font-headline text-xl transition-colors',
                                isStCardActive && 'text-card'
                              )}
                            >
                              {item.title}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={cn(
                              'transition-colors',
                              isStCardActive && 'text-primary-foreground/70'
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              }
              return (
                <Link
                  href={item.href}
                  key={item.id}
                  className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full transform-gpu flex-col bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                    <CardHeader>
                      <div className="mb-4">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-xl">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
