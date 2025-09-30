
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const componentLoader = () => <Skeleton className="w-full h-96" />;

const TTestPage = dynamic(() => import('@/app/(app)/topics/t-test/page').then(mod => mod.default), { loading: componentLoader });
const ZTestPage = dynamic(() => import('@/app/(app)/topics/z-test/page').then(mod => mod.default), { loading: componentLoader });
const AnovaPage = dynamic(() => import('@/app/(app)/topics/anova/page').then(mod => mod.default), { loading: componentLoader });
const FTestPage = dynamic(() => import('@/app/(app)/topics/f-test/page').then(mod => mod.default), { loading: componentLoader });
const ChiSquaredTestPage = dynamic(() => import('@/app/(app)/topics/chi-squared-test/page').then(mod => mod.default), { loading: componentLoader });
const PearsonCorrelationPage = dynamic(() => import('@/app/(app)/topics/pearson-correlation/page').then(mod => mod.default), { loading: componentLoader });
const MannWhitneyUPage = dynamic(() => import('@/app/(app)/topics/mann-whitney-u-test/page').then(mod => mod.default), { loading: componentLoader });
const KruskalWallisTestPage = dynamic(() => import('@/app/(app)/topics/kruskal-wallis-test/page').then(mod => mod.default), { loading: componentLoader });
const WilcoxonSignedRankTestPage = dynamic(() => import('@/app/(app)/topics/wilcoxon-signed-rank-test/page').then(mod => mod.default), { loading: componentLoader });
const SpearmanCorrelationPage = dynamic(() => import('@/app/(app)/topics/spearmans-rank-correlation/page').then(mod => mod.default), { loading: componentLoader });
const FriedmanTestPage = dynamic(() => import('@/app/(app)/topics/friedman-test/page').then(mod => mod.default), { loading: componentLoader });
const KSTestPage = dynamic(() => import('@/app/(app)/topics/kolmogorov-smirnov-k-s-test/page').then(mod => mod.default), { loading: componentLoader });


const tests = [
    { id: 't-test', title: 'T-Test', Component: TTestPage },
    { id: 'z-test', title: 'Z-Test', Component: ZTestPage },
    { id: 'anova', title: 'ANOVA', Component: AnovaPage },
    { id: 'f-test', title: 'F-Test', Component: FTestPage },
    { id: 'chi-squared', title: 'Chi-Squared', Component: ChiSquaredTestPage },
    { id: 'pearson', title: 'Pearson Correlation', Component: PearsonCorrelationPage },
    { id: 'mann-whitney', title: 'Mann-Whitney U', Component: MannWhitneyUPage },
    { id: 'kruskal-wallis', title: 'Kruskal-Wallis', Component: KruskalWallisTestPage },
    { id: 'wilcoxon', title: 'Wilcoxon Signed-Rank', Component: WilcoxonSignedRankTestPage },
    { id: 'spearman', title: "Spearman's Rank", Component: SpearmanCorrelationPage },
    { id: 'friedman', title: 'Friedman Test', Component: FriedmanTestPage },
    { id: 'ks-test', title: 'K-S Test', Component: KSTestPage },
];

export default function ConsolidatedStatisticsPage() {
  return (
    <>
      <PageHeader
        title="Interactive Statistical Tests"
        description="The detective work of data science. Explore the core statistical tests used in quantitative analysis. Each tab provides an interactive example to help you build intuition."
        variant="aligned-left"
      />
       <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea: What is Hypothesis Testing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Think of hypothesis testing as being a data detective. You start with a default assumption, the <strong>Null Hypothesis (H₀)</strong>, which states there is no effect or no difference (e.g., "a new drug has no effect"). Then, you gather evidence (your sample data) to see if you have enough proof to reject that default assumption in favor of an alternative, the <strong>Alternative Hypothesis (H₁)</strong> (e.g., "the new drug has an effect").
            </p>
            <p>
                The <strong>p-value</strong> is the crucial piece of evidence. It's the probability of observing your data (or something even more extreme) if the null hypothesis were actually true. A small p-value (typically &lt; 0.05) suggests that your observed data is very unlikely under the null hypothesis, giving you a reason to reject it.
            </p>
          </CardContent>
        </Card>
      <Card className="mt-8">
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="t-test" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
