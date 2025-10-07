'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlockMath, InlineMath } from 'react-katex';
import { Scaling, Cpu, Link as LinkIcon, AlertTriangle, Code, Trophy, Bot } from 'lucide-react';
import 'katex/dist/katex.min.css';

function TheIntuition() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <h4 className="font-bold text-lg not-prose">The Problem: A Tangled Mess</h4>
      <p>Imagine a system of linear equations, <InlineMath math="A\mathbf{x} = \mathbf{b}" />. Visually, think of this as a tangled web of strings. Each equation is a string, and the variables (<InlineMath math="x_1, x_2, x_3" />) are points where the strings are knotted together. The matrix A describes the complexity of this tangle. Your job is to find the exact position of each knot (<InlineMath math="\mathbf{x}" />) so that the whole system balances perfectly (<InlineMath math="\mathbf{b}" />).</p>
      <p>Pulling on one string affects all the others. Solving this directly is like trying to untangle all the knots at once. It's confusing and hard to keep track of.</p>
      
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

function TheProcess() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
        <h4 className="font-bold text-lg not-prose">The Two-Step Journey</h4>
        <p>By replacing A with LU, our hard problem <InlineMath math="A\mathbf{x} = \mathbf{b}" /> becomes the simpler <InlineMath math="LU\mathbf{x} = \mathbf{b}" />. We can now solve this by introducing an intermediate vector <InlineMath math="\mathbf{y}" />:</p>
        
        <h5 className="font-semibold text-base mt-4">Step 1: Solve <InlineMath math="L\mathbf{y} = \mathbf{b}" /> for <InlineMath math="\mathbf{y}" /> (Forward Substitution)</h5>
        <p>A lower triangular system is like a domino rally. The first equation gives you <InlineMath math="y_1" /> directly. You use that to solve for <InlineMath math="y_2" /> in the second equation, and so on.</p>
        <div className="text-center"><BlockMath math="\begin{pmatrix} 1 & 0 & 0 \\ l_{21} & 1 & 0 \\ l_{31} & l_{32} & 1 \end{pmatrix} \begin{pmatrix} y_1 \\ y_2 \\ y_3 \end{pmatrix} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}" /></div>
        
        <h5 className="font-semibold text-base mt-6">Step 2: Solve <InlineMath math="U\mathbf{x} = \mathbf{y}" /> for <InlineMath math="\mathbf{x}" /> (Backward Substitution)</h5>
        <p>Now that you have <InlineMath math="\mathbf{y}" />, you can solve for your original goal, <InlineMath math="\mathbf{x}" />. An upper triangular system is like climbing down a ladder. You solve for <InlineMath math="x_3" /> in the last equation first, then use that to find <InlineMath math="x_2" /> in the equation above it, and so on.</p>
        <div className="text-center"><BlockMath math="\begin{pmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{pmatrix} \begin{pmatrix} x_1 \\ x_2 \\ x_3 \end{pmatrix} = \begin{pmatrix} y_1 \\ y_2 \\ y_3 \end{pmatrix}" /></div>
        <p>We've successfully untangled the mess by breaking it into two simple tasks without ever facing the complicated matrix A directly!</p>
    </div>
  );
}

function TheMechanics() {
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
            <p><strong>Goal:</strong> Zero out the entries below the main diagonal.</p>
            
            <p className="mt-4"><strong>Action 1: Eliminate the first column.</strong></p>
            <ul className="text-sm">
                <li>R₂ → R₂ - <strong className="text-red-400">2</strong> * R₁. The multiplier is 2. We store this in <InlineMath math="l_{21}" />.</li>
                <li>R₃ → R₃ - <strong className="text-red-400">1</strong> * R₁. The multiplier is 1. We store this in <InlineMath math="l_{31}" />.</li>
            </ul>
            <p>The matrix becomes <InlineMath math="A'" /> and our logbook L begins to form:</p>
            <div className="text-center">
              <BlockMath math="A' = \begin{pmatrix} 2 & 1 & 1 \\ 0 & 3 & 0 \\ 0 & -3 & -1 \end{pmatrix} \quad L = \begin{pmatrix} 1 & 0 & 0 \\ \mathbf{2} & 1 & 0 \\ \mathbf{1} & ? & 1 \end{pmatrix}" />
            </div>

            <p className="mt-4"><strong>Action 2: Eliminate the second column.</strong></p>
             <ul className="text-sm">
                <li>R₃ → R₃ - (<strong className="text-red-400">-1</strong>) * R₂. The multiplier is -1. We store this in <InlineMath math="l_{32}" />.</li>
            </ul>
            <p>The matrix is now in upper triangular form. This is our U. Our completed logbook is L.</p>
            <div className="text-center">
              <BlockMath math="U = \begin{pmatrix} 2 & 1 & 1 \\ 0 & 3 & 0 \\ 0 & 0 & -1 \end{pmatrix} \quad L = \begin{pmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 1 & \mathbf{-1} & 1 \end{pmatrix}" />
            </div>
            <p>You can verify that multiplying <InlineMath math="L \times U" /> gives you back the original matrix <InlineMath math="A" />.</p>
        </div>
    );
}

