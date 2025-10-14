
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function EigenApplicationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Applications of Eigen-analysis"
        description="Markov Chains & Dynamic Systems"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've developed the complete theory of eigenvalues and eigenvectors (<InlineMath math="Av=\lambda v" />) and the powerful computational tool of diagonalization (<InlineMath math="A = PDP^{-1}" />).
        </p>
        <p>
          Now, we put it to work. The true power of eigen-analysis is in understanding systems that <strong>evolve over time</strong>. These are called <strong>dynamic systems</strong>. We will explore one of the most famous and useful examples: <strong>Markov Chains</strong>.
        </p>
      </article>

      <PageSection title="What is a Dynamic System?">
          <p className="prose prose-invert max-w-none">A dynamic system is any system that changes from one state to another over discrete time steps according to a fixed rule. If that rule is a linear transformation, we can model it with a matrix.</p>
          <p className="prose prose-invert max-w-none">Let <InlineMath math="x_k" /> be the state of a system at time step <InlineMath math="k" />. The state at the next time step, <InlineMath math="x_{k+1}" />, is given by:</p>
          <FormulaBlock>
            <BlockMath math="x_{k+1} = A x_k" />
          </FormulaBlock>
          <ul className="list-disc pl-5 text-sm space-y-1 prose prose-invert max-w-none">
            <li><InlineMath math="x_0" /> is our initial state.</li>
            <li><InlineMath math="x_1 = A x_0" /></li>
            <li><InlineMath math="x_2 = A x_1 = A (A x_0) = A^2 x_0" /></li>
            <li>In general: <InlineMath math="x_k = A^k x_0" /></li>
          </ul>
          <p className="prose prose-invert max-w-none">The state of the system at any future time <InlineMath math="k" /> is determined by the <InlineMath math="k" />-th power of the transformation matrix <InlineMath math="A" /> applied to the initial state <InlineMath math="x_0" />.</p>
      </PageSection>

      <PageSection title="Application: Markov Chains">
        <p className="prose prose-invert max-w-none">
            A Markov Chain is a specific type of dynamic system used to model probabilities. It describes the movement of something between a finite number of states.
        </p>
        <Card>
            <CardHeader>
                <CardTitle>The Rules of a Markov Matrix (or Transition Matrix)</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li>All entries are between 0 and 1 (they represent probabilities).</li>
                    <li>The entries in each <strong>column</strong> sum to 1 (the total probability of moving from a given state must be 100%).</li>
                </ol>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Example: A Simple Market Model</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mt-2">Imagine a city where people choose between two streaming services, "StreamFlix" and "ConnectPlus." Each month, some people switch.</p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                    <li>StreamFlix keeps 90% of its customers, and 10% switch to ConnectPlus.</li>
                    <li>ConnectPlus keeps 80% of its customers, and 20% switch to StreamFlix.</li>
                </ul>
                <p className="text-sm mt-2">We model this with a transition matrix <InlineMath math="A" />:</p>
                <BlockMath math="A = \begin{bmatrix} 0.9 & 0.2 \\ 0.1 & 0.8 \end{bmatrix}" />
                <p className="text-sm mt-2">Let <InlineMath math="x_0 = [0.6, 0.4]^T" /> be the initial market share. After one month:</p>
                <BlockMath math="x_1 = A x_0 = \begin{bmatrix} 0.9 & 0.2 \\ 0.1 & 0.8 \end{bmatrix} \begin{bmatrix} 0.6 \\ 0.4 \end{bmatrix} = \begin{bmatrix} 0.62 \\ 0.38 \end{bmatrix}" />
                <p className="text-sm mt-2">StreamFlix will have 62% and ConnectPlus will have 38%.</p>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Big Question: What Happens in the Long Run?">
           <p className="prose prose-invert max-w-none">The <strong>steady state</strong> of this system is the eigenvector corresponding to the eigenvalue <InlineMath math="\lambda = 1" />.</p>
           <p className="prose prose-invert max-w-none">We need to find the eigenvector for <InlineMath math="\lambda=1" /> by solving <InlineMath math="(A - I)v = 0" />.</p>
           <BlockMath math="A - I = \begin{bmatrix} 0.9-1 & 0.2 \\ 0.1 & 0.8-1 \end{bmatrix} = \begin{bmatrix} -0.1 & 0.2 \\ 0.1 & -0.2 \end{bmatrix}" />
           <p className="prose prose-invert max-w-none">This gives the equation <InlineMath math="-0.1s + 0.2c = 0" />, which simplifies to <InlineMath math="s = 2c" />. The eigenvector is of the form <InlineMath math="[2c, c]" />. We can choose `c=1`, giving a basis vector <InlineMath math="v_1 = [2, 1]" />.</p>
           <p className="prose prose-invert max-w-none">To make this a probability vector (components sum to 1), we normalize it:</p>
           <FormulaBlock>
             <BlockMath math="x_{ss} = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix} \approx \begin{bmatrix} 0.667 \\ 0.333 \end{bmatrix}" />
           </FormulaBlock>
           <p className="prose prose-invert max-w-none font-semibold">Conclusion: The market will stabilize with StreamFlix holding 2/3 of the market and ConnectPlus holding 1/3, regardless of the initial state.</p>
      </PageSection>
      
      <LessonSummaryCard title="Summary: Eigen-analysis in Action">
            <li>Dynamic systems <InlineMath math="x_{k+1} = Ax_k" /> can be understood by analyzing the matrix `A`.</li>
            <li>Diagonalization (<InlineMath math="A^k = PD^kP^{-1}" />) is key to computing long-term states.</li>
            <li>Markov Chains model probabilistic state changes.</li>
            <li>The <strong>steady state</strong> of a Markov chain is the eigenvector for the eigenvalue <InlineMath math="\lambda = 1" />.</li>
            <li>Other eigenvalues with magnitude less than 1 determine the rate of convergence to the steady state.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-spectral-theorem">
        The Spectral Theorem
      </NextUpNavigation>
    </div>
  );
}
