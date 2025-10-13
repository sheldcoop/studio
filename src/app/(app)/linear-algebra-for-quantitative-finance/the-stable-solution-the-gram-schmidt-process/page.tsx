
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function GramSchmidtPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Stable Solution: The Gram-Schmidt Process"
        description="The constructive algorithm that takes a 'bad' basis and straightens it out into a perfect orthonormal basis."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In our last lesson, we discovered the potential dangers of the Normal Equations. The act of computing `AᵀA` can lead to numerical instability, especially when the columns of our matrix `A` are nearly parallel.
        </p>
        <p>
          The root of the problem is that the columns of `A` can be "badly behaved." They can point in similar directions, creating a skewed and unstable coordinate system.
        </p>
        <p>
          What if we could fix this? What if we could take any set of basis vectors (like the columns of `A`) and convert them into a <strong>perfect basis</strong>—one where every vector is orthogonal to every other vector, and every vector has a length of 1?
        </p>
        <p>
          This is the goal of the <strong>Gram-Schmidt Process</strong>. It is a beautiful, constructive algorithm that takes a "bad" basis and systematically straightens it out into a "good" <strong>orthonormal basis</strong>.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Goal: Orthonormal Bases</CardTitle>
          <CardDescription>
            A set of vectors `\{q₁, q₂, ..., qₙ\}` is orthonormal if they are mutually orthogonal (dot product is 0) and all have a length of 1.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Working with an orthonormal basis is a dream. Projections become trivial, and matrices whose columns are orthonormal (our **Orthogonal Matrices, `Q`**) are numerically perfect, with a condition number of 1.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Algorithm: Step-by-Step Purification</CardTitle>
          <CardDescription>
            The process takes a set of independent vectors `{v₁, v₂, ...}` and generates an orthonormal set `{q₁, q₂, ...}` that spans the same space.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg">Step 1: The First Vector (The Anchor)</h4>
            <p className="text-muted-foreground">Take the first vector `v₁`, which becomes our first orthogonal vector `u₁`. Then, normalize it.</p>
            <BlockMath math="q_1 = \frac{v_1}{\|v_1\|}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold text-lg">Step 2: The Second Vector (The Subtraction Trick)</h4>
            <p className="text-muted-foreground">Take the second vector `v₂` and subtract its projection onto the first new vector `q₁`. This removes any component of `v₂` that is parallel to `q₁`, leaving only the orthogonal part `u₂`.</p>
            <BlockMath math="u_2 = v_2 - (q_1^T v_2) q_1" />
            <p className="mt-2 text-muted-foreground">Then normalize `u₂` to get `q₂`.</p>
            <BlockMath math="q_2 = \frac{u_2}{\|u_2\|}" />
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold text-lg">Step 3: The Third Vector and Beyond...</h4>
            <p className="text-muted-foreground">The pattern continues. To find `u₃`, take `v₃` and subtract its projections onto *all* previously found orthonormal vectors (`q₁` and `q₂`).</p>
            <BlockMath math="u_3 = v_3 - (q_1^T v_3) q_1 - (q_2^T v_3) q_2" />
            <p className="mt-2 text-muted-foreground">Then normalize.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">A Concrete Example</CardTitle>
          <CardDescription>Let's orthonormalize the basis `v₁ = [3, 4]` and `v₂ = [1, 5]`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Step 1: Process `v₁`</h4>
              <p><InlineMath math="\|v_1\| = \sqrt{3^2 + 4^2} = 5" /></p>
              <p className="font-bold text-primary"><InlineMath math="q_1 = \frac{1}{5}[3, 4] = [0.6, 0.8]" /></p>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold">Step 2: Process `v₂`</h4>
              <p>Subtract the projection of `v₂` onto `q₁`:</p>
              <p><InlineMath math="q_1^T v_2 = (0.6)(1) + (0.8)(5) = 4.6" /></p>
              <p><InlineMath math="u_2 = [1, 5] - 4.6 \cdot [0.6, 0.8] = [1, 5] - [2.76, 3.68] = [-1.76, 1.32]" /></p>
              <p>Normalize `u₂`:</p>
              <p><InlineMath math="\|u_2\| = \sqrt{(-1.76)^2 + (1.32)^2} = \sqrt{3.0976 + 1.7424} = \sqrt{4.84} = 2.2" /></p>
              <p className="font-bold text-primary"><InlineMath math="q_2 = \frac{1}{2.2}[-1.76, 1.32] = [-0.8, 0.6]" /></p>
            </div>
             <div className="border-t pt-4">
              <h4 className="font-semibold">Result</h4>
              <p>Our new orthonormal basis is `\{ q₁=[0.6, 0.8], q₂=[-0.8, 0.6] \}`.</p>
            </div>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will assemble these new orthonormal vectors into a matrix `Q` to form the QR Decomposition.
      </p>
    </div>
  );
}
