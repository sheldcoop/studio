
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function GaussianEliminationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Gaussian Elimination"
        description="The Master Algorithm"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've framed our central problem, <InlineMath math="Ax = b" />. We understand it from both the row and column perspectives. Now, we need a systematic, foolproof method for finding the solution vector <InlineMath math="x" />. That method is <strong>Gaussian Elimination</strong>.
        </p>
        <p>
          This isn't about clever tricks or lucky guesses. This is an algorithm—a step-by-step mechanical process that will work on any system of linear equations, no matter how large. It is the computational backbone of linear algebra. The goal of Gaussian Elimination is simple: <strong>to make an intimidating system of equations progressively easier until the solution is obvious.</strong>
        </p>
        <p>We do this by transforming our system into an <strong>upper triangular</strong> form. An upper triangular system is one where all the coefficients below the main diagonal are zero. Why? Because it's incredibly easy to solve.</p>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Intimidating System</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockMath math="\begin{cases} 2x + y + z = 5 \\ 4x - 6y = -2 \\ -2x + 7y + 2z = 9 \end{cases}" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Easy (Upper Triangular) System</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockMath math="\begin{cases} 2x + y + z = 5 \\ \quad -8y - 2z = -12 \\ \quad \quad \quad z = 2 \end{cases}" />
          </CardContent>
        </Card>
      </div>
      <p className="prose prose-invert max-w-none">Look at that second system. You can see the solution just by looking at it! If <InlineMath math="z=2" />, you can plug that into the second equation to find <InlineMath math="y" />, and then plug both <InlineMath math="y" /> and <InlineMath math="z" /> into the first equation to find <InlineMath math="x" />. This easy, final step is called <strong>back substitution</strong>.</p>
      

      <Card>
        <CardHeader>
          <CardTitle>The Tools: Elementary Row Operations</CardTitle>
          <CardDescription>The algorithm works by applying a set of three simple, "legal" moves called elementary row operations. These moves are guaranteed not to change the underlying solution of the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Swapping:</strong> You can swap any two rows. (This is like reordering your equations).</li>
            <li><strong>Scaling:</strong> You can multiply any row by a non-zero constant. (This is like multiplying both sides of an equation by a number).</li>
            <li><strong>Replacement:</strong> You can replace one row by adding to it a multiple of another row. (This is the workhorse of elimination).</li>
          </ol>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>The Augmented Matrix: A More Compact Notation</CardTitle>
           <CardDescription>Writing out the <InlineMath math="x, y, z" /> variables at every step is tedious. To make our work cleaner and more suitable for computers, we use a shorthand called an <strong>augmented matrix</strong>.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4">We simply take the coefficient matrix <InlineMath math="A" /> and the result vector <InlineMath math="b" /> and combine them, separated by a vertical line.</p>
            <div className="flex items-center justify-center gap-4">
                 <BlockMath math="\begin{cases} 2x + y + z = 5 \\ 4x - 6y = -2 \\ -2x + 7y + 2z = 9 \end{cases}" />
                 <span className="text-2xl font-mono">→</span>
                 <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 4 & -6 & 0 & -2 \\ -2 & 7 & 2 & 9 \end{array}\right]" />
            </div>
             <p className="mt-4">Our goal is to use the row operations to turn the left side of this matrix into an upper triangular form.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Algorithm in Action: Step-by-Step</CardTitle>
          <CardDescription>Let's solve our system. Our strategy is to eliminate coefficients column by column, from top to bottom.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold">Our Starting Matrix:</h4>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 4 & -6 & 0 & -2 \\ -2 & 7 & 2 & 9 \end{array}\right]" />
             <p>The first non-zero entry in the first row is called the <strong>pivot</strong>. Here, our first pivot is the `2` in the top-left corner. We will use this pivot to eliminate all the entries below it in the first column.</p>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 1: Eliminate the `4` in Row 2.</h4>
            <p>Operation: <InlineMath math="R_2 \rightarrow R_2 - 2 \cdot R_1" />.</p>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & -8 & -2 & -12 \\ -2 & 7 & 2 & 9 \end{array}\right]" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 2: Eliminate the `-2` in Row 3.</h4>
            <p>Operation: <InlineMath math="R_3 \rightarrow R_3 + R_1" />.</p>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & -8 & -2 & -12 \\ 0 & 8 & 3 & 14 \end{array}\right]" />
          </div>
           <div className="border-t pt-4">
            <h4 className="font-semibold">Step 3: Eliminate the `8` in Row 3.</h4>
             <p>We have cleared the first column. Now we move to the next pivot, the `-8` in Row 2, and use it to eliminate everything below it.</p>
            <p>Operation: <InlineMath math="R_3 \rightarrow R_3 + R_2" />.</p>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & -8 & -2 & -12 \\ 0 & 0 & 1 & 2 \end{array}\right]" />
             <p>Our final matrix is in <strong>row echelon form</strong>. The left side is upper triangular. We have achieved our goal.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>The Payoff: Back Substitution</CardTitle></CardHeader>
        <CardContent>
            <p>Now we translate this matrix back into equations and solve from the bottom up:</p>
            <BlockMath math="\begin{cases} 2x + y + z = 5 \\ \quad -8y - 2z = -12 \\ \quad \quad \quad z = 2 \end{cases}" />
            <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>We know <InlineMath math="z = 2" />.</li>
                <li>Plug <InlineMath math="z=2" /> into the second equation: <InlineMath math="-8y - 2(2) = -12 \Rightarrow -8y = -8 \Rightarrow y = 1" />.</li>
                <li>Plug <InlineMath math="y=1" /> and <InlineMath math="z=2" /> into the first equation: <InlineMath math="2x + (1) + (2) = 5 \Rightarrow 2x = 2 \Rightarrow x = 1" />.</li>
            </ol>
            <p className="mt-4 font-semibold">The solution is <InlineMath math="x=1, y=1, z=2" />. Our solution vector is <InlineMath math="x = [1, 1, 2]" />. We have conquered the system.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader><CardTitle>Summary: The Universal Solver</CardTitle></CardHeader>
        <CardContent>
             <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Setup:</strong> Write the system as an <strong>augmented matrix</strong>.</li>
                <li><strong>Goal:</strong> Use <strong>row operations</strong> to transform the matrix into <strong>row echelon form</strong> (upper triangular).</li>
                <li><strong>Strategy:</strong> Use the <strong>pivot</strong> in each row to eliminate the entries below it, column by column.</li>
                <li><strong>Solve:</strong> Use <strong>back substitution</strong> on the simplified system.</li>
            </ol>
            <p className="mt-4">This process will always work, and it lays the groundwork for understanding the deep structure of matrices, which we'll explore in the coming lessons.</p>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> What happens when things don't go so smoothly? We will use Gaussian Elimination to analyze systems that have **no solution** or **infinitely many solutions**, and understand what these outcomes mean both algebraically and geometrically.
      </p>

    </div>
  );
}

