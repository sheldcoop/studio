

'use client';

import { type Topic, type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart, Scaling, Sigma, Waypoints, VenetianMask, Plane, Combine, AppWindow } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';
import { MatrixAdditionTheory, MatrixMultiplicationTheory, MatrixTransposeTheory, ScalarMultiplicationTheory } from '@/lib/curriculum/matrix-operations';

// Dynamically import the visualizer components
const EigenVisualizer = dynamic(
  () => import('@/components/app/eigen-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const SvdVisualizer = dynamic(
  () => import('@/components/app/svd-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const DeterminantVisualizer = dynamic(
  () => import('@/components/app/determinant-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const ChangeOfBasisVisualizer = dynamic(
  () => import('@/components/app/change-of-basis-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const LinearIndependenceVisualizer = dynamic(
  () => import('@/components/app/linear-independence-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const NullSpaceVisualizer = dynamic(
  () => import('@/components/app/null-space-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const ColumnSpaceVisualizer = dynamic(
  () => import('@/components/app/column-space-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const RowSpaceVisualizer = dynamic(
  () => import('@/components/app/row-space-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const DiagonalizationVisualizer = dynamic(
  () => import('@/components/app/diagonalization-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const CovarianceVisualizer = dynamic(
  () => import('@/components/app/covariance-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const LUDecompositionVisualizer = dynamic(
  () => import('@/components/app/lu-decomposition-visualizer'),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

const MatrixOperationsVisualizer = dynamic(
    () => import('@/components/app/matrix-operations-visualizer'),
    {
      loading: () => <Skeleton className="h-[400px] w-full" />,
      ssr: false,
    }
);


function EigenvalueTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
        <p>Imagine you have a big, stretchy sheet of rubber with a grid drawn on it. A matrix transformation is like grabbing this sheet and stretching, rotating, or squishing it in some way. Almost every point on the grid moves to a new position, pointing in a new direction from the center.</p>
        <p>However, there will be certain special lines of points on this sheet that, after the stretch, are still on the same line they started on. They haven't been rotated off their original path. These special directions are the <strong>eigenvectors</strong>.</p>
        <p>The amount each of these special lines stretched or shrunk is its corresponding <strong>eigenvalue</strong>. An eigenvalue of 3 means points on that line are now three times farther from the center. An eigenvalue of 0.5 means they are twice as close.</p>
        <hr />
        
        <p>We can express this intuition with a simple but profound equation. For a given square matrix <strong className="text-primary">A</strong>, a non-zero vector <strong className="text-primary">v</strong> is an eigenvector if applying the transformation **A** to **v** results in a vector that is just a scaled version of **v**.</p>
        <div className="text-center"><BlockMath math="Av = \lambda v" /></div>
        <ul className="text-sm">
            <li><InlineMath math="A" /> is the transformation matrix.</li>
            <li><InlineMath math="v" /> is the eigenvector.</li>
            <li><InlineMath math="\lambda" /> (lambda) is the eigenvalue, which is just a scalar number.</li>
        </ul>
        <p>To find these values, we rearrange the equation:</p>
        <div className="text-center"><BlockMath math="Av - \lambda v = 0" /></div>
        <p>We can introduce the identity matrix <InlineMath math="I" /> to make the matrix subtraction valid:</p>
        <div className="text-center"><BlockMath math="Av - \lambda I v = 0" /></div>
        <div className="text-center"><BlockMath math="(A - \lambda I)v = 0" /></div>
        <p>This equation tells us that the matrix <InlineMath math="(A - \lambda I)" /> transforms the non-zero vector **v** into the zero vector. This can only happen if the matrix <InlineMath math="(A - \lambda I)" /> squishes space into a lower dimension (i.e., its determinant is zero).</p>
        <p>This gives us the <strong>characteristic equation</strong>, which we can solve to find the eigenvalues:</p>
        <div className="text-center"><BlockMath math="\det(A - \lambda I) = 0" /></div>
        <p>Once we have the eigenvalues (<InlineMath math="\lambda" />), we can plug each one back into <InlineMath math="(A - \lambda I)v = 0" /> to solve for the corresponding eigenvectors (<InlineMath math="v" />).</p>
        <hr />

        <p>This concept becomes even more powerful when applied to specific types of matrices common in finance. For symmetric matrices, like the **covariance matrices** used in portfolio theory, the **Spectral Theorem** provides a cornerstone guarantee: the eigenvalues will be real numbers and the eigenvectors will be orthogonal (perpendicular). This means we can form a new, more natural basis for our data space using these eigenvectors. This is the mathematical foundation of **Principal Component Analysis (PCA)**, where we change the basis of our data to align with the directions of highest variance (the eigenvectors with the largest eigenvalues).</p>
        
        <p>Furthermore, this leads to the idea of **eigendecomposition**, where a matrix A can be broken down into the product of its eigenvectors and eigenvalues: <InlineMath math="A = PDP^{-1}" />. Here, **P** is the matrix whose columns are the eigenvectors of **A**, and **D** is a diagonal matrix with the eigenvalues on its diagonal. This decomposition is incredibly useful for calculating powers of a matrix (<InlineMath math="A^k = PD^kP^{-1}" />), which is fundamental to modeling the long-term behavior of dynamic systems like Markov chains in credit risk modeling.</p>
    </div>
  );
}

function EigenvalueProperties() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <h4 className="font-bold text-lg not-prose">1. Sum of Eigenvalues = Trace of the Matrix</h4>
      <p>The <strong>trace</strong> of a square matrix is the sum of its diagonal elements. This property provides a quick check on your calculations.</p>
      <div className="p-4 rounded-md bg-muted/50 my-4 not-prose">
        <p className="font-semibold">Example:</p>
        <p>For our matrix <InlineMath math="A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}" />, the trace is <InlineMath math="2 + 2 = 4" />. The sum of our eigenvalues is <InlineMath math="3 + 1 = 4" />. They match perfectly.</p>
      </div>
      <hr className="my-6" />

      <h4 className="font-bold text-lg not-prose">2. Product of Eigenvalues = Determinant of the Matrix</h4>
      <p>The <strong>determinant</strong> represents the scaling factor of the transformation on an area (in 2D) or volume (in 3D). This property connects the scaling of individual eigenvectors to the overall scaling of space.</p>
      <div className="p-4 rounded-md bg-muted/50 my-4 not-prose">
        <p className="font-semibold">Example:</p>
        <p>The determinant of A is <InlineMath math="(2 \times 2) - (1 \times 1) = 3" />. The product of our eigenvalues is <InlineMath math="3 \times 1 = 3" />. Again, a perfect match.</p>
      </div>
      <hr className="my-6" />

      <h4 className="font-bold text-lg not-prose">3. Eigenvectors of a Symmetric Matrix are Orthogonal</h4>
      <p>A matrix is <strong>symmetric</strong> if it is equal to its own transpose (<InlineMath math="A = A^T" />). Our matrix A is symmetric. A profound consequence is that its eigenvectors are perpendicular to each other. This is the foundation of the Spectral Theorem and why PCA works so well for financial data (covariance matrices are always symmetric).</p>
      <div className="p-4 rounded-md bg-muted/50 my-4 not-prose">
        <p className="font-semibold">Example:</p>
        <p>Our eigenvectors were approximately <InlineMath math="v_1 \approx \begin{pmatrix} 0.707 \\ 0.707 \end{pmatrix}" /> and <InlineMath math="v_2 \approx \begin{pmatrix} -0.707 \\ 0.707 \end{pmatrix}" />. Their dot product is approximately 0, which proves they are orthogonal.</p>
      </div>
      <hr className="my-6" />
      
      <h4 className="font-bold text-lg not-prose">4. Eigenvalues of a Diagonal/Triangular Matrix are its Diagonal Entries</h4>
      <p>This is a convenient shortcut. If you have an upper or lower triangular matrix, the eigenvalues are simply the numbers on the main diagonal.</p>
      <div className="p-4 rounded-md bg-muted/50 my-4 not-prose">
        <p className="font-semibold">Example:</p>
        <p>For the matrix <InlineMath math="B = \begin{pmatrix} 5 & 10 & -1 \\ 0 & -2 & 3 \\ 0 & 0 & 7 \end{pmatrix}" />, you don't need to do any calculation. The eigenvalues are immediately known to be 5, -2, and 7.</p>
      </div>
    </div>
  );
}

function DeterminantTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>The determinant of a 2x2 matrix is a single number that reveals a surprising amount about the transformation it represents. Geometrically, the absolute value of the determinant tells you the <strong>area scaling factor</strong> of the transformation.</p>
            <p>Imagine a unit square formed by the standard basis vectors <InlineMath math="\mathbf{\hat{\imath}}" /> and <InlineMath math="\mathbf{\hat{\jmath}}" />. This square has an area of 1. When you apply a matrix transformation, this square gets warped into a parallelogram. The area of this new parallelogram is exactly the absolute value of the determinant of the matrix.</p>
            <ul className="text-sm">
                <li>If <InlineMath math="|\det(A)| = 3" />, the transformation blows up areas by a factor of 3.</li>
                <li>If <InlineMath math="|\det(A)| = 0.5" />, it squishes areas to be half their original size.</li>
                <li>If <InlineMath math="\det(A) = 0" />, it squishes all of space onto a single line (or even a point), meaning the area becomes zero. This is a crucial indicator that the matrix is "singular" and does not have an inverse.</li>
            </ul>
            <hr />
            <h4 className="font-bold text-lg not-prose">What about the sign?</h4>
            <p>The sign of the determinant tells you about the transformation's effect on <strong>orientation</strong>. If the determinant is negative, it means the transformation has flipped space, like turning it inside-out or looking at it in a mirror. In 2D, this corresponds to the order of the basis vectors being reversed.</p>
        </div>
    );
}

function ChangeOfBasisTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>A <strong>basis</strong> is a set of vectors that can be used as a coordinate system for a vector space. The standard basis we're all used to is (<InlineMath math="\mathbf{\hat{\imath}}" />, <InlineMath math="\mathbf{\hat{\jmath}}" />), which are the vectors <InlineMath math="\begin{pmatrix} 1 \\ 0 \end{pmatrix}" /> and <InlineMath math="\begin{pmatrix} 0 \\ 1 \end{pmatrix}" /> respectively. The coordinates of a vector <InlineMath math="\mathbf{v} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}" /> simply mean "3 steps in the <InlineMath math="\mathbf{\hat{\imath}}" /> direction and 2 steps in the <InlineMath math="\mathbf{\hat{\jmath}}" /> direction."</p>
            <p>However, we can choose any two linearly independent vectors to be our basis. A **change of basis** is the process of re-expressing a vector in terms of a new set of basis vectors. It's like translating a description of a location from one language (e.g., "3 steps east, 2 steps north") to another language (e.g., "1.5 steps northeast, 0.5 steps northwest"). The location itself doesn't change, just how we describe it.</p>
             <hr />
            <h4 className="font-bold text-lg not-prose">The Change of Basis Matrix</h4>
            <p>If we have a new basis B = {<b className="text-red-400">b₁</b>, <b className="text-blue-400">b₂</b>}, we can create a "change of basis matrix" <InlineMath math="P_B" /> whose columns are these new basis vectors. To find the standard coordinates of a vector <InlineMath math="[\mathbf{v}]_B = \begin{pmatrix} c_1 \\ c_2 \end{pmatrix}" /> given in the new basis, we simply multiply:</p>
             <div className="text-center"><BlockMath math="\mathbf{v}_{\text{std}} = P_B [\mathbf{v}]_B = c_1\mathbf{b}_1 + c_2\mathbf{b}_2" /></div>
             <p>To go the other way—from standard coordinates to the new basis—we use the inverse matrix:</p>
             <div className="text-center"><BlockMath math="[\mathbf{v}]_B = P_B^{-1} \mathbf{v}_{\text{std}}" /></div>
            <p>This is extremely powerful in quantitative finance, particularly in Principal Component Analysis (PCA), where we change the basis of our data to a new set of orthogonal axes (the eigenvectors of the covariance matrix) that represent the directions of maximum variance.</p>
        </div>
    );
}

function NullSpaceTheory() {
  return (
     <div className="prose prose-invert max-w-none p-6 text-foreground/90">
        <p>Every matrix <strong className="text-primary">A</strong> tells a story. It's a linear transformation that takes an input vector <strong className="text-primary">x</strong> and maps it to an output vector <strong className="text-primary">Ax</strong>. While many vectors are stretched, shrunk, and rotated to new locations, some special vectors are completely annihilated by the transformation—they are sent to the zero vector.</p>
        <p>The collection of all such vectors is called the <strong>Null Space</strong> or <strong>Kernel</strong> of the matrix <strong className="text-primary">A</strong>. It's the set of all solutions to the fundamental equation:</p>
        <div className="text-center"><BlockMath math="A\mathbf{x} = \mathbf{0}" /></div>
        <p>The Null Space is not just a mathematical curiosity; it answers a critical question: is the transformation "many-to-one"? If the null space contains more than just the zero vector, it means that multiple different input vectors are being mapped to the same output vector. This has profound implications for solving systems of equations. If <InlineMath math="A\mathbf{x} = \mathbf{b}" /> has a solution, and the null space of A is non-trivial, then there are infinitely many solutions.</p>
        <hr/>
        <h4 className="font-bold text-lg not-prose">How to Find the Null Space</h4>
        <p>Finding the null space is equivalent to solving the homogeneous system of linear equations <InlineMath math="A\mathbf{x} = \mathbf{0}" />. The standard method is to use <strong>Gaussian elimination</strong> to reduce the matrix A to its Row Echelon Form. The variables that correspond to columns without pivots are "free variables." By expressing the "pivot variables" in terms of these free variables, we can describe every vector in the null space.</p>
     </div>
  );
}

function ColumnSpaceTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <p>The <strong>Column Space</strong> (also known as the range or image) of a matrix <strong className="text-primary">A</strong> represents all possible outputs the transformation can produce. If you imagine the matrix as a machine that takes in any vector <strong className="text-primary">x</strong> from its domain (e.g., ℝ²), the Column Space is the set of all possible landing spots for the output vector <strong className="text-primary">Ax</strong>.</p>
      <p>It's called the Column Space because it is the <strong>span</strong> of the column vectors of the matrix. Think about the standard basis vectors, <InlineMath math="\mathbf{\hat{\imath}} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}" /> and <InlineMath math="\mathbf{\hat{\jmath}} = \begin{pmatrix} 0 \\ 1 \end{pmatrix}" />. Where do they land after the transformation?
      </p>
      <div className="text-center"><BlockMath math="A\mathbf{\hat{\imath}} = \text{1st column of } A" /></div>
      <div className="text-center"><BlockMath math="A\mathbf{\hat{\jmath}} = \text{2nd column of } A" /></div>
      <p>Since any input vector <InlineMath math="\mathbf{x} = \begin{pmatrix} x_1 \\ x_2 \end{pmatrix}" /> can be written as <InlineMath math="x_1\mathbf{\hat{\imath}} + x_2\mathbf{\hat{\jmath}}" />, its output is:</p>
      <div className="text-center"><BlockMath math="A\mathbf{x} = A(x_1\mathbf{\hat{\imath}} + x_2\mathbf{\hat{\jmath}}) = x_1(A\mathbf{\hat{\imath}}) + x_2(A\mathbf{\hat{\jmath}})" /></div>
      <p>This shows that every possible output is just a linear combination of the columns of A. Therefore, the set of all outputs—the Column Space—is the span of the columns.</p>
      <hr/>
      <h4 className="font-bold text-lg not-prose">Dimension and Solvability</h4>
      <p>The dimension of the column space is called the <strong>rank</strong> of the matrix. If the rank of a 2x2 matrix is 2, its columns are linearly independent, and they span the entire 2D plane. If the rank is 1, the columns are linearly dependent (they lie on the same line), and they only span a line. If the rank is 0, the matrix is the zero matrix.</p>
      <p>The Column Space directly answers the question of solvability for a system <InlineMath math="A\mathbf{x} = \mathbf{b}" />. A solution exists if and only if the vector <strong className="text-primary">b</strong> is in the Column Space of A. In other words, a solution exists if you can form <strong className="text-primary">b</strong> from a linear combination of the columns of A.</p>
    </div>
  );
}

function RowSpaceTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>The <strong>Row Space</strong> of a matrix <strong className="text-primary">A</strong> is the set of all possible linear combinations of its row vectors. In other words, it's the <strong>span</strong> of the rows of A.</p>
            <p>While the Column Space tells us about the possible outputs of the transformation, the Row Space lives in the input space (<InlineMath math="\mathbb{R}^n" /> for an <InlineMath math="m \times n" /> matrix). It represents the part of the input space that actually gets "used" by the transformation. Any vector that is orthogonal (perpendicular) to the Row Space gets squashed to zero—these vectors form the Null Space.</p>
            <hr/>
            <h4 className="font-bold text-lg not-prose">The Fundamental Connection</h4>
            <p>A crucial insight is that the Row Space of a matrix A is the same as the Column Space of its transpose, <InlineMath math="A^T" />. The dimension of the Row Space is equal to the dimension of the Column Space, and this number is the <strong>rank</strong> of the matrix.</p>
            <p>Elementary row operations (like the ones used in Gaussian Elimination) do not change the Row Space of a matrix. This is why we can use row reduction to find a basis for the Row Space—the non-zero rows of the row-echelon form of A form a basis for the Row Space of A.</p>
        </div>
    );
}

function FundamentalTheoremTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>The Fundamental Theorem of Linear Algebra connects the four fundamental subspaces in a beautiful and profound way. For any <InlineMath math="m \times n" /> matrix A:</p>
            
            <h4 className="font-bold text-lg not-prose mt-6">Part 1: The Dimensions</h4>
            <ul className="list-decimal pl-6 space-y-2">
                <li>The **Column Space** and the **Row Space** have the same dimension, which is the rank of the matrix: <InlineMath math="\dim(C(A)) = \dim(C(A^T)) = r" />.</li>
                <li>The dimension of the **Null Space** is <InlineMath math="n - r" />.</li>
                <li>The dimension of the **Left Null Space** (the null space of <InlineMath math="A^T" />) is <InlineMath math="m - r" />.</li>
            </ul>
            <p>This leads to the Rank-Nullity Theorem: <InlineMath math="\text{rank}(A) + \text{nullity}(A) = n" />.</p>
            <hr/>

            <h4 className="font-bold text-lg not-prose mt-6">Part 2: The Orthogonality</h4>
            <p>This is the most geometric part of the theorem. It describes how the subspaces are oriented relative to each other.</p>
             <ul className="list-decimal pl-6 space-y-2">
                <li>The **Null Space** is the orthogonal complement of the **Row Space** in <InlineMath math="\mathbb{R}^n" />. This means every vector in the null space is perpendicular to every vector in the row space. Together, they span the entire input space.</li>
                <li>The **Left Null Space** is the orthogonal complement of the **Column Space** in <InlineMath math="\mathbb{R}^m" />. This means every vector in the left null space is perpendicular to every vector in the column space.</li>
            </ul>
            <p>This tells us that any vector in the input space can be uniquely split into a part that's in the Row Space (which gets transformed to a non-zero output) and a part that's in the Null Space (which gets squashed to zero).</p>
        </div>
    );
}

function DiagonalizationTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
        <p>Diagonalization is the process of finding an "eigenbasis" for a transformation. For many matrices <strong className="text-primary">A</strong>, there exists a special basis formed by its eigenvectors. In this basis, the transformation <strong className="text-primary">A</strong> acts in a very simple way: it just stretches or shrinks along the new basis axes, without any rotation or shear.</p>
        <p>This simplification is captured by the famous equation: </p>
        <div className="text-center"><BlockMath math="A = PDP^{-1}" /></div>
        <p>This isn't just an abstract formula; it's a recipe for understanding a complex transformation:</p>
        <ul className="text-sm">
            <li><strong>Step 1: <InlineMath math="P^{-1}" /> (Change of Basis).</strong> First, we take a vector and figure out its coordinates in the language of the eigenbasis. This is what <InlineMath math="P^{-1}" /> does.</li>
            <li><strong>Step 2: <InlineMath math="D" /> (Scale).</strong> In this new "eigenworld," the transformation is simple. We just stretch the vector along each eigen-axis by the amount of the corresponding eigenvalue. This is what the diagonal matrix <strong className="text-primary">D</strong> does.</li>
            <li><strong>Step 3: <InlineMath math="P" /> (Change Back).</strong> Finally, we convert the stretched vector back to our standard coordinate system. This is the job of <strong className="text-primary">P</strong>.</li>
        </ul>
        <p>So, a complicated transformation <strong className="text-primary">A</strong> is really just a simple stretch (<strong className="text-primary">D</strong>) viewed from a different perspective (<strong className="text-primary">P</strong>).</p>
        <hr />
        <h4 className="font-bold text-lg not-prose">When is a Matrix Diagonalizable?</h4>
        <p>A square <InlineMath math="n \times n" /> matrix is diagonalizable if and only if it has <InlineMath math="n" /> linearly independent eigenvectors. If it doesn't have enough independent eigenvectors to form a basis for the entire space, it cannot be diagonalized.</p>
        <hr />
        <h4 className="font-bold text-lg not-prose">Why is it Useful in Finance?</h4>
        <p>One of the most powerful applications is calculating powers of a matrix. To find <InlineMath math="A^{100}" />, you don't need to multiply A by itself 100 times. Instead, you can do:</p>
        <div className="text-center"><BlockMath math="A^k = (PDP^{-1})^k = PD^kP^{-1}" /></div>
        <p>Calculating <InlineMath math="D^k" /> is incredibly easy—you just raise the diagonal eigenvalue entries to the power of k. This technique is fundamental for modeling the long-term state of systems described by Markov chains, which are used extensively in credit risk modeling to predict the probability of a bond defaulting over many time periods.</p>
    </div>
  );
}

function CovarianceTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <h4 className="font-bold text-lg not-prose">Defining Covariance Matrices</h4>
            <p>Imagine a scatter plot of returns for two stocks. If the cloud of points is tilted upwards, the stocks tend to move together (positive covariance). If it's tilted downwards, they move oppositely (negative covariance). A circular cloud means no relationship (zero covariance).</p>
            <p>A <strong>covariance matrix</strong>, often denoted as <InlineMath math="\Sigma" />, is a square matrix that summarizes this relationship for a set of assets. For two assets, it looks like this:</p>
            <div className="text-center"><BlockMath math="\Sigma = \begin{pmatrix} \sigma_1^2 & \sigma_{12} \\ \sigma_{21} & \sigma_2^2 \end{pmatrix}" /></div>
            <ul className="text-sm">
                <li>The diagonal elements (<InlineMath math="\sigma_1^2" />, <InlineMath math="\sigma_2^2" />) are the <strong>variances</strong> of each asset—a measure of their individual risk or volatility.</li>
                <li>The off-diagonal elements (<InlineMath math="\sigma_{12}" />, <InlineMath math="\sigma_{21}" />) are the <strong>covariances</strong> between the assets. Since <InlineMath math="\sigma_{12} = \sigma_{21}" />, the matrix is always symmetric.</li>
            </ul>
            <p>A positive covariance <InlineMath math="\sigma_{12}" /> means the assets tend to move in the same direction. A negative covariance means they move in opposite directions. The covariance matrix doesn't just give us numbers; it geometrically describes the shape and tilt of our data cloud.</p>
            <hr className="my-6" />
            <h4 className="font-bold text-lg not-prose">Defining Correlation Matrices</h4>
            <p>Covariance is useful, but its magnitude depends on the volatility of the assets, making it hard to compare. A covariance of 100 might be huge for two low-volatility stocks but tiny for two high-volatility ones. To fix this, we normalize the covariance to get the <strong>correlation coefficient</strong>, <InlineMath math="\rho" /> (rho).</p>
            <div className="text-center"><BlockMath math="\rho_{12} = \frac{\sigma_{12}}{\sigma_1 \sigma_2}" /></div>
            <p>The correlation is always between -1 and +1, giving us a standardized measure of the linear relationship. A <strong>correlation matrix</strong> is simply the covariance matrix where every element has been normalized in this way:</p>
            <div className="text-center"><BlockMath math="R = \begin{pmatrix} 1 & \rho_{12} \\ \rho_{21} & 1 \end{pmatrix}" /></div>
            <p>The diagonal is always 1 because an asset is perfectly correlated with itself.</p>
             <hr className="my-6" />
            <h4 className="font-bold text-lg not-prose">Calculating Portfolio Variance</h4>
            <p>This is where the covariance matrix becomes the engine of portfolio theory. The variance (risk) of a portfolio is not just the average of the individual asset risks. The interaction between assets—their covariance—is critical. For a portfolio with weights <InlineMath math="\mathbf{w} = \begin{pmatrix} w_1 \\ w_2 \end{pmatrix}" />, the portfolio variance is given by matrix multiplication:</p>
            <div className="text-center"><BlockMath math="\sigma_p^2 = \mathbf{w}^T \Sigma \mathbf{w}" /></div>
            <p>This elegant equation shows that by combining assets with low or negative covariance, we can build a portfolio where the total risk is lower than the sum of its parts. This is the mathematical heart of diversification.</p>
        </div>
    );
}

function LUDecompositionTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>Solving a system of linear equations, <strong className="text-primary">Ax = b</strong>, can be computationally expensive, especially if the matrix <strong className="text-primary">A</strong> is large. LU Decomposition provides a powerful and efficient method to solve this by factoring the matrix <strong className="text-primary">A</strong> into two simpler matrices: a **Lower triangular matrix (L)** and an **Upper triangular matrix (U)**.</p>
            <div className="text-center"><BlockMath math="A = LU" /></div>
            <p>The original problem <InlineMath math="A\mathbf{x} = \mathbf{b}" /> now becomes <InlineMath math="LU\mathbf{x} = \mathbf{b}" />. The genius of this approach is that we can solve this in two easy steps:</p>
            <ol className="text-sm">
                <li><strong>Let <InlineMath math="U\mathbf{x} = \mathbf{y}" />. First, solve <InlineMath math="L\mathbf{y} = \mathbf{b}" /> for <InlineMath math="\mathbf{y}" />.</strong> Because L is lower triangular, this can be solved quickly using a process called "forward substitution."</li>
                <li><strong>Now, solve <InlineMath math="U\mathbf{x} = \mathbf{y}" /> for <InlineMath math="\mathbf{x}" />.</strong> Because U is upper triangular, this can be solved just as quickly using "backward substitution."</li>
            </ol>
            <p>This two-step process is dramatically faster than finding the inverse of A, especially if you need to solve the system for many different <strong className="text-primary">b</strong> vectors, as you only need to perform the computationally expensive decomposition once.</p>
            <hr />
            <h4 className="font-bold text-lg not-prose">What do L and U represent?</h4>
            <p>The matrices L and U are directly related to the steps of Gaussian elimination. The **U** matrix is the row echelon form of A. The **L** matrix stores the multipliers used during the elimination process. Its diagonal entries are always 1, and the entries below the diagonal are the negative of the multipliers used to eliminate the entries in A.</p>
        </div>
    );
}

