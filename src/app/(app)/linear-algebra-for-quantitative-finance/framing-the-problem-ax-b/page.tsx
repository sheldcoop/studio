
import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { SideBySideComparison, ComparisonItem } from '@/components/app/side-by-side-comparison';
import { FormulaBlock } from '@/components/app/formula-block';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function FramingTheProblemPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Framing the Problem: Ax = b"
        description="The central character of our story."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome to the heart of linear algebra. Everything we have learned so far—every vector, every matrix, every concept of span and independence—has been preparation for this moment. We are about to tackle the single most important and practical problem in this entire field: solving a system of linear equations.
        </p>
        <p>
          This might sound like something you did in high school, and you'd be right. But we are going to look at it through our powerful new geometric lenses, and in doing so, we will unlock a depth you never imagined.
        </p>
         <p>Let's start with a simple system:</p>
        <FormulaBlock>
            <BlockMath math="\begin{cases} 2x - y = 1 \\ x + y = 5 \end{cases}" />
        </FormulaBlock>
        <p>Our goal is to find the values of `x` and `y` that make both of these equations true at the same time. The first, most crucial step is to translate this system into the language of linear algebra. We are going to separate it into its three essential components:</p>
         <ol className="list-decimal pl-6">
            <li>A matrix of the <strong>coefficients</strong> (`A`).</li>
            <li>A vector of the <strong>unknowns</strong> (`x`).</li>
            <li>A vector of the <strong>results</strong> (`b`).</li>
        </ol>
        <FormulaBlock>
            <BlockMath math="\underbrace{\begin{bmatrix} 2 & -1 \\ 1 & 1 \end{bmatrix}}_{A} \underbrace{\begin{bmatrix} x \\ y \end{bmatrix}}_{x} = \underbrace{\begin{bmatrix} 1 \\ 5 \end{bmatrix}}_{b}" />
        </FormulaBlock>
        <p>This gives us the compact, beautiful matrix equation: <InlineMath math="Ax = b" />. This equation is the central character of our story. Learning to solve it is our quest. To truly understand it, we need to view it from two different, equally important perspectives.</p>
      </article>

      <SideBySideComparison>
        <ComparisonItem title="View #1: The Row Picture (Intersection of Lines)">
          <p>
            The "Row Picture" is likely how you first learned about these problems. Each row in our matrix equation represents one of the original equations.
          </p>
          <BlockMath math="\begin{aligned} \begin{bmatrix} 2 & -1 \end{bmatrix} \cdot \begin{bmatrix} x \\ y \end{bmatrix} &= 1 \quad \rightarrow \quad 2x - y = 1 \\ \begin{bmatrix} 1 & 1 \end{bmatrix} \cdot \begin{bmatrix} x \\ y \end{bmatrix} &= 5 \quad \rightarrow \quad x + y = 5 \end{aligned}" />
          <p>What does an equation like <InlineMath math="2x - y = 1" /> represent geometrically? <strong>It's a line.</strong> And <InlineMath math="x + y = 5" /> is another line.</p>
          <p>Finding the solution <InlineMath math="(x, y)" /> that satisfies both equations means finding the single point in our 2D space where these <strong>two lines intersect</strong>.</p>
          <p>This is a perfectly valid way to think about the problem. If we had three equations with three unknowns (<InlineMath math="x, y, z" />), each equation would represent a plane in 3D space, and the solution would be the single point where all three planes intersect. The Row Picture is intuitive, but it gets very hard to visualize beyond three dimensions. More importantly, it doesn't use our powerful new concepts of vectors and span. For that, we need the second view.</p>
        </ComparisonItem>
        <ComparisonItem title="View #2: The Column Picture (Combination of Vectors)">
            <p>
            This is the perspective of a true linear algebraist. It is more abstract, but infinitely more powerful.
          </p>
          <p>Let's rewrite our <InlineMath math="Ax = b" /> equation by breaking down the matrix-vector multiplication:</p>
          <BlockMath math="x \cdot \text{Column 1 of A} + y \cdot \text{Column 2 of A} = b" />
          <BlockMath math="x \begin{bmatrix} 2 \\ 1 \end{bmatrix} + y \begin{bmatrix} -1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1 \\ 5 \end{bmatrix}" />
          <p>Look closely at that equation. It is a <strong>linear combination</strong> of the column vectors of `A`. The unknowns, `x` and `y`, are the <strong>scalars</strong>, the "weights" in our recipe.</p>
          <p className="font-semibold text-primary">The problem has been completely reframed. It now asks a beautiful, geometric question: Can we find the correct linear combination of the column vectors of `A` that produces the vector `b`?</p>
          <p>In other words: <strong>Is <InlineMath math="b" /> in the span of the columns of `A`?</strong></p>
          <p>By solving the system (you can check that the answer is <InlineMath math="x=2, y=3" />), we are proving that:</p>
          <BlockMath math="2 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + 3 \begin{bmatrix} -1 \\ 1 \end{bmatrix} = \begin{bmatrix} 4 \\ 2 \end{bmatrix} + \begin{bmatrix} -3 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 5 \end{bmatrix}" />
          <p>We found the recipe! We needed two parts of the first column and three parts of the second column to build our target vector `b`.</p>
        </ComparisonItem>
      </SideBySideComparison>

      <LessonSummaryCard title="Summary: The Two Views">
        <li><strong>Row Picture (Intersection):</strong> Each row is an equation for a line/plane. The solution is the point where they all intersect. Intuitive, but limited.</li>
        <li><strong>Column Picture (Combination):</strong> The columns of `A` are vectors. The solution is the set of scalar weights for the linear combination of those columns that produces the vector `b`. Powerful and generalizable.</li>
        <li className="list-none pt-2 font-semibold">Mastering the ability to switch between these two views is the sign of a mature understanding.</li>
      </LessonSummaryCard>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/gaussian-elimination">
        Gaussian Elimination
      </NextUpNavigation>
    </div>
  );
}
