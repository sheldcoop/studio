
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


export default function MatrixMultiplicationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix-Vector Multiplication"
        description="Understanding how a matrix transforms a vector."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>Matrix multiplication is arguably the most important operation in linear algebra. But the standard row-column calculation rule often feels arbitrary and unmotivated. The secret to understanding it is to first grasp what it means to multiply a <strong>matrix by a vector</strong>.</p>
        <p>The profound idea is this: <strong>Matrix-vector multiplication is a linear combination of the matrix's columns, where the weights are the components of the vector.</strong></p>
      </article>

      <PageSection title='The "Why": A Change of Language'>
        <p className="prose prose-invert max-w-none">
            Imagine our standard coordinate system, defined by the basis vectors <InlineMath math="\hat{i} = [1, 0]" /> and <InlineMath math="\hat{j} = [0, 1]" />. In this system, a vector like <InlineMath math="v = [2, 1]" /> means "take 2 parts of <InlineMath math="\hat{i}" /> and 1 part of <InlineMath math="\hat{j}" />".
        </p>
        <p className="prose prose-invert max-w-none">
            But what if we had a different set of basis vectors, say <InlineMath math="b_1" /> and <InlineMath math="b_2" />? What would the vector with coordinates <InlineMath math="[2, 1]" /> look like in *that* new language? The resulting vector would be <InlineMath math="2 \cdot b_1 + 1 \cdot b_2" />.
        </p>
        <p className="prose prose-invert max-w-none">
            This is exactly what matrix-vector multiplication does. If we form a matrix `A` whose columns are our new basis vectors, `A = [b₁ | b₂]`, then multiplying `A` by the vector `v = [2, 1]` gives us the position of that vector in the standard coordinate system.
        </p>
        <FormulaBlock>
            <BlockMath math="A \cdot v = \begin{bmatrix} | & | \\ b_1 & b_2 \\ | & | \end{bmatrix} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = 2 \cdot b_1 + 1 \cdot b_2" />
        </FormulaBlock>
        
        <InteractiveVisualizationWrapper
          title="Visualizing a Linear Combination"
        >
          <InteractiveMatrixTransformation />
        </InteractiveVisualizationWrapper>

        <p className="mt-4 prose prose-invert max-w-none">
            Use the interactive tool above. The gray grid is our standard system with its fixed red (<InlineMath math="\hat{i}" />) and green (<InlineMath math="\hat{j}" />) basis vectors. The colored vectors (<InlineMath math="b_1, b_2" />) are the columns of your new matrix, and you can drag them. The white vector `v` is the result of the linear combination. Change the coordinates in the input boxes or drag the basis vectors to see how the final vector's position is a sum of scaled versions of your new basis.
        </p>
        
      </PageSection>

      <PageSection title='The "How": The Row-Column Rule Revisited'>
        <DefinitionCard title="The Calculation Rule">
            <p>Now, let's see how the familiar "row-times-column" dot product rule is just a computational shortcut for this linear combination.</p>
            <div className="border p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Example:</h4>
                <div className="flex justify-center gap-8 items-center">
                    <BlockMath math="A = \begin{bmatrix} 1.5 & -0.5 \\ 0.5 & 1.0 \end{bmatrix}" />
                    <span className="text-2xl">,</span>
                    <BlockMath math="v = \begin{bmatrix} 2 \\ 1 \end{bmatrix}" />
                </div>
                <p className="mt-4"><strong className="text-primary">Linear Combination View:</strong></p>
                <BlockMath math="2 \cdot \begin{bmatrix} 1.5 \\ 0.5 \end{bmatrix} + 1 \cdot \begin{bmatrix} -0.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \end{bmatrix} + \begin{bmatrix} -0.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 2.5 \\ 2.0 \end{bmatrix}" />
                <p className="mt-4"><strong className="text-primary">Row-Column View:</strong></p>
                <p><InlineMath math="\text{Row 1} \cdot v = (1.5 \cdot 2) + (-0.5 \cdot 1) = 3 - 0.5 = 2.5" /></p>
                <p><InlineMath math="\text{Row 2} \cdot v = (0.5 \cdot 2) + (1.0 \cdot 1) = 1 + 1 = 2.0" /></p>
                <p className="mt-2">They produce the exact same result! The dot product method is simply a way to compute the components of the final vector directly.</p>
            </div>
        </DefinitionCard>
      </PageSection>

      <LessonSummaryCard title="Summary: Matrix-Vector Multiplication">
        <li><strong>The "Why":</strong> It is the process of finding a vector's position, which is expressed as a linear combination of new basis vectors (the columns of the matrix).</li>
        <li><strong>The "How":</strong> The dot product of each matrix row with the vector gives you the components of the final resulting vector.</li>
        <li className="list-none pt-2 font-semibold">Understanding it as a linear combination of columns is the key to deeper insights.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/special-matrices">
        Matrix Multiplication: Composing Transformations
      </NextUpNavigation>
    </div>
  );
}
