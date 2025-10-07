
'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlockMath, InlineMath } from 'react-katex';
import { Trophy, ShieldCheck, Cpu, Code, Zap, HeartPulse } from 'lucide-react';


export default function CholeskyDecompositionPage() {
  return (
    <>
      <PageHeader
        title="The Ultimate Guide to Cholesky Decomposition"
        description="The elegant 'matrix square root' for specialized, high-speed applications."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="text-primary"/> 1. The Intuition: The Matrix Square Root</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>If LU Decomposition is like factoring a number into two general components (like <InlineMath math="12 = 3 \times 4" />), Cholesky Decomposition is like finding the square root of a perfect square (like <InlineMath math="25 = 5 \times 5" />).</p>
            <p>It's a specialized, more elegant, and much faster method for a special class of matrices. Cholesky decomposition factors a matrix <InlineMath math="A" /> into the product of a lower triangular matrix <InlineMath math="L" /> and its own transpose, <InlineMath math="L^T" />.</p>
            <div className="text-center"><BlockMath math="A = LL^T" /></div>
            <p>This is beautiful. We only need to find <em>one</em> matrix, <InlineMath math="L" />. This symmetry is what makes Cholesky so powerful and efficient. It's the cleanest possible way to decompose a matrix.</p>
            <p>But this power comes with a condition. You can only use this method on matrices that are <strong>Symmetric and Positive Definite</strong>.</p>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> 2. The Prerequisites: The VIP Club of Matrices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
              <p>To qualify for Cholesky decomposition, a matrix <InlineMath math="A" /> must have two properties:</p>
              <h4 className="font-semibold text-lg not-prose">1. It must be Symmetric.</h4>
              <p>This is easy to check. The matrix must be a mirror image of itself across its main diagonal. In other words, <InlineMath math="A = A^T" />.</p>
              <div className="text-center"><BlockMath math="A = \begin{pmatrix} \mathbf{4} & 2 & -2 \\ 2 & \mathbf{10} & 2 \\ -2 & 2 & \mathbf{6} \end{pmatrix} \quad \text{is symmetric.}" /></div>
              <h4 className="font-semibold text-lg not-prose">2. It must be Positive Definite.</h4>
              <p>Intuitively, this means the matrix represents a system that is "stable" and has a single minimum point. For a covariance matrix, it means all variances are positive. The formal check is that all its eigenvalues must be positive.</p>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="text-primary"/> 3. The Mechanics: A Concrete 3x3 Example</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>Let's decompose our symmetric positive definite matrix from before: <InlineMath math="A = \begin{pmatrix} 4 & 2 & -2 \\ 2 & 10 & 2 \\ -2 & 2 & 6 \end{pmatrix}" />. We want to find <InlineMath math="L = \begin{pmatrix} l_{11} & 0 & 0 \\ l_{21} & l_{22} & 0 \\ l_{31} & l_{32} & l_{33} \end{pmatrix}" />.</p>
            
            <h5 className="font-semibold not-prose">Step 1: First Column of L</h5>
            <ul className="text-sm">
                <li><InlineMath math="l_{11} = \sqrt{a_{11}} = \sqrt{4} = \mathbf{2}" /></li>
                <li><InlineMath math="l_{21} = \frac{a_{21}}{l_{11}} = \frac{2}{2} = \mathbf{1}" /></li>
                <li><InlineMath math="l_{31} = \frac{a_{31}}{l_{11}} = \frac{-2}{2} = \mathbf{-1}" /></li>
            </ul>

            <h5 className="font-semibold not-prose">Step 2: Second Column of L</h5>
            <ul className="text-sm">
                <li><InlineMath math="l_{22} = \sqrt{a_{22} - l_{21}^2} = \sqrt{10 - 1^2} = \sqrt{9} = \mathbf{3}" /></li>
                <li><InlineMath math="l_{32} = \frac{a_{32} - l_{31}l_{21}}{l_{22}} = \frac{2 - (-1)(1)}{3} = \frac{3}{3} = \mathbf{1}" /></li>
            </ul>

            <h5 className="font-semibold not-prose">Step 3: Third Column of L</h5>
            <ul className="text-sm">
                <li><InlineMath math="l_{33} = \sqrt{a_{33} - (l_{31}^2 + l_{32}^2)} = \sqrt{6 - ((-1)^2 + 1^2)} = \sqrt{6 - 2} = \sqrt{4} = \mathbf{2}" /></li>
            </ul>

            <p>We are done! Our lower triangular matrix is:</p>
            <div className="text-center"><BlockMath math="L = \begin{pmatrix} 2 & 0 & 0 \\ 1 & 3 & 0 \\ -1 & 1 & 2 \end{pmatrix}" /></div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="text-primary"/> 4. The "Why": Applications of the Specialist</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
                <p>Cholesky decomposition is the go-to method whenever you're dealing with symmetric positive definite matrices.</p>
                <h5 className="font-semibold not-prose">Statistics & Machine Learning</h5>
                <p>This is the killer app. **Covariance matrices** are always symmetric positive definite. Cholesky is used to efficiently generate correlated random variables for simulations or to solve for the parameters in Gaussian Processes.</p>
                <h5 className="font-semibold not-prose">Quantitative Finance</h5>
                <p>For Monte Carlo simulations of financial markets, asset prices are correlated. Cholesky is used to decompose the covariance matrix of these assets to simulate their paths realistically.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> 5. The Showdown: Cholesky vs. LU</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="prose prose-invert max-w-none text-foreground/90 mb-4">This isn't a fair fight; it's a specialist versus a generalist.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Feature</TableHead>
                            <TableHead>Cholesky</TableHead>
                            <TableHead>LU (with Pivoting)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">Requirements</TableCell>
                            <TableCell className="font-bold text-green-400">Symmetric Positive Definite</TableCell>
                            <TableCell>Any square, invertible matrix</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Speed</TableCell>
                            <TableCell className="font-bold text-green-400">Blazing Fast (Roughly 2x LU)</TableCell>
                            <TableCell>Fast (The general standard)</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-semibold">Stability</TableCell>
                            <TableCell className="font-bold text-green-400">Perfectly Stable (No Pivoting)</TableCell>
                            <TableCell>Requires pivoting for stability</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-semibold">Memory</TableCell>
                            <TableCell className="font-bold text-green-400">Efficient (Stores only L)</TableCell>
                            <TableCell>Stores both L and U</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-semibold">Verdict</TableCell>
                            <TableCell className="font-bold text-green-400">Always use if matrix qualifies.</TableCell>
                            <TableCell>The reliable generalist.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> 6. Making It Real: Python Implementation</CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center">
                <p className="text-muted-foreground">Python implementation coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
