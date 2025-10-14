
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function CAPMPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Capital Asset Pricing Model (CAPM)"
        description="A Masterclass Edition lesson on the Nobel Prize-winning model for risk and expected return."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we focused on building the "perfect" portfolio from a universe of assets. We were architects, designing an optimal structure.
        </p>
        <p>
          Now, we shift our perspective. We become analysts. We are given a single stock—say, Apple (AAPL)—and we need to answer one of the most fundamental questions in finance: <strong>What is a fair expected return for this stock?</strong>
        </p>
        <p>
          The insight of CAPM, which won William Sharpe the Nobel Prize, is that an investor should not be rewarded for all risk, but only for the risk they <strong>cannot</strong> diversify away.
        </p>
      </article>

      <PageSection title="The Two Flavors of Risk">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Systematic vs. Idiosyncratic Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The core idea of CAPM is to split a stock's total risk into two parts:</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Systematic Risk (Market Risk):</strong> This is the risk inherent to the entire market (e.g., recessions, interest rate changes). You <strong>cannot</strong> get rid of it by diversifying.</li>
                    <li><strong>Idiosyncratic Risk (Specific Risk):</strong> This is the risk specific to a single company (e.g., a drug trial failing, a factory fire). This risk is <strong>diversifiable</strong>.</li>
                </ol>
                <p className="font-semibold text-primary">The Central Premise of CAPM: The market will only compensate you (with higher expected returns) for taking on systematic risk—the risk you are forced to bear.</p>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Measuring Systematic Risk with Beta (β)">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Linear Model</CardTitle>
                <CardDescription>
                    Beta measures how much a stock tends to move when the overall market moves. It is the measure of an asset's systematic risk.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                    <li>`β = 1`: The stock moves in line with the market.</li>
                    <li>`β &gt 1`: The stock is more volatile than the market.</li>
                    <li>`β &lt 1`: The stock is less volatile than the market.</li>
                </ul>
                <p className="mt-4">CAPM proposes a simple linear relationship:</p>
                <BlockMath math="(R_s - R_f) = \alpha + \beta (R_m - R_f) + \epsilon" />
                <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><InlineMath math="y = (R_s - R_f)" />: The stock's excess return (dependent variable).</li>
                    <li><InlineMath math="x = (R_m - R_f)" />: The market's excess return (independent variable).</li>
                    <li>`β` (Beta): The <strong>slope</strong> of the line, measuring systematic risk.</li>
                    <li>`α` (Alpha): The <strong>y-intercept</strong>, representing performance not explained by the market.</li>
                    <li>`ε` (Epsilon): The <strong>error term</strong>, representing idiosyncratic risk.</li>
                </ul>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Linear Algebra Revelation">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Solving for Alpha and Beta</CardTitle>
                <CardDescription>
                    Finding the best-fit `α` and `β` from historical data is a classic <strong>Least Squares Problem</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>For a set of historical returns, we have an overdetermined system `Ax = b` where `x = [α, β]ᵀ`. The solution is found by solving the <strong>Normal Equations</strong>:</p>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="A^TA\hat{x} = A^Tb" />
            </div>
            <p>The matrix `A` is constructed with a column of ones for the intercept `α` and a column of the market's excess returns for `β`.</p>
            </CardContent>
        </Card>
      </PageSection>

      <LessonSummaryCard title="Summary: The Triumph of Regression">
        <li><strong>The Goal:</strong> Find a fair expected return for a stock based on its non-diversifiable market risk.</li>
        <li><strong>The Concept:</strong> We measure this risk with <strong>Beta (`β`)</strong>.</li>
        <li><strong>The Formulation:</strong> We model this as a simple <strong>linear regression</strong>.</li>
        <li><strong>The Solution:</strong> We solve the <strong>Normal Equations `AᵀAx̂ = Aᵀb`</strong> to find the estimated `α` and `β`.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/arbitrage-and-the-fundamental-theorem-of-asset-pricing">
        Arbitrage and FTAP
      </NextUpNavigation>
    </div>
  );
}
