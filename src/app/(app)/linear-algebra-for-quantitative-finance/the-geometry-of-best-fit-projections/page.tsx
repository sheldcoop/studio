
'use client';

import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function ProjectionsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title='The Geometry of "Best Fit": Projections'
        description="Building the mathematical machinery to find the closest possible solution."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we faced a hard truth: most real-world systems `Ax=b` have no solution. We redefined our goal: instead of trying to hit the unreachable target `b`, we will aim for the closest point to it that we *can* hit.
        </p>
        <p>
          This closest point, we said, is the **orthogonal projection** of `b` onto the Column Space of `A`. Today, we build the geometric machinery to find that projection. We will start with the simplest case imaginable and build up to the general, powerful formula.
        </p>
      </article>

      <PageSection title="Part 1: Projection onto a Line">
        <p className="prose prose-invert max-w-none">
            The simplest case is projecting one vector onto another. This forms the basis for everything else.
        </p>
        <p className="prose prose-invert max-w-none">
            Imagine a single vector `a` in space, which defines a line. Now, imagine another vector `b` that is not on this line. The closest point on the line to `b` is the **orthogonal projection of `b` onto `a`**, which we'll call `p`.
        </p>
        <p className="prose prose-invert max-w-none">
            The key feature is that the error vector, <InlineMath math="e = b - p" />, must be **orthogonal** to the vector `a` that defines the line. This means their dot product is zero:
        </p>
        <FormulaBlock>
            <BlockMath math="a \cdot (b - p) = 0" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none">
            We also know `p` must be a scaled version of `a`, so <InlineMath math="p = \hat{x}a" /> for some scalar <InlineMath math="\hat{x}" />. Substituting this in:
        </p>
        <BlockMath math="a \cdot (b - \hat{x}a) = 0 \implies a \cdot b - \hat{x}(a \cdot a) = 0" />
        <p className="prose prose-invert max-w-none">Solving for our unknown scalar <InlineMath math="\hat{x}" /> gives:</p>
        <FormulaBlock>
            <BlockMath math="\hat{x} = \frac{a \cdot b}{a \cdot a} = \frac{a^Tb}{a^Ta}" />
        </FormulaBlock>
        <p className="prose prose-invert max-w-none">And the projection vector `p` itself is:</p>
        <FormulaBlock>
            <BlockMath math="p = \hat{x}a = \left( \frac{a^Tb}{a^Ta} \right) a" />
        </FormulaBlock>
      </PageSection>

      <PageSection title="Part 2: Projection onto a Subspace">
        <p className="prose prose-invert max-w-none">
            Now we generalize this to project a vector `b` onto an entire subspace, like the Column Space of a matrix `A`.
        </p>
        <p className="prose prose-invert max-w-none">
            Let the Column Space of `A` be spanned by linearly independent basis vectors `{'a₁, a₂, ..., aₙ'}`. The projection `p` is in this space, so it must be a linear combination of these basis vectors:
        </p>
        <BlockMath math="p = \hat{x}_1 a_1 + \hat{x}_2 a_2 + \dots + \hat{x}_n a_n = A\hat{x}" />
        <p className="prose prose-invert max-w-none">
            Here, `x̂` is the vector of coefficients we need to find. The error `e = b - p` must be orthogonal to the *entire* subspace, meaning it's orthogonal to every basis vector `aᵢ`.
        </p>
        <BlockMath math="\begin{cases} a_1^T(b - A\hat{x}) = 0 \\ a_2^T(b - A\hat{x}) = 0 \\ \vdots \\ a_n^T(b - A\hat{x}) = 0 \end{cases}" />
        <p className="prose prose-invert max-w-none">This entire system of equations can be written in a single, compact matrix form:</p>
        <BlockMath math="A^T(b - A\hat{x}) = 0" />
        <p className="prose prose-invert max-w-none">Rearranging this gives us the magnificent **Normal Equations**:</p>
        <div className="rounded-lg border bg-primary/10 p-6 text-center my-4">
            <BlockMath math="A^TA\hat{x} = A^Tb" />
        </div>
        <p className="prose prose-invert max-w-none">
            We have converted our original, unsolvable system `Ax=b` into a new, smaller, **always solvable** square system that gives us the best approximate solution `x̂`.
        </p>
      </PageSection>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-algebraic-solution-the-normal-equations">
        The Algebraic Solution: The Normal Equations
      </NextUpNavigation>
    </div>
  );
}