function LinearIndependenceTheory() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <h4 className="font-bold text-lg not-prose">Defining Linear Independence</h4>
            <p>A set of vectors is <strong>linearly independent</strong> if no vector in the set can be written as a linear combination of the others. Geometrically, this means none of the vectors lie on the "span" (the line, plane, or hyperplane) created by the other vectors. They all point in genuinely different directions, contributing new information and new dimensions to the space they span.</p>
             <p>Conversely, a set of vectors is <strong>linearly dependent</strong> if at least one vector is redundant. For two vectors, this means they lie on the same line—one is just a scaled version of the other.</p>
            <hr />
            <h4 className="font-bold text-lg not-prose">Spanning Sets</h4>
            <p>The <strong>span</strong> of a set of vectors is the set of all possible vectors you can reach by taking linear combinations of them. In 2D, two linearly independent vectors can span the entire 2D plane. You can reach any point by taking some amount of one vector and adding some amount of the other. However, if the two vectors are linearly dependent, their span is just a single line.</p>
            <hr />
            <h4 className="font-bold text-lg not-prose">Basis and Dimension</h4>
            <p>A <strong>basis</strong> for a vector space is a set of linearly independent vectors that spans the entire space. It's the minimum set of "building blocks" you need to describe any vector in that space. The number of vectors in a basis is called the <strong>dimension</strong> of the space. For the 2D plane (ℝ²), the dimension is 2, and any two linearly independent vectors can form a basis.</p>
        </div>
    )
}


