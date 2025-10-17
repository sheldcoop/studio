
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { BinomialDashboard } from '@/components/quantlab/dashboards/BinomialDashboard';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

// --- Main Page Component ---
export default function BinomialDistributionPage() {
  return (
    <>
      <PageHeader
        title="Binomial Distribution"
        description="Modeling the number of successes in a sequence of independent trials."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">The "Series of Coin Flips" Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              The Binomial Distribution is a discrete probability distribution that models the number of successes in a fixed number of independent 'Bernoulli' trials, where each trial has only two possible outcomes: success or failure.
            </p>
            <p>
              Think of flipping a coin 10 times and counting the number of heads. In finance, this could model the number of winning trades in a month (where each trade is a trial), or the number of portfolio companies that meet their earnings target in a quarter.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Binomial Distribution</CardTitle>
            <CardDescription>Adjust the number of trials (n) and the probability of success (p) to see how the shape of the distribution changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <BinomialDashboard />
          </CardContent>
        </Card>

        <PageSection title="Core Concepts">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Probability Mass Function (PMF)</CardTitle>
                  <CardDescription>The PMF answers: "What is the probability of getting *exactly* `k` successes in `n` trials?"</CardDescription>
              </CardHeader>
              <CardContent>
                  <FormulaBlock>
                    <BlockMath math="P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}" />
                  </FormulaBlock>
                  <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                      <li><InlineMath math="\binom{n}{k}" /> (the binomial coefficient) counts the number of different ways to arrange `k` successes among `n` trials.</li>
                      <li><InlineMath math="p^k" /> is the probability of achieving `k` successes.</li>
                      <li><InlineMath math="(1-p)^{n-k}" /> is the probability of getting `n-k` failures.</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">The interactive chart above is a direct visualization of this PMF for each possible value of `k`.</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Cumulative Distribution Function (CDF)</CardTitle>
                  <CardDescription>The CDF answers: "What is the probability of getting `k` successes *or fewer*?"</CardDescription>
              </CardHeader>
              <CardContent>
                  <FormulaBlock>
                    <BlockMath math="F(k) = P(X \le k) = \sum_{i=0}^{k} \binom{n}{i} p^i (1-p)^{n-i}" />
                  </FormulaBlock>
                  <p className="text-sm text-muted-foreground mt-4">The CDF is simply the sum of all the probabilities from the PMF for all outcomes up to and including `k`.</p>
              </CardContent>
          </Card>
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Expected Value & Variance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Expected Value (Mean)</h4>
                        <FormulaBlock><BlockMath math="E[X] = np" /></FormulaBlock>
                        <p className="text-sm text-muted-foreground mt-2">This is intuitive: if you flip a fair coin (p=0.5) 20 times (n=20), you would expect to get 20 * 0.5 = 10 heads.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Variance</h4>
                        <FormulaBlock><BlockMath math="Var(X) = np(1-p)" /></FormulaBlock>
                        <p className="text-sm text-muted-foreground mt-2">The variance measures the spread of the outcomes. Notice it's maximized when p=0.5, representing the highest uncertainty.</p>
                    </div>
                </CardContent>
            </Card>
        </PageSection>

        <PageSection title="Applications">
            <KeyConceptAlert title="Quantitative Finance: Option Pricing" icon="brain">
              <p>The Binomial Option Pricing Model uses a discrete-time binomial tree to model the price of an underlying asset. At each step, the price can move up or down with a certain probability `p`. By working backward from the option's expiration date, traders can calculate the option's fair value today. Each step in the tree is a Bernoulli trial, and the final distribution of possible prices follows a Binomial distribution.</p>
            </KeyConceptAlert>
        </PageSection>
      </div>
    </>
  );
}
