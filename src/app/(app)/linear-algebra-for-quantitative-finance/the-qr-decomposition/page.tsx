
'use client';

import { PageHeader } from '@/components/app/page-header';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { PageSection } from '@/components/app/page-section';
import { KeyConceptAlert } from '@/components/app/key-concept-alert';
import { ExampleStep } from '@/components/app/example-step';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

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

      <PageSection title="What is QR Decomposition? The Geometric View">
        <p className="prose prose-invert max-w-none">
            The decomposition `A = QR` says: "Any matrix `A` can be represented as a different set of perfectly orthonormal axes (`Q`), followed by a simple set of scaling and shearing instructions (`R`) that tells you how to rebuild the original skewed vectors from these perfect axes."
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4 prose prose-invert max-w-none">
            <li><strong>`Q` (The Orthonormal Basis):</strong> This is an Orthogonal Matrix. Its columns are <InlineMath math="\{q_1, q_2\}" /> - the "perfect" orthonormal basis for the Column Space of `A`. We find `Q` using the Gram-Schmidt process.</li>
            <li><strong>`R` (The Recipe Matrix):</strong> This is an Upper Triangular Matrix. It is the "recipe" that tells us how to construct the original columns of `A` as linear combinations of the new `q` vectors.</li>
        </ul>
      </PageSection>
      
      <PageSection title="Building `A=QR`: The Mechanics of `R`">
        <p className="prose prose-invert max-w-none">
            The entries of `R` are the coefficients and lengths we calculate during the Gram-Schmidt process. The relationship `A = QR` for `A = [v₁ | v₂]` means:
        </p>
        <BlockMath math="\begin{bmatrix} v_1 & v_2 \end{bmatrix} = \begin{bmatrix} q_1 & q_2 \end{bmatrix} \begin{bmatrix} r_{11} & r_{12} \\ 0 & r_{22} \end{bmatrix}" />
        <p className="prose prose-invert max-w-none">Expanding this gives us:</p>
        <ul className="list-disc pl-5 space-y-1">
            <li><InlineMath math="v_1 = r_{11}q_1" /></li>
            <li><InlineMath math="v_2 = r_{12}q_1 + r_{22}q_2" /></li>
        </ul>
        <p className="mt-2 prose prose-invert max-w-none">The entries of `R` are the dot products of the original columns with the new orthonormal vectors:</p>
        <BlockMath math="R = Q^T A = \begin{bmatrix} q_1^T \\ q_2^T \end{bmatrix} \begin{bmatrix} v_1 & v_2 \end{bmatrix} = \begin{bmatrix} q_1^Tv_1 & q_1^Tv_2 \\ q_2^Tv_1 & q_2^Tv_2 \end{bmatrix}" />
        <p className="prose prose-invert max-w-none">Because of how Gram-Schmidt works (`q₂` is orthogonal to `v₁`'s original space), `q₂ᵀv₁` will be 0, making `R` upper triangular.</p>
      </PageSection>

      <PageSection title="The Payoff: Solving Least Squares without `AᵀA`">
        <p className="prose prose-invert max-w-none">We want to solve `AᵀAx̂ = Aᵀb`. By substituting `A = QR`:</p>
        <BlockMath math="(QR)^T(QR)\hat{x} = (QR)^T b" />
        <p className="prose prose-invert max-w-none">This simplifies using `QᵀQ = I`:</p>
        <BlockMath math="R^T Q^T Q R \hat{x} = R^T Q^T b \implies R^T R \hat{x} = R^T Q^T b" />
        <KeyConceptAlert title="The Golden Equation" icon="brain">
            Since `Rᵀ` is invertible, we can cancel it from both sides, leaving the stunningly simple and stable result:
            <BlockMath math="R\hat{x} = Q^Tb" />
        </KeyConceptAlert>
        <p className="prose prose-invert max-w-none mt-4">This is the golden equation for solving least squares. It is theoretically identical to the Normal Equations but computationally far superior because it avoids forming the ill-conditioned `AᵀA` matrix.</p>
      </PageSection>

      <PageSection title="The Complete Algorithm (The Professional's Method)">
        <ol className="list-decimal pl-5 space-y-4 prose prose-invert max-w-none">
            <li>
                <strong>Decompose A into QR:</strong>
                <ul className="list-alpha pl-5 mt-1 space-y-1 text-sm">
                    <li>Take the columns of `A`.</li>
                    <li>Use the Gram-Schmidt process to find the orthonormal vectors `qᵢ`. These form the columns of `Q`.</li>
                    <li>The matrix `R` can then be calculated as `R = QᵀA`.</li>
                </ul>
            </li>
            <li><strong>Compute the target vector:</strong> Calculate the new, smaller target vector `Qᵀb`.</li>
            <li><strong>Solve for `x̂`:</strong> Solve the simple upper triangular system `Rx̂ = Qᵀb` using fast and easy back substitution.</li>
        </ol>
      </PageSection>

      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-singular-value-decomposition-svd">
        The Singular Value Decomposition (SVD)
      </NextUpNavigation>
    </div>
  );
}
