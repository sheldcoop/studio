
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { ExampleStep } from '@/components/app/example-step';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function DeterminantCalculationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Calculation and Properties of the Determinant"
        description="The machinery for computing and reasoning about the scaling factor of space."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we developed a deep geometric intuition for the determinant. Now, it's time to build the machinery to compute this magical number for any square matrix.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The 3x3 Case: Cofactor Expansion</CardTitle>
          <CardDescription>
            This method breaks down the determinant of an `n x n` matrix into a combination of determinants of smaller `(n-1) x (n-1)` matrices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>For a general 3x3 matrix expanded along the first row, the formula is:</p>
            <BlockMath math="\det(A) = a \begin{vmatrix} e & f \\ h & i \end{vmatrix} - b \begin{vmatrix} d & f \\ g & i \end{vmatrix} + c \begin{vmatrix} d & e \\ g & h \end{vmatrix}" />
            <KeyConceptAlert title="Practical Tip">
                Always choose to expand along the row or column with the most zeros! This minimizes the number of cofactors you need to calculate.
            </KeyConceptAlert>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle className="font-headline">Key Properties of the Determinant</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <p><strong className="text-primary">1. Identity Matrix:</strong> <InlineMath math="\det(I) = 1" />.</p>
              <p><strong className="text-primary">2. Row Swaps:</strong> Swapping two rows flips the sign of the determinant.</p>
              <p><strong className="text-primary">3. Row Replacement:</strong> Adding a multiple of one row to another does not change the determinant.</p>
              <p><strong className="text-primary">4. Triangular Matrix:</strong> The determinant is the product of the diagonal entries.</p>
              <p><strong className="text-primary">5. Invertibility:</strong> <InlineMath math="A" /> is invertible if and only if <InlineMath math="\det(A) \neq 0" />.</p>
              <p><strong className="text-primary">6. Multiplicative Property:</strong> <InlineMath math="\det(AB) = \det(A) \cdot \det(B)" />.</p>
              <p><strong className="text-primary">7. Inverse:</strong> <InlineMath math="\det(A^{-1}) = 1 / \det(A)" />.</p>
              <p><strong className="text-primary">8. Transpose:</strong> <InlineMath math="\det(A^T) = \det(A)" />.</p>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">A Smarter Way to Calculate</CardTitle>
              <CardDescription>Brute-force cofactor expansion is very slow for large matrices. The most efficient way to calculate a determinant is to use row operations to get to REF, then multiply the pivots.</CardDescription>
          </CardHeader>
          <CardContent>
              <ExampleStep stepNumber={1} title="Use Row Operations to get to REF">
                  <p>Given <InlineMath math="A = \begin{bmatrix} 2 & 4 & 6 \\ 1 & 3 & 5 \\ 1 & 2 & 4 \end{bmatrix}" />, factor 2 from R1, then perform elimination.</p>
                  <p><InlineMath math="\det(A) = 2 \cdot \det(\begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 2 \\ 0 & 0 & 1 \end{bmatrix})" /></p>
              </ExampleStep>
              <ExampleStep stepNumber={2} title="Multiply the Diagonals of U and the factored scalars">
                  <p>The REF matrix `U` has a determinant of 1 (1x1x1).</p>
                  <p>The final determinant is <InlineMath math="\det(A) = 2 \times 1 = 2" />. This is far faster than a full cofactor expansion.</p>
              </ExampleStep>
          </CardContent>
      </Card>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/eigenvalues-and-eigenvectors">
        Eigenvalues and Eigenvectors
      </NextUpNavigation>
    </div>
  );
}
