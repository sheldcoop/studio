
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PitfallAlert } from '@/components/app/pitfall-alert';
import { DefinitionCard } from '@/components/app/definition-card';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function DeterminantMeaningPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Geometric Meaning of the Determinant"
        description="The Scaling Factor of Space"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome to a new chapter. We now focus on <strong>square matrices (`n x n`)</strong>. Because the input and output dimensions are the same, we can ask a fascinating new question:
        </p>
        <p className="font-semibold text-primary">When a matrix transforms space, does it stretch it, squish it, or leave it the same size? By how much does <strong>area</strong> or <strong>volume</strong> change?</p>
        <p>There is a single, magical number that tells us this. It is called the <strong>determinant</strong>.</p>
      </article>

      <DefinitionCard title="The Determinant">
        <p>The determinant of a 2x2 matrix <InlineMath math="A = [[a, b], [c, d]]" /> is the area of the parallelogram formed by the transformed basis vectors. Its value is `det(A) = ad - bc`.</p>
        <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
            <li><strong>`det(A) &gt; 0`</strong>: Preserves orientation (no flipping).</li>
            <li><strong>`det(A) &lt 0`</strong>: Reverses orientation (a flip occurred). The absolute value `|det(A)|` is the scaling factor.</li>
        </ul>
      </DefinitionCard>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Most Important Case: Determinant equals Zero</CardTitle>
          <CardDescription>What happens if `det(A) = 0`?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <p>Consider a matrix `C` where the columns are linearly dependent:</p>
           <BlockMath math="C = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}" />
           <p>The determinant is <InlineMath math="1 \times 4 - 2 \times 2 = 0" />. The transformation squashes the entire 2D plane onto a single line. The resulting "parallelogram" has **zero area**.</p>
            <PitfallAlert title="The Ultimate Test for Invertibility">
               A determinant of zero means the transformation collapses space into a lower dimension. Such a matrix has linearly dependent columns, a non-trivial null space, and is **not invertible** (singular).
            </PitfallAlert>
        </CardContent>
      </Card>

      <LessonSummaryCard title="Summary: The Essence of the Determinant">
        <li><strong>Scaling Factor:</strong> The absolute value `|det(A)|` is the factor by which area (2D) or volume (3D) is scaled.</li>
        <li><strong>Orientation Flip:</strong> The sign of `det(A)` tells you if the orientation of space has been reversed (negative) or preserved (positive).</li>
        <li><strong>Invertibility Test:</strong> `det(A) = 0` is the definitive sign that the transformation squashes space into a lower dimension. Such a matrix is **not invertible**.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/calculation-and-properties-of-the-determinant">
        Calculation and Properties of the Determinant
      </NextUpNavigation>
    </div>
  );
}
