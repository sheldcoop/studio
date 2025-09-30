'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import all the test components to keep the initial load small
const TTestPage = dynamic(() => import('@/app/(app)/topics/statistics/t-test/page'));
const ZTestPage = dynamic(() => import('@/app/(app)/topics/statistics/z-test/page'));
const AnovaPage = dynamic(() => import('@/app/(app)/topics/statistics/anova/page'));
const FTestPage = dynamic(() => import('@/app/(app)/topics/statistics/f-test/page'));
const ChiSquaredTestPage = dynamic(() => import('@/app/(app)/topics/statistics/chi-squared-test/page'));
const MannWhitneyUPage = dynamic(() => import('@/app/(app)/topics/statistics/mann-whitney-u-test/page'));
const KruskalWallisTestPage = dynamic(() => import('@/app/(app)/topics/statistics/kruskal-wallis-test/page'));
const WilcoxonSignedRankTestPage = dynamic(() => import('@/app/(app)/topics/statistics/wilcoxon-signed-rank-test/page'));

const tests = [
    { id: 't-test', title: 'T-Test', Component: TTestPage },
    { id: 'z-test', title: 'Z-Test', Component: ZTestPage },
    { id: 'anova', title: 'ANOVA', Component: AnovaPage },
    { id: 'f-test', title: 'F-Test', Component: FTestPage },
    { id: 'chi-squared', title: 'Chi-Squared', Component: ChiSquaredTestPage },
    { id: 'mann-whitney', title: 'Mann-Whitney U', Component: MannWhitneyUPage },
    { id: 'kruskal-wallis', title: 'Kruskal-Wallis', Component: KruskalWallisTestPage },
    { id: 'wilcoxon', title: 'Wilcoxon Signed-Rank', Component: WilcoxonSignedRankTestPage },
];

export default function ConsolidatedStatisticsPage() {
  return (
    <>
      <PageHeader
        title="Interactive Statistical Tests"
        description="Explore the core statistical tests used in quantitative analysis. Each tab provides an interactive example to help you build intuition."
        variant="aligned-left"
      />
      <Card>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="t-test" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4 lg:grid-cols-4">
              {tests.map(test => (
                <TabsTrigger key={test.id} value={test.id} className="text-xs md:text-sm">
                  {test.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {tests.map(test => (
              <TabsContent key={test.id} value={test.id} className="mt-6">
                <test.Component />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
