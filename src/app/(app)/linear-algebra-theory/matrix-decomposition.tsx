
'use client';

import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function MatrixDecompositionComponent() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Matrix Decomposition"
        description="Unpacking the secret recipe of your data."
        variant="aligned-left"
      />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-base text-foreground/90">
        <p>
          <strong>Matrix decomposition</strong>, also known as matrix factorization, is the process of breaking down a matrix into a product of simpler matrices. It's a fundamental concept in linear algebra that simplifies complex matrix operations, making it easier to solve systems of linear equations, compute determinants, and analyze data. Think of it as finding the "factors" of a matrix, much like you find the factors of a number (e.g., 12 = 2 x 2 x 3).
        </p>

        <h3 className="font-headline text-2xl font-bold">Why Decompose a Matrix?</h3>
        <p>
          Decomposing a matrix into its constituent parts can reveal underlying properties and structures that are not immediately obvious. This process is crucial for both theoretical understanding and practical applications in fields like physics, engineering, and computer science, especially in <strong>machine learning and data analysis</strong>.
        </p>
        <p>The primary benefits include:</p>
        <ul>
          <li><strong>Simplifying computations:</strong> Solving a system of linear equations, <InlineMath math="A\vec{x} = \vec{b}" />, can be computationally expensive for a large matrix <InlineMath math="A" />. If we can decompose <InlineMath math="A" /> into simpler matrices, say <InlineMath math="A = LU" />, the problem becomes two simpler ones: <InlineMath math="L\vec{y} = \vec{b}" /> and <InlineMath math="U\vec{x} = \vec{y}" />, which are much easier to solve.</li>
          <li><strong>Revealing matrix properties:</strong> Decompositions like eigendecomposition can reveal important characteristics of a matrix, such as its <strong>eigenvalues and eigenvectors</strong>, which describe its geometric transformation properties.</li>
          <li><strong>Enabling powerful applications:</strong> Techniques like <strong>Principal Component Analysis (PCA)</strong> rely on matrix decomposition to reduce the dimensionality of data while retaining the most important information.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Common Types of Matrix Decomposition</h3>
        <p>There are several ways to decompose a matrix, each with its own specific uses and advantages. The choice depends on the properties of the matrix and the problem you are trying to solve.</p>

        <h4 className="font-headline text-xl font-bold">LU Decomposition</h4>
        <p>LU decomposition factors a square matrix <InlineMath math="A" /> into the product of a <strong>lower triangular matrix</strong> (<InlineMath math="L" />) and an <strong>upper triangular matrix</strong> (<InlineMath math="U" />).</p>
        <div className="text-center"><BlockMath math="A = LU" /></div>
        <ul>
          <li><strong>L (Lower Triangular Matrix):</strong> All entries above the main diagonal are zero.</li>
          <li><strong>U (Upper Triangular Matrix):</strong> All entries below the main diagonal are zero.</li>
        </ul>
        <p><strong>When is it used?</strong> LU decomposition is primarily used for solving systems of linear equations efficiently. Once the LU factorization of <InlineMath math="A" /> is known, solving <InlineMath math="A\vec{x} = \vec{b}" /> becomes a straightforward process of forward and backward substitution. It's also used to compute the determinant of a matrix, since <InlineMath math="\det(A) = \det(L) \times \det(U)" />, and the determinant of a triangular matrix is simply the product of its diagonal elements.</p>

        <h4 className="font-headline text-xl font-bold">QR Decomposition</h4>
        <p>QR decomposition factors a matrix <InlineMath math="A" /> into the product of an <strong>orthogonal matrix</strong> (<InlineMath math="Q" />) and an <strong>upper triangular matrix</strong> (<InlineMath math="R" />).</p>
        <div className="text-center"><BlockMath math="A = QR" /></div>
        <ul>
          <li><strong>Q (Orthogonal Matrix):</strong> The columns are orthogonal unit vectors. This means <InlineMath math="Q^T Q = I" /> (the identity matrix), and therefore <InlineMath math="Q^T = Q^{-1}" />.</li>
          <li><strong>R (Upper Triangular Matrix):</strong> Similar to the <InlineMath math="U" /> in LU decomposition.</li>
        </ul>
        <p><strong>When is it used?</strong> QR decomposition is often used in algorithms for solving <strong>least squares problems</strong>, which are common in regression analysis and data fitting. It is also a key component in algorithms for calculating eigenvalues and eigenvectors, such as the QR algorithm.</p>

        <h4 className="font-headline text-xl font-bold">Eigendecomposition (Spectral Decomposition)</h4>
        <p>Eigendecomposition applies to square matrices that are "diagonalizable." It factors a matrix <InlineMath math="A" /> into a product involving its eigenvectors and eigenvalues.</p>
        <div className="text-center"><BlockMath math="A = PDP^{-1}" /></div>
        <ul>
            <li><strong>P:</strong> A matrix whose columns are the <strong>eigenvectors</strong> of <InlineMath math="A" />.</li>
            <li><strong>D:</strong> A diagonal matrix whose diagonal entries are the corresponding <strong>eigenvalues</strong> of <InlineMath math="A" />.</li>
            <li><strong>P⁻¹:</strong> The inverse of matrix P.</li>
        </ul>
        <p>For a special class of matrices called symmetric matrices, the decomposition is even simpler: <InlineMath math="A = PDP^T" />, where <InlineMath math="P" /> is an orthogonal matrix.</p>
        <p><strong>When is it used?</strong> Eigendecomposition is fundamental to understanding the geometric transformations a matrix represents. It's used in a wide range of applications, including <strong>Principal Component Analysis (PCA)</strong> for dimensionality reduction, solving systems of linear differential equations, and in quantum mechanics.</p>

        <h4 className="font-headline text-xl font-bold">Singular Value Decomposition (SVD)</h4>
        <p>Singular Value Decomposition (SVD) is one of the most general and powerful matrix decompositions. It can be applied to <strong>any</strong> <InlineMath math="m \times n" /> matrix, not just square matrices. SVD factors a matrix <InlineMath math="A" /> into three other matrices:</p>
        <div className="text-center"><BlockMath math="A = U\Sigma V^T" /></div>
        <ul>
            <li><strong>U:</strong> An <InlineMath math="m \times m" /> orthogonal matrix whose columns are the left-singular vectors of <InlineMath math="A" />.</li>
            <li><strong>Σ (Sigma):</strong> An <InlineMath math="m \times n" /> diagonal matrix containing the <strong>singular values</strong> of <InlineMath math="A" /> on its diagonal. These values are always non-negative and are ordered from largest to smallest.</li>
            <li><strong>Vᵀ:</strong> The transpose of an <InlineMath math="n \times n" /> orthogonal matrix whose columns are the right-singular vectors of <InlineMath math="A" />.</li>
        </ul>
        <p><strong>When is it used?</strong> SVD is incredibly versatile. Its applications include:</p>
        <ul>
          <li><strong>Data compression:</strong> SVD allows for low-rank approximation of a matrix, which is used in image and signal compression.</li>
          <li><strong>Noise reduction:</strong> By discarding the smaller singular values, noise can be filtered from data.</li>
          <li><strong>Recommender systems:</strong> SVD is used in collaborative filtering to predict user ratings for items.</li>
          <li><strong>Natural Language Processing (NLP):</strong> Techniques like Latent Semantic Analysis (LSA) use SVD to find relationships between documents and terms.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Which Method Should I Use? 🤔</h3>
        <p>Choosing the right decomposition is crucial for efficiency and accuracy. Here’s a practical guide:</p>
        <ul>
          <li><strong>For solving a square system of equations (<InlineMath math="A\vec{x}=\vec{b}" />) quickly:</strong> Use <strong>LU Decomposition</strong>. It's the fastest and most direct method for this common task.</li>
          <li><strong>If your matrix is symmetric and positive-definite (like a covariance matrix):</strong> Use <strong>Cholesky Decomposition</strong> (<InlineMath math="A=LL^T" />). It's about twice as fast as LU and more numerically stable for this special, but very common, case in finance.</li>
          <li><strong>For solving overdetermined systems (least squares) or when you need maximum numerical stability:</strong> Use <strong>QR Decomposition</strong>. The orthogonal nature of Q prevents errors from being amplified, making it a very robust choice.</li>
          <li><strong>For understanding the underlying structure of your data (PCA) or the dynamics of a square system:</strong> Use <strong>Eigendecomposition</strong>. It gives you the principal axes (eigenvectors) and their importance (eigenvalues).</li>
          <li><strong>For almost anything else, especially with a non-square matrix:</strong> Use <strong>SVD</strong>. It's the most general and powerful tool. Use it for dimensionality reduction, collaborative filtering, or when other methods don't apply.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Common Pitfalls and Considerations ⚠️</h3>
        <ul>
          <li><strong>Numerical Instability:</strong> Floating-point arithmetic on computers isn't perfect. For some "ill-conditioned" matrices, the small rounding errors in <strong>LU decomposition</strong> can accumulate and lead to a wrong answer. <strong>QR and SVD are far more stable</strong> in this regard.</li>
          <li><strong>Computational Cost:</strong> Power comes at a price. SVD is the most computationally expensive decomposition. For a large square matrix, don't use SVD if a faster method like LU or Cholesky will suffice.</li>
          <li><strong>Matrix Properties Matter:</strong> You cannot use Eigendecomposition on a non-square matrix or Cholesky on a non-symmetric one. Always check the properties of your matrix before choosing a method. Applying the wrong tool will lead to errors or failure.</li>
        </ul>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Comparison at a Glance</h3>
        <div className="not-prose">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Decomposition</TableHead>
                <TableHead>Works On</TableHead>
                <TableHead>Primary Use Case</TableHead>
                <TableHead>Pros</TableHead>
                <TableHead>Cons</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><strong>LU</strong></TableCell>
                <TableCell>Square matrices</TableCell>
                <TableCell>Solving <InlineMath math="A\vec{x}=\vec{b}" />, finding determinants</TableCell>
                <TableCell>Very fast</TableCell>
                <TableCell>Can be numerically unstable</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Cholesky</strong></TableCell>
                <TableCell>Symmetric, positive-definite</TableCell>
                <TableCell>Monte Carlo simulation, covariance problems</TableCell>
                <TableCell>Extremely fast, stable</TableCell>
                <TableCell>Highly specialized</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>QR</strong></TableCell>
                <TableCell>Any <InlineMath math="m \times n" /> matrix</TableCell>
                <TableCell>Least squares, stable computations</TableCell>
                <TableCell>Numerically stable</TableCell>
                <TableCell>Slower than LU</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Eigendecomposition</strong></TableCell>
                <TableCell>Diagonalizable square matrices</TableCell>
                <TableCell>PCA, understanding system dynamics</TableCell>
                <TableCell>Provides intuitive interpretation</TableCell>
                <TableCell>Limited to square matrices</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>SVD</strong></TableCell>
                <TableCell><strong>Any</strong> <InlineMath math="m \times n" /> matrix</TableCell>
                <TableCell>Dimensionality reduction, recommendations</TableCell>
                <TableCell>Universal, powerful, stable</TableCell>
                <TableCell>Most computationally expensive</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
