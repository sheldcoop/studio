
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function InexactProblemPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Inexact Problem: Why Ax=b Often Has No Solution"
        description="Welcome to the messy, noisy, but far more realistic world of data."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome to Module 5. We are now stepping out of the clean, theoretical world of perfect mathematical systems and into the messy, noisy, but far more realistic world of <strong>data</strong>.
        </p>
        <p>
          In our journey so far, when we solved `Ax=b`, we implicitly assumed that a perfect solution existed. But in almost every practical application—from economics to machine learning, from engineering to biology—the single most common answer to the question &quot;Does `Ax=b` have a solution?&quot; is a resounding <strong>NO</strong>.
        </p>
        <p>
          Today, we will understand <strong>why</strong> this is the case, what it means, and how it forces us to redefine our entire concept of a &quot;solution.&quot;
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Reality of Data: Overdetermined Systems</CardTitle>
          <CardDescription>
            Imagine you are a scientist trying to find a linear relationship, `y = mx + c`, between two variables. You run an experiment and collect some data points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>x (Temperature)</TableHead>
                <TableHead>y (Pressure)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>1</TableCell><TableCell>1</TableCell></TableRow>
              <TableRow><TableCell>2</TableCell><TableCell>3</TableCell></TableRow>
              <TableRow><TableCell>3</TableCell><TableCell>2</TableCell></TableRow>
            </TableBody>
          </Table>
          <p className="mt-4">Each data point gives us one equation:</p>
          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
            <li>For (1, 1): <InlineMath math="m(1) + c = 1" /></li>
            <li>For (2, 3): <InlineMath math="m(2) + c = 3" /></li>
            <li>For (3, 2): <InlineMath math="m(3) + c = 2" /></li>
          </ul>
          <p className="mt-4">Let&apos;s write this in our familiar `Ax=b` form. Our unknowns are `m` and `c`, so our unknown vector is `x = [m, c]ᵀ`.</p>
          <BlockMath math="\underbrace{\begin{bmatrix} 1 & 1 \\ 2 & 1 \\ 3 & 1 \end{bmatrix}}_{A} \underbrace{\begin{bmatrix} m \\ c \end{bmatrix}}_{x} = \underbrace{\begin{bmatrix} 1 \\ 3 \\ 2 \end{bmatrix}}_{b}" />
          <p className="mt-4">
            Notice the dimensions. `A` is a `3x2` matrix. We have <strong>3 equations</strong> but only <strong>2 unknowns</strong>. This is an <strong>overdetermined system</strong>. We have more constraints (data points) than we have degrees of freedom (parameters). Unless your data is perfectly, miraculously linear (which real data never is), it&apos;s impossible for all three lines to intersect at a single point.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The New Goal: Get as Close as Possible</CardTitle>
          <CardDescription>If `Ax=b` has no solution, we must change our goal. We now seek an `x` that makes `Ax` as <strong>close</strong> to `b` as possible.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>We define the <strong>error vector</strong> `e` as the difference between what we <strong>want</strong> (`b`) and what we <strong>get</strong> (`Ax`).</p>
            <BlockMath math="e = b - Ax" />
            <p className="mt-4">The official goal of <strong>Least Squares</strong> is to find the special vector `x̂` (&quot;x-hat&quot;) that minimizes the squared length of the error vector:</p>
             <div className="rounded-lg border bg-muted/50 p-4 text-center mt-2">
                <BlockMath math="\text{Find } \hat{x} \text{ that minimizes } \|b - Ax\|^2" />
            </div>
            <p className="mt-4">This `x̂` is our <strong>best approximate solution</strong>. For our problem, it will give us the line of best fit.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">The Geometric Insight: Projection</CardTitle>
            <CardDescription>The key to solving this lies in the Column Picture.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>An exact solution exists only if `b` is in the <strong>Column Space of A</strong>. When there's no solution, it means `b` is <strong>outside</strong> of `C(A)`. In our example, `C(A)` is a plane in 3D space, and `b` is a point not on that plane.</p>
            <p className="mt-4">The closest point to `b` within the Column Space is its <strong>orthogonal projection</strong> onto that subspace. Let&apos;s call this projection vector `p`.</p>
            <p className="mt-4 font-semibold text-primary">The new, solvable quest is: Find `x̂` such that `Ax̂ = p`.</p>
            <p className="mt-2">The error vector `e = b - p` will be <strong>orthogonal</strong> to the Column Space, a crucial fact we will use to find the solution.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Summary: A New Mindset</CardTitle></CardHeader>
        <CardContent className="space-y-2">
           <ol className="list-decimal pl-5 space-y-2">
                <li><strong>The Reality:</strong> Most real-world systems are <strong>overdetermined</strong> and have no exact solution.</li>
                <li><strong>The New Goal:</strong> Find the <strong>least-squares solution `x̂`</strong> that minimizes the error `||b - Ax||²`.</li>
                <li><strong>The Geometry:</strong> This is equivalent to finding the <strong>orthogonal projection `p`</strong> of `b` onto the Column Space of `A` and solving `Ax̂ = p`.</li>
           </ol>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We will develop the formula for <strong>projections</strong>, learning how to find the &quot;shadow&quot; a vector casts onto a line and, more generally, onto any subspace.
      </p>
    </div>
  );
}
