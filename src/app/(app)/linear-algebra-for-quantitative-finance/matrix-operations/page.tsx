
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';

export default function MatrixOperationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Operations"
        description="The Rules of Moving in Space"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>In the last lesson, we introduced the two powerful views of a matrix. Before we can fully harness the power of transformations, we need to get comfortable with the basic "grammar" of matrices.</p>
        <p>How do we add, subtract, and scale them? These operations are simple and intuitive, closely mirroring the vector operations we've already learned.</p>
      </article>

      <PageSection title="The Ground Rules: Matrix Dimensions">
        <p className="prose prose-invert max-w-none">Before we can perform any operation, we have to talk about the <strong>shape</strong> or <strong>dimensions</strong> of a matrix. The dimensions are always given as <strong>rows x columns</strong>.</p>
        <ul className="list-disc pl-6 prose prose-invert max-w-none">
            <li>A matrix with 3 rows and 4 columns is a <InlineMath math="3 \times 4" /> matrix.</li>
            <li>A matrix with 1 row and 5 columns is a <InlineMath math="1 \times 5" /> matrix (which is also a row vector!).</li>
        </ul>
        <p className="prose prose-invert max-w-none">This is crucial because most matrix operations have strict rules about the dimensions of the matrices involved.</p>
      </PageSection>

      <PageSection title="Addition and Subtraction">
        <p className="prose prose-invert max-w-none">You can only add or subtract two matrices if they have the <strong>exact same dimensions</strong>. To perform the operation, you simply add or subtract the corresponding elements in each position.</p>
        <p>Let <InlineMath math="A" /> be a <InlineMath math="2 \times 2" /> matrix and <InlineMath math="B" /> be a <InlineMath math="2 \times 2" /> matrix.</p>
        <div className="flex justify-center gap-8">
            <BlockMath math="A = \begin{bmatrix} 1 & -2 \\ 3 & 4 \end{bmatrix}" />
            <BlockMath math="B = \begin{bmatrix} 5 & 0 \\ 1 & -3 \end{bmatrix}" />
        </div>
        <div>
            <h5 className="font-semibold">Addition (<InlineMath math="A + B" />):</h5>
            <BlockMath math="A + B = \begin{bmatrix} 1+5 & -2+0 \\ 3+1 & 4-3 \end{bmatrix} = \begin{bmatrix} 6 & -2 \\ 4 & 1 \end{bmatrix}" />
        </div>
      </PageSection>
      
      <PageSection title="Scalar Multiplication">
          <p className="prose prose-invert max-w-none">To multiply a matrix by a scalar, you multiply <strong>every single element</strong> inside the matrix by that scalar.</p>
          <p>Let's take our matrix <InlineMath math="A" /> and multiply it by the scalar 3.</p>
          <div className="flex justify-center">
            <BlockMath math="3 \times A = 3 \times \begin{bmatrix} 1 & -2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 & -6 \\ 9 & 12 \end{bmatrix}" />
          </div>
          <p className="prose prose-invert max-w-none"><strong>Geometric Intuition:</strong> If a matrix represents a transformation, multiplying it by a scalar `c` scales the entire transformation.</p>
      </PageSection>
      
      <PageSection title="The Transpose: Flipping the Grid">
          <p className="prose prose-invert max-w-none">To find the transpose of a matrix, you <strong>flip it across its main diagonal</strong>. The rows become the columns, and the columns become the rows. The transpose of a matrix <InlineMath math="A" /> is written as <InlineMath math="A^T" />.</p>
          <p>Let's take a <InlineMath math="2 \times 3" /> matrix <InlineMath math="C" />.</p>
          <BlockMath math="C = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}" />
          <p>To find <InlineMath math="C^T" />, the first row becomes the first column, and the second row becomes the second column.</p>
          <BlockMath math="C^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}" />
          <p className="prose prose-invert max-w-none">Notice that the dimensions also flip. A <InlineMath math="2 \times 3" /> matrix becomes a <InlineMath math="3 \times 2" /> matrix.</p>
          <KeyConceptAlert title="Why is the Transpose So Important?">
              <p>The transpose is the key to unlocking the <strong>Four Fundamental Subspaces</strong>. It also appears constantly in key formulas, like the <strong>Normal Equations for linear regression (<InlineMath math="A^TA\hat{x} = A^Tb" />)</strong> and in the definition of a <strong>symmetric matrix (<InlineMath math="A = A^T" />)</strong>.</p>
          </KeyConceptAlert>
      </PageSection>

      <LessonSummaryCard title="Summary: The Basic Toolkit">
        <li><strong>Addition/Subtraction:</strong> Add/subtract element-wise. Matrices must have the same dimensions.</li>
        <li><strong>Scalar Multiplication:</strong> Multiply every element by the scalar.</li>
        <li><strong>Transpose (<InlineMath math="A^T" />):</strong> Flip the matrix along its diagonal. The rows become columns.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/matrix-multiplication">
        Matrix Multiplication
      </NextUpNavigation>
    </div>
  );
}
