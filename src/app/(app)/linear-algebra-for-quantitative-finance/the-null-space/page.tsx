
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
          In our last lesson, we focused on the **Column Space**—the set of all possible *outputs* `b` for which the equation `Ax = b` has a solution. It represents the "reach" of our matrix transformation.
        </p>
        <p>
          Now, we ask a fundamentally different and more profound question. Let's consider the simplest possible target: the zero vector, `0`. What if we set `b=0` and try to solve the equation `Ax = 0`?
        </p>
        <p>This special type of system is called a **homogeneous system**. It always has at least one solution, the "trivial" one, where `x` is the zero vector (`A * 0 = 0`). But are there other, more interesting solutions?</p>
        <p>The set of **all possible solutions `x`** to the homogeneous equation `Ax = 0` is called the **Null Space** of the matrix `A`. It is also sometimes called the **Kernel**.</p>
        <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <BlockMath math="\text{Null Space } N(A) = \{ \text{all vectors } x \text{ such that } Ax = 0 \}" />
        </div>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Intuition: What Gets "Squashed" to Zero?</CardTitle>
          <CardDescription>
            The Null Space is the set of all input vectors that get **squashed, collapsed, or annihilated** into the single point of the origin by the transformation `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Think of a matrix `A` that represents a projection from 3D space onto the xy-plane. The input vector `[1, 2, 3]` might land on the output vector `[1, 2, 0]`. But what input vector lands on `[0, 0, 0]`?</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>The input `[0, 0, 5]` gets projected straight down to the origin.</li>
                <li>So does `[0, 0, -2]` and `[0, 0, 1000]`.</li>
                <li>In fact, **any vector on the z-axis** gets squashed to the origin.</li>
            </ul>
            <p>In this case, the entire z-axis is the **Null Space** of the projection matrix. It is the subspace of all inputs that are "lost" or "zeroed out" by the transformation.</p>
            <p className="font-semibold">The Null Space is not a random collection of vectors. It is always a **subspace** of the input space.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Null Space</CardTitle>
          <CardDescription>The Null Space is defined by the solutions to `Ax=0`. How do we find these solutions? With the most powerful tool in our toolbox: **Gauss-Jordan Elimination (to RREF)**.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold">Example:</h4>
            <p>Let's find the Null Space of this matrix `A`:</p>
            <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 1: Reduce `A` to its Reduced Row Echelon Form (RREF).</h4>
            <p className="text-sm text-muted-foreground">We are solving `Ax=0`. We can just focus on `A` because the zero vector on the right side of an augmented matrix never changes.</p>
             <p className="text-sm text-muted-foreground mt-2">After full elimination, the RREF matrix `R` is:</p>
            <BlockMath math="R = \begin{bmatrix} \mathbf{1} & 2 & 0 & 1 \\ 0 & 0 & \mathbf{1} & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 2: Identify pivot variables and free variables.</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Pivot Columns:</strong> 1 and 3. So, `x₁` and `x₃` are pivot variables.</li>
                <li><strong>Free Columns:</strong> 2 and 4. So, `x₂` and `x₄` are **free variables**.</li>
            </ul>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 3: Write the general solution to `Rx = 0`.</h4>
            <p className="text-sm">Let `x₂ = s` and `x₄ = t`, where `s` and `t` can be any real numbers.</p>
            <p className="text-sm mt-2">From Row 1: <InlineMath math="x₁ + 2x₂ + x₄ = 0 \implies x₁ = -2x₂ - x₄ = -2s - t" /></p>
            <p className="text-sm">From Row 2: <InlineMath math="x₃ + x₄ = 0 \implies x₃ = -x₄ = -t" /></p>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 4: Decompose the solution into a linear combination of vectors.</h4>
            <p className="text-sm text-muted-foreground">This is the magic step. We write our solution vector `x` and separate the parts for `s` and `t`.</p>
            <BlockMath math="x = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \end{bmatrix} = \begin{bmatrix} -2s - t \\ s \\ -t \\ t \end{bmatrix} = s \begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix} + t \begin{bmatrix} -1 \\ 0 \\ -1 \\ 1 \end{bmatrix}" />
            <p className="mt-2">Every vector `x` in the Null Space is a linear combination of these two specific vectors. These two vectors form a **basis for the Null Space of `A`**.</p>
             <p className="mt-2">The dimension of the Null Space (called the **nullity**) is 2, which is exactly the number of free variables we had.</p>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Meaning of the Null Space: Redundancy</CardTitle>
          <CardDescription>
            The Null Space is the precise mathematical description of **redundancy** in the columns of `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>A non-zero vector `x` in the Null Space means that `Ax = 0`, which is `x₁·(col 1) + x₂·(col 2) + ... = 0`. This is the very definition of **linear dependence** among the columns of `A`. The basis vectors we found for the Null Space give us the exact "recipes" for how the columns are dependent on each other.</p>
            <Alert>
              <AlertTitle>Example Decoded</AlertTitle>
              <AlertDescription>
                For our example, `s=1, t=0` gives the null space vector `x = [-2, 1, 0, 0]`. This means:<br/>
                <InlineMath math="-2 \cdot (\text{col 1}) + 1 \cdot (\text{col 2}) + 0 \cdot (\text{col 3}) + 0 \cdot (\text{col 4}) = 0" /><br/>
                This tells us that `col 2 = 2 * col 1`. The Null Space has revealed the specific redundancy between the columns.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        **Up Next:** We will complete the picture by introducing the **Row Space** and the **Left Null Space**, and see how all four fundamental subspaces fit together.
      </p>
    </div>
  );
}

