
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EigenvaluesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Eigenvectors & Eigenvalues"
        description="Discovering the Soul of a Matrix"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've seen that a matrix is a transformation that can stretch, shrink, shear, and rotate space. Most vectors, when transformed, are knocked off their original path. But what if there are <strong>special vectors</strong>? Vectors that, when transformed, are only stretched or shrunk, but not rotated?
        </p>
        <p className="text-xl font-semibold text-primary text-center">
          These special, non-rotating vectors are the "invariant axes" of a transformation. They are the <strong>eigenvectors</strong> of a matrix.
        </p>
        <p>
          The corresponding factor by which they are stretched or shrunk is their <strong>eigenvalue</strong>. Understanding these concepts is the key to unlocking the deep structure of a matrix and is the foundation for countless applications, from Principal Component Analysis (PCA) to solving differential equations.
        </p>
      </article>

      <PageSection title="The Mathematical Definition">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Eigen-Equation</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="mb-4">
                    An eigenvector `v` and its corresponding eigenvalue `λ` for a matrix `A` are a pair that satisfies the following equation:
                </p>
                 <FormulaBlock>
                    <BlockMath math="Av = \lambda v" />
                </FormulaBlock>
                <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                    <li><strong>`A`</strong> is our `n x n` transformation matrix.</li>
                    <li><strong>`v`</strong> is the `n x 1` eigenvector (it's a non-zero vector).</li>
                    <li><strong>`λ`</strong> (lambda) is the scalar eigenvalue.</li>
                </ul>
                <p className="mt-4">This equation perfectly captures the concept: &quot;The action of matrix `A` on the vector `v` is the same as just scaling `v` by the number `λ`.&quot;</p>
            </CardContent>
        </Card>
      </PageSection>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Try The Interactive Visualizer</CardTitle>
          <CardDescription>The best way to understand this concept is to see it. Our interactive tool in the QuantLab lets you apply transformations and see the eigenvectors in action.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Button asChild>
                <Link href="/quantlab/eigen-visualizer">
                    Go to Eigen-Visualizer
                </Link>
            </Button>
        </CardContent>
      </Card>
      
      <PageSection title="How to Find Them: The Characteristic Equation">
        <p className="prose prose-invert max-w-none">
            To find these special pairs, we need to do a little algebraic manipulation.
        </p>
        <BlockMath math="Av - \lambda v = 0" />
        <p className="prose prose-invert max-w-none mt-2">
            To factor out `v`, we need to introduce the identity matrix `I`:
        </p>
        <BlockMath math="(A - \lambda I)v = 0" />
        <KeyConceptAlert title="The Critical Insight">
          <p>
            This equation, `(A - λI)v = 0`, is asking for a non-zero vector `v` that lives in the <strong>null space</strong> of the matrix `(A - λI)`.
          </p>
          <p className="mt-2">
            A matrix only has a non-trivial null space if it is <strong>singular</strong> (i.e., not invertible). And the definitive test for a singular matrix is that its <strong>determinant is zero</strong>.
          </p>
        </KeyConceptAlert>
        <p className="prose prose-invert max-w-none mt-4">
            This gives us our master key. To find the eigenvalues, we must solve the <strong>characteristic equation</strong>:
        </p>
        <FormulaBlock>
            <BlockMath math="\det(A - \lambda I) = 0" />
        </FormulaBlock>
         <p className="prose prose-invert max-w-none mt-4">
            Solving this equation for `λ` will give us the eigenvalues. Then, for each `λ`, we can plug it back into `(A - λI)v = 0` to find the corresponding eigenvectors `v` in the null space.
        </p>
      </PageSection>

      <LessonSummaryCard title="Summary: The Soul of a Matrix">
        <li><strong>Eigenvectors</strong> are the vectors that are only scaled (not rotated) by a transformation. They define the transformation's invariant axes.</li>
        <li><strong>Eigenvalues</strong> are the scalar factors by which their corresponding eigenvectors are scaled.</li>
        <li>The defining relationship is <strong>`Av = λv`</strong>.</li>
        <li>We find eigenvalues by solving the characteristic equation: <strong>`det(A - λI) = 0`</strong>.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-characteristic-equation">
        The Characteristic Equation
      </NextUpNavigation>
    </div>
  );
}
