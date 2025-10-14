
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { ExampleStep } from '@/components/app/example-step';
import { FormulaBlock } from '@/components/app/formula-block';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function LUDecompositionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="LU Decomposition"
        description="The Efficiency Expert"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          So far, we have treated Gaussian Elimination as a <em>process</em>—a series of steps we perform to solve a single system `Ax = b`.
        </p>
        <p>
          But what if you have to solve multiple systems with the <strong>same coefficient matrix `A`</strong>, but different result vectors `b`? This happens all the time in the real world. Running the entire, slow Gaussian Elimination process for each `b` would be incredibly inefficient. The elimination steps only depend on `A`, so we'd be wastefully re-doing the exact same row operations every single time.
        </p>
        <p>
          The central question is: <strong>Can we save the elimination steps themselves?</strong> The answer is yes. This is the motivation for the <strong>LU Decomposition</strong>.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is LU Decomposition?</CardTitle>
          <CardDescription>
            LU Decomposition is a <strong>matrix factorization</strong>. It is a way of breaking down a single, complex matrix `A` into the product of two simpler, more useful matrices:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <FormulaBlock>
                <BlockMath math="A = LU" />
            </FormulaBlock>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>`L` is a Lower triangular matrix.</strong> It has 1s on the diagonal and all zeros <em>above</em> the diagonal.</li>
                <li><strong>`U` is an Upper triangular matrix.</strong> It is the <strong>exact same row echelon form</strong> that we get from running Gaussian Elimination on `A`.</li>
            </ul>
            <KeyConceptAlert title="The Core Idea">
              <p>The `L` matrix is the perfect record of the elimination steps we performed to get `A` into its upper triangular form `U`.</p>
            </KeyConceptAlert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Payoff: Solving `Ax = b` with Super Speed</CardTitle>
          <CardDescription>
            We substitute `LU` for `A`: `LUx = b`. Now, we cleverly split this one hard problem into two easy problems. Let's define an intermediate vector `c` such that `Ux = c`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <ol className="list-decimal pl-6 space-y-2 font-semibold">
                <li>First, solve `Lc = b` for `c`. (Forward substitution - very fast)</li>
                <li>Then, solve `Ux = c` for `x`. (Back substitution - very fast)</li>
            </ol>
            <p>This is better because both systems involve triangular matrices, which are solved with lightning-fast substitution.</p>
            <ExampleStep stepNumber={1} title="Solve `Lc = b` for `c`">
                 <p>Given `L` and `b`, find `c = [c₁, c₂]`. This is forward substitution.</p>
                 <BlockMath math="\begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} c_1 \\ c_2 \end{bmatrix} = \begin{bmatrix} 3 \\ 9 \end{bmatrix} \implies c = \begin{bmatrix} 3 \\ 3 \end{bmatrix}" />
            </ExampleStep>
             <ExampleStep stepNumber={2} title="Solve `Ux = c` for `x`">
                 <p>Now use `U` and our new `c` to find `x = [x₁, x₂]`. This is back substitution.</p>
                 <BlockMath math="\begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \end{bmatrix} \implies x = \begin{bmatrix} 1 \\ 1 \end{bmatrix}" />
            </ExampleStep>
            <p>The upfront work of finding `L` and `U` allows us to solve for any new `b` vector with blistering speed. This is the method computers actually use to solve large systems of equations.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pitfalls: The Need for Row Swaps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>What happens if we have a zero in a pivot position? The standard `A = LU` decomposition will fail. The solution is a slightly modified form called the <strong>PA = LU Decomposition</strong>. `P` is a **Permutation Matrix**—a special type of orthogonal matrix that simply records the row swaps.</p>
        </CardContent>
      </Card>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/column-space-and-rank">
        Column Space & Rank
      </NextUpNavigation>
    </div>
  );
}