function FourSubspacesPage({ topic }: { topic: Topic }) {
    if (!topic.subTopics) return null;
    return (
        <div className="space-y-12">
            {topic.subTopics.map((subTopic) => {
                switch(subTopic.id) {
                    case 'column-space':
                        return (
                             <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                                 <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Plane className="text-primary"/> The Output World (Image/Range)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ColumnSpaceTheory />
                                    </CardContent>
                                </Card>
                                <div className="mt-8">
                                    <ColumnSpaceVisualizer />
                                </div>
                            </section>
                        );
                    case 'row-space':
                         return (
                            <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                                <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Plane className="text-primary"/> The Input World</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <RowSpaceTheory />
                                    </CardContent>
                                </Card>
                                <div className="mt-8">
                                    <RowSpaceVisualizer />
                                </div>
                            </section>
                        );
                    case 'null-space':
                        return (
                            <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                                <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><VenetianMask className="text-primary"/> The Kernel</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <NullSpaceTheory />
                                    </CardContent>
                                </Card>
                                <div className="mt-8">
                                    <NullSpaceVisualizer />
                                </div>
                            </section>
                        );
                    case 'fundamental-theorem':
                        return (
                            <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                                <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><Combine className="text-primary"/> Tying It All Together</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <FundamentalTheoremTheory />
                                    </CardContent>
                                </Card>
                            </section>
                        );
                    default: return null;
                }
            })}
        </div>
    )
}

function DeterminantPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory: The Area Scaling Factor</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DeterminantTheory />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                </CardHeader>
                <CardContent>
                    <DeterminantVisualizer />
                </CardContent>
            </Card>
        </div>
    );
}

function ChangeOfBasisPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory: A New Perspective</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ChangeOfBasisTheory />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChangeOfBasisVisualizer />
                </CardContent>
            </Card>
        </div>
    );
}

