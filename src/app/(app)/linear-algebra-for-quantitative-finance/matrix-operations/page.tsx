
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function MatrixOperationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Operations"
        description="The Rules of Moving in Space"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In the last lesson, we introduced the two powerful views of a matrix: as a container for data and as a transformation of space. Before we can fully harness the power of transformations, we need to get comfortable with the basic "grammar" of matrices.
        </p>
        <p>
            How do we add, subtract, and scale them? These operations are simple and intuitive, closely mirroring the vector operations we've already learned. They are the essential groundwork for everything that follows.
        </p>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Ground Rules: Matrix Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Before we can perform any operation, we have to talk about the <strong>shape</strong> or <strong>dimensions</strong> of a matrix. The dimensions are always given as <strong>rows x columns</strong>.</p>
                <ul className="list-disc pl-6">
                    <li>A matrix with 3 rows and 4 columns is a <InlineMath math="3 \times 4" /> matrix.</li>
                    <li>A matrix with 1 row and 5 columns is a <InlineMath math="1 \times 5" /> matrix (which is also a row vector!).</li>
                </ul>
                <p>This is crucial because most matrix operations have strict rules about the dimensions of the matrices involved.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Addition and Subtraction</CardTitle>
                <CardDescription>
                    This is the easiest operation, and it works exactly like vector addition. You can only add or subtract two matrices if they have the <strong>exact same dimensions</strong>. To perform the operation, you simply add or subtract the corresponding elements in each position.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <h4 className="font-semibold">Example:</h4>
                <p>Let <InlineMath math="A" /> be a <InlineMath math="2 \times 2" /> matrix and <InlineMath math="B" /> be a <InlineMath math="2 \times 2" /> matrix.</p>
                <div className="flex justify-center gap-8">
                     <BlockMath math="A = \begin{bmatrix} 1 & -2 \\ 3 & 4 \end{bmatrix}" />
                     <BlockMath math="B = \begin{bmatrix} 5 & 0 \\ 1 & -3 \end{bmatrix}" />
                </div>
                <div>
                    <h5 className="font-semibold">Addition (<InlineMath math="A + B" />):</h5>
                    <BlockMath math="A + B = \begin{bmatrix} 1+5 & -2+0 \\ 3+1 & 4-3 \end{bmatrix} = \begin{bmatrix} 6 & -2 \\ 4 & 1 \end{bmatrix}" />
                </div>
                 <div>
                    <h5 className="font-semibold">Subtraction (<InlineMath math="A - B" />):</h5>
                     <BlockMath math="A - B = \begin{bmatrix} 1-5 & -2-0 \\ 3-1 & 4-(-3) \end{bmatrix} = \begin{bmatrix} -4 & -2 \\ 2 & 7 \end{bmatrix}" />
                </div>
                 <p>If we tried to add <InlineMath math="A" /> to a <InlineMath math="3 \times 2" /> matrix, the operation would be undefined.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Scalar Multiplication</CardTitle>
                <CardDescription>
                    This also works exactly like it does for vectors. To multiply a matrix by a scalar, you multiply <strong>every single element</strong> inside the matrix by that scalar.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <h4 className="font-semibold">Example:</h4>
                 <p>Let's take our matrix <InlineMath math="A" /> and multiply it by the scalar 3.</p>
                 <div className="flex justify-center">
                    <BlockMath math="3 \times A = 3 \times \begin{bmatrix} 1 & -2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 \times 1 & 3 \times (-2) \\ 3 \times 3 & 3 \times 4 \end{bmatrix} = \begin{bmatrix} 3 & -6 \\ 9 & 12 \end{bmatrix}" />
                 </div>
                 <p><strong>Geometric Intuition:</strong> If a matrix represents a transformation, multiplying it by a scalar `c` scales the entire transformation.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Transpose: Flipping the Grid</CardTitle>
                <CardDescription>
                   The transpose is a simple but incredibly useful operation. To find the transpose of a matrix, you <strong>flip it across its main diagonal</strong>. The rows become the columns, and the columns become the rows. The transpose of a matrix <InlineMath math="A" /> is written as <InlineMath math="A^T" />.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <h4 className="font-semibold">Example:</h4>
                <p>Let's take a <InlineMath math="2 \times 3" /> matrix <InlineMath math="C" />.</p>
                <BlockMath math="C = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}" />
                <p>To find <InlineMath math="C^T" />, the first row <InlineMath math="[1, 2, 3]" /> becomes the first column. The second row <InlineMath math="[4, 5, 6]" /> becomes the second column.</p>
                 <BlockMath math="C^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}" />
                <p>Notice that the dimensions also flip. A <InlineMath math="2 \times 3" /> matrix becomes a <InlineMath math="3 \times 2" /> matrix.</p>
                 <div className="border p-4 rounded-lg bg-muted/50 mt-4">
                    <h4 className="font-semibold">Why is the Transpose So Important?</h4>
                    <p className="mt-2 text-sm">The transpose is the key to unlocking the <strong>Four Fundamental Subspaces</strong>. It also appears constantly in key formulas, like the <strong>Normal Equations for linear regression (<InlineMath math="A^TA\hat{x} = A^Tb" />)</strong> and in the definition of a <strong>symmetric matrix (<InlineMath math="A = A^T" />)</strong>.</p>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Summary: The Basic Toolkit</CardTitle></CardHeader>
            <CardContent>
                 <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Addition/Subtraction:</strong> Add/subtract element-wise. Matrices must have the same dimensions.</li>
                    <li><strong>Scalar Multiplication:</strong> Multiply every element by the scalar.</li>
                    <li><strong>Transpose (<InlineMath math="A^T" />):</strong> Flip the matrix along its diagonal. The rows become columns.</li>
                </ul>
                <p className="mt-4">These are the simple rules. But what about multiplying a matrix by another matrix? That's a completely different beast, and the subject of our next, very important lesson.</p>
            </CardContent>
        </Card>

      </article>
    </div>
  );
}
