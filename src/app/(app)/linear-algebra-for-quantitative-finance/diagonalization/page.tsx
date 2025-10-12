
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'diagonalization');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function DiagonalizationPage() {
    const topicInfo = allTopics.find(t => t.id === 'diagonalization');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Diagonalization"
        description="Simplifying complex systems for long-term modeling."
        variant="aligned-left"
      />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-base text-foreground/90">
        
        <h3 className="font-headline text-2xl font-bold">Part 1: The "Why" - What is Diagonalization?</h3>
        <p>Imagine you have a complex system whose state changes over time, modeled by a matrix `A`. Calculating the state after 100 steps (<InlineMath math="A^{100}\vec{x}" />) would require 99 matrix multiplications—a very tedious task.</p>
        <p><strong>Diagonalization</strong> is a powerful technique that re-writes a matrix `A` into a product of three simpler matrices:</p>
        <BlockMath math="A = PDP^{-1}" />
        <p>Where:</p>
        <ul>
            <li>`D` is a **diagonal matrix** (all non-diagonal elements are zero).</li>
            <li>`P` is an invertible matrix.</li>
        </ul>
        <p>Why is this useful? Because powers of diagonal matrices are trivial to compute. The power `k` of a diagonal matrix is just the matrix of its diagonal entries raised to the power `k`.</p>
        <p>This decomposition makes calculating <InlineMath math="A^k" /> incredibly easy:</p>
        <BlockMath math="A^k = (PDP^{-1})(PDP^{-1})...(PDP^{-1}) = PD(P^{-1}P)D...DP^{-1} = PD^kP^{-1}" />
        <p>Suddenly, calculating <InlineMath math="A^{100}" /> becomes a single matrix multiplication, an easy diagonal power, and another matrix multiplication. This is fundamental for modeling long-term behavior in financial systems, like Markov chains for credit ratings.</p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 2: The "How" - The Role of Eigenvectors</h3>
        <p>The magic of diagonalization comes from changing to a special basis: the **basis of eigenvectors**.</p>
        <p>Recall from the topic on `Change of Basis` that a matrix transformation looks different from a different perspective. If we can find a basis where the transformation `A` only stretches or shrinks vectors (without rotating them), then in that basis, the matrix for `A` will be diagonal. Those special basis vectors are the **eigenvectors**.</p>
        <p>The matrices `P` and `D` are constructed directly from the eigenvectors and eigenvalues of `A`:</p>
        <ul>
            <li>`P` is the matrix whose columns are the eigenvectors of `A`.</li>
            <li>`D` is the diagonal matrix whose diagonal entries are the corresponding eigenvalues of `A`.</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">The Diagonalization Theorem</h4>
        <p>This leads to the central theorem:</p>
        <p><em>An `n x n` matrix `A` is diagonalizable if and only if `A` has `n` linearly independent eigenvectors.</em></p>
        <p>If you can't find a full set of `n` independent eigenvectors, the matrix cannot be diagonalized.</p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 3: The Process - A Step-by-Step Example</h3>
        <p>Let's diagonalize the matrix <InlineMath math="A = \begin{pmatrix} 1 & 3 \\ 4 & 2 \end{pmatrix}" />.</p>
        
        <h4 className="font-headline text-xl font-bold">Step 1: Find the Eigenvalues</h4>
        <p>We solve the characteristic equation <InlineMath math="\det(A - \lambda I) = 0" />.</p>
        <BlockMath math="\det \begin{pmatrix} 1-\lambda & 3 \\ 4 & 2-\lambda \end{pmatrix} = (1-\lambda)(2-\lambda) - (3)(4) = 0" />
        <BlockMath math="\lambda^2 - 3\lambda + 2 - 12 = 0 \implies \lambda^2 - 3\lambda - 10 = 0" />
        <BlockMath math="(\lambda - 5)(\lambda + 2) = 0" />
        <p>Our eigenvalues are <InlineMath math="\lambda_1 = 5" /> and <InlineMath math="\lambda_2 = -2" />.</p>

        <h4 className="font-headline text-xl font-bold">Step 2: Find the Eigenvectors</h4>
        <p>For each eigenvalue, we find the null space of <InlineMath math="(A - \lambda I)" />.</p>
        <p><strong>For <InlineMath math="\lambda_1 = 5" />:</strong></p>
        <BlockMath math="A-5I = \begin{pmatrix} -4 & 3 \\ 4 & -3 \end{pmatrix}" />
        <p>The equation <InlineMath math="(A-5I)\vec{x} = \vec{0}" /> gives <InlineMath math="-4x_1 + 3x_2 = 0" />. A solution is <InlineMath math="x_1 = 3, x_2 = 4" />. So, our first eigenvector is <InlineMath math="\vec{v}_1 = \begin{pmatrix} 3 \\ 4 \end{pmatrix}" />.</p>
        <p><strong>For <InlineMath math="\lambda_2 = -2" />:</strong></p>
        <BlockMath math="A-(-2)I = \begin{pmatrix} 3 & 3 \\ 4 & 4 \end{pmatrix}" />
        <p>The equation <InlineMath math="(A+2I)\vec{x} = \vec{0}" /> gives <InlineMath math="3x_1 + 3x_2 = 0" />. A solution is <InlineMath math="x_1 = 1, x_2 = -1" />. So, our second eigenvector is <InlineMath math="\vec{v}_2 = \begin{pmatrix} 1 \\ -1 \end{pmatrix}" />.</p>

        <h4 className="font-headline text-xl font-bold">Step 3: Construct P and D</h4>
        <p>Since we found 2 linearly independent eigenvectors for our 2x2 matrix, `A` is diagonalizable.</p>
        <p>`P` is the matrix of eigenvectors, and `D` is the diagonal matrix of the corresponding eigenvalues.</p>
        <BlockMath math="P = \begin{pmatrix} 3 & 1 \\ 4 & -1 \end{pmatrix}" />
        <BlockMath math="D = \begin{pmatrix} 5 & 0 \\ 0 & -2 \end{pmatrix}" />

        <h4 className="font-headline text-xl font-bold">Step 4: Find P⁻¹</h4>
        <p>Using the formula for a 2x2 inverse: <InlineMath math="\frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" /></p>
        <BlockMath math="P^{-1} = \frac{1}{(3)(-1) - (1)(4)} \begin{pmatrix} -1 & -1 \\ -4 & 3 \end{pmatrix} = -\frac{1}{7} \begin{pmatrix} -1 & -1 \\ -4 & 3 \end{pmatrix} = \begin{pmatrix} 1/7 & 1/7 \\ 4/7 & -3/7 \end{pmatrix}" />

        <h4 className="font-headline text-xl font-bold">Conclusion</h4>
        <p>We have successfully diagonalized `A`:</p>
        <BlockMath math="A = \underbrace{\begin{pmatrix} 3 & 1 \\ 4 & -1 \end{pmatrix}}_{P} \underbrace{\begin{pmatrix} 5 & 0 \\ 0 & -2 \end{pmatrix}}_{D} \underbrace{\begin{pmatrix} 1/7 & 1/7 \\ 4/7 & -3/7 \end{pmatrix}}_{P^{-1}}" />
        <p>You can multiply these matrices together to verify that you get back the original matrix `A`.</p>

      </div>
    </div>
  );
}
