
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 1: Projection onto a Line</CardTitle>
          <CardDescription>
            The simplest case is projecting one vector onto another. This forms the basis for everything else.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Imagine a single vector `a` in space, which defines a line. Now, imagine another vector `b` that is not on this line. The closest point on the line to `b` is the **orthogonal projection of `b` onto `a`**, which we'll call `p`.</p>
          <p>The key feature is that the error vector, <InlineMath math="e = b - p" />, must be **orthogonal** to the vector `a` that defines the line. This means their dot product is zero:</p>
          <BlockMath math="a \cdot (b - p) = 0" />
          <p>We also know `p` must be a scaled version of `a`, so <InlineMath math="p = \hat{x}a" /> for some scalar <InlineMath math="\hat{x}" />. Substituting this in:</p>
          <BlockMath math="a \cdot (b - \hat{x}a) = 0 \implies a \cdot b - \hat{x}(a \cdot a) = 0" />
          <p>Solving for our unknown scalar <InlineMath math="\hat{x}" /> gives:</p>
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <BlockMath math="\hat{x} = \frac{a \cdot b}{a \cdot a} = \frac{a^Tb}{a^Ta}" />
          </div>
          <p>And the projection vector `p` itself is:</p>
           <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <BlockMath math="p = \hat{x}a = \left( \frac{a^Tb}{a^Ta} \right) a" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 2: Projection onto a Subspace</CardTitle>
          <CardDescription>
            Now we generalize this to project a vector `b` onto an entire subspace, like the Column Space of a matrix `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Let the Column Space of `A` be spanned by linearly independent basis vectors `{'a₁, a₂, ..., aₙ'}`. The projection `p` is in this space, so it must be a linear combination of these basis vectors:</p>
          <BlockMath math="p = \hat{x}_1 a_1 + \hat{x}_2 a_2 + \dots + \hat{x}_n a_n = A\hat{x}" />
          <p>Here, `x̂` is the vector of coefficients we need to find. The error `e = b - p` must be orthogonal to the *entire* subspace, meaning it's orthogonal to every basis vector `aᵢ`.</p>
          <BlockMath math="\begin{cases} a_1^T(b - A\hat{x}) = 0 \\ a_2^T(b - A\hat{x}) = 0 \\ \vdots \\ a_n^T(b - A\hat{x}) = 0 \end{cases}" />
          <p>This entire system of equations can be written in a single, compact matrix form:</p>
          <BlockMath math="A^T(b - A\hat{x}) = 0" />
          <p>Rearranging this gives us the magnificent **Normal Equations**:</p>
          <div className="rounded-lg border bg-primary/10 p-6 text-center">
            <BlockMath math="A^TA\hat{x} = A^Tb" />
          </div>
          <p className="mt-4">We have converted our original, unsolvable system `Ax=b` into a new, smaller, **always solvable** square system that gives us the best approximate solution `x̂`.</p>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will take the Normal Equations we just derived and use them as our primary tool to solve a real-world linear regression problem from start to finish.
      </p>
    </div>
  );
}