function TheRealWorld() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
             <p>In a perfect world, the method above always works. In reality, we face a major danger: dividing by zero or a very small number.</p>
            <p>If a pivot element (an entry on the diagonal we use for elimination) is zero, the algorithm fails. If it's tiny, rounding errors can be amplified catastrophically, giving you a completely wrong answer.</p>
            
            <h5 className="font-semibold text-base mt-6">The Solution: Partial Pivoting</h5>
            <p>Before each elimination step, we look down the current column and find the row with the largest absolute value. We then swap this row with the current pivot row. This ensures we always divide by the largest, most stable number possible.</p>
            <p>This process introduces a third matrix, the <strong>Permutation Matrix (P)</strong>, which is just an identity matrix that has recorded all our row swaps. The true, robust form of the decomposition is:</p>
            <div className="text-center"><BlockMath math="PA = LU" /></div>
            <p>All modern software uses this version. It's fast, accurate, and reliable.</p>
        </div>
    );
}

function TheWhy() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
             <p>LU decomposition is a computational workhorse. Its key advantage is efficiency: once you've done the expensive decomposition of <InlineMath math="A" />, you can solve for many different vectors <InlineMath math="\mathbf{b}" /> very cheaply.</p>
             <h5 className="font-semibold text-base mt-6">Quantitative Finance</h5>
             <p>Used in numerical methods to solve the partial differential equations (like Black-Scholes) that price financial derivatives.</p>
             <h5 className="font-semibold text-base mt-6">Machine Learning</h5>
             <p>A fundamental building block for solving systems that appear in Gaussian Processes and optimization algorithms like Newton's method. While Cholesky is often preferred for symmetric matrices, LU is the general-purpose solver.</p>
        </div>
    );
}

function TheCompetition() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Best For...</TableHead>
                    <TableHead>Key Advantage</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-bold text-primary">LU (Pivoting)</TableCell>
                    <TableCell>General square systems Ax=b, especially with multiple b's.</TableCell>
                    <TableCell>Speed and Reusability. The workhorse.</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-bold">Cholesky</TableCell>
                    <TableCell>Symmetric, positive-definite matrices (e.g., covariance matrices).</TableCell>
                    <TableCell>Twice as fast as LU and perfectly stable without pivoting.</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-bold">QR</TableCell>
                    <TableCell>Overdetermined systems (least-squares regression), non-square matrices.</TableCell>
                    <TableCell>Superior numerical stability. The most robust choice.</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-bold">SVD</TableCell>
                    <TableCell>Analyzing a matrix's properties (rank, condition number), PCA.</TableCell>
                    <TableCell>The most powerful and insightful, but also the slowest.</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

function PythonImplementation() {
    const code = `import numpy as np
from scipy.linalg import lu, lu_solve, lu_factor

# Define our matrix A and vector b
A = np.array([[2, 1, 1], [4, 5, 2], [2, -2, 0]])
b = np.array([5, 15, -2])

# 1. Decompose A into P, L, and U
# (P is the permutation matrix from pivoting)
P, L, U = lu(A)

# 2. Solve the system for x
# This is equivalent to the two-step process:
# Step 1: Solve Ly = Pb for y (forward substitution)
# Step 2: Solve Ux = y for x (backward substitution)
x = lu_solve((L, U), np.dot(P.T, b))

# For performance, when solving for the same A many times:
lu_piv = lu_factor(A)
x_fast = lu_solve(lu_piv, b)

print("Solution x:", x)
# Expected Output: [1. 2. 1.]`;
    return (
        <pre className="language-python rounded-lg bg-gray-900/50 text-sm overflow-x-auto"><code className="language-python">{code}</code></pre>
    );
}


export default function LUDecompositionPage() {
  return (
    <>
      <PageHeader
        title="The Ultimate Guide to LU Decomposition"
        description="Factoring a complex problem into two simple ones."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> 1. The Intuition: Taming Complexity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TheIntuition />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon className="text-primary"/> 2. The Process: The Two-Step Journey</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <TheProcess />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="text-primary"/> 3. The Mechanics: A Concrete 3x3 Example</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TheMechanics />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-primary"/> 4. The Real World: Pivoting and Numerical Stability</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <TheRealWorld />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> 5. The "Why": Applications Across Disciplines</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <TheWhy />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> 6. The Competition: LU vs. Other Decompositions</CardTitle>
            </CardHeader>
            <CardContent>
                <TheCompetition />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> 7. Making It Real: Python Implementation</CardTitle>
            </CardHeader>
            <CardContent>
                <PythonImplementation />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
