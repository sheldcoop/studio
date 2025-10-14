
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ExampleStep } from '@/components/app/example-step';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

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
          <CardTitle>The Algorithm in Action: Step-by-Step</CardTitle>
          <CardDescription>We'll solve our system using an <strong>augmented matrix</strong> to keep our work clean. The goal is to get the left side into an upper triangular form, called <strong>row echelon form</strong>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <ExampleStep stepNumber={1} title="Start with the Augmented Matrix">
                <p>The first non-zero entry in the first row is our <strong>pivot</strong>. We will use this pivot (the 2) to eliminate all the entries below it.</p>
                <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{2} & 1 & 1 & 5 \\ 4 & -6 & 0 & -2 \\ -2 & 7 & 2 & 9 \end{array}\right]" />
            </ExampleStep>
            <ExampleStep stepNumber={2} title="Eliminate below the first pivot">
                <p>Operation 1: <InlineMath math="R_2 \rightarrow R_2 - 2 \cdot R_1" />.</p>
                <p>Operation 2: <InlineMath math="R_3 \rightarrow R_3 + R_1" />.</p>
                <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & \mathbf{-8} & -2 & -12 \\ 0 & 8 & 3 & 14 \end{array}\right]" />
            </ExampleStep>
            <ExampleStep stepNumber={3} title="Eliminate below the second pivot">
                <p>We move to the next pivot (the -8) and eliminate everything below it.</p>
                <p>Operation: <InlineMath math="R_3 \rightarrow R_3 + R_2" />.</p>
                <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & -8 & -2 & -12 \\ 0 & 0 & \mathbf{1} & 2 \end{array}\right]" />
                <p>We have achieved row echelon form!</p>
            </ExampleStep>
            <ExampleStep stepNumber={4} title="The Payoff: Back Substitution">
                <p>Now we translate this matrix back into equations and solve from the bottom up:</p>
                <BlockMath math="\begin{cases} 2x + y + z = 5 \\ \quad -8y - 2z = -12 \\ \quad \quad \quad z = 2 \end{cases}" />
                <ol className="list-decimal pl-6 space-y-2 mt-4 text-sm">
                    <li>We know <InlineMath math="z = 2" />.</li>
                    <li>Plug into row 2: <InlineMath math="-8y - 2(2) = -12 \Rightarrow y = 1" />.</li>
                    <li>Plug into row 1: <InlineMath math="2x + (1) + (2) = 5 \Rightarrow x = 1" />.</li>
                </ol>
                <p className="mt-4 font-semibold">The solution is <InlineMath math="x=1, y=1, z=2" />. Our solution vector is <InlineMath math="x = [1, 1, 2]" />.</p>
            </ExampleStep>
        </CardContent>
      </Card>

       <LessonSummaryCard title="Summary: The Universal Solver">
            <li><strong>Setup:</strong> Write the system as an <strong>augmented matrix</strong>.</li>
            <li><strong>Goal:</strong> Use <strong>row operations</strong> to transform the matrix into <strong>row echelon form</strong> (upper triangular).</li>
            <li><strong>Strategy:</strong> Use the <strong>pivot</strong> in each row to eliminate the entries below it, column by column.</li>
            <li><strong>Solve:</strong> Use <strong>back substitution</strong> on the simplified system.</li>
       </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-solutions-to-ax-b">
        The Solutions to Ax = b
      </NextUpNavigation>
    </div>
  );
}
