
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { allTopics } from '@/lib/curriculum';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

type Goal = 'compare_means' | 'test_relationship';
type Groups = 'two' | 'more_than_two';
type DataType = 'parametric' | 'non_parametric';

const testMap: Record<Goal, Record<Groups, Record<DataType, string>>> = {
  compare_means: {
    two: {
      parametric: 't-test',
      non_parametric: 'mann-whitney-u-test',
    },
    more_than_two: {
      parametric: 'anova',
      non_parametric: 'kruskal-wallis-test',
    },
  },
  test_relationship: {
    two: {
      parametric: 'pearson-correlation',
      non_parametric: 'spearmans-rank-correlation',
    },
    more_than_two: {
      parametric: 'chi-squared-test', // Often used for categorical relationships
      non_parametric: 'chi-squared-test',
    },
  },
};

function TestCard({ testId }: { testId: string }) {
    const test = allTopics.find(t => t.id === testId);
    if (!test) return null;

    return (
        <Link href={test.href} className="group block rounded-lg">
            <Card className="h-full border-2 border-transparent bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/10">
                <CardHeader>
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}


export default function StatToolkitPage() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [groups, setGroups] = useState<Groups | null>(null);
  const [dataType, setDataType] = useState<DataType | null>(null);

  const recommendedTestId = useMemo(() => {
    if (goal && groups && dataType) {
      return testMap[goal]?.[groups]?.[dataType] || null;
    }
    return null;
  }, [goal, groups, dataType]);
  
  const parametricTests = allTopics.filter(t => t.category === 'parametric' && testMap.compare_means.two.parametric === t.id || testMap.compare_means.more_than_two.parametric === t.id || testMap.test_relationship.two.parametric === t.id);
  const nonParametricTests = allTopics.filter(t => t.category === 'non-parametric' && testMap.compare_means.two.non_parametric === t.id || testMap.compare_means.more_than_two.non_parametric === t.id || testMap.test_relationship.two.non_parametric === t.id || testMap.test_relationship.more_than_two.non_parametric === t.id);

  return (
    <>
      <PageHeader
        title="The Quant's Detective Kit"
        description="Don't know which test to use? Answer the questions below to find the right tool for the job."
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Statistical Test Chooser</CardTitle>
                <CardDescription>Follow these steps to identify the most appropriate statistical test for your needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Step 1: Goal */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">1</span>
                        What is your primary goal?
                    </h3>
                    <RadioGroup value={goal || ''} onValueChange={(v) => setGoal(v as Goal)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Label htmlFor="compare_means" className={cn("rounded-lg border p-4 cursor-pointer transition-all", goal === 'compare_means' && 'border-primary ring-2 ring-primary')}>
                            <RadioGroupItem value="compare_means" id="compare_means" className="sr-only" />
                            <span className="font-bold block">Compare Averages</span>
                            <span className="text-sm text-muted-foreground">See if the mean or median is different between groups.</span>
                        </Label>
                         <Label htmlFor="test_relationship" className={cn("rounded-lg border p-4 cursor-pointer transition-all", goal === 'test_relationship' && 'border-primary ring-2 ring-primary')}>
                            <RadioGroupItem value="test_relationship" id="test_relationship" className="sr-only" />
                            <span className="font-bold block">Test for a Relationship</span>
                            <span className="text-sm text-muted-foreground">Check if two variables are related or associated.</span>
                        </Label>
                    </RadioGroup>
                </div>

                {/* Step 2: Number of Groups */}
                {goal && (
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">2</span>
                            How many groups or variables are you analyzing?
                        </h3>
                        <RadioGroup value={groups || ''} onValueChange={(v) => setGroups(v as Groups)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Label htmlFor="two" className={cn("rounded-lg border p-4 cursor-pointer transition-all", groups === 'two' && 'border-primary ring-2 ring-primary')}>
                                <RadioGroupItem value="two" id="two" className="sr-only" />
                                <span className="font-bold block">Two</span>
                                <span className="text-sm text-muted-foreground">e.g., Comparing Strategy A vs. Strategy B</span>
                            </Label>
                             <Label htmlFor="more_than_two" className={cn("rounded-lg border p-4 cursor-pointer transition-all", groups === 'more_than_two' && 'border-primary ring-2 ring-primary')}>
                                <RadioGroupItem value="more_than_two" id="more_than_two" className="sr-only" />
                                <span className="font-bold block">More than Two</span>
                                <span className="text-sm text-muted-foreground">e.g., Comparing Sectors, Multiple strategies</span>
                            </Label>
                        </RadioGroup>
                    </div>
                )}

                 {/* Step 3: Data Type */}
                {goal && groups && (
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">3</span>
                            Does your data follow a Normal (Bell Curve) Distribution?
                        </h3>
                         <RadioGroup value={dataType || ''} onValueChange={(v) => setDataType(v as DataType)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Label htmlFor="parametric" className={cn("rounded-lg border p-4 cursor-pointer transition-all", dataType === 'parametric' && 'border-primary ring-2 ring-primary')}>
                                <RadioGroupItem value="parametric" id="parametric" className="sr-only" />
                                <span className="font-bold block">Yes, it's normally distributed.</span>
                                <span className="text-sm text-muted-foreground">Use a Parametric Test.</span>
                            </Label>
                             <Label htmlFor="non_parametric" className={cn("rounded-lg border p-4 cursor-pointer transition-all", dataType === 'non_parametric' && 'border-primary ring-2 ring-primary')}>
                                <RadioGroupItem value="non_parametric" id="non_parametric" className="sr-only" />
                                <span className="font-bold block">No, or I'm not sure.</span>
                                <span className="text-sm text-muted-foreground">Use a Non-Parametric Test.</span>
                            </Label>
                        </RadioGroup>
                    </div>
                )}
            </CardContent>
        </Card>

        {recommendedTestId && (
            <Card className="bg-primary/10 border-primary border-2">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-primary">
                        <CheckCircle />
                        Recommended Test
                    </CardTitle>
                    <CardDescription>Based on your answers, this is the most appropriate test to use.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TestCard testId={recommendedTestId} />
                </CardContent>
            </Card>
        )}

        <section>
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">Or, Browse All Tests</h2>
                <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">If you already know what you're looking for, you can browse all available tests below.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">👨‍🍳 Parametric Tests</CardTitle>
                        <CardDescription>Assumes data meets certain standards (e.g., normal distribution). Precise and powerful when assumptions are met.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {parametricTests.map(test => (
                                <li key={test.id}>
                                    <Link href={test.href} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.title}</h4>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">🏕️ Non-Parametric Tests</CardTitle>
                        <CardDescription>Makes no strict assumptions. More flexible and robust with unusual, ranked, or non-normal data.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {nonParametricTests.map(test => (
                                 <li key={test.id}>
                                    <Link href={test.href} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.title}</h4>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                    </Link>
                                 </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
      </div>
    </>
  );
}
