
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function FundamentalTheoremPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Fundamental Theorem of Linear Algebra"
        description="The Grand Unified Theory"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
            For the past eight lessons, we have been on a journey. We started with the simple problem `Ax=b` and, in our quest to understand it, we have uncovered a hidden world of interconnected structures: the Column Space, the Null Space, the Row Space, and the Left Null Space.
        </p>
        <p>
            We have treated them as separate characters in our story. Today, we bring them all on stage for the final act. The <strong>Fundamental Theorem of Linear Algebra</strong> is not a new calculation. It is a statement of profound, beautiful truth that connects all these ideas into a single, cohesive picture. It is the grand unified theory of what a matrix *is*.
        </p>
         <p>Let's consider an `m x n` matrix `A` with rank `r`. This means:</p>
         <ul className="list-disc pl-6">
            <li>`A` takes input vectors from `n`-dimensional space (ℝⁿ).</li>
            <li>`A` produces output vectors in `m`-dimensional space (ℝᵐ).</li>
            <li>The "true" dimension of the action is `r` (the number of pivots).</li>
         </ul>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Decomposition of Spaces & Dimensions</CardTitle>
          <CardDescription>
            The theorem tells us that the input and output spaces can each be split perfectly into two orthogonal subspaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold">Input Space (ℝⁿ)</h4>
                    <p>Split into the <strong>Row Space</strong> and the <strong>Null Space</strong>. They are orthogonal complements.</p>
                    <p className="font-semibold mt-2">dim(Row Space) + dim(Null Space) = r + (n-r) = n</p>
                </div>
                <div>
                    <h4 className="font-semibold">Output Space (ℝᵐ)</h4>
                    <p>Split into the <strong>Column Space</strong> and the <strong>Left Null Space</strong>. They are orthogonal complements.</p>
                    <p className="font-semibold mt-2">dim(Column Space) + dim(Left Null Space) = r + (m-r) = m</p>
                </div>
            </div>
            <p className="font-semibold text-primary mt-4">This diagram is the most important picture in all of linear algebra. It shows that `A` acts as a perfect, one-to-one mapping from its `r`-dimensional Row Space to its `r`-dimensional Column Space. The entire `(n-r)`-dimensional Null Space is collapsed into nothing.</p>
        </CardContent>
      </Card>
      
       <Card>
          <CardHeader>
            <CardTitle className="font-headline">A Complete Walkthrough</CardTitle>
            <CardDescription>Let's analyze a `3x4` matrix (`m=3, n=4`) with rank `r=2`.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <p>Let <InlineMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix}" />, which has RREF <InlineMath math="R = \begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />.</p>
               <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subspace</TableHead>
                        <TableHead>Dimension</TableHead>
                        <TableHead>Basis</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-semibold">Column Space `C(A)`</TableCell>
                        <TableCell>r = 2 (plane in ℝ³)</TableCell>
                        <TableCell className="text-xs"><BlockMath math="\left\{ \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \begin{bmatrix} 3 \\ 7 \\ 8 \end{bmatrix} \right\}"/></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Null Space `N(A)`</TableCell>
                        <TableCell>n-r = 4-2 = 2 (plane in ℝ⁴)</TableCell>
                         <TableCell className="text-xs"><BlockMath math="\left\{ \begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix}, \begin{bmatrix} -1 \\ 0 \\ -1 \\ 1 \end{bmatrix} \right\}"/></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Row Space `C(Aᵀ)`</TableCell>
                        <TableCell>r = 2 (plane in ℝ⁴)</TableCell>
                        <TableCell className="text-xs"><BlockMath math="\{[1, 2, 0, 1], [0, 0, 1, 1]\}" /></TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-semibold">Left Null Space `N(Aᵀ)`</TableCell>
                        <TableCell>m-r = 3-2 = 1 (line in ℝ³)</TableCell>
                        <TableCell className="text-xs">(Found by reducing `Aᵀ`)</TableCell>
                    </TableRow>
                </TableBody>
               </Table>
                <p><strong>Orthogonality Check:</strong> Take a basis vector from the Row Space, `v = [1, 2, 0, 1]`, and a basis vector from the Null Space, `x = [-2, 1, 0, 0]`. Their dot product is `(1)(-2) + (2)(1) + (0)(0) + (1)(0) = 0`. They are orthogonal, as the theorem guarantees.</p>
          </CardContent>
      </Card>


      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-geometric-meaning-of-the-determinant">
        Determinants
      </NextUpNavigation>
    </div>
  );
}
