
'use client';

import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DefinitionCard } from '@/components/app/definition-card';
import { PageSection } from '@/components/app/page-section';
import { PitfallAlert } from '@/components/app/pitfall-alert';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';
import { InteractiveVisualizationWrapper } from '@/components/app/interactive-visualization-wrapper';
import { InteractiveMatrixTransformation } from '@/components/linear-algebra-animations/InteractiveMatrixTransformation';
import { FormulaBlock } from '@/components/app/formula-block';
import { MatrixMultiplicationAnimation } from '@/components/linear-algebra-animations/matrix-multiplication-animation';


export default function MatrixMultiplicationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Multiplication: Composing Transformations"
        description="Understanding how matrix multiplication combines multiple spatial transformations."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
            We've seen that a matrix transforms a vector. Now we ask the next logical question: what happens if we apply two transformations one after another?
        </p>
        <p>
            This is the entire essence of <strong>matrix-matrix multiplication</strong>. It is not just an arbitrary set of rules for multiplying numbers in a grid; it is the act of <strong>composing functions</strong>—creating a single, new transformation that represents the combined effect of two separate transformations.
        </p>
      </article>
      
       <InteractiveVisualizationWrapper title="Visualizing Composed Transformations">
          <MatrixMultiplicationAnimation />
        </InteractiveVisualizationWrapper>

      <PageSection title='The "How": The Row-Column Rule Revisited'>
        <DefinitionCard title="The Calculation Rule">
            <p>The familiar "row-times-column" dot product rule is the computational shortcut for finding the columns of this new, combined transformation matrix.</p>
             <p className="mt-4">If `C = AB`, then each column of `C` is the result of `A` transforming the corresponding column of `B`.</p>
        </DefinitionCard>
      </PageSection>
      
       <PageSection title='The "Why": AB ≠ BA'>
           <PitfallAlert title="Order Matters!">
              <p>The most important property of matrix multiplication is that it is **not commutative**. In almost all cases, applying transformation B then A (`AB`) is not the same as applying A then B (`BA`).</p>
              <p className="mt-2">Think about it physically: rotating 90 degrees then shearing right is not the same as shearing right then rotating 90 degrees. The order in which you apply transformations changes the final outcome. This is the deep, geometric reason why matrix multiplication is not commutative.</p>
           </PitfallAlert>
      </PageSection>

      <LessonSummaryCard title="Summary: Matrix-Matrix Multiplication">
        <li><strong>The "Why":</strong> It is the process of composing two linear transformations into a single, equivalent transformation.</li>
        <li><strong>The "How":</strong> The dot product of the i-th row of the first matrix and the j-th column of the second matrix gives the (i, j) entry of the result.</li>
        <li className="list-none pt-2 font-semibold">`AB` means "apply transformation B, then apply transformation A." The order is critical.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/special-matrices">
        Special Matrices
      </NextUpNavigation>
    </div>
  );
}
