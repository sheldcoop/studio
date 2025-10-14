
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Diamond, Star, Infinity } from 'lucide-react';
import { PitfallAlert } from '@/components/app/pitfall-alert';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

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
          The true genius of Gaussian Elimination is not just that it finds answers, but that it is a powerful <strong>diagnostic tool</strong>. It tells us the <strong>nature</strong> of our system. It reveals whether our problem has that one perfect answer, or if it's a problem with no answer at all, or a problem with an entire family of answers.
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
                <li>After elimination, does every variable's column have a <strong>pivot</strong>, or are some "free"?</li>
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
           <BlockMath math="\left[\begin{array}{ccc|c} 1 & 1 & 2 & 3 \\ 0 & 1 & 1 & 1 \\ \mathbf{0} & \mathbf{0} & \mathbf{0} & \mathbf{-1} \end{array}\right]" />
           <PitfallAlert title="The Diagnostic Rule: A Contradiction">
              The last row translates to <InlineMath math="0x + 0y + 0z = -1" />, or <InlineMath math="0 = -1" />. This is a mathematical impossibility. If you find a row of `[0 0 ... | non-zero]`, the system has <strong>NO SOLUTION</strong>.
           </PitfallAlert>
           <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The three planes defined by the equations never meet at a single point. In the column picture, the target vector <InlineMath math="b" /> is <strong>not in the span</strong> of the columns of `A`.</p>
        </CardContent>
      </Card>

      <Card className="border-sky-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-sky-400"><Infinity /> Case 2: Infinite Solutions — "The Free Variable"</CardTitle>
          <CardDescription>
            This happens when there are no contradictions, but some equations are redundant, giving us freedom.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{1} & -2 & 1 & 4 \\ 0 & \mathbf{1} & 1 & -1 \\ 0 & 0 & 0 & 0 \end{array}\right]" />
          <p>The last row, `0=0`, is true but useless. The column for `z` does not have a pivot. This makes `z` a <strong>free variable</strong>.</p>
          
           <Alert variant="default" className="border-sky-500/50">
               <Diamond className="h-4 w-4 text-sky-400" />
                <AlertTitle>The Diagnostic Rule: Free Variables</AlertTitle>
                <AlertDescription>
                   If there are no contradictions and at least one column has no pivot, the variable for that column is "free". You can choose its value, leading to <strong>INFINITELY MANY SOLUTIONS</strong>.
                </AlertDescription>
           </Alert>
            <div>
              <h4 className="font-semibold">The General Solution is a Line:</h4>
              <BlockMath math="\begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix} + t \begin{bmatrix} -3 \\ -1 \\ 1 \end{bmatrix}" />
            </div>
            <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The three planes intersect along a single line. In the column picture, the columns of `A` are <strong>linearly dependent</strong>, and there are infinite ways to combine them to create `b`.</p>
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
            <BlockMath math="\left[\begin{array}{ccc|c} \mathbf{2} & 1 & 1 & 5 \\ 0 & \mathbf{-8} & -2 & -12 \\ 0 & 0 & \mathbf{1} & 2 \end{array}\right]" />
            <Alert variant="default" className="border-green-500/50">
               <Star className="h-4 w-4 text-green-400" />
                <AlertTitle>The Diagnostic Rule: Full Pivots</AlertTitle>
                <AlertDescription>
                   If there are no contradictions and <strong>every variable's column has a pivot</strong>, the system has a <strong>UNIQUE SOLUTION</strong>. There are no free variables, so there is no freedom.
                </AlertDescription>
           </Alert>
            <p className="text-sm"><strong className="text-primary">Geometric Meaning:</strong> The planes intersect at a single point. In the column picture, the columns of `A` are <strong>linearly independent</strong> and `b` is in their span.</p>
        </CardContent>
      </Card>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/lu-decomposition">
        LU Decomposition
      </NextUpNavigation>
    </div>
  );
}
