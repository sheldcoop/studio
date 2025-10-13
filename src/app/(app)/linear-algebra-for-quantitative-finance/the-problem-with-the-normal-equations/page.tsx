
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


export default function ProblemWithNormalEquationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Problem with the Normal Equations"
        description="Exploring the numerical instability of AᵀA and the concept of ill-conditioning."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we successfully used the Normal Equations, <InlineMath math="A^TA\hat{x} = A^Tb" />, as a powerful recipe to find the line of best fit. It felt clean, simple, and definitive. It is the textbook method and the foundation of our theoretical understanding of least squares.
        </p>
        <p>
          However, when we move from small, neat textbook examples to the large, messy datasets of the real world, a dark side of the Normal Equations can emerge. Direct computation of <InlineMath math="A^TA" /> can sometimes lead to serious numerical problems.
        </p>
        <p>
            Today, we will play the role of a numerical analyst and investigate the primary weakness of this method: the problem of <strong>ill-conditioning</strong>.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is &quot;Conditioning&quot;?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In numerical linear algebra, the <strong>condition number</strong> of a matrix is a measure of how sensitive the output of a problem is to small changes in the input data.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A matrix with a <strong>low condition number</strong> is <strong>well-conditioned</strong>. Small errors or noise in your input data `b` will only lead to small errors in your solution `x̂`. This is a stable, reliable situation.</li>
            <li>A matrix with a <strong>very high condition number</strong> is <strong>ill-conditioned</strong>. Even tiny, unavoidable rounding errors in your input data can be magnified into massive, catastrophic errors in your final solution. This is a dangerous, unstable situation.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">The Vicious Multiplier: `cond(AᵀA) = (cond(A))²`</CardTitle>
            <CardDescription>
                The matrix we actually have to solve our system with is not `A`, but the new, square matrix `K = AᵀA`. It is a fundamental property of linear algebra that the condition number of `K` is related to the condition number of `A` in a very dramatic way.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="\text{condition\_number}(A^TA) = (\text{condition\_number}(A))^2" />
            </div>
            <p>The process of forming <InlineMath math="A^TA" /> <strong>squares the condition number</strong>. Why is this so dangerous?</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>If `A` is slightly ill-conditioned, say `cond(A) = 100`, then `cond(AᵀA) = 100² = 10,000`.</li>
                <li>If `A` is significantly ill-conditioned, say `cond(A) = 10⁷`, then `cond(AᵀA) = (10⁷)² = 10¹⁴`.</li>
            </ul>
             <Alert variant="destructive" className="mt-4">
               <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Numerical Precision at Risk</AlertTitle>
                <AlertDescription>
                    A condition number of `10¹⁴` is extremely high. Computers typically work with about 16 digits of precision. A condition number this high means that you could lose up to 14 of those 16 digits of accuracy in your final answer `x̂`!
                </AlertDescription>
           </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Need for a Better Way</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>
                The Normal Equations are a perfect theoretical tool for understanding the geometry of least squares. However, for serious numerical work, directly computing <InlineMath math="A^TA" /> is often avoided.
            </p>
            <p>
                We need a more sophisticated algorithm that can solve the least squares problem <strong>without ever explicitly forming the `AᵀA` matrix</strong>. This need for a stable, high-precision method is the entire motivation for our next topics: the <strong>Gram-Schmidt process</strong> and the beautiful <strong>QR Decomposition</strong>.
            </p>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We will learn a constructive algorithm, the <strong>Gram-Schmidt Process</strong>, which is a method for taking any set of basis vectors and turning them into a &quot;nice&quot; orthonormal basis.
      </p>
    </div>
  );
}
