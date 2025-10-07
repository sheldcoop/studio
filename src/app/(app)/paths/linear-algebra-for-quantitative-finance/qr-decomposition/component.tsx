
'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlockMath, InlineMath } from 'react-katex';
import { ShieldCheck, Cpu, Code, Trophy, HardHat, SwissFranc } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { PyScriptRunner } from "@/components/app/pyscript-runner";

function PythonImplementation() {
    const pythonCode = `
import numpy as np
from scipy.linalg import solve_triangular
from pyscript import display

# --- Define the overdetermined system Ax = b ---
# A is non-square, so there is no exact solution. We find the best fit.
A = np.array([[1, 2], [0, 1], [1, 0]])
b = np.array([1, 3, 4])

# --- Step 1: Perform QR Decomposition (A = QR) ---
Q, R = np.linalg.qr(A)

# --- Step 2: Transform b using Q's transpose (y = Q^T * b) ---
# This changes the problem from Ax=b to the simpler Rx = y
y = Q.T @ b

# --- Step 3: Solve the simple upper-triangular system (Rx = y) ---
# This is fast and numerically stable.
x_solution = solve_triangular(R, y)

# --- Display the results ---
output_str = f"""
Input Matrix A:\\n{A}\\n
Input Vector b:\\n{b}\\n
------------------------------------
Step 1: QR Decomposition (A = QR)
------------------------------------
Orthogonal Matrix Q:\\n{np.round(Q, 4)}\\n
Upper-Triangular Matrix R:\\n{np.round(R, 4)}\\n
------------------------------------
Step 2: Transform b (y = Q^T * b)
------------------------------------
Transformed Vector y:\\n{np.round(y, 4)}\\n
------------------------------------
Step 3: Solve Rx = y
------------------------------------
Least-Squares Solution x:\\n{np.round(x_solution, 4)}
"""

display(output_str, target="output-qr-solver")
`;

    return (
        <PyScriptRunner
            code={pythonCode}
            outputId="output-qr-solver"
            title="Solving Least Squares with QR"
        />
    );
}


