
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';
import { DefinitionCard } from '@/components/app/definition-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function NullSpacePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Null Space (Kernel)"
        description="The World of Lost Information"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we focused on the **Column Space**—the set of all possible *outputs* `b`. Now, we ask a fundamentally different question. Let's consider the simplest possible target: the zero vector, `0`.
        </p>
        <p>The set of **all possible solutions `x`** to the homogeneous equation `Ax = 0` is called the **Null Space** of the matrix `A`.</p>
      </article>

      <DefinitionCard title="The Null Space">
        <FormulaBlock>
          <BlockMath math="\text{Null Space } N(A) = \{ \text{all vectors } x \text{ such that } Ax = 0 \}" />
        </FormulaBlock>
        <p className="mt-4">The Null Space is the set of all input vectors that get **squashed, collapsed, or annihilated** into the single point of the origin by the transformation `A`. It is always a **subspace** of the input space.</p>
      </DefinitionCard>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Null Space</CardTitle>
          <CardDescription>The Null Space is defined by the solutions to `Ax=0`. How do we find these solutions? With the most powerful tool in our toolbox: **Gauss-Jordan Elimination (to RREF)**.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExampleStep stepNumber={1} title="Reduce `A` to its Reduced Row Echelon Form (RREF)">
            <p className="text-sm text-muted-foreground">For `Ax=0`, we can just focus on `A` because the zero vector on the right side of an augmented matrix never changes.</p>
            <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix} \quad \xrightarrow{\text{RREF}} \quad R = \begin{bmatrix} \mathbf{1} & 2 & 0 & 1 \\ 0 & 0 & \mathbf{1} & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          </ExampleStep>
          <ExampleStep stepNumber={2} title="Identify pivot variables and free variables">
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Pivot Columns:</strong> 1 and 3. So, `x₁` and `x₃` are pivot variables.</li>
                <li><strong>Free Columns:</strong> 2 and 4. So, `x₂` and `x₄` are **free variables**.</li>
            </ul>
          </ExampleStep>
          <ExampleStep stepNumber={3} title="Write the general solution to `Rx = 0`">
            <p className="text-sm">Let `x₂ = s` and `x₄ = t`, where `s` and `t` can be any real numbers.</p>
            <p className="text-sm mt-2">From Row 1: <InlineMath math="x₁ + 2x₂ + x₄ = 0 \implies x₁ = -2s - t" /></p>
            <p className="text-sm">From Row 2: <InlineMath math="x₃ + x₄ = 0 \implies x₃ = -t" /></p>
          </ExampleStep>
          <ExampleStep stepNumber={4} title="Decompose the solution into a linear combination of vectors">
            <p className="text-sm text-muted-foreground">This is the magic step. We write our solution vector `x` and separate the parts for `s` and `t`.</p>
            <BlockMath math="x = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \end{bmatrix} = \begin{bmatrix} -2s - t \\ s \\ -t \\ t \end{bmatrix} = s \begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix} + t \begin{bmatrix} -1 \\ 0 \\ -1 \\ 1 \end{bmatrix}" />
            <p className="mt-2">Every vector `x` in the Null Space is a linear combination of these two specific vectors. These two vectors form a **basis for the Null Space of `A`**.</p>
             <p className="mt-2">The dimension of the Null Space (called the **nullity**) is 2, which is exactly the number of free variables we had.</p>
          </ExampleStep>
        </CardContent>
      </Card>
      
       <KeyConceptAlert title="The Meaning of the Null Space: Redundancy">
          <p>The Null Space is the precise mathematical description of **redundancy** in the columns of `A`.</p>
          <p>A non-zero vector `x` in the Null Space means that `Ax = 0`, which is `x₁·(col 1) + x₂·(col 2) + ... = 0`. This is the very definition of **linear dependence** among the columns of `A`. For `s=1, t=0`, we find `col 2 = 2 * col 1`.</p>
       </KeyConceptAlert>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/row-space-and-left-null-space">
        Row Space & Left Null Space
      </NextUpNavigation>
    </div>
  );
}
