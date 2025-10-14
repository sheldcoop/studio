
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function PortfolioOptimizationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Mean-Variance Portfolio Optimization & The Efficient Frontier"
        description="A Masterclass Edition lesson on the Nobel Prize-winning framework for constructing optimal portfolios."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we forged our primary tool: the equation for portfolio variance, <InlineMath math="\sigma^2_p = w^T\Sigma w" />. We now have a precise, mathematical definition of risk. This is a monumental step, but it is not the end of our journey. It is the beginning.
        </p>
        <p>
          The question that has driven finance for a century is: <strong>How should one invest?</strong>
        </p>
        <p>
          It’s a question of choice. Given thousands of stocks and bonds, there are an infinite number of portfolios we could construct. Are some choices fundamentally &quot;better&quot; than others? In 1952, a young economist named Harry Markowitz provided the first rigorous mathematical answer to this question, and it was so profound it won him the Nobel Prize.
        </p>
        <p>
          His framework, known as <strong>Mean-Variance Optimization</strong>, is the bedrock of Modern Portfolio Theory. Today, we will walk through his logic, build his model from the ground up, and discover for ourselves the beautiful and powerful concept of the <strong>Efficient Frontier</strong>.
        </p>
      </article>

      <PageSection title="The Two Dimensions of Investment - Risk and Return">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Investment Opportunity Set</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>Every investment can be characterized by two fundamental numbers:</p>
            <ol className="list-decimal pl-5 space-y-1">
                <li><strong>The Expected Return (The &quot;Mean&quot;):</strong> What reward do we expect to get?</li>
                <li><strong>The Risk (The &quot;Variance&quot;):</strong> How uncertain is that reward?</li>
            </ol>
            <p>As we learned, for a portfolio with a weight vector <InlineMath math="w" /> and an asset expected return vector <InlineMath math="\mu" />, the portfolio&apos;s expected return is:</p>
            <BlockMath math="\mu_p = w^T\mu" />
            <p>And for a portfolio with a covariance matrix <InlineMath math="\Sigma" />, the portfolio&apos;s risk (variance) is:</p>
            <BlockMath math="\sigma^2_p = w^T\Sigma w" />
            <p className="mt-4">The set of all possible portfolios forms the **investment opportunity set**. A key insight from plotting this set is that the portfolio with the minimum risk is a mix of assets. This is the mathematical proof of **diversification**.</p>
            <p>The top part of this opportunity set curve is the **Efficient Frontier**. It represents all portfolios that are &quot;Pareto-optimal&quot;—you cannot increase your return without also increasing your risk. These are the only &quot;smart&quot; choices.</p>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="The Formal Problem Statement">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Constrained Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The goal is to find the weights `w` that trace out the efficient frontier. The most common way to frame this is as a **constrained optimization** problem:</p>
                <p><strong>For a specific, desired level of expected return, `μ*`, find the set of weights `w` that achieves this return with the absolute minimum possible variance.</strong></p>
                <div className="rounded-lg border bg-muted/50 p-4">
                    <p><strong>Minimize:</strong> <InlineMath math="\frac{1}{2}w^T\Sigma w" /></p>
                    <p className="mt-2"><strong>Subject to the constraints:</strong></p>
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li><InlineMath math="w^T\mu = \mu^*" /> (The portfolio&apos;s return must be our target return)</li>
                    <li><InlineMath math="w^T\mathbf{1} = 1" /> (The weights must sum to 100%. <InlineMath math="\mathbf{1}" /> is a vector of ones.)</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="From Calculus to Linear Algebra: The Solution">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Method of Lagrange Multipliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>We use the Method of Lagrange Multipliers to solve this constrained problem by converting it into a larger, unconstrained problem using the Lagrangian function <InlineMath math="\mathcal{L}" />.</p>
                <BlockMath math="\mathcal{L}(w, \lambda_1, \lambda_2) = \frac{1}{2}w^T\Sigma w - \lambda_1(w^T\mu - \mu^*) - \lambda_2(w^T\mathbf{1} - 1)" />
                <p>Taking the derivatives gives us a system of linear equations:</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li><InlineMath math="\frac{\partial\mathcal{L}}{\partial w} = \Sigma w - \lambda_1\mu - \lambda_2\mathbf{1} = 0" /></li>
                    <li><InlineMath math="\frac{\partial\mathcal{L}}{\partial \lambda_1} = w^T\mu - \mu^* = 0 \implies \mu^T w = \mu^*" /></li>
                    <li><InlineMath math="\frac{\partial\mathcal{L}}{\partial \lambda_2} = w^T\mathbf{1} - 1 = 0 \implies \mathbf{1}^T w = 1" /></li>
                </ol>
                <p className="mt-4">This system can be written in the grand <InlineMath math="Ax=b" /> form using block matrices, where our unknown vector is <InlineMath math="x_{sol} = [w^T, \lambda_1, \lambda_2]^T" />:</p>
                <BlockMath math="\begin{bmatrix} \Sigma & -\mu & -\mathbf{1} \\ \mu^T & 0 & 0 \\ \mathbf{1}^T & 0 & 0 \end{bmatrix} \begin{bmatrix} w \\ \lambda_1 \\ \lambda_2 \end{bmatrix} = \begin{bmatrix} 0 \\ \mu^* \\ 1 \end{bmatrix}" />
                <p className="mt-4">By solving this system for a range of different target returns `μ*`, we can trace out the entire Efficient Frontier.</p>
            </CardContent>
        </Card>
      </PageSection>

      <LessonSummaryCard title="Summary: The Triumph of Optimization">
        <li>We identified the **Efficient Frontier** as the set of optimal portfolios.</li>
        <li>We framed the search as a **constrained optimization problem**: Minimize risk for a given return.</li>
        <li>We used the **Method of Lagrange Multipliers** to turn this into a solvable problem.</li>
        <li>The solution is a **system of linear equations (`Ax=b`)** that gives the exact portfolio weights `w` for any point on the frontier.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-capital-asset-pricing-model-capm">
        The Capital Asset Pricing Model (CAPM)
      </NextUpNavigation>
    </div>
  );
}
