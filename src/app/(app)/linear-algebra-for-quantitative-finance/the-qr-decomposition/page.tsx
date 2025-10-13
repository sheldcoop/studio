
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

export default function QRDecompositionPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The QR Decomposition (The Stable Masterpiece)"
        description="The numerically stable and elegant method for solving least squares problems."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We stand at a crossroads. We have a powerful theoretical solution to the least squares problem—the Normal Equations—but we know it can be a numerically unstable computational method. We also have a powerful tool for building a perfect, stable basis—the Gram-Schmidt process.
        </p>
        <p>
          Today, we unite these ideas. The <strong>QR Decomposition</strong> is not just another factorization; it is the direct embodiment of the Gram-Schmidt process as a matrix product. It is the professional, stable, and elegant method for solving least squares and many other problems in linear algebra.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">What is QR Decomposition? The Geometric View</CardTitle>
          <CardDescription>
            The decomposition `A = QR` says: "Any matrix `A` can be represented as a different set of perfectly orthonormal axes (`Q`), followed by a simple set of scaling and shearing instructions (`R`) that tells you how to rebuild the original skewed vectors from these perfect axes."
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>`Q` (The Orthonormal Basis):</strong> This is an Orthogonal Matrix. Its columns `\{q₁, q₂\}` are the "perfect" orthonormal basis for the Column Space of `A`. We find `Q` using the Gram-Schmidt process.</li>
                <li><strong>`R` (The Recipe Matrix):</strong> This is an Upper Triangular Matrix. It is the "recipe" that tells us how to construct the original columns of `A` as linear combinations of the new `q` vectors.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Building `A=QR`: The Mechanics of `R`</CardTitle>
          <CardDescription>
            The entries of `R` are the coefficients and lengths we calculate during the Gram-Schmidt process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>The relationship `A = QR` for `A = [v₁ | v₂]` means:</p>
          <BlockMath math="\begin{bmatrix} v_1 & v_2 \end{bmatrix} = \begin{bmatrix} q_1 & q_2 \end{bmatrix} \begin{bmatrix} r_{11} & r_{12} \\ 0 & r_{22} \end{bmatrix}" />
          <p>Expanding this gives us:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><InlineMath math="v_1 = r_{11}q_1" /></li>
            <li><InlineMath math="v_2 = r_{12}q_1 + r_{22}q_2" /></li>
          </ul>
          <p className="mt-2">The entries of `R` are the dot products of the original columns with the new orthonormal vectors:</p>
          <BlockMath math="R = Q^T A = \begin{bmatrix} q_1^T \\ q_2^T \end{bmatrix} \begin{bmatrix} v_1 & v_2 \end{bmatrix} = \begin{bmatrix} q_1^Tv_1 & q_1^Tv_2 \\ q_2^Tv_1 & q_2^Tv_2 \end{bmatrix}" />
          <p>Because of how Gram-Schmidt works (`q₂` is orthogonal to `v₁`'s original space), `q₂ᵀv₁` will be 0, making `R` upper triangular.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Payoff: Solving Least Squares without `AᵀA`</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>We want to solve `AᵀAx̂ = Aᵀb`. By substituting `A = QR`:</p>
            <BlockMath math="(QR)^T(QR)\hat{x} = (QR)^T b" />
            <p>This simplifies using `QᵀQ = I`:</p>
            <BlockMath math="R^T Q^T Q R \hat{x} = R^T Q^T b \implies R^T R \hat{x} = R^T Q^T b" />
             <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>The Golden Equation</AlertTitle>
                <AlertDescription>
                    Since `Rᵀ` is invertible, we can cancel it from both sides, leaving the stunningly simple and stable result:
                    <BlockMath math="R\hat{x} = Q^Tb" />
                </AlertDescription>
            </Alert>
            <p className="mt-4">This is the golden equation for solving least squares. It is theoretically identical to the Normal Equations but computationally far superior because it avoids forming the ill-conditioned `AᵀA` matrix.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>The Complete Algorithm (The Professional's Method)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Decompose A into QR:</strong>
                <ul className="list-alpha pl-5 mt-1 space-y-1 text-sm">
                    <li>Take the columns of `A`.</li>
                    <li>Use the Gram-Schmidt process to find the orthonormal vectors `qᵢ`. These form the columns of `Q`.</li>
                    <li>The matrix `R` can then be calculated as `R = QᵀA`.</li>
                </ul>
            </li>
            <li><strong>Compute the target vector:</strong> Calculate the new, smaller target vector `Qᵀb`.</li>
            <li><strong>Solve for `x̂`:</strong> Solve the simple upper triangular system `Rx̂ = Qᵀb` using fast and easy back substitution.</li>
          </ol>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        **Up Next:** We have reached the summit of matrix decompositions. We will introduce the Singular Value Decomposition (SVD).
      </p>
    </div>
  );
}
