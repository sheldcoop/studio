
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart } from 'lucide-react';

function EigenvalueExplanation() {
    return (
        <div className="prose prose-invert max-w-none p-6 text-foreground/90">
            <h4>Imagine a matrix not as a grid of numbers, but as a transformation of space.</h4>
            <p>
                When you apply a matrix to every vector in a plane, you might see space get stretched, squished, or rotated. It can be a chaotic mess!
            </p>
            <div className="my-6">
                <div className="grid grid-cols-2 items-center gap-4">
                    <div className="text-center">
                        <p className="font-semibold">Before Transformation</p>
                        <svg viewBox="-5 -5 10 10" className="mx-auto h-24 w-24">
                            <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--muted-foreground))" /></marker></defs>
                            <circle cx="0" cy="0" r="3" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" fill="transparent" />
                            <line x1="0" y1="0" x2="3" y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" markerEnd="url(#arrow)" />
                            <line x1="0" y1="0" x2="2.12" y2="2.12" stroke="hsl(var(--muted-foreground))" strokeWidth="0.2" markerEnd="url(#arrow)" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">After Transformation</p>
                        <svg viewBox="-5 -5 10 10" className="mx-auto h-24 w-24">
                            <defs><marker id="arrow-transformed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" /></marker></defs>
                            <path d="M -1.5 -4.5 Q 0 -5 1.5 -4.5 T 4.5 -1.5 T 1.5 1.5 T -1.5 4.5 T -4.5 1.5 T -1.5 -1.5 Z" stroke="hsl(var(--primary))" strokeWidth="0.2" fill="transparent" />
                            <line x1="0" y1="0" x2="4" y2="0" stroke="hsl(var(--primary))" strokeWidth="0.3" markerEnd="url(#arrow-transformed)" />
                            <line x1="0" y1="0" x2="-1" y2="1" stroke="hsl(var(--primary))" strokeWidth="0.3" markerEnd="url(#arrow-transformed)" />
                        </svg>
                    </div>
                </div>
            </div>
            <h4>But amidst this chaos, some vectors are special.</h4>
            <p>
                These are the <strong className="text-primary">eigenvectors</strong>. When the transformation happens, they don't change their direction at all. They stay on their original path, simply getting stretched or shrunk.
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
