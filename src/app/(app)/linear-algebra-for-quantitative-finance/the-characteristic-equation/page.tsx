
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

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
        <FormulaBlock>
            <BlockMath math="\det(A - \lambda I) = 0" />
        </FormulaBlock>
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
            <FormulaBlock>
                <BlockMath math="A = \begin{bmatrix} 3 & -1 \\ 2 & 0 \end{bmatrix}" />
            </FormulaBlock>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Act I: Find the Eigenvalues (λ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <ExampleStep stepNumber={1} title="Set up the matrix `(A - λI)`">
                <p className="text-sm text-muted-foreground mb-2">This means we subtract `λ` from every diagonal entry of `A`.</p>
                <BlockMath math="A - \lambda I = \begin{bmatrix} 3 & -1 \\ 2 & 0 \end{bmatrix} - \lambda \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 3-\lambda & -1 \\ 2 & -\lambda \end{bmatrix}" />
            </ExampleStep>
             <ExampleStep stepNumber={2} title="Calculate the determinant of `(A - λI)`">
                 <p className="text-sm text-muted-foreground mb-2">This resulting polynomial in `λ` is called the <strong>characteristic polynomial</strong>.</p>
                <BlockMath math="\det(A - \lambda I) = (3 - \lambda)(-\lambda) - (-1)(2) = -3\lambda + \lambda^2 + 2 = \lambda^2 - 3\lambda + 2" />
            </ExampleStep>
             <ExampleStep stepNumber={3} title="Set the characteristic polynomial to zero and solve for `λ`">
                <BlockMath math="\lambda^2 - 3\lambda + 2 = 0" />
                <p className="mt-2">This is a simple quadratic equation. We can factor it:</p>
                <BlockMath math="(\lambda - 1)(\lambda - 2) = 0" />
                 <p className="mt-4 font-semibold text-primary">The solutions are `λ₁ = 1` and `λ₂ = 2`. These are our eigenvalues!</p>
            </ExampleStep>
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
                <ExampleStep stepNumber={1} title="Plug `λ = 1` into the matrix `(A - λI)`">
                    <BlockMath math="(A - 1I) = \begin{bmatrix} 3-1 & -1 \\ 2 & 0-1 \end{bmatrix} = \begin{bmatrix} 2 & -1 \\ 2 & -1 \end{bmatrix}" />
                </ExampleStep>
                <ExampleStep stepNumber={2} title="Solve the system `(A - I)v = 0` by finding the null space">
                    <BlockMath math="\begin{bmatrix} 2 & -1 \\ 2 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}" />
                    <p className="mt-2">This translates to the equation `2x - y = 0`, which means `y = 2x`.</p>
                </ExampleStep>
                <ExampleStep stepNumber={3} title="Write the solution in vector form">
                    <BlockMath math="v = \begin{bmatrix} x \\ 2x \end{bmatrix} = x \begin{bmatrix} 1 \\ 2 \end{bmatrix}" />
                    <p className="mt-2 font-semibold">The basis vector for this null space, `v₁ = [1, 2]`, is our first eigenvector.</p>
                </ExampleStep>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-primary my-4">Case 2: Finding the eigenvector for `λ₂ = 2`</h3>
                <ExampleStep stepNumber={1} title="Plug `λ = 2` into `(A - λI)`">
                    <BlockMath math="(A - 2I) = \begin{bmatrix} 3-2 & -1 \\ 2 & 0-2 \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix}" />
                </ExampleStep>
                <ExampleStep stepNumber={2} title="Solve the system `(A - 2I)v = 0`">
                    <BlockMath math="\begin{bmatrix} 1 & -1 \\ 2 & -2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}" />
                    <p className="mt-2">This gives the equation `x - y = 0`, which means `x = y`.</p>
                </ExampleStep>
                <ExampleStep stepNumber={3} title="Write the solution in vector form">
                    <BlockMath math="v = \begin{bmatrix} x \\ x \end{bmatrix} = x \begin{bmatrix} 1 \\ 1 \end{bmatrix}" />
                    <p className="mt-2 font-semibold">The basis vector for this null space, `v₂ = [1, 1]`, is our second eigenvector.</p>
                </ExampleStep>
            </div>
        </CardContent>
      </Card>
      
       <LessonSummaryCard title="Summary: The Algorithm">
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
                    <li>For <strong>each</strong> eigenvalue `λ`, plug it back into `A - λI`.</li>
                    <li>Find the basis for the <strong>null space</strong> of this new matrix by solving `(A - λI)v = 0`.</li>
                    <li>The basis vectors you find are the eigenvectors for that `λ`.</li>
                </ol>
            </li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/diagonalization-pdp-1">
        Diagonalization
      </NextUpNavigation>
    </div>
  );
}
