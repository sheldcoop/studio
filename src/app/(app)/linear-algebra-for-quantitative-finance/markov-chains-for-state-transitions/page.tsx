
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function MarkovChainsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Markov Chains for State Transitions"
        description="The Mathematics of Change"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          So far in this module, our analysis has been largely static. We've looked at a snapshot of the market to calculate risk, optimize portfolios, and find relationships. But markets are not static; they are dynamic, constantly in motion.
        </p>
        <p>
          How do we model systems that <strong>change over time</strong>? How do we predict the future state of a system based on its current state?
        </p>
        <p>
          For this, we turn to a wonderfully elegant tool called a <strong>Markov Chain</strong>. It is a perfect marriage of probability theory and linear algebra, and it allows us to model everything from the weather, to a customer's journey, to the migration of credit ratings.
        </p>
      </article>

      <PageSection title="The Core Idea - Memoryless State Transitions">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Markov Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>A Markov Chain describes a system that can be in one of several <strong>states</strong>. The system transitions between these states in discrete time steps (e.g., every day, month, or year).</p>
                <p>The defining feature—the "Markov Property"—is that the probability of transitioning to any future state depends <strong>only on the current state</strong>, not on the sequence of events that preceded it. The system is "memoryless."</p>
                <h4 className="font-semibold text-primary mt-4">The Perfect Financial Example: Credit Rating Migrations</h4>
                <p>Let's model the credit quality of a universe of companies. We can define a few simple states a company can be in:</p>
                <ul className="list-disc pl-5">
                    <li>State 1: Investment Grade (IG)</li>
                    <li>State 2: High Yield (HY)</li>
                    <li>State 3: Defaulted (D)</li>
                </ul>
                <p>Each year, a company can either stay in its current state or transition to another. We can represent the probabilities of these transitions in a grid.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>From</TableHead>
                            <TableHead>To: IG</TableHead>
                            <TableHead>To: HY</TableHead>
                            <TableHead>To: D</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell className="font-bold">IG</TableCell><TableCell>90%</TableCell><TableCell>8%</TableCell><TableCell>2%</TableCell></TableRow>
                        <TableRow><TableCell className="font-bold">HY</TableCell><TableCell>5%</TableCell><TableCell>85%</TableCell><TableCell>10%</TableCell></TableRow>
                        <TableRow><TableCell className="font-bold">D</TableCell><TableCell>0%</TableCell><TableCell>0%</TableCell><TableCell>100%</TableCell></TableRow>
                    </TableBody>
                </Table>
                <p className="mt-2 text-sm text-muted-foreground">This grid tells us, for example, that an Investment Grade company has a 90% chance of staying IG next year, an 8% chance of being downgraded to High Yield, and a 2% chance of defaulting.</p>
                <p className="mt-2 text-sm text-muted-foreground">Notice that a Defaulted company stays defaulted with 100% probability. This is called an <strong>absorbing state</strong>.</p>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Linear Algebra Connection">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Transition Matrix</CardTitle>
                <CardDescription>We represent this grid of probabilities as a matrix, the Transition Matrix `P`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <BlockMath math="P = \begin{bmatrix} 0.90 & 0.08 & 0.02 \\ 0.05 & 0.85 & 0.10 \\ 0.00 & 0.00 & 1.00 \end{bmatrix}" />
                <p>This is a special kind of matrix called a **stochastic matrix**. Its two key properties are:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>All entries are non-negative.</li>
                    <li>The sum of each row is exactly 1.</li>
                </ol>
                <p>Now, let's represent the current state of our entire market with a **state vector `v`**. Let's say today, 80% of companies are IG, 15% are HY, and 5% have Defaulted.</p>
                <BlockMath math="v_0 = [0.80, 0.15, 0.05]" />
            </CardContent>
        </Card>
      </PageSection>
      
       <PageSection title="Predicting the Future - Matrix-Vector Multiplication">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">One Step at a Time</CardTitle>
                <CardDescription>To find the state one year from now, we multiply our current state vector by our transition matrix: `v₁ = v₀ * P`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Let's calculate the first component of `v₁` (the new % of IG firms):</p>
                <BlockMath math="\%IG_{new} = (0.80 \times 0.90) + (0.15 \times 0.05) + (0.05 \times 0.00) = 0.7275" />
                <p className="text-sm">This calculation tells a story: 90% of the original 80% of IG firms *stayed* IG (0.72), and 5% of the original 15% of HY firms were *upgraded* to IG (0.0075).</p>
                <p>When we complete the full matrix-vector multiplication, we get our new state vector:</p>
                <BlockMath math="v_1 = [0.7275, 0.1915, 0.0810]" />
                <p>After one year, we predict that 72.75% of firms will be IG, 19.15% will be HY, and 8.1% will be Defaulted.</p>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Long-Term Future - Matrix Powers & Eigenvectors">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Steady State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>What about two years? `v₂ = v₁ * P = (v₀ * P) * P = v₀ * P²`. The state after `n` steps is:</p>
                <BlockMath math="v_n = v_0 P^n" />
                <p>For many transition matrices, the system will converge to a **steady-state vector `v_ss`** such that it never leaves:</p>
                <BlockMath math="v_{ss} P = v_{ss}" />
                <p>This is the eigenvector equation `Ax = λx`! The steady-state vector is the **left eigenvector** of `P` corresponding to an **eigenvalue of λ = 1**.</p>
                <p>For any regular stochastic matrix, a unique eigenvalue of 1 is guaranteed, and its corresponding eigenvector (when normalized) is the long-term equilibrium state of the system.</p>
            </CardContent>
        </Card>
      </PageSection>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/fixed-income-bond-mathematics">
        Fixed Income (Bond) Mathematics
      </NextUpNavigation>
    </div>
  );
}
