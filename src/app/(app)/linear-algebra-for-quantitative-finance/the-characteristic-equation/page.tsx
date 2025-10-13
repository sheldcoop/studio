
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function CharacteristicEquationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Characteristic Equation"
        description="The algorithm for finding eigenvalues and eigenvectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we developed a deep, intuitive understanding of what eigenvalues and eigenvectors are. We established that they are the key to unlocking the soul of a matrix. We concluded with the master formula, the <strong>characteristic equation</strong>, which is the key to finding them:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <BlockMath math="\det(A - \lambda I) = 0" />
        </div>
        <p>
          Today, we get our hands dirty. We will use this equation to build a step-by-step algorithm for finding the eigenvalues and eigenvectors of any square matrix.
        </p>
        <p className="font-semibold">The process is a two-act play:</p>
         <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Act I: Find the Eigenvalues.</strong> We solve the characteristic equation for all possible values of `λ`.</li>
            <li><strong>Act II: Find the Eigenvectors.</strong> For each eigenvalue `λ` we found, we plug it back into `(A - λI)v = 0` and find the basis for the null space to get the corresponding eigenvector(s) `v`.</li>
        </ol>
      </article>
      
      <Card>
          <CardHeader>
              <CardTitle>The Matrix of the Day</CardTitle>
              <CardDescription>Let's find the eigenvalues and eigenvectors of this matrix `A`:</CardDescription>
          </CardHeader>
          <CardContent>
            <BlockMath math="A = \begin{bmatrix} 3 & -1 \\ 2 & 0 \end{bmatrix}" />
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Act I: Find the Eigenvalues (λ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h4 className="font-semibold">Step 1: Set up the matrix `(A - λI)`.</h4>
                <p className="text-sm text-muted-foreground mb-2">This means we subtract `λ` from every diagonal entry of `A`.</p>
                <BlockMath math="A - \lambda I = \begin{bmatrix} 3 & -1 \\ 2 & 0 \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 3-\lambda & -1 \\ 2 & -\lambda \end{bmatrix}" />
            </div>
             <div className="border-t pt-4">
                <h4 className="font-semibold">Step 2: Calculate the determinant of `(A - λI)`.</h4>
                 <p className="text-sm text-muted-foreground mb-2">This resulting polynomial in `λ` is called the **characteristic polynomial**.</p>
                <BlockMath math="\det(A - \lambda I) = (3 - \lambda)(-\lambda) - (-1)(2) = -3\lambda + \lambda^2 + 2 = \lambda^2 - 3\lambda + 2" />
            </div>
             <div className="border-t pt-4">
                <h4 className="font-semibold">Step 3: Set the characteristic polynomial to zero and solve for `λ`.</h4>
                <BlockMath math="\lambda^2 - 3\lambda + 2 = 0" />
                <p className="mt-2">This is a simple quadratic equation. We can factor it:</p>
                <BlockMath math="(\lambda - 1)(\lambda - 2) = 0" />
                 <p className="mt-4 font-semibold text-primary">The solutions are `λ₁ = 1` and `λ₂ = 2`. These are our eigenvalues!</p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Act II: Find the Eigenvectors (v)</CardTitle>
          <CardDescription>We must do this for each eigenvalue separately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="border-b pb-8">
                <h3 className="font-semibold text-lg text-primary mb-4">Case 1: Finding the eigenvector for `λ₁ = 1`</h3>
                <h4 className="font-medium mb-2">Step 1: Plug `λ = 1` into the matrix `(A - λI)`.</h4>
                <BlockMath math="(A - 1I) = \begin{bmatrix} 3-1 & -1 \\ 2 & 0-1 \end{bmatrix} = \begin{bmatrix} 2 & -1 \\ 2 & -1 \end{bmatrix}" />
                <h4 className="font-medium mt-4 mb-2">Step 2: Solve the system `(A - I)v = 0` by finding the null space.</h4>
                <BlockMath math="\begin{bmatrix} 2 & -1 \\ 2 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}" />
                <p className="mt-2">This translates to the equation `2x - y = 0`, which means `y = 2x`.</p>
                <h4 className="font-medium mt-4 mb-2">Step 3: Write the solution in vector form.</h4>
                <BlockMath math="v = \begin{bmatrix} x \\ 2x \end{bmatrix} = x \begin{bmatrix} 1 \\ 2 \end{bmatrix}" />
                <p className="mt-2 font-semibold">The basis vector for this null space, `v₁ = [1, 2]`, is our first eigenvector.</p>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-primary mb-4">Case 2: Finding the eigenvector for `λ₂ = 2`</h3>
                <h4 className="font-medium mb-2">Step 1: Plug `λ = 2` into `(A - λI)`.</h4>
                <BlockMath math="(A - 2I) = \begin{bmatrix} 3-2 & -1 \\ 2 & 0-2 \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix}" />
                <h4 className="font-medium mt-4 mb-2">Step 2: Solve the system `(A - 2I)v = 0`.</h4>
                 <BlockMath math="\begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}" />
                <p className="mt-2">This gives the equation `x - y = 0`, which means `x = y`.</p>
                <h4 className="font-medium mt-4 mb-2">Step 3: Write the solution in vector form.</h4>
                <BlockMath math="v = \begin{bmatrix} x \\ x \end{bmatrix} = x \begin{bmatrix} 1 \\ 1 \end{bmatrix}" />
                <p className="mt-2 font-semibold">The basis vector for this null space, `v₂ = [1, 1]`, is our second eigenvector.</p>
            </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Summary: The Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
            <ol className="list-decimal pl-6 space-y-4">
                <li>
                    <strong>Find Eigenvalues (`λ`):</strong>
                    <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                        <li>Construct the matrix `A - λI`.</li>
                        <li>Compute its determinant to get the characteristic polynomial: `det(A - λI)`.</li>
                        <li>Set the polynomial to zero and solve for `λ`. The roots are your eigenvalues.</li>
                    </ol>
                </li>
                 <li>
                    <strong>Find Eigenvectors (`v`):</strong>
                    <ol className="list-alpha pl-6 mt-2 space-y-1 text-sm">
                        <li>For **each** eigenvalue `λ`, plug it back into `A - λI`.</li>
                        <li>Find the basis for the **null space** of this new matrix by solving `(A - λI)v = 0`.</li>
                        <li>The basis vectors you find are the eigenvectors for that `λ`.</li>
                    </ol>
                </li>
            </ol>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> Now that we know how to find these fundamental components, we will explore the magical process of **Diagonalization**.
      </p>
    </div>
  );
}
