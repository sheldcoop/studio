
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { FormulaBlock } from '@/components/app/formula-block';
import { ExampleStep } from '@/components/app/example-step';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { PitfallAlert } from '@/components/app/pitfall-alert';

export default function DiagonalizationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Diagonalization (Changing to the Eigenbasis)"
        description="Factoring a matrix into its core components: its eigenvalues and eigenvectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          We've just learned how to find the "soul" of a matrix—its eigenvalues (`λ`) and eigenvectors (`v`). We discovered that these eigenvectors form the special, invariant axes of the transformation.
        </p>
        <p>
          This leads to a groundbreaking idea: What if we changed our entire coordinate system to align with these special axes? What if we wrote all our vectors not in terms of the standard `i` and `j`, but in terms of the matrix's own eigenvectors?
        </p>
        <p>
          This change of basis is the key to <strong>diagonalization</strong>. Diagonalization is a <strong>matrix decomposition</strong>—a way of factoring a matrix `A` into the product of three simpler matrices. It is arguably the most important decomposition for understanding dynamic systems.
        </p>
         <FormulaBlock>
            <BlockMath math="A = PDP^{-1}" />
        </FormulaBlock>
        <p>Let's break down the cast of characters in this remarkable equation:</p>
         <ul className="list-disc pl-6 space-y-2">
            <li><strong>`A`</strong> is the original matrix we want to understand.</li>
            <li><strong>`D`</strong> is a simple **diagonal matrix**. Its diagonal entries are the **eigenvalues** of `A`.</li>
            <li><strong>`P`</strong> is a matrix whose columns are the corresponding **eigenvectors** of `A`.</li>
            <li><strong>`P⁻¹`</strong> is the inverse of `P`.</li>
        </ul>
      </article>

      <PageSection title='The "Why": The Story of the Transformation'>
        <p className="prose prose-invert max-w-none mb-4">
            The equation `A = PDP⁻¹` isn't just a formula; it's a story. It tells us that the complex transformation of `A` is actually a simple three-step process. To understand what `A` does to a vector `x`, we can compute `PDP⁻¹x`, reading from right to left:
        </p>
        <Card>
            <CardContent className="p-6">
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                    <strong>`P⁻¹x` (Change of Basis):</strong> The matrix `P⁻¹` acts as a translator. It takes `x` (written in the standard `i,j` system) and rewrites it in the language of the eigenvectors.
                    </li>
                    <li>
                    <strong>`D * (P⁻¹x)` (A Simple Scaling):</strong> Now that our vector is in the eigenbasis, the transformation is incredibly simple. The diagonal matrix `D` just stretches or shrinks the vector along these new eigenvector axes.
                    </li>
                    <li>
                    <strong>`P * (D(P⁻¹x))` (Change Back):</strong> The result we have now is in the eigenbasis. `P` acts as a translator to convert it back to the standard `i,j` coordinate system.
                    </li>
                </ol>
            </CardContent>
        </Card>
        <p className="mt-4 prose prose-invert max-w-none">The decomposition reveals the true nature of `A`: **&quot;Change to the eigenbasis, perform a simple scaling, and then change back.&quot;** Many complex transformations are just simple scaling operations viewed from a different, "tilted" perspective—the perspective of the eigenvectors.</p>
      </PageSection>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">The "How": Constructing P and D</CardTitle>
              <CardDescription>Let's use our result from the last lesson. For the matrix `A = [3 -1; 2 0]`, we found:</CardDescription>
              <ul className="list-disc text-sm pl-5 pt-2">
                  <li>`λ₁ = 1` with eigenvector `v₁ = [1, 2]`</li>
                  <li>`λ₂ = 2` with eigenvector `v₂ = [1, 1]`</li>
              </ul>
          </CardHeader>
          <CardContent className="space-y-6">
            <ExampleStep stepNumber={1} title="Construct the Eigenvalue Matrix `D`">
                <p className="text-sm text-muted-foreground mb-2">A diagonal matrix with eigenvalues on the diagonal.</p>
                <BlockMath math="D = \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}" />
            </ExampleStep>
             <ExampleStep stepNumber={2} title="Construct the Eigenvector Matrix `P`">
                <p className="text-sm text-muted-foreground mb-2">Place the eigenvectors as columns, in the same order as `D`.</p>
                <BlockMath math="P = \begin{bmatrix} 1 & 1 \\ 2 & 1 \end{bmatrix}" />
            </ExampleStep>
            <ExampleStep stepNumber={3} title="Find the Inverse `P⁻¹`">
                <p className="text-sm text-muted-foreground mb-2">For a 2x2 matrix `[a b; c d]`, the inverse is `1/(ad-bc) * [d -b; -c a]`.</p>
                <p className="text-sm">`det(P) = (1)(1) - (1)(2) = -1`</p>
                <BlockMath math="P^{-1} = \frac{1}{-1} \begin{bmatrix} 1 & -1 \\ -2 & 1 \end{bmatrix} = \begin{bmatrix} -1 & 1 \\ 2 & -1 \end{bmatrix}" />
            </ExampleStep>
            <ExampleStep stepNumber={4} title="Verify the Decomposition">
                <p className="text-sm text-muted-foreground mb-2">Check if `PDP⁻¹` equals `A`.</p>
                <p className="text-sm font-semibold">First, `PD`:</p>
                <BlockMath math="PD = \begin{bmatrix} 1 & 1 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 2 & 2 \end{bmatrix}" />
                <p className="text-sm font-semibold mt-4">Now, `(PD)P⁻¹`:</p>
                <BlockMath math="(PD)P^{-1} = \begin{bmatrix} 1 & 2 \\ 2 & 2 \end{bmatrix} \begin{bmatrix} -1 & 1 \\ 2 & -1 \end{bmatrix} = \begin{bmatrix} 3 & -1 \\ 2 & 0 \end{bmatrix} = A" />
                <p className="text-sm mt-2">It works perfectly! We have successfully decomposed `A` into its fundamental components.</p>
            </ExampleStep>
          </CardContent>
      </Card>

      <PageSection title="The Power of Diagonalization: Calculating Matrix Powers">
        <p className="prose prose-invert max-w-none">
            One of the most immediate applications is calculating high powers of a matrix, a common task in modeling systems that evolve over time.
        </p>
        <p className="prose prose-invert max-w-none">What is `A¹⁰⁰`? Calculating `A*A*A...` one hundred times would be a nightmare. But with diagonalization, it's trivial.</p>
        <BlockMath math="A^2 = (PDP^{-1})(PDP^{-1}) = P D (P^{-1}P) D P^{-1} = PDIDP^{-1} = PD^2P^{-1}" />
        <p className="prose prose-invert max-w-none">The pattern holds for any power `k`:</p>
        <FormulaBlock>
            <BlockMath math="A^k = PD^kP^{-1}" />
        </FormulaBlock>
        <p className="mt-4 prose prose-invert max-w-none">Calculating `Dᵏ` is incredibly easy—you just raise each diagonal element to the `k`-th power.</p>
      </PageSection>

      <PageSection title="When is a Matrix Not Diagonalizable?">
        <PitfallAlert title="Defective Matrices">
            <p>An `n x n` matrix `A` is diagonalizable if and only if it has **`n` linearly independent eigenvectors**.</p>
            <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                <li>This is always true if all the eigenvalues are distinct (no repeated eigenvalues).</li>
                <li>If an eigenvalue is repeated, you *might* not have enough linearly independent eigenvectors. A classic example is a shear matrix. Such matrices are called **defective**.</li>
            </ul>
        </PitfallAlert>
      </PageSection>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/applications-of-eigen-analysis">
        Applications of Eigen-analysis
      </NextUpNavigation>
    </div>
  );
}
