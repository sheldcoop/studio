
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { PitfallAlert } from '@/components/app/pitfall-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function MatrixMultiplicationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Multiplication"
        description="The most important—and initially, the most confusing—of all matrix operations."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>If you've seen it before, you might remember a confusing rule about rows and columns, dot products, and a lot of finger-pointing. The "how" can seem strange and arbitrary.</p>
        <p>The secret to understanding it is to ignore the "how" for a moment and focus on the <strong>"why."</strong> The "why" comes directly from our second view of matrices: <strong>a matrix is a transformation.</strong></p>
      </article>

      <PageSection title='The "Why": Composing Transformations'>
        <p className="prose prose-invert max-w-none">What happens if you want to apply two transformations in a row? First, you rotate space 90 degrees counter-clockwise. Then, you shear space horizontally.</p>
        <p className="prose prose-invert max-w-none">Let's call the rotation matrix <InlineMath math="Rot" /> and the shear matrix <InlineMath math="Shear" />. Applying <InlineMath math="Rot" /> to a vector <InlineMath math="v" /> gives you a new vector, let's call it <InlineMath math="v'" />. Then, applying <InlineMath math="Shear" /> to <InlineMath math="v'" /> gives you the final vector, <InlineMath math="v''" />.</p>
        <BlockMath math="Shear \cdot (Rot \cdot v) = v''" />
        <p className="prose prose-invert max-w-none">The central question of matrix multiplication is this: <strong>Is there a single, new matrix that represents this entire two-step process?</strong> Can we find a matrix <InlineMath math="M" /> that does the rotation *and then* the shear all in one go, such that <InlineMath math="M \cdot v = v''" />?</p>
        <p className="prose prose-invert max-w-none">Yes. That new matrix <InlineMath math="M" /> is the <strong>product</strong> of <InlineMath math="Shear" /> and <InlineMath math="Rot" />.</p>
        <BlockMath math="M = Shear \cdot Rot" />
        <p className="prose prose-invert max-w-none font-semibold">Matrix multiplication is the composition of linear transformations. It's how we combine multiple transformations into a single, equivalent one.</p>
        <PitfallAlert title="Order Matters! AB ≠ BA">
            <p>Thinking about transformations makes it immediately obvious why the order of matrix multiplication is critical. Rotating then shearing gives you one result. Shearing then rotating gives you a completely different result! This is why, in general, <InlineMath math="AB" /> is not the same as <InlineMath math="BA" />. Matrix multiplication is <strong>not commutative</strong>.</p>
        </PitfallAlert>
      </PageSection>

      <PageSection title='The "How": The Row-Column Rule'>
        <DefinitionCard title="The Dimension Rule">
          <p>To multiply two matrices <InlineMath math="A" /> and <InlineMath math="B" /> to get <InlineMath math="C = AB" />, the <strong>inner dimensions must match</strong>.</p>
          <p>If <InlineMath math="A" /> is <InlineMath math="m \times n" /> and <InlineMath math="B" /> is <InlineMath math="n \times p" />, then you can multiply them. The resulting matrix <InlineMath math="C" /> will have the outer dimensions: <InlineMath math="m \times p" />.</p>
          <p className="font-mono bg-muted p-2 rounded-md text-center"><InlineMath math="(m \times n) \cdot (n \times p) \rightarrow (m \times p)" /></p>
        </DefinitionCard>
        <DefinitionCard title="The Calculation Rule">
            <p>The entry in the <InlineMath math="i" />-th row and <InlineMath math="j" />-th column of the product matrix <InlineMath math="C" /> is the <strong>dot product of the <InlineMath math="i" />-th row of <InlineMath math="A" /> and the <InlineMath math="j" />-th column of <InlineMath math="B" /></strong>.</p>
            <div className="border p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Example:</h4>
                <div className="flex justify-center gap-8">
                    <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}" />
                    <BlockMath math="B = \begin{bmatrix} 7 & 8 \\ 9 & 10 \\ 11 & 12 \end{bmatrix}" />
                </div>
                <p className="text-sm text-center text-muted-foreground mt-2"><InlineMath math="A" /> is <InlineMath math="2 \times 3" />, <InlineMath math="B" /> is <InlineMath math="3 \times 2" />. The result <InlineMath math="C" /> will be <InlineMath math="2 \times 2" />.</p>
                <p className="mt-4"><InlineMath math="C_{11}" /> (1st row, 1st col) = (Row 1 of A) · (Col 1 of B) = <InlineMath math="(1 \cdot 7) + (2 \cdot 9) + (3 \cdot 11) = 58" /></p>
                <p><InlineMath math="C_{12}" /> (1st row, 2nd col) = (Row 1 of A) · (Col 2 of B) = <InlineMath math="(1 \cdot 8) + (2 \cdot 10) + (3 \cdot 12) = 64" /></p>
                <p><InlineMath math="C_{21}" /> (2nd row, 1st col) = (Row 2 of A) · (Col 1 of B) = <InlineMath math="(4 \cdot 7) + (5 \cdot 9) + (6 \cdot 11) = 139" /></p>
                <p><InlineMath math="C_{22}" /> (2nd row, 2nd col) = (Row 2 of A) · (Col 2 of B) = <InlineMath math="(4 \cdot 8) + (5 \cdot 10) + (6 \cdot 12) = 154" /></p>
                <h4 className="font-semibold mt-4">Result:</h4>
                <BlockMath math="C = \begin{bmatrix} 58 & 64 \\ 139 & 154 \end{bmatrix}" />
            </div>
        </DefinitionCard>
      </PageSection>

      <LessonSummaryCard title="Summary: The Most Important Operation">
        <li><strong>The "Why":</strong> Matrix multiplication is the <strong>composition of transformations</strong>.</li>
        <li><strong>The "How":</strong> The entry in row <InlineMath math="i" />, column <InlineMath math="j" /> is the dot product of row <InlineMath math="i" /> of the first matrix and column <InlineMath math="j" /> of the second.</li>
        <li><strong>The Rule:</strong> The inner dimensions must match: <InlineMath math="(m \times n) \cdot (n \times p) \rightarrow (m \times p)" />.</li>
        <li><strong>The Warning:</strong> Order matters! In general, <InlineMath math="AB \neq BA" />.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/special-matrices">
        Special Matrices
      </NextUpNavigation>
    </div>
  );
}
