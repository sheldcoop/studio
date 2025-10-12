
'use client';

import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Lesson = ({ title, time, children }: { title: string; time: string; children: React.ReactNode; }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-baseline">
            <h3 className="font-headline text-2xl font-bold">{title}</h3>
            <span className="text-sm text-muted-foreground">{time}</span>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90">
            {children}
        </div>
    </div>
);


export default function MatrixOperationsComponent() {
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <PageHeader
        title="The Essential Matrix Operations"
        description="A matrix is a rectangular grid of numbers that can represent data, systems of equations, or powerful geometric transformations."
        variant="aligned-left"
      />

      <Card>
        <CardContent className="p-6 space-y-12">
            <Lesson title="Lesson 1: Matrix Addition & Subtraction" time="~15 min">
                <p>This is the most intuitive place to start. Adding and subtracting matrices is almost exactly like adding and subtracting regular numbers, with one simple rule.</p>
                <h4 className="font-semibold text-primary">The Golden Rule of Addition/Subtraction</h4>
                <p>You can only add or subtract two matrices if they have the <strong>exact same dimensions</strong>. You can add a 2x3 matrix to another 2x3 matrix, but you cannot add a 2x3 matrix to a 2x2 matrix.</p>
                <h4 className="font-semibold text-primary">How to Add Matrices</h4>
                <p>You add matrices <strong>element-wise</strong>. This means you add the numbers that are in the same position. The number in the first row, first column of the first matrix gets added to the number in the first row, first column of the second matrix, and so on.</p>
                <p><strong>Example:</strong> Let's add matrix A and matrix B.</p>
                <BlockMath math="A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \text{ and } B = \begin{pmatrix} 7 & 8 & 9 \\ 10 & 11 & 12 \end{pmatrix}" />
                <p>Both are 2x3 matrices, so we can add them.</p>
                <BlockMath math="A + B = \begin{pmatrix} 1+7 & 2+8 & 3+9 \\ 4+10 & 5+11 & 6+12 \end{pmatrix} = \begin{pmatrix} 8 & 10 & 12 \\ 14 & 16 & 18 \end{pmatrix}" />
                <p>It's like laying one matrix on top of the other and adding the corresponding numbers.</p>
                <h4 className="font-semibold text-primary">How to Subtract Matrices</h4>
                <p>Subtraction works the exact same way: subtract the elements in the corresponding positions.</p>
                <BlockMath math="A - B = \begin{pmatrix} 1-7 & 2-8 & 3-9 \\ 4-10 & 5-11 & 6-12 \end{pmatrix} = \begin{pmatrix} -6 & -6 & -6 \\ -6 & -6 & -6 \end{pmatrix}" />
                <h4 className="font-semibold text-primary">Key Takeaway</h4>
                <p>For addition and subtraction, the matrices must be the same size. The operation is performed element by element.</p>
            </Lesson>

            <hr />

            <Lesson title="Lesson 2: Scalar Multiplication" time="~15 min">
                <p>This operation involves a matrix and a <strong>scalar</strong> (a single number). It's one of the simplest operations to master.</p>
                <h4 className="font-semibold text-primary">How to Perform Scalar Multiplication</h4>
                <p>You take the scalar and multiply it by <strong>every single element</strong> inside the matrix. You are essentially scaling the entire matrix.</p>
                <p><strong>Example:</strong> Let's take the matrix A from our previous example and multiply it by the scalar `3`.</p>
                <BlockMath math="A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}" />
                <BlockMath math="3A = 3 \cdot \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} = \begin{pmatrix} 3 \cdot 1 & 3 \cdot 2 & 3 \cdot 3 \\ 3 \cdot 4 & 3 \cdot 5 & 3 \cdot 6 \end{pmatrix} = \begin{pmatrix} 3 & 6 & 9 \\ 12 & 15 & 18 \end{pmatrix}" />
                <p>That's all there is to it! Every number inside gets scaled up by a factor of 3. This works for any scalar, including negative numbers and fractions.</p>
                <h4 className="font-semibold text-primary">Key Takeaway</h4>
                <p>Scalar multiplication means multiplying every single element in the matrix by the scalar.</p>
            </Lesson>

             <hr />
            
            <Lesson title="Lesson 3: Matrix Multiplication" time="~15 min">
                <p>This is the most complex of the basic operations, but it's also the most powerful. It does <strong>not</strong> work element-wise. Instead, it involves a "row-times-column" method.</p>
                <h4 className="font-semibold text-primary">The Golden Rule of Multiplication</h4>
                <p>To multiply two matrices, <InlineMath math="A \cdot B" />, the number of <strong>columns</strong> in the first matrix (A) must be equal to the number of <strong>rows</strong> in the second matrix (B).</p>
                <ul className="list-disc pl-6">
                    <li>If A is an <InlineMath math="m \times n" /> matrix, B must be an <InlineMath math="n \times p" /> matrix.</li>
                    <li>The <strong>inner dimensions (<InlineMath math="n" />)</strong> must match.</li>
                    <li>The resulting matrix, C, will have the dimensions of the <strong>outer dimensions (<InlineMath math="m \times p" />)</strong>.</li>
                </ul>
                <p><strong>Example:</strong> A <InlineMath math="3 \times 2" /> matrix can multiply a <InlineMath math="2 \times 4" /> matrix. The inner '2's match, and the result will be a <InlineMath math="3 \times 4" /> matrix.</p>
                <h4 className="font-semibold text-primary">How to Multiply Matrices</h4>
                <p>The value of each element in the resulting matrix is the <strong>dot product</strong> of a row from the first matrix and a column from the second matrix.</p>
                <p>Let's multiply matrix C and D:</p>
                <BlockMath math="C = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \text{ (a 2x2 matrix)}" />
                <BlockMath math="D = \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} \text{ (a 2x2 matrix)}" />
                <p>The result will be a 2x2 matrix. Let's call it <InlineMath math="R = \begin{pmatrix} r_{11} & r_{12} \\ r_{21} & r_{22} \end{pmatrix}" />.</p>
                <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">[Image/Animation Placeholder: An animation highlighting the first row of C and the first column of D, then showing the calculation for the top-left element of the result.]</div>
                <ul>
                    <li><strong>To find the element in Row 1, Column 1 (<InlineMath math="r_{11}" />):</strong>
                        <ul className="list-disc pl-6">
                        <li>Take Row 1 of C: <InlineMath math="(1, 2)" /></li>
                        <li>Take Column 1 of D: <InlineMath math="(5, 7)" /></li>
                        <li>Calculate the dot product: <InlineMath math="(1 \cdot 5) + (2 \cdot 7) = 5 + 14 = 19" />. So, <InlineMath math="r_{11} = 19" />.</li>
                        </ul>
                    </li>
                    <li><strong>To find the element in Row 1, Column 2 (<InlineMath math="r_{12}" />):</strong>
                         <ul className="list-disc pl-6">
                            <li>Take Row 1 of C: <InlineMath math="(1, 2)" /></li>
                            <li>Take Column 2 of D: <InlineMath math="(6, 8)" /></li>
                            <li>Calculate the dot product: <InlineMath math="(1 \cdot 6) + (2 \cdot 8) = 6 + 16 = 22" />. So, <InlineMath math="r_{12} = 22" />.</li>
                        </ul>
                    </li>
                    <li><strong>To find the element in Row 2, Column 1 (<InlineMath math="r_{21}" />):</strong>
                         <ul className="list-disc pl-6">
                            <li>Take Row 2 of C: <InlineMath math="(3, 4)" /></li>
                            <li>Take Column 1 of D: <InlineMath math="(5, 7)" /></li>
                            <li>Calculate the dot product: <InlineMath math="(3 \cdot 5) + (4 \cdot 7) = 15 + 28 = 43" />. So, <InlineMath math="r_{21} = 43" />.</li>
                        </ul>
                    </li>
                     <li><strong>To find the element in Row 2, Column 2 (<InlineMath math="r_{22}" />):</strong>
                         <ul className="list-disc pl-6">
                            <li>Take Row 2 of C: <InlineMath math="(3, 4)" /></li>
                            <li>Take Column 2 of D: <InlineMath math="(6, 8)" /></li>
                            <li>Calculate the dot product: <InlineMath math="(3 \cdot 6) + (4 \cdot 8) = 18 + 32 = 50" />. So, <InlineMath math="r_{22} = 50" />.</li>
                        </ul>
                    </li>
                </ul>
                <h4 className="font-semibold text-primary">Final Result:</h4>
                <BlockMath math="C \cdot D = \begin{pmatrix} 19 & 22 \\ 43 & 50 \end{pmatrix}" />
                <p><strong>Very Important:</strong> Matrix multiplication is <strong>NOT commutative</strong>. In general, <InlineMath math="A \cdot B \neq B \cdot A" />. The order matters!</p>
            </Lesson>

             <hr />

            <Lesson title="Lesson 4: The Matrix Transpose" time="~15 min">
                <p>The transpose is a simple and useful operation that flips a matrix over its main diagonal.</p>
                <h4 className="font-semibold text-primary">How to Transpose a Matrix</h4>
                <p>You simply switch the rows and columns. The first row becomes the first column, the second row becomes the second column, and so on. The notation for the transpose of matrix A is <InlineMath math="A^T" />.</p>
                <p><strong>Example:</strong> Let's find the transpose of matrix A. A is a 2x3 matrix. Its transpose will be a 3x2 matrix.</p>
                <BlockMath math="A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix}" />
                <p>To find <InlineMath math="A^T" />, the first row `(1, 2, 3)` becomes the first column. The second row `(4, 5, 6)` becomes the second column.</p>
                <BlockMath math="A^T = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}" />
                <p><strong>Why is this useful?</strong> The transpose is crucial for many advanced topics, including calculating matrix inverses, vector dot products, and understanding the four fundamental subspaces.</p>
                <h4 className="font-semibold text-primary">Key Takeaway</h4>
                <p>The transpose flips the matrix's rows into columns.</p>
            </Lesson>
        </CardContent>
      </Card>
    </div>
  );
}
