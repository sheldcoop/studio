
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function EigenvaluesEigenvectorsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Eigenvalues & Eigenvectors"
        description="The Soul of a Matrix"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We now ask a profound question: are there any special vectors that don't change their direction when transformed by a matrix `A`?
        </p>
        <p>
          Most vectors get knocked off their original path. But some "special" vectors are simply stretched or shrunk, still pointing along the same line. These are <strong>eigenvectors</strong>. The factor by which they are scaled is their <strong>eigenvalue</strong>.
        </p>
      </article>

      <DefinitionCard title="The Eigen-Equation">
        <p>An eigenvector `v` of a square matrix `A` is a non-zero vector that satisfies:</p>
        <FormulaBlock>
            <BlockMath math="Av = \lambda v" />
        </FormulaBlock>
        <p className="mt-4">Here, the scalar `λ` (lambda) is the eigenvalue. This equation signifies that the complex action of `A` on `v` simplifies to simple scalar multiplication. Eigenvectors are the invariant axes of a transformation.</p>
      </DefinitionCard>

      <PageSection title="A Visual Example: A Simple Shear">
        <p className="prose prose-invert max-w-none">
            Consider the shear transformation <InlineMath math="A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}" />. This pushes everything to the right.
        </p>
        <p className="prose prose-invert max-w-none mt-4">
          Most vectors, like `[1, 1]`, change direction: <InlineMath math="A[1,1]^T = [2,1]^T" />. But a horizontal vector like `v = [3, 0]` is special:
        </p>
        <FormulaBlock>
            <BlockMath math="A \begin{bmatrix} 3 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 3 \\ 0 \end{bmatrix} = \begin{bmatrix} 3 \\ 0 \end{bmatrix}" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none">The vector `[3, 0]` is unchanged. This fits `Av = λv` with `λ = 1`. Any vector on the x-axis is an eigenvector with an eigenvalue of 1.</p>
      </PageSection>
      
      <PageSection title="How Do We Find Them?">
        <p className="prose prose-invert max-w-none">
            To systematically find `v` and `λ`, we rearrange the eigen-equation:
        </p>
        <FormulaBlock>
            <BlockMath math="Av - \lambda v = 0 \implies Av - \lambda Iv = 0 \implies (A - \lambda I)v = 0" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none">
            This tells us the eigenvector `v` is in the <strong>Null Space</strong> of the matrix `(A - λI)`. Since `v` must be non-zero, this null space must be non-trivial.
        </p>
        <p className="prose prose-invert max-w-none font-semibold text-primary">
            A matrix has a non-trivial Null Space if and only if it is singular, which means its determinant is zero.
        </p>
        <FormulaBlock>
            <p className="mb-2 text-sm text-muted-foreground">This gives us the master key, the <strong>Characteristic Equation</strong>:</p>
            <BlockMath math="\det(A - \lambda I) = 0" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none mt-4">
            By solving this equation for `λ`, we find the eigenvalues. Then, for each `λ`, we find the Null Space of `(A - λI)` to get the corresponding eigenvectors.
        </p>
      </PageSection>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-characteristic-equation">
        The Characteristic Equation
      </NextUpNavigation>
    </div>
  );
}
