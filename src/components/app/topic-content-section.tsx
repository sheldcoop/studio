
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart, Scaling, Sigma, Waypoints } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';

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

export function TopicContentSection({ subTopic }: { subTopic: SubTopic }) {
    const isEigenTopic = subTopic.id.includes('eigen');
    const isSvdTopic = subTopic.id.includes('svd');
    const isDeterminantTopic = subTopic.id.includes('determinant');
    const isChangeOfBasisTopic = subTopic.id.includes('change-of-basis');
    const isLinearIndependenceTopic = subTopic.id.includes('linear-independence');
    const isNullSpaceTopic = subTopic.id.includes('null-space');
    const isColumnSpaceTopic = subTopic.id.includes('column-space');


    const renderInteractiveDemo = () => {
        if (isEigenTopic) return <EigenVisualizer />;
        if (isSvdTopic) return <SvdVisualizer />;
        if (isDeterminantTopic) return <DeterminantVisualizer />;
        if (isChangeOfBasisTopic) return <ChangeOfBasisVisualizer />;
        if (isLinearIndependenceTopic) return <LinearIndependenceVisualizer />;
        if (isNullSpaceTopic) return <NullSpaceVisualizer />;
        if (isColumnSpaceTopic) return <ColumnSpaceVisualizer />;

        return (
             <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
            </div>
        );
    };

    const renderTheory = () => {
      if (isEigenTopic) return <EigenvalueTheory />;
      if (isNullSpaceTopic) return <NullSpaceTheory />;
      if (isColumnSpaceTopic) return <ColumnSpaceTheory />;
      return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <p>Theory explanation coming soon.</p>
        </div>
      );
    }

    return (
        <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
            <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {renderTheory()}
                    </CardContent>
                </Card>
                
                {isEigenTopic && (
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2"><Waypoints className="text-primary"/> Properties of Eigenvalues & Eigenvectors</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <EigenvalueProperties />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderInteractiveDemo()}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Practice Problems</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Practice problems coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Application examples coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
