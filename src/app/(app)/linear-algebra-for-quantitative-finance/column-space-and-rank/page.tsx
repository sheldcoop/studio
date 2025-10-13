
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ColumnSpaceAndRankPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Column Space & Rank"
        description="The World of Possible Outputs"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          For the past several lessons, our focus has been entirely on finding a solution <InlineMath math="x" /> to the equation <InlineMath math="Ax = b" />. We've built an incredible algorithmic machine—Gaussian Elimination—to do this.
        </p>
        <p>
          Now, it's time to change our perspective.
        </p>
        <p>
          Let's stop thinking about a specific <InlineMath math="b" /> and start thinking about <strong>all possible <InlineMath math="b" />'s</strong>. When we use our matrix <InlineMath math="A" /> as a transformation, what is the entire universe of possible output vectors? Where can our input vectors possibly land?
        </p>
        <p>
          The answer to this question is a beautiful, fundamental concept: the <strong>Column Space</strong>.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Defining the Column Space</CardTitle>
          <CardDescription>
            The Column Space of a matrix <InlineMath math="A" />, written as <InlineMath math="C(A)" />, is the set of all possible linear combinations of its column vectors. In other words, **the Column Space is the span of the columns of <InlineMath math="A" />**.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Remember the "Column Picture" of <InlineMath math="Ax = b" />? We saw that the product <InlineMath math="Ax" /> is simply a linear combination of the columns of A, where the weights are the entries of the vector <InlineMath math="x" />.</p>
          <BlockMath math="x_1 \cdot (\text{col } 1) + x_2 \cdot (\text{col } 2) + \dots + x_n \cdot (\text{col } n) = Ax" />
          <Alert>
            <AlertTitle className="font-semibold">The Key Insight</AlertTitle>
            <AlertDescription>
              The Column Space of <InlineMath math="A" /> is the set of all possible output vectors <InlineMath math="b" />. The equation <InlineMath math="Ax = b" /> has a solution if, and only if, the vector <InlineMath math="b" /> lives inside the Column Space of <InlineMath math="A" />. If <InlineMath math="b" /> is outside <InlineMath math="C(A)" />, the system is inconsistent.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Visualizing the Column Space</CardTitle>
          <CardDescription>
            Let's take a 3x2 matrix <InlineMath math="A" />:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlockMath math="A = \begin{bmatrix} 1 & -1 \\ 2 & 0 \\ 3 & 1 \end{bmatrix}" />
          <p>The columns are <InlineMath math="c_1 = [1, 2, 3]" /> and <InlineMath math="c_2 = [-1, 0, 1]" />. These are two vectors in 3D space.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Column Space of <InlineMath math="A" /> is the **span** of these two vectors.</li>
            <li>Since <InlineMath math="c_1" /> and <InlineMath math="c_2" /> are not collinear, their span is a **plane** passing through the origin in 3D space.</li>
            <li>This means if we take *any* 2D input vector <InlineMath math="x" />, the output <InlineMath math="Ax" /> will *always* land somewhere on this specific plane.</li>
            <li>If we pick a target vector <InlineMath math="b" /> that lies on this plane, <InlineMath math="Ax=b" /> has a solution. If <InlineMath math="b" /> is off the plane, there is no solution.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Finding a Basis for the Column Space</CardTitle>
          <CardDescription>The columns of <InlineMath math="A" /> span the Column Space, but they might be linearly dependent. We need a non-redundant basis. The pivot columns of the original matrix <InlineMath math="A" /> form this basis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold">Example:</h4>
            <p>Let's find a basis for <InlineMath math="C(A)" /> for this matrix <InlineMath math="A" />:</p>
            <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 7 & 9 \\ 3 & 6 & 8 & 11 \end{bmatrix}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 1: Reduce A to Row Echelon Form (REF).</h4>
            <p className="text-sm text-muted-foreground">After elimination (<InlineMath math="R_2 \to R_2 - 2R_1" />, <InlineMath math="R_3 \to R_3 - 3R_1" />, then <InlineMath math="R_3 \to R_3 + R_2" />), we get the REF matrix <InlineMath math="U" />:</p>
            <BlockMath math="U = \begin{bmatrix} \mathbf{1} & 2 & 3 & 4 \\ 0 & 0 & \mathbf{1} & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 2: Identify the pivot columns in `U`.</h4>
            <p>The pivots (the first non-zero entries in each row) are in **Column 1** and **Column 3**.</p>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold">Step 3: The basis is the corresponding columns from the *original* matrix `A`.</h4>
            <p>A basis for <InlineMath math="C(A)" /> is:</p>
            <BlockMath math="\left\{ \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \begin{bmatrix} 3 \\ 7 \\ 8 \end{bmatrix} \right\}" />
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Do NOT use the pivot columns from `U`. Row operations change the column space. You must use the columns from the original `A`. The REF simply tells you *which* columns to pick.</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Concept of Rank</CardTitle>
          <CardDescription>
            The essential, "true" dimension of the Column Space is called the **rank** of the matrix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The **rank** of a matrix <InlineMath math="A" /> is the **dimension of its Column Space**.</p>
          <p className="mt-2">Equivalently, and more practically: The **rank of <InlineMath math="A" /> is the number of pivots** in its row echelon form.</p>
          <p className="mt-4">In our example, we found 2 pivots, so the **rank of <InlineMath math="A" /> is 2**. This means the four column vectors of <InlineMath math="A" />, which live in 3D space, actually only span a 2-dimensional subspace (a plane).</p>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        <strong>Up Next:</strong> We've answered the question, "What are all the possible outputs?" Now we'll ask the opposite, "What inputs get mapped to zero?" This will lead us to the second of the four fundamental subspaces: the incredibly important **Null Space**.
      </p>
    </div>
  );
}
