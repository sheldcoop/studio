
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function SVDPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Singular Value Decomposition (The Ultimate Revelation)"
        description="The final and most important factorization of our journey."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome to the final and most important factorization of our journey. We have seen how LU Decomposition helps us solve systems efficiently. We saw how QR Decomposition gives us a stable way to handle least squares. We saw how Eigendecomposition (`A = PDP⁻¹`) reveals the deep structure of a square matrix by finding its special axes.
        </p>
        <p>But each of these has a limitation:</p>
        <ul className="list-disc pl-6">
            <li>LU and Eigendecomposition only work for <strong>square matrices</strong>.</li>
            <li>Eigendecomposition is not even guaranteed for all square matrices (it requires a full set of eigenvectors).</li>
            <li>QR works for rectangular matrices, but it only tells us about the column space.</li>
        </ul>
        <p>What if we wanted a single decomposition that could tell us everything, for <strong>any matrix whatsoever</strong>? A decomposition that works for tall, fat, square, singular, or invertible matrices? A decomposition that reveals not just one set of special axes, but two?</p>
        <p>That decomposition is the <strong>Singular Value Decomposition (SVD)</strong>.</p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Central Idea: Every Matrix is a Rotation, a Stretch, and another Rotation</CardTitle>
          <CardDescription>
            The SVD states that <strong>any linear transformation</strong> represented by *any* `m x n` matrix `A` can be broken down into three fundamental, simple actions: a rotation, a scaling, and another rotation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="A = U\Sigma V^T" />
            </div>
             <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>`V` (The Input Space Axes):</strong> An `n x n` **Orthogonal Matrix**. Its columns, `{'{v₁, ..., vₙ}'}`, form a perfect orthonormal basis for the **input space (ℝⁿ)**.</li>
                <li><strong>`Σ` (The Scaling Factors):</strong> An `m x n` **Diagonal Matrix**. The values on its diagonal, `σ₁ ≥ σ₂ ≥ ... ≥ 0`, are the **singular values**.</li>
                <li><strong>`U` (The Output Space Axes):** An `m x m` **Orthogonal Matrix**. Its columns, `{'{u₁, ..., uₘ}'}`, form a perfect orthonormal basis for the **output space (ℝᵐ)**.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Geometry of the Transformation: Step-by-Step</CardTitle>
          <CardDescription>Visualizing what `y = Ax` means in the language of SVD: `y = UΣVᵀx`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4 text-sm">
                <li><strong>Apply `Vᵀ` (First Rotation):</strong> The first step is `Vᵀx`. This rotates your input vector `x` to align it with the new, perfect axes defined by `V`.</li>
                <li><strong>Apply `Σ` (Scaling):</strong> The second step is `Σ(Vᵀx)`. This stretches or squashes the components of the rotated vector by the singular values `σᵢ`.</li>
                <li><strong>Apply `U` (Second Rotation):</strong> The final step is `U(ΣVᵀx)`. This rotates the stretched/squashed vector to its final position in the output space.</li>
            </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Connection to the Four Fundamental Subspaces</CardTitle>
          <CardDescription>SVD provides orthonormal bases for all four fundamental subspaces simultaneously. For a matrix `A` of rank `r`:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Row Space `C(Aᵀ)`:** Basis is the first `r` columns of `V`, `{'{v₁, ..., vᵣ}'}`.</li>
                <li>**Null Space `N(A)`:** Basis is the remaining `n-r` columns of `V`, `{'{vᵣ₊₁, ..., vₙ}'}`.</li>
                <li>**Column Space `C(A)`:** Basis is the first `r` columns of `U`, `{'{u₁, ..., uᵣ}'}`.</li>
                <li>**Left Null Space `N(Aᵀ)`:** Basis is the remaining `m-r` columns of `U`, `{'{uᵣ₊₁, ..., uₘ}'}`.</li>
            </ul>
             <div className="rounded-lg border bg-muted/50 p-4 text-center mt-4">
                <p className="mb-2 text-sm text-muted-foreground">The core relationship:</p>
                <BlockMath math="A v_i = \sigma_i u_i \quad (\text{for } i=1, ..., r)" />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">How is it Calculated? (The Connection to Eigen-analysis)</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mb-4">We find `U`, `Σ`, and `V` from the eigendecomposition of the symmetric matrices `AᵀA` and `AAᵀ`.</p>
           <ol className="list-decimal pl-5 space-y-4 text-sm">
                <li>
                    <strong>Find `V` and `Σ` from `AᵀA`:**
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Construct the `n x n` symmetric matrix `AᵀA`.</li>
                        <li>Find its eigenvalues (`λᵢ`) and orthonormal eigenvectors.</li>
                        <li>The eigenvectors are the columns of `V`.</li>
                        <li>The singular values `σᵢ` are the square roots of the eigenvalues (`σᵢ = √λᵢ`).</li>
                    </ul>
                </li>
                <li>
                    <strong>Find `U`:**
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                         <li>The eigenvectors of the `m x m` matrix `AAᵀ` are the columns of `U`.</li>
                        <li>Alternatively, and more quickly, use the formula `uᵢ = (1/σᵢ) * A * vᵢ` for each `i`.</li>
                    </ul>
                </li>
           </ol>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will put this ultimate tool to work by exploring its application in **Principal Component Analysis (PCA)**.
      </p>
    </div>
  );
}
