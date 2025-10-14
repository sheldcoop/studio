
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function CholeskyDecompositionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Cholesky Decomposition (LLᵀ)"
        description="The efficiency expert for a special class of matrices."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've just seen the power of the Spectral Theorem for symmetric matrices. Now, we zoom in on an even more special (and highly useful) subset: <strong>symmetric positive-definite</strong> matrices.
        </p>
        <p>
          A matrix `A` is positive-definite if `xᵀAx &gt 0` for all non-zero vectors `x`. Intuitively, this means the transformation `A` doesn't "flip" any vector and that all its eigenvalues are positive. Covariance and correlation matrices often have this property, making them prime candidates for this specialized decomposition.
        </p>
        <p>
          The Cholesky Decomposition is a way to factor such a matrix `A` into the product of a lower triangular matrix `L` and its transpose `Lᵀ`. It's like finding the "square root" of a matrix.
        </p>
         <FormulaBlock>
            <BlockMath math="A = LL^T" />
        </FormulaBlock>
      </article>

      <PageSection title="Why It's a Quant Finance Workhorse">
        <p className="prose prose-invert max-w-none">
            The Cholesky decomposition is incredibly fast and numerically stable, making it a favorite for many financial applications. Its primary use case is in <strong>Monte Carlo simulations</strong> for modeling correlated assets.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm prose prose-invert max-w-none mt-4">
            <li>You start with a covariance matrix `C` that describes how your assets move together. `C` is symmetric and positive-definite.</li>
            <li>You compute its Cholesky decomposition: `C = LLᵀ`.</li>
            <li>You generate a vector `Z` of independent, standard normal random variables (uncorrelated noise).</li>
            <li>You create a vector of correlated random variables `X` by simply multiplying: `X = LZ`.</li>
        </ol>
        <p className="font-semibold prose prose-invert max-w-none">This simple multiplication transforms uncorrelated noise into correlated returns that respect the covariance structure of your portfolio, forming the core of realistic market simulations.</p>
      </PageSection>
      
      <PageSection title="The 'How': The Cholesky-Banachiewicz Algorithm">
        <p className="prose prose-invert max-w-none">
            The calculation is a straightforward, element-by-element process. For a 3x3 matrix `A`, we want to find `L` such that:
        </p>
        <BlockMath math="\begin{bmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{bmatrix} = \begin{bmatrix} l_{11} & 0 & 0 \\ l_{21} & l_{22} & 0 \\ l_{31} & l_{32} & l_{33} \end{bmatrix} \begin{bmatrix} l_{11} & l_{21} & l_{31} \\ 0 & l_{22} & l_{32} \\ 0 & 0 & l_{33} \end{bmatrix}" />
        <p className="prose prose-invert max-w-none">By multiplying `LLᵀ` and equating terms, we solve for the elements of `L` column by column:</p>
        <ul className="list-disc text-sm pl-5 space-y-2 prose prose-invert max-w-none">
            <li><InlineMath math="l_{11} = \sqrt{a_{11}}" /></li>
            <li><InlineMath math="l_{21} = a_{21} / l_{11}" /></li>
            <li><InlineMath math="l_{22} = \sqrt{a_{22} - l_{21}^2}" /></li>
            <li>And so on...</li>
        </ul>
        <Alert className="mt-4">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>The Big Advantage</AlertTitle>
            <AlertDescription>
                Unlike LU Decomposition, Cholesky doesn't require any "pivoting" (row swaps). This, combined with only needing to compute one matrix `L` (since `Lᵀ` is free), makes it roughly twice as fast.
            </AlertDescription>
        </Alert>
      </PageSection>
      
      <LessonSummaryCard title="Summary: The Specialist's Tool">
        <li><strong>Who it's for:</strong> Symmetric, positive-definite matrices (like covariance matrices).</li>
        <li><strong>The Decomposition (<InlineMath math="A = LL^T" />):</strong> Factors `A` into a lower triangular matrix `L` and its transpose.</li>
        <li><strong>The Killer Application:</strong> Correlating random variables in Monte Carlo simulations for risk management and derivatives pricing.</li>
        <li><strong>The Benefit:</strong> Exceptionally fast and numerically stable, making it ideal for high-performance computing tasks.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-singular-value-decomposition-svd">
        The Singular Value Decomposition (SVD)
      </NextUpNavigation>
    </div>
  );
}
