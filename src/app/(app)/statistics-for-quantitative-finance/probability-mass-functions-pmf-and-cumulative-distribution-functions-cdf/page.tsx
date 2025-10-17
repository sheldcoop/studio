
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

export default function PMFCDFPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="PMF & CDF: Describing Discrete Random Variables"
        description="The two essential tools for understanding and visualizing the probabilities of discrete outcomes."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've established the idea of a random variable—a variable whose value is a numerical outcome of a random phenomenon. Now, we need a precise way to describe its behavior. For **discrete** random variables (those that can only take on a countable number of values), our two primary tools are the Probability Mass Function (PMF) and the Cumulative Distribution Function (CDF).
        </p>
        <p>
          Think of them as two different ways of looking at the same information. The PMF tells you the probability of hitting an exact value, while the CDF tells you the probability of being at or below a certain value.
        </p>
      </article>

      <PageSection title="The Probability Mass Function (PMF)">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The "Exactly Equal To" Function</CardTitle>
                <CardDescription>The PMF, denoted as <InlineMath math="p(x)" />, answers the question: "What is the probability that our random variable <InlineMath math="X" /> is exactly equal to some value <InlineMath math="x" />?"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormulaBlock>
                    <BlockMath math="p(x) = P(X = x)" />
                </FormulaBlock>
                <p><strong>Example: A Fair Six-Sided Die</strong></p>
                <p>Let <InlineMath math="X" /> be the random variable representing the outcome of a single die roll. The possible outcomes are <InlineMath math="\{1, 2, 3, 4, 5, 6\}" />. Since the die is fair, the PMF is:</p>
                 <BlockMath math="P(X=k) = \frac{1}{6} \quad \text{for } k \in \{1, 2, 3, 4, 5, 6\}" />
                 <p className="font-semibold mt-4">Properties of a PMF:</p>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li><InlineMath math="0 \le p(x) \le 1" /> for all <InlineMath math="x" />. (Probabilities are between 0 and 100%).</li>
                    <li><InlineMath math="\sum_{x} p(x) = 1" />. (The sum of probabilities for all possible outcomes must be 1).</li>
                </ol>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Cumulative Distribution Function (CDF)">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The "Less Than or Equal To" Function</CardTitle>
                <CardDescription>The CDF, denoted <InlineMath math="F(x)" />, answers the question: "What is the probability that our random variable <InlineMath math="X" /> takes on a value less than or equal to <InlineMath math="x" />?"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormulaBlock>
                    <BlockMath math="F(x) = P(X \le x) = \sum_{t \le x} p(t)" />
                </FormulaBlock>
                <p>The CDF is the sum of all the probabilities from the PMF up to the value <InlineMath math="x" />. It's a running total.</p>
                <p><strong>Example: CDF for a Fair Die Roll</strong></p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><InlineMath math="F(1) = P(X \le 1) = P(X=1) = 1/6" /></li>
                    <li><InlineMath math="F(2) = P(X \le 2) = P(X=1) + P(X=2) = 2/6" /></li>
                    <li><InlineMath math="F(3) = P(X \le 3) = 3/6" /></li>
                    <li>...and so on, up to <InlineMath math="F(6) = 1" />.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">For a discrete variable, the CDF is a step function, jumping up at each possible outcome.</p>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Applications in Quant Finance & ML">
        <KeyConceptAlert title="Quant Finance: Modeling Credit Defaults" icon="brain">
          <p>A portfolio manager holds a basket of 10 similar corporate bonds. Using historical data, they build a PMF for the number of defaults they expect to see in the next year. Let <InlineMath math="X" /> be the number of defaults.</p>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
            <li>The **PMF** answers: "What's the probability of exactly 2 defaults?" (<InlineMath math="P(X=2)" />). This is crucial for pricing certain derivatives or setting loss reserves.</li>
            <li>The **CDF** answers: "What's the probability of 2 or fewer defaults?" (<InlineMath math="P(X \le 2)" />). This is essential for calculating Value-at-Risk (VaR) and understanding the tail risk of the portfolio.</li>
          </ul>
        </KeyConceptAlert>
        <KeyConceptAlert title="Machine Learning: Setting Classification Thresholds" icon="brain">
          <p>A machine learning model outputs a "probability of default" score for loan applicants, ranging from 0 to 1. The bank needs to decide on a threshold to approve or reject loans.</p>
          <p className="mt-2">The **CDF** of these scores is the perfect tool. By looking at the CDF, a risk officer can answer questions like: "What score threshold corresponds to the top 5% most risky applicants?" (<InlineMath math="F(x) = 0.95" />). This allows them to set data-driven rules for their lending decisions.</p>
        </KeyConceptAlert>
      </PageSection>

      <LessonSummaryCard title="Summary: PMF vs. CDF">
        <li><strong>PMF (<InlineMath math="P(X=x)" />):</strong> Gives the probability of a single, specific outcome. Think of it as the "mass" at a single point. The graph is a series of spikes.</li>
        <li><strong>CDF (<InlineMath math="P(X \le x)" />):</strong> Gives the total, cumulative probability of all outcomes up to a certain point. It's a non-decreasing function that goes from 0 to 1. The graph is a step function.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/statistics-for-quantitative-finance/expected-value-e-x-variance-var-x-and-standard-deviation">
        Expected Value, Variance, and Standard Deviation
      </NextUpNavigation>
    </div>
  );
}
