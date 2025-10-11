
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatrixTransformationVisualizer } from '@/components/app/linear-algebra-animation/matrix-transformation-visualizer';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function MatrixTransformationsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Interactive Matrix Transformations"
                description="A matrix is more than just a grid of numbers. It's a function that transforms space. This interactive demo shows you how."
                variant="aligned-left"
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <CardContent className="p-0 h-[600px]">
                           <MatrixTransformationVisualizer />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                Every 2x2 matrix transformation is completely defined by where it sends the standard basis vectors{' '}
                                <InlineMath math="\hat{i} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}" /> (the red vector) and{' '}
                                <InlineMath math="\hat{j} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}" /> (the green vector).
                            </p>
                            <p>
                                The coordinates of the transformed <InlineMath math="\hat{i}" /> form the <strong>first column</strong> of the matrix, and the coordinates of the transformed <InlineMath math="\hat{j}" /> form the <strong>second column</strong>.
                            </p>
                            <p>
                                <strong>Grab the tips of the colored vectors and move them!</strong> As you do, you are directly changing the numbers in the matrix below, and the entire grid transforms accordingly.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">The Determinant</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                The <strong className="text-primary">determinant</strong> of the matrix represents the area of the shaded blue parallelogram.
                            </p>
                             <div className="rounded-lg border bg-background/50 p-4 text-center">
                                <BlockMath math="det\left(\begin{bmatrix} a & b \\ c & d \end{bmatrix}\right) = ad - bc" />
                            </div>
                            <p>
                                It tells you how much the transformation scales area. If the determinant is 0, it means the transformation squishes all of space onto a single line (or a point), and the shaded area collapses to zero.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
