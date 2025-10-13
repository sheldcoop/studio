
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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
          But what if you have to solve multiple systems with the <strong>same coefficient matrix `A`</strong>, but different result vectors `b`?
        </p>
        <ul className="list-disc pl-6 space-y-1">
            <li><InlineMath math="Ax = b_1" /></li>
            <li><InlineMath math="Ax = b_2" /></li>
            <li><InlineMath math="Ax = b_3" /></li>
        </ul>
        <p>
          This happens all the time in the real world, for example, when simulating a structure under different loads. Running the entire, slow Gaussian Elimination process for each `b` would be incredibly inefficient. The elimination steps only depend on `A`, so we'd be wastefully re-doing the exact same row operations every single time.
        </p>
        <p>
          The central question is: <strong>Can we save the elimination steps themselves?</strong> Can we capture the entire forward elimination process in a matrix?
        </p>
        <p>
          The answer is yes. This is the motivation for the <strong>LU Decomposition</strong>.
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
            <div className="text-center"><BlockMath math="A = LU" /></div>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>`L` is a Lower triangular matrix.</strong> It has 1s on the diagonal and all zeros <em>above</em> the diagonal.</li>
                <li><strong>`U` is an Upper triangular matrix.</strong> It is the <strong>exact same row echelon form</strong> that we get from running Gaussian Elimination on `A`.</li>
            </ul>
            <p className="font-semibold text-primary">The magic is this: The `L` matrix is the perfect record of the elimination steps we performed to get `A` into its upper triangular form `U`.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The `L` Matrix: Storing the Multipliers</CardTitle>
          <CardDescription>
            Remember our elimination operations, like `Row 2 → Row 2 - 2 * Row 1`? The number `2` here is the <strong>multiplier</strong> we used. The `L` matrix is constructed by simply placing these multipliers (with their sign flipped) into the corresponding positions below the diagonal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <h4 className="font-semibold">Example:</h4>
            <p>Let's take a simple matrix `A` and find its LU decomposition.</p>
            <BlockMath math="A = \begin{bmatrix} 2 & 1 \\ 4 & 5 \end{bmatrix}" />
            <h5 className="font-semibold">Step 1: Perform forward elimination to get `U`.</h5>
            <ul className="list-disc pl-6 text-sm">
                <li>We need to eliminate the `4` in the second row.</li>
                <li>The operation is `R₂ → R₂ - 2*R₁`. The multiplier is <strong>2</strong>.</li>
                <li><InlineMath math="[4, 5] - 2 \cdot [2, 1] = [0, 3]" /></li>
            </ul>
            <p>So, our Upper triangular matrix `U` is:</p>
            <BlockMath math="U = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}" />
            <h5 className="font-semibold mt-4">Step 2: Construct `L` from the multipliers.</h5>
            <ul className="list-disc pl-6 text-sm">
                <li>`L` will be a lower triangular matrix with 1s on the diagonal.</li>
                <li>The multiplier we used was <strong>2</strong>. It was used to operate on Row 2 using Row 1. So, we place this `2` in the Row 2, Column 1 position of `L`.</li>
            </ul>
            <BlockMath math="L = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}" />
            <p>You can multiply them to verify: `A = LU`</p>
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
                <li>First, solve `Lc = b` for `c`.</li>
                <li>Then, solve `Ux = c` for `x`.</li>
            </ol>
            <p>This is better because both systems involve triangular matrices, which are solved with lightning-fast substitution.</p>
            <div>
                <h4 className="font-semibold">Let's see it in action.</h4>
                 <p>Let `A` be our matrix from before, and let `b = [3, 9]`. We want to solve `Ax = b`.</p>
                 <h5 className="font-medium mt-2">Step 1: Solve `Lc = b` for `c = [c₁, c₂]`.</h5>
                 <BlockMath math="\begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} c_1 \\ c_2 \end{bmatrix} = \begin{bmatrix} 3 \\ 9 \end{bmatrix}" />
                 <p className="text-sm">From the first row: `1*c₁ + 0*c₂ = 3` → `c₁ = 3`. <br/>
                 From the second row: `2*c₁ + 1*c₂ = 9` → `2(3) + c₂ = 9` → `c₂ = 3`.</p>
                 <p className="text-sm font-semibold">So, `c = [3, 3]`. That was fast.</p>
            </div>
             <div>
                 <h5 className="font-medium mt-2">Step 2: Solve `Ux = c` for `x = [x₁, x₂]`.</h5>
                 <BlockMath math="\begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \end{bmatrix}" />
                 <p className="text-sm">From the second row: `3*x₂ = 3` → `x₂ = 1`.<br/>
                 From the first row: `2*x₁ + 1*x₂ = 3` → `2*x₁ + 1 = 3` → `x₁ = 1`.</p>
                 <p className="text-sm font-semibold">The final solution is `x = [1, 1]`.</p>
            </div>
            <p>The upfront work of finding `L` and `U` allows us to solve for any new `b` vector with blistering speed. This is the method computers actually use to solve large systems of equations.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pitfalls and Properties: The Fine Print</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h4 className="font-semibold">Pitfall #1: The Need for Row Swaps</h4>
                <p>What happens if we have a zero in a pivot position? The standard `A = LU` decomposition will fail. The solution is a slightly modified form called the **PA = LU Decomposition**. `P` is a **Permutation Matrix**—a special type of orthogonal matrix that simply records the row swaps.</p>
            </div>
             <div>
                <h4 className="font-semibold">Properties and When It Can Be Used</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>**Existence:** An LU decomposition for a square matrix `A` exists if and only if the matrix can be brought to row echelon form without any row swaps.</li>
                    <li>**Uniqueness:** If it exists, and `A` is invertible, the `L` and `U` matrices are unique.</li>
                    <li>**Determinant:** `det(A) = det(L)det(U) = 1 * det(U)` (product of diagonals of `U`). This is often the fastest way to compute a determinant.</li>
                    <li>**Primary Use Case:** The ideal scenario for using LU decomposition is when you need to solve `Ax=b` for a fixed `A` and many different `b` vectors.</li>
                </ul>
            </div>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We have mastered the art of solving `Ax=b`. It's time to step back and analyze the deeper structure of the matrix `A` itself. We will formally introduce the Four Fundamental Subspaces.
      </p>

    </div>
  );
}
