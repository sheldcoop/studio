
'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BlockMath, InlineMath } from 'react-katex';
import { Scaling, Cpu, Link as LinkIcon } from 'lucide-react';
import 'katex/dist/katex.min.css';

function LUDecompositionTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <h4 className="font-bold text-lg not-prose">The Problem: A Tangled Mess</h4>
      <p>Imagine a system of linear equations, <InlineMath math="A\mathbf{x} = \mathbf{b}" />. Visually, think of this as a tangled web of strings. Each equation is a string, and the variables (<InlineMath math="x_1, x_2, x_3" />) are points where the strings are knotted together. The matrix A describes the complexity of this tangle. Your job is to find the exact position of each knot (<InlineMath math="\mathbf{x}" />) so that the whole system balances perfectly (<InlineMath math="\mathbf{b}" />).</p>
      <p>Pulling on one string affects all the others. Solving this directly is like trying to untangle all the knots at once. It's confusing, messy, and hard to keep track of.</p>
      
      <hr/>

      <h4 className="font-bold text-lg not-prose">The "Aha!" Moment: A Clever Shortcut</h4>
      <p>What if, instead of tackling the messy tangle <strong className="text-primary">A</strong> head-on, we could find a secret path? This is the entire spirit of LU Decomposition. We're going to replace our one, complicated problem with two incredibly simple steps by factoring <strong className="text-primary">A</strong> into:</p>
      <div className="text-center"><BlockMath math="A = LU" /></div>
      <ul className="text-sm">
        <li><strong className="text-primary">L</strong> is a <strong>Lower triangular matrix</strong>.</li>
        <li><strong className="text-primary">U</strong> is an <strong>Upper triangular matrix</strong>.</li>
      </ul>
      <p>These matrices are special because they represent a "one-way" tangle, making them trivial to solve.</p>
    </div>
  );
}

function LUDecompositionProcess() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
        <h4 className="font-bold text-lg not-prose">The Two-Step Journey</h4>
        <p>By replacing A with LU, our hard problem <InlineMath math="A\mathbf{x} = \mathbf{b}" /> becomes the simpler <InlineMath math="LU\mathbf{x} = \mathbf{b}" />. We can now solve this by introducing a helper variable <InlineMath math="\mathbf{y}" />:</p>
        
        <h5 className="font-semibold text-base mt-4">Step 1: Solve <InlineMath math="L\mathbf{y} = \mathbf{b}" /> for <InlineMath math="\mathbf{y}" /></h5>
        <p>A lower triangular system is like a domino rally. The first equation gives you <InlineMath math="y_1" /> directly. You use that to solve for <InlineMath math="y_2" /> in the second equation, and so on. This is called <strong>Forward Substitution</strong>.</p>
        <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 0 & 0 \\ l_{21} & 1 & 0 \\ l_{31} & l_{32} & 1 \end{pmatrix} \begin{pmatrix} y_1 \\ y_2 \\ y_3 \end{pmatrix} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}" /></div>
        
        <h5 className="font-semibold text-base mt-6">Step 2: Solve <InlineMath math="U\mathbf{x} = \mathbf{y}" /> for <InlineMath math="\mathbf{x}" /></h5>
        <p>Now that you have <InlineMath math="\mathbf{y}" />, you can solve for your original goal, <InlineMath math="\mathbf{x}" />. An upper triangular system is like climbing down a ladder. You solve for <InlineMath math="x_3" /> in the last equation first, then use that to find <InlineMath math="x_2" /> in the equation above it, and so on. This is called <strong>Backward Substitution</strong>.</p>
        <div className="text-center"><BlockMath math="\begin{pmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{pmatrix} \begin{pmatrix} x_1 \\ x_2 \\ x_3 \end{pmatrix} = \begin{pmatrix} y_1 \\ y_2 \\ y_3 \end{pmatrix}" /></div>
        <p>We've successfully untangled the mess by breaking it into two simple, sequential tasks. We never had to face the complicated matrix A directly!</p>
    </div>
  );
}

function LUDecompositionExample() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>The matrices L and U aren't magic. They are the natural result of the step-by-step process you already know: <strong>Gaussian Elimination</strong>.</p>
            <ul className="text-sm">
                <li>The <strong className="text-primary">U</strong> matrix is simply the end result of your elimination—the neat, upper-triangular form you work so hard to get.</li>
                <li>The <strong className="text-primary">L</strong> matrix is a "logbook" of your journey. Every time you perform an operation like "subtract 3 times Row 1 from Row 2," the L matrix neatly stores that multiplier 3 in the right place.</li>
            </ul>
            <hr/>
            <h4 className="font-bold text-lg not-prose">A Concrete 3x3 Example</h4>
            <p>Let's decompose the matrix <InlineMath math="A" />:</p>
            <div className="text-center"><BlockMath math="A = \begin{pmatrix} 2 & 1 & 1 \\ 4 & 5 & 2 \\ 2 & -2 & 0 \end{pmatrix}" /></div>
            <p><strong>Goal:</strong> Get A into an upper triangular form U using elimination. We'll store the multipliers in L.</p>
            
            <p className="mt-4"><strong>Step 1: Eliminate the first column below the pivot.</strong></p>
            <ul className="text-sm">
                <li>(Row 2) → (Row 2) - <strong className="text-red-400">2</strong> * (Row 1). The multiplier is 2. We store this in <InlineMath math="l_{21}" />.</li>
                <li>(Row 3) → (Row 3) - <strong className="text-red-400">1</strong> * (Row 1). The multiplier is 1. We store this in <InlineMath math="l_{31}" />.</li>
            </ul>
            <p>This gives us an intermediate matrix and our L matrix starting to form:</p>
            <div className="text-center">
              <BlockMath math="A' = \begin{pmatrix} 2 & 1 & 1 \\ 0 & 3 & 0 \\ 0 & -3 & -1 \end{pmatrix} \quad L = \begin{pmatrix} 1 & 0 & 0 \\ \mathbf{2} & 1 & 0 \\ \mathbf{1} & ? & 1 \end{pmatrix}" />
            </div>

            <p className="mt-4"><strong>Step 2: Eliminate the second column below the pivot.</strong></p>
             <ul className="text-sm">
                <li>(Row 3) → (Row 3) - (<strong className="text-red-400">-1</strong>) * (Row 2). The multiplier is -1. We store this in <InlineMath math="l_{32}" />.</li>
            </ul>
            <p>We are done! Our final U matrix is the result, and our L matrix is complete.</p>
            <div className="text-center">
              <BlockMath math="U = \begin{pmatrix} 2 & 1 & 1 \\ 0 & 3 & 0 \\ 0 & 0 & -1 \end{pmatrix} \quad L = \begin{pmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 1 & \mathbf{-1} & 1 \end{pmatrix}" />
            </div>
            <p>You can verify that multiplying L and U together will give you the original matrix A.</p>
        </div>
    );
}

export default function LUDecompositionPage() {
  return (
    <>
      <PageHeader
        title="LU Decomposition: A Tale of Two Steps"
        description="Factoring a complex problem into two simple ones."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> The Intuition</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LUDecompositionTheory />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon className="text-primary"/> The Process</CardTitle>
                <CardDescription>From <InlineMath math="Ax=b" /> to <InlineMath math="Ly=b" /> and <InlineMath math="Ux=y" /></CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <LUDecompositionProcess />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="text-primary"/> The Mechanics: Gaussian Elimination</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LUDecompositionExample />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

