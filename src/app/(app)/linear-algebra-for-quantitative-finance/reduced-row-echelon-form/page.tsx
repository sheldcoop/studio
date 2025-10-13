
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle } from 'lucide-react';

export default function RREFPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Reduced Row Echelon Form (RREF)"
        description="The Ultimate Answer Sheet"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our previous lessons, we learned to use Gaussian Elimination to transform a matrix into <strong>Row Echelon Form (REF)</strong>. This gave us an upper-triangular system that was easy to solve using back-substitution.
        </p>
        <p>
          REF is powerful, but it's not the final destination. It gives us a system that is easy for a human to solve. But what if we wanted a form so simple that the answers are just... there, with no substitution required?
        </p>
        <p>
          This is the purpose of <strong>Reduced Row Echelon Form (RREF)</strong>. It's the cleanest, most unique form of a matrix, and it acts as the ultimate answer sheet for a linear system.
        </p>
      </article>

       <Card>
        <CardHeader>
            <CardTitle>From REF to RREF: The Extra Steps</CardTitle>
        </CardHeader>
        <CardContent>
            <p>To be in Reduced Row Echelon Form, a matrix must first be in Row Echelon Form. Then, it must satisfy two additional, stricter conditions:</p>
            <ol className="list-decimal pl-6 mt-4 space-y-4 font-semibold">
                <li>
                    Every pivot entry must be <strong>1</strong>.
                    <p className="font-normal text-muted-foreground mt-1">We achieve this by scaling each pivot row. For example, if a row is `[0, 2, 4 | 6]`, we would divide the entire row by 2 to make the pivot a 1, resulting in `[0, 1, 2 | 3]`.</p>
                </li>
                 <li>
                    Every entry <strong>above</strong> each pivot must be <strong>0</strong>.
                    <p className="font-normal text-muted-foreground mt-1">This is the "upwards" elimination phase. After clearing everything below the pivots (Gaussian Elimination), we go back and clear everything above them, starting from the rightmost pivot and working our way left.</p>
                </li>
            </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Example: The Full Journey</CardTitle>
          <CardDescription>Let's take our simple, unique-solution system from a previous lesson and take it all the way to RREF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold">Starting Augmented Matrix:</h4>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 4 & -6 & 0 & -2 \\ -2 & 7 & 2 & 9 \end{array}\right]" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 1: Achieve Row Echelon Form (REF)</h4>
            <p className="text-sm text-muted-foreground mb-2">This is standard Gaussian Elimination, clearing entries below the pivots.</p>
            <BlockMath math="\left[\begin{array}{ccc|c} 2 & 1 & 1 & 5 \\ 0 & -8 & -2 & -12 \\ 0 & 0 & 1 & 2 \end{array}\right]" />
          </div>
           <div className="border-t pt-4">
            <h4 className="font-semibold">Step 2: Scale all pivots to 1</h4>
             <p className="text-sm text-muted-foreground mb-2">We divide each row by its pivot value.</p>
             <ul className="list-disc text-sm pl-5 space-y-1">
                <li>R1 &rarr; R1 / 2</li>
                <li>R2 &rarr; R2 / -8</li>
                <li>R3 &rarr; R3 / 1 (no change)</li>
             </ul>
            <BlockMath math="\left[\begin{array}{ccc|c} 1 & 0.5 & 0.5 & 2.5 \\ 0 & 1 & 0.25 & 1.5 \\ 0 & 0 & 1 & 2 \end{array}\right]" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 3: Eliminate entries ABOVE the pivots</h4>
             <p className="text-sm text-muted-foreground mb-2">This is "upwards" elimination, starting from the rightmost pivot.</p>
             <p className="text-sm mb-2">Our rightmost pivot is the `1` in R3, C3. We use it to clear the `0.25` and `0.5` above it.</p>
             <ul className="list-disc text-sm pl-5 space-y-1">
                <li>R2 &rarr; R2 - 0.25 * R3 gives `[0, 1, 0 | 1]`</li>
                <li>R1 &rarr; R1 - 0.5 * R3 gives `[1, 0.5, 0 | 1.5]`</li>
             </ul>
              <p className="text-sm text-muted-foreground my-2">Matrix is now:</p>
             <BlockMath math="\left[\begin{array}{ccc|c} 1 & 0.5 & 0 & 1.5 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 2 \end{array}\right]" />
             <p className="text-sm my-2">Now use the next pivot (the `1` in R2, C2) to clear the `0.5` above it.</p>
             <ul className="list-disc text-sm pl-5 space-y-1">
                <li>R1 &rarr; R1 - 0.5 * R2 gives `[1, 0, 0 | 1]`</li>
             </ul>
          </div>
           <Alert variant="default" className="border-green-500/50">
               <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertTitle>Final RREF Matrix:</AlertTitle>
                <AlertDescription>
                    <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{1} & 0 & 0 & \mathbf{1} \\ 0 & \mathbf{1} & 0 & \mathbf{1} \\ 0 & 0 & \mathbf{1} & \mathbf{2} \end{array}\right]" />
                    <p>Notice the identity matrix on the left. The solution is now directly readable on the right: x=1, y=1, z=2. No back-substitution needed!</p>
                </AlertDescription>
           </Alert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Why is RREF So Important?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Uniqueness:</strong> Every matrix has one and only one unique Reduced Row Echelon Form. This makes RREF a definitive "fingerprint" for a matrix. Two different-looking matrices that have the same RREF are, in a deep sense, the same.</li>
                <li><strong>Readability:</strong> As we saw, for systems with a unique solution, the RREF gives you the answer directly. For systems with infinite solutions, it makes the relationship between pivot and free variables exceptionally clear.</li>
                <li><strong>Theoretical Power:</strong> RREF is the ultimate tool for understanding a matrix's fundamental properties. It tells you the rank, the basis for the column space, and the basis for the null space, all in one neat package.</li>
            </ul>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We will learn how to "store" the process of elimination in matrices themselves, leading to the elegant and computationally vital **LU Decomposition**.
      </p>

    </div>
  );
}
