
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
          Welcome to a new chapter in our story. For the past two modules, we have been obsessed with a single problem: solving `Ax=b` for any matrix `A`. Now, we narrow our focus to a special, incredibly important class of matrices: <strong>square matrices (`n x n`)</strong>.
        </p>
        <p>
          Square matrices are the operators of dynamic systems. They transform a space back onto itself. A 2x2 matrix takes 2D vectors to 2D vectors. A 3x3 matrix takes 3D vectors to 3D vectors. Because the input and output dimensions are the same, we can ask a fascinating new question:
        </p>
        <p className="font-semibold text-primary">When a matrix transforms space, does it stretch it, squish it, or leave it the same size? By how much does <strong>area</strong> or <strong>volume</strong> change?</p>
        <p>There is a single, magical number that tells us this. It is called the <strong>determinant</strong>.</p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The 2D Case: A Change in Area</CardTitle>
          <CardDescription>
            Let's start in 2D. We know that any 2x2 matrix is defined by where it sends the basis vectors <InlineMath math="i = [1, 0]" /> and <InlineMath math="j = [0, 1]" />. The original `i` and `j` form a `1x1` square with an area of 1.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Now, let's apply a transformation with a matrix `A`:</p>
          <BlockMath math="A = \begin{bmatrix} 3 & 1 \\ 1 & 2 \end{bmatrix}" />
          <ul className="list-disc pl-5 text-sm space-y-1">
              <li>The first column tells us that `i` lands on `[3, 1]`.</li>
              <li>The second column tells us that `j` lands on `[1, 2]`.</li>
          </ul>
          <p>The original `1x1` square is transformed into a new shape—a **parallelogram**. The area of this new parallelogram is <InlineMath math="3 \times 2 - 1 \times 1 = 5" />.</p>
          <p>The **determinant** of the matrix `A`, written as `det(A)` or `|A|`, is this scaling factor: `det(A) = 5`. This means the transformation `A` stretches space and makes everything **5 times bigger** in area.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Sign of the Determinant: An Orientation Flip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>A negative determinant signifies a change in **orientation**. Consider a matrix `B`:</p>
          <BlockMath math="B = \begin{bmatrix} 1 & 2 \\ 3 & 1 \end{bmatrix}" />
          <p>The determinant is <InlineMath math="\det(B) = 1 \times 1 - 2 \times 3 = -5" />.</p>
          <p>In the original space, `j` is to the left of `i`. After transforming with `B`, the new `j` (`[2,1]`) is on the *right* of the new `i` (`[1,3]`). The space has been **flipped over**. A negative determinant means the orientation has reversed.</p>
           <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                <li><strong>`det(A) &gt 0`</strong>: Preserves orientation (no flipping).</li>
                <li><strong>`det(A) &lt 0`</strong>: Reverses orientation (a flip occurred).</li>
                <li>The **absolute value** `|det(A)|` is the area/volume scaling factor.</li>
            </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Most Important Case: Determinant equals Zero</CardTitle>
          <CardDescription>What happens if `det(A) = 0`?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <p>Consider a matrix `C` where the columns are linearly dependent:</p>
           <BlockMath math="C = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}" />
           <p>The determinant is <InlineMath math="1 \times 4 - 2 \times 2 = 0" />. The transformation squashes the entire 2D plane onto a single line. The resulting "parallelogram" has **zero area**.</p>
            <Alert variant="destructive">
               <AlertTriangle className="h-4 w-4" />
                <AlertTitle>The Ultimate Test for Invertibility</AlertTitle>
                <AlertDescription>
                   A determinant of zero means the transformation collapses space into a lower dimension. Such a matrix has linearly dependent columns, a non-trivial null space, and is **not invertible** (singular).
                </AlertDescription>
           </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary: The Essence of the Determinant</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Scaling Factor:</strong> The absolute value `|det(A)|` is the factor by which area (2D) or volume (3D) is scaled.</li>
            <li><strong>Orientation Flip:</strong> The sign of `det(A)` tells you if the orientation of space has been reversed (negative) or preserved (positive).</li>
            <li><strong>Invertibility Test:</strong> `det(A) = 0` is the definitive sign that the transformation squashes space into a lower dimension. Such a matrix is **not invertible**.</li>
          </ol>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground">
        **Up Next:** We will learn the mechanical rules and properties for **calculating the determinant**, moving from the simple 2x2 case to a general method that works for any `n x n` matrix.
      </p>
    </div>
  );
}
