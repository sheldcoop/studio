
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { SideBySideComparison, ComparisonItem } from '@/components/app/side-by-side-comparison';
import { DefinitionCard } from '@/components/app/definition-card';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function TwoViewsOfAMatrixPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Two Views of a Matrix"
        description="The next major character in our story. A grid of numbers, and so much more."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>We’ve spent the last four lessons building a solid intuition for vectors. We know they are the fundamental atoms of our data. Now, we introduce the next major character in our story: the Matrix.</p>
        <p>Just like with vectors, there are two primary ways to think about a matrix. One is simple and practical, the other is abstract and incredibly powerful. Mastering the ability to switch between these two views is the next giant leap in your linear algebra journey.</p>
      </article>

      <SideBySideComparison>
        <ComparisonItem title="View #1: The Data Scientist's View (A Container for Data)">
          <p>A matrix is simply a grid of numbers, arranged in rows and columns. It's a spreadsheet. A matrix is a collection of vectors. You can view it as a stack of row vectors:</p>
          <BlockMath math="A = \begin{bmatrix} 1 & -2 \\ 3 & 5 \\ 0 & 4 \end{bmatrix}" />
          <ul className="list-disc pl-6 font-mono text-sm">
              <li>row 1 = [1, -2]</li>
              <li>row 2 = [3, 5]</li>
              <li>row 3 = [0, 4]</li>
          </ul>
          <p>This view is essential for organizing datasets, but it doesn't tell us what a matrix *does*.</p>
        </ComparisonItem>
        <ComparisonItem title="View #2: The Physicist's View (A Linear Transformation)">
          <p>This is the most important and mind-expanding idea in all of linear algebra. A matrix is a function that transforms space. It takes in a vector and spits out a new vector. Let's take a simple 2x2 matrix and a vector:</p>
          <BlockMath math="A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}, \quad v = \begin{bmatrix} 1 \\ 2 \end{bmatrix}" />
          <p>When we multiply A by v, we get a new vector:</p>
          <BlockMath math="A \cdot v = \begin{bmatrix} 2 \\ 6 \end{bmatrix}" />
          <p>The matrix A took the input vector and stretched space by a factor of 2 on the x-axis and by a factor of 3 on the y-axis.</p>
        </ComparisonItem>
      </SideBySideComparison>

      <KeyConceptAlert title="The Core Idea for Quants & ML" icon="brain">
        <p>Machine learning models learn the optimal transformations to solve a problem. A neural network is essentially a series of matrices. The "learning" process is just the algorithm finding the perfect numbers to put inside these matrices so that by the end, all "cat" vectors end up in one part of the space, and all "dog" vectors end up in another.</p>
      </KeyConceptAlert>

      <DefinitionCard title="The Connection Between the Views">
          <p>How does a simple grid of numbers (View #1) contain the instructions for a complex spatial transformation (View #2)? The secret lies in the columns of the matrix.</p>
          <p className="font-semibold">The columns of a matrix tell you where the basis vectors land after the transformation.</p>
          <p>Let's look at a matrix M and our standard basis vectors <InlineMath math="i = [1, 0]" /> and <InlineMath math="j = [0, 1]" />:</p>
          <BlockMath math="M = \begin{bmatrix} 3 & -1 \\ 1 & 2 \end{bmatrix}" />
          <ul className="list-disc pl-6 text-sm">
              <li>The first column, <InlineMath math="[3, 1]" />, is exactly where the first basis vector, <InlineMath math="i" />, ends up after being transformed by M.</li>
              <li>The second column, <InlineMath math="[-1, 2]" />, is where the second basis vector, <InlineMath math="j" />, lands.</li>
          </ul>
          <p>Because the transformation is "linear", knowing where the basis vectors land tells us everything we need to know about how the entire space is transformed.</p>
      </DefinitionCard>

      <LessonSummaryCard title="Summary: Your Two New Lenses for Matrices">
        <li><strong>Data Container:</strong> A matrix is a grid of numbers, perfect for organizing datasets. This is how we <strong>store</strong> information.</li>
        <li><strong>Transformation:</strong> A matrix is a function that transforms space. It takes input vectors and produces output vectors. This is how we <strong>process</strong> information.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/matrix-operations">
        Matrix Operations
      </NextUpNavigation>
    </div>
  );
}