function LinearIndependencePage({ topic }: { topic: Topic }) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <LinearIndependenceTheory />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                </CardHeader>
                <CardContent>
                    <LinearIndependenceVisualizer />
                </CardContent>
            </Card>
        </div>
    );
}

function MatrixOperationsPage({ topic }: { topic: Topic }) {
    if (!topic.subTopics) return null;
    return (
        <div className="space-y-12">
            {topic.subTopics.map((subTopic) => {
                let theory, visualizer;
                switch (subTopic.id) {
                    case 'matrix-addition-subtraction':
                        theory = MatrixAdditionTheory();
                        break;
                    case 'scalar-multiplication':
                        theory = ScalarMultiplicationTheory();
                        break;
                    case 'matrix-multiplication':
                        theory = MatrixMultiplicationTheory();
                        break;
                    case 'matrix-transpose':
                        theory = MatrixTransposeTheory();
                        break;
                }

                return (
                    <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                        <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                        <div className="prose prose-invert max-w-none p-6 bg-card rounded-lg" dangerouslySetInnerHTML={{ __html: theory || '' }} />
                    </section>
                );
            })}
             <section className="scroll-mt-24">
                <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">Interactive Visualizer</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AppWindow className="text-primary" /> Interactive Demo</CardTitle>
                        <CardDescription>See how these operations affect vectors and the grid space in real-time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <MatrixOperationsVisualizer />
                    </CardContent>
                </Card>
             </section>
        </div>
    );
}


export function TopicContentSection({ topicInfo }: { topicInfo: Topic }) {
    const { id: topicId, subTopics } = topicInfo;

    const isEigenTopic = topicId.includes('eigen');
    const isSvdTopic = topicId.includes('svd');
    const isDeterminantTopic = topicId.includes('determinant-geometric-meaning');
    const isChangeOfBasisTopic = topicId.includes('change-of-basis');
    const isLinearIndependenceTopic = topicId.includes('linear-independence');
    const isDiagonalizationTopic = topicId === 'diagonalization';
    const isCovarianceTopic = topicId === 'covariance-and-correlation-matrices';
    const isFundamentalSubspaceTopic = topicId === 'the-four-fundamental-subspaces';
    const isLUDecompositionTopic = topicId === 'lu-decomposition';
    const isMatrixOperationsTopic = topicId === 'matrix-operations';
    
    if (isFundamentalSubspaceTopic) {
        return <FourSubspacesPage topic={topicInfo} />;
    }

    if (isDeterminantTopic) {
        return <DeterminantPage />;
    }
    
    if (isChangeOfBasisTopic) {
        return <ChangeOfBasisPage />;
    }

    if (isLinearIndependenceTopic) {
        return <LinearIndependencePage topic={topicInfo} />;
    }

    if (isMatrixOperationsTopic) {
        return <MatrixOperationsPage topic={topicInfo} />;
    }

    const renderInteractiveDemo = () => {
        if (isEigenTopic) return <EigenVisualizer />;
        if (isSvdTopic) return <SvdVisualizer />;
        if (isDiagonalizationTopic) return <DiagonalizationVisualizer />;
        if (isCovarianceTopic) return <CovarianceVisualizer />;
        if (isLUDecompositionTopic) return <LUDecompositionVisualizer />;

        return (
             <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
            </div>
        );
    };

    const renderTheory = () => {
      if (isEigenTopic) return <EigenvalueTheory />;
      if (isDiagonalizationTopic) return <DiagonalizationTheory />;
      if (isCovarianceTopic) return <CovarianceTheory />;
      if (isLUDecompositionTopic) return <LUDecompositionTheory />;
      return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>Theory explanation coming soon.</p>
        </div>
      );
    }
    
    // Default rendering for a single-topic page
    if (!subTopics || subTopics.length === 0) {
      return (
          <div className="space-y-8">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                      {renderTheory()}
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                      {renderInteractiveDemo()}
                  </CardContent>
              </Card>
          </div>
      );
    }

    // Rendering for topics that have sub-topics
    return (
        <div className="space-y-12">
            {subTopics.map(subTopic => (
                 <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
                    <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
                    <div className="space-y-8">
                        {/* The logic for rendering will be based on the sub-topic ID */}
                        <p className="text-muted-foreground">Content for {subTopic.title} coming soon.</p>
                    </div>
                </section>
            ))}
        </div>
    );
}
