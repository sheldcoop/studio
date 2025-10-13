
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function SpectralTheoremPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Spectral Theorem"
        description="The Zen of Symmetric Matrices"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Throughout our journey, we have treated matrices as general transformations that can rotate, shear, and scale space in complex ways. We even encountered "defective" matrices that aren't diagonalizable.
        </p>
        <p>
          But now, we turn our attention to a special, privileged, and incredibly common class of matrices: <strong>symmetric matrices</strong>.
        </p>
        <p>A symmetric matrix is one that is equal to its own transpose (<InlineMath math="A = A^T" />).</p>
        <BlockMath math="A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 9 & 5 \\ 3 & 5 & 7 \end{bmatrix}" />
        <p>These matrices are not just mathematical curiosities. They are everywhere in the real world:</p>
        <ul className="list-disc pl-6">
            <li><strong>Covariance matrices</strong> in statistics and finance are always symmetric.</li>
            <li><strong>Correlation matrices</strong> are always symmetric.</li>
            <li>The <strong>Hessian matrix</strong> used in optimization problems is symmetric.</li>
        </ul>
        <p>
          It turns out that these matrices have remarkably beautiful and well-behaved properties. These properties are so powerful that they get their own famous theorem: **The Spectral Theorem**.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Guarantees of The Spectral Theorem</CardTitle>
          <CardDescription>
            The Spectral Theorem makes two profound guarantees about any real symmetric matrix `A`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h4 className="font-semibold">Guarantee #1: All eigenvalues of `A` are real numbers.</h4>
                <p className="text-sm mt-1">This might seem like a minor technical point, but it's huge. Many non-symmetric matrices can have complex eigenvalues, which correspond to rotational components in the transformation. The fact that symmetric matrices only have real eigenvalues is the first clue that they represent a "purer" kind of transformation—one without rotation.</p>
            </div>
            <div>
                <h4 className="font-semibold">Guarantee #2: The eigenvectors of `A` corresponding to distinct eigenvalues are always orthogonal.</h4>
                <p className="text-sm mt-1">This is the showstopper. For a general matrix, the eigenvectors can point in any direction relative to each other. But for a symmetric matrix, the invariant axes of the transformation form a perfect, <strong>perpendicular coordinate system</strong>.</p>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">The Grand Prize: Orthogonal Diagonalization</CardTitle>
            <CardDescription>These two guarantees lead to the most important result of the theorem.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Every symmetric matrix `A` can be factored as:</p>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <BlockMath math="A = QDQ^T" />
            </div>
            <p>This is a special, more powerful version of the diagonalization we learned before (<InlineMath math="A = PDP^{-1}" />). Let's break down the new cast:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>`A`</strong> is our symmetric matrix.</li>
                <li><strong>`D`</strong> is the same as before: a diagonal matrix containing the **real eigenvalues** of `A`.</li>
                <li><strong>`Q`</strong> is an **orthogonal matrix**. Its columns are the **orthonormal eigenvectors** of `A`.</li>
            </ul>
            <p>Remember the superpower of orthogonal matrices? Their inverse is simply their transpose (<InlineMath math="Q^{-1} = Q^T" />).</p>
            <p>This means for symmetric matrices, the difficult <InlineMath math="P^{-1}" /> step in diagonalization is replaced by a trivial transpose operation. The decomposition <InlineMath math="A = QDQ^T" /> tells us that **every symmetric transformation is simply a scaling along a set of perfectly perpendicular axes.**</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application: The Geometry of Data (Principal Component Analysis)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2">
            <li>You have a dataset, represented as a cloud of data points.</li>
            <li>You compute the <strong>covariance matrix</strong> of this data. A covariance matrix is **always symmetric**.</li>
            <li>Because it's symmetric, the Spectral Theorem applies! We can find its eigenvalues and its **orthonormal eigenvectors**.</li>
            <li>What *are* these eigenvectors and eigenvalues in the context of our data?
                <ul className="list-disc pl-6 mt-2">
                    <li>The **eigenvectors** of the covariance matrix are the **principal components** of the data. They are the perpendicular axes along which the data varies the most.</li>
                    <li>The **eigenvalues** tell you **how much** variance exists along each of these principal axes.</li>
                </ul>
            </li>
          </ol>
           <p className="mt-4 prose prose-invert max-w-none">PCA is nothing more than finding the eigen-decomposition of the covariance matrix. The Spectral Theorem guarantees that this process will work and perfectly reveal the directions of maximum variance in our data.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary: The Elegance of Symmetry</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Who it's for:</strong> Any real **symmetric matrix** (<InlineMath math="A = A^T" />).</li>
            <li><strong>The Guarantees:</strong> Eigenvalues are always **real**, and eigenvectors from different eigenvalues are always **orthogonal**.</li>
            <li><strong>The Decomposition (<InlineMath math="A = QDQ^T" />):</strong> Every symmetric matrix is **orthogonally diagonalizable**.</li>
            <li><strong>The Geometric Meaning:</strong> A symmetric transformation is a **pure stretch** along a set of perpendicular axes, with no rotational component.</li>
            <li><strong>The Killer Application:</strong> It provides the theoretical foundation for **Principal Component Analysis (PCA)**.</li>
          </ol>
        </CardContent>
      </Card>
      <p className="text-center text-muted-foreground">
        **Up Next:** We will introduce the final, most powerful, and most general of all decompositions: the **Singular Value Decomposition (SVD)**.
      </p>
    </div>
  );
}
