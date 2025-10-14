
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function CovarianceMatrixPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Covariance Matrix & The Geometry of Portfolio Risk"
        description="A Masterclass Edition lesson on the cornerstone of portfolio theory."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome. Today, we will embark on a journey to answer a single question: <strong>What is the true risk of a portfolio?</strong>
        </p>
        <p>
          Along the way, we will discover that a concept you learned in basic statistics—variance—blossoms into one of the most beautiful and powerful structures in all of finance: the **Covariance Matrix**. And we will see how the language of linear algebra allows us to express a deeply complex idea with breathtaking simplicity.
        </p>
      </article>

      <PageSection title="The Soul of Variance">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">What are we really measuring?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>Let's start with an idea. What is risk? In finance, we often define risk as **volatility**, or the degree to which an asset's returns swing around its average.</p>
            <p>Let `R` be a single return for an asset, and `μ` be its average return. The deviation for that day is `(R - μ)`. Some deviations are positive, some are negative. To get a sense of the average "magnitude" of deviation, we square it, making everything positive: `(R - μ)²`.</p>
            <p>**Variance**, `σ²`, is simply the *expected value* (the long-term average) of this squared deviation.</p>
            <BlockMath math="\sigma^2 = E[(R - \mu)^2]" />
            <p>This is the bedrock. Everything we do will be built on this single, intuitive idea.</p>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="The Two-Asset Portfolio - A Tale of Interaction">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Deriving Portfolio Variance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The return of our portfolio, `R_p`, is a simple weighted sum: `R_p = w₁R₁ + w₂R₂`</p>
                <p>The average return, `μ_p`, is also a weighted sum: `μ_p = w₁μ₁ + w₂μ₂`</p>
                <p>Now for the big question: What is the variance of this portfolio, `σ²_p`? Let's use our fundamental definition: `σ²_p = E[(R_p - μ_p)²]`.</p>
                <p>Substitute our portfolio formulas: `R_p - μ_p = (w₁R₁ + w₂R₂) - (w₁μ₁ + w₂μ₂) = w₁(R₁ - μ₁) + w₂(R₂ - μ₂)`.</p>
                <p>Now we square it, using `(a + b)² = a² + 2ab + b²`:</p>
                <BlockMath math="(R_p - \mu_p)^2 = w_1^2(R_1 - \mu_1)^2 + w_2^2(R_2 - \mu_2)^2 + 2w_1w_2(R_1 - \mu_1)(R_2 - \mu_2)" />
                <p>We need the expected value of this entire expression. Since `E[]` distributes across sums and weights are constants:</p>
                <BlockMath math="\sigma^2_p = w_1^2 E[(R_1 - \mu_1)^2] + w_2^2 E[(R_2 - \mu_2)^2] + 2w_1w_2 E[(R_1 - \mu_1)(R_2 - \mu_2)]" />
                <p>We have just re-discovered the definitions of variance and covariance!</p>
                <ul className="list-disc pl-5">
                    <li><InlineMath math="E[(R_1 - \mu_1)^2] = \sigma_1^2" /> (Variance of Asset 1)</li>
                    <li><InlineMath math="E[(R_2 - \mu_2)^2] = \sigma_2^2" /> (Variance of Asset 2)</li>
                    <li><InlineMath math="E[(R_1 - \mu_1)(R_2 - \mu_2)] = \sigma_{12}" /> (Covariance of Asset 1 and 2)</li>
                </ul>
                <p>Substituting these in gives the classic two-asset formula:</p>
                <BlockMath math="\sigma^2_p = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\sigma_{12}" />
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="The Leap into Linear Algebra">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">From Summation to Matrices</CardTitle>
                <CardDescription>The two-asset formula is hideous. What if we have 1000 assets? This does not scale. Let's rewrite it in a more structured way.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>Let's organize the risks into a **Covariance Matrix, Σ**, and our weights into a vector `w`.</p>
            <div className="flex justify-center gap-8">
                <BlockMath math="\Sigma = \begin{bmatrix} \sigma_1^2 & \sigma_{12} \\ \sigma_{21} & \sigma_2^2 \end{bmatrix}" />
                <BlockMath math="w = \begin{bmatrix} w_1 \\ w_2 \end{bmatrix}" />
            </div>
            <p>Let's propose a structure: `wᵀΣw` and see what happens.</p>
            <p><strong>Step 1: Compute `Σw`</strong></p>
            <BlockMath math="\Sigma w = \begin{bmatrix} \sigma_1^2 & \sigma_{12} \\ \sigma_{21} & \sigma_2^2 \end{bmatrix} \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} \sigma_1^2 w_1 + \sigma_{12} w_2 \\ \sigma_{21} w_1 + \sigma_2^2 w_2 \end{bmatrix}" />
            <p><strong>Step 2: Compute `wᵀ(Σw)`</strong></p>
            <BlockMath math="w^T(\Sigma w) = [w_1, w_2] \begin{bmatrix} \sigma_1^2 w_1 + \sigma_{12} w_2 \\ \sigma_{21} w_1 + \sigma_2^2 w_2 \end{bmatrix}" />
            <p>Multiplying this out gives:</p>
            <BlockMath math="w_1(\sigma_1^2 w_1 + \sigma_{12} w_2) + w_2(\sigma_{21} w_1 + \sigma_2^2 w_2) = w_1^2\sigma_1^2 + w_1w_2\sigma_{12} + w_2w_1\sigma_{21} + w_2^2\sigma_2^2" />
            <p>Since `σ₁₂ = σ₂₁`, this simplifies to the exact same formula as before:</p>
            <BlockMath math="\sigma^2_p = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\sigma_{12}" />
            <p className="font-semibold text-primary">This is the miracle. The chaotic, expanding sum of terms is perfectly and compactly organized by the structure of matrix multiplication `wᵀΣw`.</p>
            </CardContent>
        </Card>
      </PageSection>
      
      <LessonSummaryCard title="Summary: The Triumph of Structure">
          <li>Portfolio risk comes from individual volatilities (**variances**) and their interactive movements (**covariances**).</li>
          <li>A simple summation formula becomes impossibly complex as assets grow.</li>
          <li>By organizing weights into a vector `w` and risks into a **Covariance Matrix `Σ`**, we express total portfolio variance with the simple and scalable formula: **`σ²_p = wᵀΣw`**.</li>
          <li>This formula works because the structure of matrix multiplication is the perfect mirror for the structure of portfolio risk.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/portfolio-optimization-and-the-efficient-frontier">
        Portfolio Optimization
      </NextUpNavigation>
    </div>
  );
}
