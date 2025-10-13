
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Diamond, Star, Infinity as InfinityIcon } from 'lucide-react';

export default function SolutionsToAxBPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Solutions to Ax = b"
        description="One, None, or Infinite?"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we celebrated the power of Gaussian Elimination. We saw it as a perfect machine that takes a complex system and hands us a single, unique solution. That was a wonderful, clean example—a world where every problem has one perfect answer.
        </p>
        <p>
          Today, we step into the real world.
        </p>
        <p>
          The true genius of Gaussian Elimination is not just that it finds answers, but that it is a powerful <strong>diagnostic tool</strong>. It tells us the *nature* of our system. It reveals whether our problem has that one perfect answer, or if it's a problem with no answer at all, or a problem with an entire family of answers.
        </p>
        <p>There are only three possibilities for any system <InlineMath math="Ax=b" />. Let’s become detectives and learn to identify the clues for each one.</p>
      </article>

       <Card>
        <CardHeader>
            <CardTitle>The Clues: Pivots and Contradictions</CardTitle>
        </CardHeader>
        <CardContent>
            <p>The entire story is told by the <strong>pivots</strong>—the first non-zero entry in each row after you've reached row echelon form. Everything hinges on two questions:</p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
                <li>Do we encounter a mathematical <strong>contradiction</strong> during elimination?</li>
                <li>After elimination, does every variable's column have a **pivot**, or are some "free"?</li>
            </ol>
        </CardContent>
      </Card>
      

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive"><AlertTriangle /> Case 1: No Solution — "The Contradiction"</CardTitle>
          <CardDescription>
            This is the case where the equations are fundamentally at odds with each other. They describe a geometric situation that is impossible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <h4 className="font-semibold">Example System (Inconsistent):</h4>
            <BlockMath math="\begin{cases} x + y + 2z = 3 \\ 2x + 3y + 5z = 7 \\ 3x + 4y + 7z = 9 \end{cases}" />
          </div>
          <div>
            <h4 className="font-semibold">Augmented Matrix:</h4>
            <BlockMath math="\left[\begin{array}{ccc|c} 1 & 1 & 2 & 3 \\ 2 & 3 & 5 & 7 \\ 3 & 4 & 7 & 9 \end{array}\right]" />
          </div>
           <div className="space-y-2 border-t pt-4">
              <p className="text-sm"><strong>Step 1:</strong> <InlineMath math="R_2 \rightarrow R_2 - 2R_1" /> gives <InlineMath math="[0, 1, 1, 1]" />.</p>
              <p className="text-sm"><strong>Step 2:</strong> <InlineMath math="R_3 \rightarrow R_3 - 3R_1" /> gives <InlineMath math="[0, 1, 1, 0]" />.</p>
              <p className="font-mono text-xs text-muted-foreground">
                Matrix becomes: <br/>
                [ 1  1  2 | 3 ]<br/>
                [ 0  1  1 | 1 ]<br/>
                [ 0  1  1 | 0 ]
              </p>
           </div>
           <div className="space-y-2 border-t pt-4">
              <p className="text-sm"><strong>Step 3:</strong> Next pivot is the 1 in R2. <InlineMath math="R_3 \rightarrow R_3 - R_2" />.</p>
              <p><InlineMath math="[0, 1, 1, 0] - [0, 1, 1, 1] = [0, 0, 0, -1]" /></p>
           </div>
           <div>
            <h4 className="font-semibold">Final Echelon Form:</h4>
            <BlockMath math="\left[\begin{array}{ccc|c} 1 & 1 & 2 & 3 \\ 0 & 1 & 1 & 1 \\ \mathbf{0} & \mathbf{0} & \mathbf{0} & \mathbf{-1} \end{array}\right]" />
           </div>
           <Alert variant="destructive">
               <AlertTriangle className="h-4 w-4" />
                <AlertTitle>The Diagnostic Rule: A Contradiction</AlertTitle>
                <AlertDescription>
                    The last row translates to <InlineMath math="0x + 0y + 0z = -1" />, or <InlineMath math="0 = -1" />. This is a mathematical impossibility. If you find a row of `[0 0 ... | non-zero]`, the system has **NO SOLUTION**.
                </AlertDescription>
           </Alert>
           <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The three planes defined by the equations never meet at a single point. In the column picture, the target vector <InlineMath math="b" /> is **not in the span** of the columns of `A`.</p>
        </CardContent>
      </Card>

      <Card className="border-sky-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-sky-400"><InfinityIcon /> Case 2: Infinite Solutions — "The Free Variable"</CardTitle>
          <CardDescription>
            This happens when there are no contradictions, but some equations are redundant, giving us freedom.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Example System:</h4>
            <BlockMath math="\begin{cases} x - 2y + z = 4 \\ 2x - 3y + 3z = 7 \\ 4x - 7y + 5z = 15 \end{cases}" />
          </div>
          <div>
            <h4 className="font-semibold">Final Echelon Form (after elimination):</h4>
            <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{1} & -2 & 1 & 4 \\ 0 & \mathbf{1} & 1 & -1 \\ 0 & 0 & 0 & 0 \end{array}\right]" />
          </div>
          <p>The last row, `0=0`, is true but useless. It tells us one equation was redundant. Now we identify our pivots (in bold). The column for `z` does not have a pivot. This makes `z` a **free variable**.</p>
          
           <Alert variant="default" className="border-sky-500/50">
               <Diamond className="h-4 w-4 text-sky-400" />
                <AlertTitle>The Diagnostic Rule: Free Variables</AlertTitle>
                <AlertDescription>
                   If there are no contradictions and at least one column has no pivot, the variable for that column is "free". You can choose its value, leading to **INFINITELY MANY SOLUTIONS**.
                </AlertDescription>
           </Alert>
            <div>
              <h4 className="font-semibold">Finding the General Solution:</h4>
              <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
                <li>Let the free variable <InlineMath math="z=t" />, where `t` is any real number.</li>
                <li>Use back-substitution. From Row 2: <InlineMath math="y + z = -1 \Rightarrow y = -1 - t" />.</li>
                <li>From Row 1: <InlineMath math="x - 2y + z = 4 \Rightarrow x - 2(-1-t) + t = 4 \Rightarrow x = 2 - 3t" />.</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold">The General Solution is a Line:</h4>
              <BlockMath math="\begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 2 - 3t \\ -1 - t \\ t \end{bmatrix}" />
            </div>
            <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The three planes intersect along a single line. In the column picture, the columns of `A` are **linearly dependent**, and there are infinite ways to combine them to create `b`.</p>
        </CardContent>
      </Card>
      
       <Card className="border-green-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-green-400"><Star /> Case 3: A Unique Solution</CardTitle>
          <CardDescription>
            This is the clean case we saw in the last lesson.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Final Echelon Form:</h4>
              <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{2} & 1 & 1 & 5 \\ 0 & \mathbf{-8} & -2 & -12 \\ 0 & 0 & \mathbf{1} & 2 \end{array}\right]" />
            </div>
            <Alert variant="default" className="border-green-500/50">
               <Star className="h-4 w-4 text-green-400" />
                <AlertTitle>The Diagnostic Rule: Full Pivots</AlertTitle>
                <AlertDescription>
                   If there are no contradictions and **every variable's column has a pivot**, the system has a **UNIQUE SOLUTION**. There are no free variables, so there is no freedom.
                </AlertDescription>
           </Alert>
            <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The planes intersect at a single point. In the column picture, the columns of `A` are **linearly independent** and `b` is in their span.</p>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will see how this *process* of elimination can be captured and stored in matrices themselves, leading to the elegant and computationally vital **LU Decomposition**.
      </p>

    </div>
  );
}
