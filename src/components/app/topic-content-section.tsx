
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart, Scaling, Sigma, Waypoints } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockMath, InlineMath } from 'react-katex';

// Dynamically import the new animation component
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

const DeterminantAnimation = dynamic(
  () => import('@/components/app/determinant-animation').then(mod => mod.DeterminantAnimation),
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
        <p>This gives us the **characteristic equation**, which we can solve to find the eigenvalues:</p>
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


export function TopicContentSection({ subTopic }: { subTopic: SubTopic }) {
    const isEigenTopic = subTopic.id.includes('eigen');
    const isSvdTopic = subTopic.id.includes('svd');
    const isDeterminantTopic = subTopic.id.includes('determinant');

    return (
        <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
            <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
                    </CardHeader>
                    {isEigenTopic ? (
                         <CardContent className="p-0">
                            <EigenvalueTheory />
                        </CardContent>
                    ) : (
                        <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                            <p className="text-sm text-muted-foreground">Theory explanation coming soon.</p>
                        </CardContent>
                    )}
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
                        {isEigenTopic ? (
                            <EigenVisualizer />
                        ) : isSvdTopic ? (
                            <SvdVisualizer />
                        ) : isDeterminantTopic ? (
                            <DeterminantAnimation isHovered={true} />
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                                <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
                            </div>
                        )}
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
