
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { MultinomialDashboard } from '@/components/quantlab/dashboards/MultinomialDashboard';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

export default function MultinomialDistributionPage() {
  return (
    <>
      <PageHeader
        title="Multinomial Distribution"
        description="A generalization of the Binomial distribution for more than two outcomes."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Beyond Success or Failure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Multinomial distribution extends the Binomial distribution to situations with more than two possible outcomes for each trial. While Binomial models the number of successes in a series of 'success/failure' trials, Multinomial models the number of times each of a set of possible outcomes occurs.
            </p>
            <p>
              For example, instead of just a 'win' or 'loss', a trade could result in a 'big win', 'small win', 'breakeven', 'small loss', or 'big loss'. The Multinomial distribution can calculate the probability of observing a specific count for each of these categories over a series of trades.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Multinomial Calculator</CardTitle>
            <CardDescription>Specify the parameters to calculate the probability of a specific result. Since the full distribution is multi-dimensional, we calculate the probability for a specific outcome vector.</CardDescription>
          </CardHeader>
          <CardContent>
            <MultinomialDashboard />
          </CardContent>
        </Card>
        
        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Mass Function (PMF)</CardTitle>
                  <CardDescription>The PMF gives the probability of observing *exactly* a specific set of counts for each of the `c` possible outcomes.</CardDescription>
              </CardHeader>
              <CardContent>
                  <BlockMath math="P(X_1=x_1, ..., X_c=x_c) = \frac{n!}{x_1! \cdots x_c!} p_1^{x_1} \cdots p_c^{x_c}" />
                  <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li>The first term is the **multinomial coefficient**, which counts the number of ways to arrange the outcomes. It's a generalization of the binomial coefficient.</li>
                      <li>The second part is the product of the probabilities of achieving the desired count for each outcome category, similar to the Binomial PMF but extended for multiple categories.</li>
                  </ul>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <p>For a multinomial distribution, we look at the mean and variance for the count of a *single* outcome <InlineMath math="X_i"/>.</p>
                  <div>
                      <h4 className="font-semibold">Expected Value (Mean)</h4>
                      <BlockMath math="E[X_i] = n p_i"/>
                      <p className="text-sm text-muted-foreground mt-2">This is intuitive: if you have 100 trials (`n=100`) and outcome `i` has a 30% chance (`p_i=0.3`), you expect to see it `100 * 0.3 = 30` times.</p>
                  </div>
                  <div>
                      <h4 className="font-semibold">Variance</h4>
                      <BlockMath math="Var(X_i) = n p_i (1-p_i)"/>
                      <p className="text-sm text-muted-foreground mt-2">Notice that the variance for a single outcome's count is the same as if it were a Binomial distribution (treating that outcome as "success" and all others as "failure").</p>
                  </div>
              </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Applications">
          <KeyConceptAlert title="Machine Learning: Text Classification" icon="brain">
            <p>A "Bag of Words" model in NLP treats a document as a collection of word counts. The Multinomial distribution is the fundamental assumption behind models like Naive Bayes for text classification. It's used to model the probability of observing the word counts in a document, given that the document belongs to a certain category (e.g., 'spam', 'finance', 'sports').</p>
          </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
