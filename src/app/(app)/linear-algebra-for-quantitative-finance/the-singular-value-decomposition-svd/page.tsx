
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function SVDPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Singular Value Decomposition (SVD)"
        description="The ultimate revelation of a matrix's geometry and the most powerful tool in linear algebra."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Welcome to what is arguably the most important, revealing, and powerful idea in all of linear algebra: the <strong>Singular Value Decomposition (SVD)</strong>.
        </p>
        <p>
          So far, we have learned about other ways to break down, or "factor," a matrix. Eigendecomposition (<InlineMath math="A = PDP^{-1}" />) was incredible, but it had a major limitation: it only works for some <strong>square matrices</strong>.
        </p>
        <p>
            But what about the rest of the universe? What about rectangular matrices, the kind that represent most real-world datasets (e.g., 1000 houses by 15 features)? How do we find the deep, geometric truth of these transformations?
        </p>
        <p>
          The SVD is the answer. It works for <strong>every single matrix</strong>, with no exceptions. It provides a complete geometric understanding of any linear transformation.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Big Idea: Any Transformation is a Rotation, a Stretch, and another Rotation</CardTitle>
          <CardDescription>
             The SVD states that <strong>any linear transformation</strong>, no matter how complex it looks, can be broken down into three fundamental actions: a rotation, a simple scaling, and a final rotation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="A = U\Sigma V^T" />
            </div>
             <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>`V` (The Input Axes):</strong> An `n x n` **Orthogonal Matrix**. Its columns, <InlineMath math="\{v_1, v_2, ...\}" />, are the **right singular vectors**. They form a perfect orthonormal basis for the **input space**. The `Vᵀ` in the formula performs the initial rotation.</li>
                <li><strong>`Σ` (The Scaling Factors):</strong> An `m x n` **rectangular diagonal matrix**. The values on its diagonal, <InlineMath math="\sigma_1 \ge \sigma_2 \ge ... \ge 0" />, are the **singular values**. This matrix does all the stretching and squashing.</li>
                <li><strong>`U` (The Output Axes):** An `m x m` **Orthogonal Matrix**. Its columns, <InlineMath math="\{u_1, u_2, ...\}" />, are the **left singular vectors**. They form a perfect orthonormal basis for the **output space**. `U` performs the final rotation.</li>
            </ul>
             <p className="font-semibold text-primary mt-4">The SVD finds the perfect input basis (`V`) and the perfect output basis (`U`) that make the transformation `A` become a simple diagonal scaling matrix `Σ`.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">A Step-by-Step Geometric Journey</CardTitle>
          <CardDescription>Visualizing what `y = Ax` means in the language of SVD: `y = UΣVᵀx`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4 text-sm">
                <li><strong>Rotate the Input (`Vᵀx`):</strong> `Vᵀ` rotates your input vector `x` to align it with the new, ideal input axes defined by the columns of `V`.</li>
                <li><strong>Scale the Components (`Σ(Vᵀx)`):</strong> `Σ` takes the rotated vector and simply stretches or squashes its components along the standard axes by the singular values `σᵢ`.</li>
                <li><strong>Rotate to the Output (`U(ΣVᵀx)`):</strong> `U` takes the scaled vector and performs a final rotation to its position in the output space, aligned with the ideal output axes `uᵢ`.</li>
            </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">SVD and the Four Fundamental Subspaces</CardTitle>
          <CardDescription>SVD provides orthonormal bases for all four fundamental subspaces simultaneously. For a matrix `A` of rank `r`:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>Row Space `C(Aᵀ)`:** Basis is the first `r` columns of `V`, `{v₁, ..., vᵣ}`.</li>
                <li>**Null Space `N(A)`:** Basis is the remaining `n-r` columns of `V`, `{vᵣ₊₁, ..., vₙ}`.</li>
                <li>**Column Space `C(A)`:** Basis is the first `r` columns of `U`, `{u₁, ..., uᵣ}`.</li>
                <li>**Left Null Space `N(Aᵀ)`:** Basis is the remaining `m-r` columns of `U`, `{uᵣ₊₁, ..., uₘ}`.</li>
            </ul>
             <div className="rounded-lg border bg-muted/50 p-4 text-center mt-4">
                <p className="mb-2 text-sm text-muted-foreground">The core relationship:</p>
                <BlockMath math="A v_i = \sigma_i u_i \quad (\text{for } i=1, ..., r)" />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">How Do We Calculate It? (The Connection to Eigen-analysis)</CardTitle>
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
                        <li>The singular values `σᵢ` are the square roots of the eigenvalues (`σᵢ = \sqrt{\lambdaᵢ}`).</li>
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
       <Card>
        <CardHeader>
          <CardTitle>Summary: The Ultimate Revelation</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Universality:</strong> SVD works for <strong>any `m x n` matrix</strong>.</li>
            <li><strong>The Geometry:</strong> Any transformation is a **Rotate (`Vᵀ`) -> Stretch (`Σ`) -> Rotate (`U`)**.</li>
            <li><strong>The Components:</strong>
                <ul className="list-disc pl-6 mt-2">
                    <li>`V`: Orthonormal basis for the input space (eigenvectors of `AᵀA`).</li>
                    <li>`Σ`: Diagonal matrix of singular values `σᵢ = \sqrt{\lambdaᵢ}`.</li>
                    <li>`U`: Orthonormal basis for the output space.</li>
                </ul>
            </li>
            <li><strong>The Power:</strong> SVD provides a complete, orthonormal map of the **Four Fundamental Subspaces**.</li>
          </ol>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will put this ultimate tool to work by exploring its application in **Principal Component Analysis (PCA)**.
      </p>
    </div>
  );
}
