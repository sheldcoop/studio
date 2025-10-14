
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function SpecialMatricesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Special Matrices: The Main Characters"
        description="Meet the cast of special matrices that you will encounter constantly in your quant journey."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>Now that we understand the rules of matrix operations, especially the powerful concept of matrix multiplication, it's time to meet the main cast of characters. These are special types of matrices that you will encounter constantly.</p>
        <p>Each one has a unique structure, but more importantly, each one has a unique <strong>behavior</strong> when it acts as a transformation. Understanding these behaviors is key to building intuition.</p>
      </article>

      <PageSection title='1. The Identity Matrix (I) - "The Do-Nothing Operator"'>
        <DefinitionCard title="Structure">
          <p>The Identity matrix, denoted <InlineMath math="I" />, is a <strong>square</strong> matrix with <strong>1s on the main diagonal</strong> and <strong>0s everywhere else</strong>.</p>
          <div className="flex justify-center gap-8">
            <div>
              <h5 className="text-center text-sm text-muted-foreground">2x2 Identity</h5>
              <BlockMath math="I_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}" />
            </div>
            <div>
              <h5 className="text-center text-sm text-muted-foreground">3x3 Identity</h5>
              <BlockMath math="I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}" />
            </div>
          </div>
        </DefinitionCard>
        <DefinitionCard title="Behavior">
          <p>The Identity matrix is the matrix equivalent of the number 1. Just as <InlineMath math="1 \cdot x = x" />, multiplying any matrix <InlineMath math="A" /> by the Identity matrix <InlineMath math="I" /> leaves <InlineMath math="A" /> completely unchanged.</p>
          <BlockMath math="A \cdot I = I \cdot A = A" />
          <p>As a transformation, the Identity matrix <strong>does nothing</strong>. It leaves all of space completely untouched.</p>
        </DefinitionCard>
      </PageSection>

      <PageSection title='2. The Inverse Matrix (A⁻¹) - "The Undo Button"'>
         <DefinitionCard title="Behavior">
            <p>For many (but not all!) square matrices <InlineMath math="A" />, there exists a special matrix called its <strong>inverse</strong>, denoted <InlineMath math="A^{-1}" />. The inverse is the matrix that "undoes" the transformation of <InlineMath math="A" />.</p>
            <p>If you apply transformation <InlineMath math="A" />, and then apply its inverse <InlineMath math="A^{-1}" />, you get back to where you started. You get the "do-nothing" Identity matrix.</p>
            <BlockMath math="A \cdot A^{-1} = A^{-1} \cdot A = I" />
         </DefinitionCard>
         <DefinitionCard title="Which Matrices Have an Inverse?">
            <p>A square matrix has an inverse only if its transformation is reversible. This means the matrix cannot "squish" or "collapse" space into a lower dimension. A matrix that has an inverse is called <strong>invertible</strong> or <strong>non-singular</strong>. A matrix without an inverse is called <strong>non-invertible</strong> or <strong>singular</strong>.</p>
         </DefinitionCard>
      </PageSection>

      <PageSection title='3. Diagonal Matrices - "Simple Scaling"'>
        <DefinitionCard title="Structure & Behavior">
            <p>A diagonal matrix is one where all the non-zero elements are on the main diagonal.</p>
            <BlockMath math="D = \begin{bmatrix} 3 & 0 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 5 \end{bmatrix}" />
            <p>Diagonal matrices are the simplest transformations of all. They perform a pure <strong>scaling</strong> along each axis, with no rotation or shear. The matrix <InlineMath math="D" /> above scales the x-axis by 3, the y-axis by -2 (stretching and flipping it), and the z-axis by 5.</p>
        </DefinitionCard>
      </PageSection>

      <PageSection title='4. Symmetric Matrices - "The Quant\'s Favorite"'>
          <DefinitionCard title="Structure & Importance">
            <p>A symmetric matrix is a square matrix that is unchanged by a transpose. In other words, <InlineMath math="A = A^T" />.</p>
            <BlockMath math="A = \begin{bmatrix} 1 & 5 & -2 \\ 5 & 8 & 4 \\ -2 & 4 & 0 \end{bmatrix}" />
            <p>Symmetric matrices are the superstars of quantitative finance and machine learning. Covariance matrices and correlation matrices are always symmetric. They have beautiful, powerful properties: their eigenvalues are always real, and their eigenvectors are always orthogonal.</p>
          </DefinitionCard>
      </PageSection>

      <PageSection title='5. Triangular Matrices (Upper and Lower)'>
          <DefinitionCard title="Structure & Importance">
             <p>A triangular matrix is a square matrix where all the entries either above or below the main diagonal are zero.</p>
            <div className="flex justify-center gap-8">
               <div>
                  <h5 className="text-center text-sm text-muted-foreground">Upper Triangular</h5>
                  <BlockMath math="U = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{bmatrix}" />
               </div>
               <div>
                  <h5 className="text-center text-sm text-muted-foreground">Lower Triangular</h5>
                  <BlockMath math="L = \begin{bmatrix} 1 & 0 & 0 \\ 4 & 5 & 0 \\ 7 & 8 & 9 \end{bmatrix}" />
               </div>
            </div>
            <p>Triangular matrices are a huge deal in numerical computation. The entire point of the <strong>LU Decomposition</strong> is to break down a complicated matrix <InlineMath math="A" /> into the product of a Lower triangular matrix <InlineMath math="L" /> and an Upper triangular matrix <InlineMath math="U" />. This makes solving <InlineMath math="Ax=b" /> vastly more efficient for computers.</p>
          </DefinitionCard>
      </PageSection>

      <PageSection title='6. Orthogonal Matrices (Q) - "The Rigid Motion Operator"'>
          <DefinitionCard title="Behavior & Structure">
            <p>An <strong>Orthogonal Matrix</strong> is a square matrix that represents a <strong>rigid motion</strong>: a transformation that can rotate or reflect space, but <strong>cannot stretch, shrink, or shear it</strong>.</p>
            <p>The defining feature of an orthogonal matrix, denoted <InlineMath math="Q" />, is that its <strong>columns form an orthonormal basis</strong>. This means every column vector has a length of 1 and is orthogonal to every other column.</p>
          </DefinitionCard>
          <DefinitionCard title="The Superpower">
            <p>The inverse of an orthogonal matrix is simply its transpose.</p>
            <BlockMath math="Q^{-1} = Q^T" />
            <p>This is a phenomenal result. The difficult operation of inversion is replaced by the trivial operation of transposing. This is why many advanced numerical algorithms (like QR Decomposition and SVD) are designed to work with orthogonal matrices whenever possible.</p>
          </DefinitionCard>
      </PageSection>

      <LessonSummaryCard title="The Complete Cast Summary">
        <li><strong>Identity <InlineMath math="I" />:</strong> The "number 1." The do-nothing transformation.</li>
        <li><strong>Inverse <InlineMath math="A^{-1}" />:</strong> The "undo button." Reverses the transformation of <InlineMath math="A" />.</li>
        <li><strong>Diagonal <InlineMath math="D" />:</strong> The "simple scaler." Scales along the axes.</li>
        <li><strong>Symmetric <InlineMath math="A" /> (<InlineMath math="A = A^T" />):</strong> The "quant's favorite." Represents pure stretching.</li>
        <li><strong>Triangular <InlineMath math="U, L" />:</strong> The "computational workhorse." For efficient equation solving.</li>
        <li><strong>Orthogonal <InlineMath math="Q" /> (<InlineMath math="Q^{-1} = Q^T" />):</strong> The "rigid motion operator." Rotates/reflects without distortion.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/linear-combinations-and-span">
        Linear Combinations, Span, and Basis
      </NextUpNavigation>
    </div>
  );
}