export default function QRDecompositionPage() {
  return (
    <>
      <PageHeader
        title="The Ultimate Guide to QR Decomposition"
        description="The robust and versatile 'Swiss Army knife' of matrix factorizations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SwissFranc className="text-primary"/> 1. The Intuition: The Perfect Perspective</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>Imagine you have a skewed and distorted photograph of a perfect grid. The grid lines are no longer perpendicular, and the squares are stretched into parallelograms. This distorted view is your matrix, <InlineMath math="A" />.</p>
            <p>Trying to solve problems in this distorted space is difficult and prone to error. What if you could rotate your camera to a new, "perfect" perspective from which the grid's structure becomes simple and clear?</p>
            <p>This is the essence of QR Decomposition. It breaks down any matrix <InlineMath math="A" /> into two special components:</p>
            <div className="text-center"><BlockMath math="A = QR" /></div>
            <ul className="text-sm">
                <li><strong>Q is an Orthogonal matrix.</strong> This represents the "perfect rotation." It's like finding the ideal camera angle. Multiplying by Q doesn't stretch or skew anything; it just rotates or reflects space.</li>
                <li><strong>R is an Upper Triangular matrix.</strong> This represents the simple, "straightened-out" version of your matrix as seen from that new perspective.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> 2. The Heroes of the Story: Meet Q and R</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
              <h4 className="font-semibold text-lg not-prose">Q: The Orthogonal Matrix (The Guardian of Stability)</h4>
              <p>A matrix Q is orthogonal if its columns are orthonormal: Each column vector has a length of 1, and all column vectors are mutually perpendicular. This gives Q a superpower: its inverse is simply its transpose (<InlineMath math="Q^{-1} = Q^T" />), making it trivial to "undo" the rotation and ensuring it never amplifies numerical errors.</p>
              
              <h4 className="font-semibold text-lg not-prose">R: The Upper Triangular Matrix (The Bringer of Simplicity)</h4>
              <p>Just like in LU decomposition, the R matrix represents a system that is incredibly easy to solve using backward substitution.</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HardHat className="text-primary"/> 3. The Process: Building a Better Basis (Gram-Schmidt)</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
             <p>The classic method to find Q is the Gram-Schmidt process, which takes the columns of <InlineMath math="A" /> and systematically "straightens them out" into the orthonormal vectors for <InlineMath math="Q" />. The <InlineMath math="R" /> matrix is a "logbook" of this process, storing the lengths and projection information calculated.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="text-primary"/> 4. The Mechanics: A Concrete Example</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>Let's decompose a non-square matrix, which is something LU can't do: <InlineMath math="A = \begin{pmatrix} 1 & 2 \\ 0 & 1 \\ 1 & 0 \end{pmatrix}" />. The columns are <InlineMath math="\mathbf{a_1} = [1, 0, 1]^T" /> and <InlineMath math="\mathbf{a_2} = [2, 1, 0]^T" />.</p>
            
            <h5 className="font-semibold not-prose">Step 1: Find the first column of Q (<InlineMath math="\mathbf{q_1}" />)</h5>
            <ul className="text-sm">
                <li>Normalize <InlineMath math="\mathbf{a_1}" />: The length is <InlineMath math="\|\mathbf{a_1}\| = \sqrt{1^2 + 0^2 + 1^2} = \sqrt{2}" />.</li>
                <li><BlockMath math="\mathbf{q_1} = \frac{\mathbf{a_1}}{\|\mathbf{a_1}\|} = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \approx \begin{pmatrix} 0.707 \\ 0 \\ 0.707 \end{pmatrix}" /></li>
            </ul>

            <h5 className="font-semibold not-prose">Step 2: Find the second column of Q (<InlineMath math="\mathbf{q_2}" />)</h5>
            <ul className="text-sm">
                <li>Project <InlineMath math="\mathbf{a_2}" /> onto <InlineMath math="\mathbf{q_1}" />: <InlineMath math="\text{proj} = (\mathbf{a_2} \cdot \mathbf{q_1})\mathbf{q_1} = (\frac{2}{\sqrt{2}})\mathbf{q_1} = \sqrt{2}\mathbf{q_1} = \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}" /></li>
                <li>Subtract the projection: <InlineMath math="\mathbf{a_2'} = \mathbf{a_2} - \text{proj} = \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix} - \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 1 \\ 1 \\ -1 \end{pmatrix}" /></li>
                <li>Normalize <InlineMath math="\mathbf{a_2'}" />: Length is <InlineMath math="\|\mathbf{a_2'}\| = \sqrt{1^2 + 1^2 + (-1)^2} = \sqrt{3}" />.</li>
                <li><BlockMath math="\mathbf{q_2} = \frac{\mathbf{a_2'}}{\|\mathbf{a_2'}\|} = \frac{1}{\sqrt{3}}\begin{pmatrix} 1 \\ 1 \\ -1 \end{pmatrix} \approx \begin{pmatrix} 0.577 \\ 0.577 \\ -0.577 \end{pmatrix}" /></li>
            </ul>
             <h5 className="font-semibold not-prose">The Result:</h5>
             <p>The resulting matrices are:</p>
            <BlockMath math="Q = \begin{pmatrix} 0.707 & 0.577 \\ 0 & 0.577 \\ 0.707 & -0.577 \end{pmatrix}, \quad R = \begin{pmatrix} \|\mathbf{a_1}\| & \mathbf{a_2} \cdot \mathbf{q_1} \\ 0 & \|\mathbf{a_2'}\| \end{pmatrix} = \begin{pmatrix} \sqrt{2} & \sqrt{2} \\ 0 & \sqrt{3} \end{pmatrix} \approx \begin{pmatrix} 1.414 & 1.414 \\ 0 & 1.732 \end{pmatrix}" />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> 5. The "Why": The Reigning Champ of Least Squares</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
                 <p>QR's stability and ability to handle non-square matrices make it the undisputed king for solving linear least squares problems. Substituting <InlineMath math="A=QR" /> into the overdetermined system <InlineMath math="A\mathbf{x}=\mathbf{b}" /> gives <InlineMath math="QR\mathbf{x}=\mathbf{b}" />. Multiplying by <InlineMath math="Q^T" /> (which is easy) gives <InlineMath math="R\mathbf{x}=Q^T\mathbf{b}" />, a simple upper-triangular system that is numerically stable to solve.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> 6. The Showdown: QR vs. The World</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Best For...</TableHead>
                            <TableHead>Key Advantage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell className="font-bold">QR Decomposition</TableCell><TableCell>Least-squares problems.</TableCell><TableCell>Robust and versatile.</TableCell></TableRow>
                        <TableRow><TableCell className="font-bold text-primary">LU (Pivoting)</TableCell><TableCell>Solving square systems Ax=b.</TableCell><TableCell>High-speed engine.</TableCell></TableRow>
                    </TableBody>
                </Table>
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
