
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the new animation component
const EigenAnimation = dynamic(
  () => import('@/components/app/eigen-animation').then(mod => mod.EigenAnimation),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);


function EigenvalueExplanation() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <h4>Imagine a matrix not as a grid of numbers, but as a transformation of space.</h4>
            <p>
                When you apply a matrix to every vector in a plane, you might see space get stretched, squished, or rotated. It can be a chaotic mess!
            </p>
            <div className="my-6">
               <div className="relative mx-auto aspect-video max-w-lg rounded-lg border bg-background/50">
                    <EigenAnimation />
                </div>
            </div>
            <h4>But amidst this chaos, some vectors are special.</h4>
            <p>
                These are the <strong className="text-primary">eigenvectors</strong>. When the transformation happens, they don't change their direction at all. They stay on their original path, simply getting stretched or shrunk. In the animation above, they are the colored lines.
            </p>
            <p>
                The factor by which an eigenvector is stretched or shrunk is its corresponding <strong className="text-primary">eigenvalue</strong>.
            </p>
            <ul className="text-sm">
                <li>An <strong>eigenvalue of 2</strong> means the vector gets twice as long.</li>
                <li>An <strong>eigenvalue of 0.5</strong> means it gets half as long.</li>
                <li>A <strong>negative eigenvalue</strong> means it flips direction and gets scaled.</li>
            </ul>
            <p>
                Finding these special "axes" of a transformation is one of the most powerful ideas in linear algebra, forming the basis for techniques like Principal Component Analysis (PCA) used in factor modeling.
            </p>
        </div>
    );
}


export function TopicContentSection({ subTopic }: SubTopic) {
    const isEigenTopic = subTopic.id.includes('eigen');

    return (
        <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
            <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Theory explanation coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                    </CardHeader>
                    {isEigenTopic ? (
                        <CardContent className="p-0">
                            <EigenvalueExplanation />
                        </CardContent>
                    ) : (
                         <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                            <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
                        </CardContent>
                    )}
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
