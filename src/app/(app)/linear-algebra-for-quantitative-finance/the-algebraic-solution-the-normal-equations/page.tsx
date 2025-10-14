
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function NormalEquationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Algebraic Solution: The Normal Equations"
        description="Putting the geometry of projections to work with a concrete, step-by-step recipe."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we achieved a major theoretical breakthrough. We used the geometry of projections to derive a formula that solves the unsolvable. We discovered that the "best" approximate solution <InlineMath math="\hat{x}" /> to an inconsistent system <InlineMath math="Ax=b" /> can be found by solving a new, consistent system called the <strong>Normal Equations</strong>:
        </p>
         <FormulaBlock>
             <BlockMath math="A^TA\hat{x} = A^Tb" />
        </FormulaBlock>
        <p>
          Today, we take this beautiful equation out of the world of theory and put it to work. We will use it as a step-by-step recipe to solve a real-world linear regression problem. This is the fundamental algorithm for fitting lines and curves to data.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Problem: Fitting a Line to Data</CardTitle>
          <CardDescription>
            Let's return to our simple scientist's experiment. We have three data points <InlineMath math="(x, y)" /> that don't lie perfectly on a line, and we want to find the "line of best fit," <InlineMath math="y = mx + c" />.
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
           <p className="mt-4">Our goal is to find the optimal values for the slope <InlineMath math="m" /> and the y-intercept <InlineMath math="c" />. These are our unknowns.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Recipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <ExampleStep stepNumber={1} title="Set up the (Unsolvable) System `Ax = b`">
                <p>First, we must translate our problem into the language of linear algebra. Our unknown vector is what we're solving for: <InlineMath math="x = [m, c]^T" />.</p>
                <p className="mt-2">We write one equation for each data point:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><InlineMath math="m(1) + c(1) = 1" /></li>
                    <li><InlineMath math="m(2) + c(1) = 3" /></li>
                    <li><InlineMath math="m(3) + c(1) = 2" /></li>
                </ul>
                <p className="mt-4">From this, we construct our matrix <InlineMath math="A" /> and vector <InlineMath math="b" />:</p>
                <BlockMath math="A = \begin{bmatrix} 1 & 1 \\ 2 & 1 \\ 3 & 1 \end{bmatrix}, \quad x = \begin{bmatrix} m \\ c \end{bmatrix}, \quad b = \begin{bmatrix} 1 \\ 3 \\ 2 \end{bmatrix}" />
                <p className="mt-2">Our system is <InlineMath math="Ax = b" />. As we know, there is no exact solution. <InlineMath math="b" /> is not in the column space of <InlineMath math="A" />.</p>
            </ExampleStep>
            
            <ExampleStep stepNumber={2} title="Assemble the Pieces of the Normal Equations">
                <h4 className="font-semibold">First, compute <InlineMath math="A^TA" />:</h4>
                <BlockMath math="A^TA = \begin{bmatrix} 1 & 2 & 3 \\ 1 & 1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 2 & 1 \\ 3 & 1 \end{bmatrix} = \begin{bmatrix} 14 & 6 \\ 6 & 3 \end{bmatrix}" />
                <p className="text-sm text-muted-foreground">Notice that <InlineMath math="A^TA" /> is symmetric, which is always true.</p>
                
                <h4 className="font-semibold mt-4">Next, compute <InlineMath math="A^Tb" />:</h4>
                <BlockMath math="A^Tb = \begin{bmatrix} 1 & 2 & 3 \\ 1 & 1 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 3 \\ 2 \end{bmatrix} = \begin{bmatrix} 1(1) + 2(3) + 3(2) \\ 1(1) + 1(3) + 1(2) \end{bmatrix} = \begin{bmatrix} 13 \\ 6 \end{bmatrix}" />
            </ExampleStep>

            <ExampleStep stepNumber={3} title="Solve the Normal Equations for `x̂`">
                <p>We now have a clean, solvable system: <InlineMath math="(A^TA)\hat{x} = A^Tb" />.</p>
                <BlockMath math="\begin{bmatrix} 14 & 6 \\ 6 & 3 \end{bmatrix} \begin{bmatrix} m \\ c \end{bmatrix} = \begin{bmatrix} 13 \\ 6 \end{bmatrix}" />
                <p className="mt-4">This is a standard 2x2 system. We can solve it via elimination or substitution. The augmented matrix is:</p>
                <BlockMath math="\left[ \begin{array}{cc|c} 14 & 6 & 13 \\ 6 & 3 & 6 \end{array} \right]" />
                <p>Simplify Row 2 by dividing by 3: <InlineMath math="\left[ \begin{array}{cc|c} 14 & 6 & 13 \\ 2 & 1 & 2 \end{array} \right]" /></p>
                <p>From Row 2, we have <InlineMath math="2m + c = 2" />, so <InlineMath math="c = 2 - 2m" />. Substitute into Row 1:</p>
                <p><InlineMath math="14m + 6(2 - 2m) = 13 \implies 14m + 12 - 12m = 13 \implies 2m = 1 \implies m = 0.5" /></p>
                <p>Now find <InlineMath math="c" />: <InlineMath math="c = 2 - 2(0.5) = 1" /></p>
                <p className="font-semibold text-primary mt-2">The solution is <InlineMath math="\hat{x} = \begin{bmatrix} m \\ c \end{bmatrix} = \begin{bmatrix} 0.5 \\ 1 \end{bmatrix}" />.</p>
            </ExampleStep>

            <ExampleStep stepNumber={4} title="Interpret the Result">
                <p>The values <InlineMath math="m=0.5" /> and <InlineMath math="c=1" /> define the line of best fit for our data. The equation is:</p>
                <FormulaBlock>
                    <BlockMath math="y = 0.5x + 1" />
                </FormulaBlock>
                <p>This is the line that minimizes the sum of the squared vertical distances from our data points to the line.</p>
            </ExampleStep>
        </CardContent>
      </Card>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-problem-with-the-normal-equations">
        The Problem with the Normal Equations
      </NextUpNavigation>
    </div>
  );
}
