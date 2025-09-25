

'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function HypothesisTestingPage() {
  const parametricTests = [
    { name: 'ANOVA', description: 'Compares the averages of three or more groups.', slug: 'anova' },
    { name: 'Pearson Correlation', description: 'Measures the linear relationship between two continuous variables.', slug: 'pearson-correlation' },
    { name: 'F-Test', description: 'Compares the variances (spread) of two or more groups.', slug: 'f-test' },
    { name: 'T-Test', description: 'Compares the means of two groups, assuming normal distribution.', slug: 't-test'},
    { name: 'Z-Test', description: 'Compares means of large samples (n>30) with known population variance.', slug: 'z-test'}
  ];

  const nonParametricTests = [
    { name: 'Mann-Whitney U Test', description: 'Alternative to the T-Test when data is not normally distributed.', slug: 'mann-whitney-u-test' },
    { name: 'Kruskal-Wallis Test', description: 'Alternative to ANOVA for comparing three or more groups.', slug: 'kruskal-wallis-test' },
    { name: 'Wilcoxon Signed-Rank Test', description: 'Alternative to the paired T-Test for repeated measurements.', slug: 'wilcoxon-signed-rank-test' },
    { name: 'Spearman\'s Rank Correlation', description: 'Measures the monotonic relationship between two ranked variables.', slug: 'spearmans-rank-correlation' },
    { name: 'Friedman Test', description: 'The non-parametric alternative to a repeated-measures ANOVA. Used to compare three or more related/paired groups.', slug: 'friedman-test' },
    { name: 'Kolmogorov-Smirnov (K-S) Test', description: 'Tests if a sample is drawn from a specific distribution (e.g., "Is my data normally distributed?").', slug: 'kolmogorov-smirnov-k-s-test' },
    { name: 'Chi-Squared Test', description: 'Tests if there is a significant association between two categorical variables.', slug: 'chi-squared-test' }
  ];

  return (
    <>
      <PageHeader
        title="Hypothesis Testing & P-Values"
        description="The detective work of data science: making decisions under uncertainty."
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The Core Idea: What is Hypothesis Testing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Think of hypothesis testing as being a data detective. You start with a default assumption, the <strong>Null Hypothesis (H₀)</strong>, which states there is no effect or no difference (e.g., "a new drug has no effect"). Then, you gather evidence (your sample data) to see if you have enough proof to reject that default assumption in favor of an alternative, the <strong>Alternative Hypothesis (H₁)</strong> (e.g., "the new drug has an effect").
            </p>
            <p>
                The <strong>p-value</strong> is the crucial piece of evidence. It's the probability of observing your data (or something even more extreme) if the null hypothesis were actually true. A small p-value (typically < 0.05) suggests that your observed data is very unlikely under the null hypothesis, giving you a reason to reject it.
            </p>
          </CardContent>
        </Card>

        <section>
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">The Two Paths: Parametric vs. Non-Parametric</h2>
                <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">The type of data you have determines the statistical test you can use. The main fork in the road is between parametric and non-parametric tests.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">👨‍🍳 Parametric Tests</CardTitle>
                        <CardDescription>The Professional Chef: Assumes ingredients (data) meet certain standards (e.g., normal distribution). Precise and powerful when assumptions are met.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {parametricTests.map(test => (
                                <li key={test.slug}>
                                    <Link href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.name}</h4>
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
                        <CardDescription>The Campfire Cook: Makes no strict assumptions about ingredients. More flexible and robust, especially with unusual, ranked, or non-normal data.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-3">
                            {nonParametricTests.map(test => (
                                 <li key={test.slug}>
                                    <Link href={`/topics/${test.slug}`} className="block rounded-lg border p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                                        <h4 className="font-semibold">{test.name}</h4>
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
