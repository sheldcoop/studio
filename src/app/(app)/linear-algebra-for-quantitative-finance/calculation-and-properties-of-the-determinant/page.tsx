
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

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
          In our last lesson, we developed a deep geometric intuition for the determinant. We know it's the scaling factor of a transformation. Now, it's time to build the machinery to compute this magical number for any square matrix.
        </p>
        <p>
            We'll start with the simple cases and build up to a general, powerful formula. Then, we'll uncover the properties that let us reason about determinants without always resorting to heavy computation.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The 2x2 Case: The Formula We Already Know</CardTitle>
        </CardHeader>
        <CardContent>
          <p>For a 2x2 matrix, the formula is simple and is the one we discovered geometrically.</p>
          <BlockMath math="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \implies \det(A) = ad - bc" />
          <p>This formula represents the signed area of the parallelogram formed by the transformed basis vectors <InlineMath math="[a, c]" /> and <InlineMath math="[b, d]" />.</p>
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold">Example:</h4>
            <BlockMath math="A = \begin{bmatrix} 3 & -1 \\ 2 & 4 \end{bmatrix}" />
            <p><InlineMath math="\det(A) = (3)(4) - (-1)(2) = 12 - (-2) = 14" />. This transformation scales area by a factor of 14 and preserves orientation.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The 3x3 Case: Introducing Cofactor Expansion</CardTitle>
          <CardDescription>
            This method breaks down the determinant of an `n x n` matrix into a combination of determinants of smaller `(n-1) x (n-1)` matrices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>For a general 3x3 matrix expanded along the first row, the formula is:</p>
            <BlockMath math="\det(A) = a \cdot C_{11} + b \cdot C_{12} + c \cdot C_{13}" />
            <p>The <InlineMath math="C_{ij}" /> terms are **cofactors**, where <InlineMath math="C_{ij} = (-1)^{i+j} \cdot \det(M_{ij})" />. <InlineMath math="M_{ij}" /> is the **minor**, the smaller matrix left when you delete row `i` and column `j`. The <InlineMath math="(-1)^{i+j}" /> term creates a checkerboard pattern of signs:</p>
            <BlockMath math="\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}" />
            <p>Putting it all together:</p>
            <BlockMath math="\det(A) = a \begin{vmatrix} e & f \\ h & i \end{vmatrix} - b \begin{vmatrix} d & f \\ g & i \end{vmatrix} + c \begin{vmatrix} d & e \\ g & h \end{vmatrix}" />
            <BlockMath math="= a(ei - fh) - b(di - fg) + c(dh - eg)" />
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Practical Tip</AlertTitle>
                <AlertDescription>Always choose to expand along the row or column with the most zeros! This minimizes the number of cofactors you need to calculate.</AlertDescription>
            </Alert>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader><CardTitle className="font-headline">Key Properties of the Determinant</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              <p><strong className="text-primary">1. Identity Matrix:</strong> <InlineMath math="\det(I) = 1" />. (The "do-nothing" transformation has a scaling factor of 1).</p>
              <p><strong className="text-primary">2. Row Swaps:</strong> Swapping two rows flips the sign of the determinant.</p>
              <p><strong className="text-primary">3. Row Replacement:</strong> Adding a multiple of one row to another does not change the determinant. This is why Gaussian elimination is so useful!</p>
              <p><strong className="text-primary">4. Triangular Matrix:</strong> The determinant is the product of the diagonal entries.</p>
              <p><strong className="text-primary">5. Invertibility:</strong> <InlineMath math="A" /> is invertible if and only if <InlineMath math="\det(A) \neq 0" />.</p>
              <p><strong className="text-primary">6. Multiplicative Property:</strong> <InlineMath math="\det(AB) = \det(A) \cdot \det(B)" />. The scaling factor of composed transformations is the product of their individual scaling factors.</p>
              <p><strong className="text-primary">7. Inverse:</strong> <InlineMath math="\det(A^{-1}) = 1 / \det(A)" />.</p>
              <p><strong className="text-primary">8. Transpose:</strong> <InlineMath math="\det(A^T) = \det(A)" />.</p>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">A Smarter Way to Calculate</CardTitle>
              <CardDescription>Brute-force cofactor expansion is very slow for large matrices. The most efficient way to calculate a determinant is to combine row operations with the triangular matrix property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
              <p>To find <InlineMath math="\det(A)" /> for <InlineMath math="A = \begin{bmatrix} 2 & 4 & 6 \\ 1 & 3 & 5 \\ 1 & 2 & 4 \end{bmatrix}" />:</p>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>Use row operations to get to REF, keeping track of changes.
                      <ul className="list-disc pl-6 mt-2">
                          <li>Factor 2 from R1: <InlineMath math="\det(A) = 2 \cdot \det(\begin{bmatrix} 1 & 2 & 3 \\ 1 & 3 & 5 \\ 1 & 2 & 4 \end{bmatrix})" /></li>
                          <li><InlineMath math="R_2 \to R_2 - R_1" /> and <InlineMath math="R_3 \to R_3 - R_1" /> (no change to determinant).</li>
                      </ul>
                  </li>
                  <li>The matrix becomes upper triangular: <InlineMath math="U = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 2 \\ 0 & 0 & 1 \end{bmatrix}" />. Its determinant is the product of the diagonals: <InlineMath math="1 \times 1 \times 1 = 1" />.</li>
                  <li>The final determinant is <InlineMath math="\det(A) = 2 \times 1 = 2" />. This is far faster than a full cofactor expansion.</li>
              </ol>
          </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next in Module 4:** Armed with the power of the determinant, we are ready to tackle the central topic of the second half of linear algebra: **Eigenvalues and Eigenvectors**.
      </p>
    </div>
  );
}
