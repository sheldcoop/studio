'use client';

import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/app/table-of-contents';
import type { SubTopic } from '@/lib/curriculum';
import { BrainCircuit, Code, BookOpen, BarChart } from 'lucide-react';

const Lesson = ({ id, title, time, children }: { id: string; title: string; time: string; children: React.ReactNode; }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{title}</h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const subTopics: SubTopic[] = [
    { id: 'sle-matrix-form', title: 'Representing Systems in Matrix Form' },
    { id: 'gaussian-elimination', title: 'Gaussian Elimination' },
    { id: 'solving-systems', title: 'Solving Systems of Equations' },
];


export default function SystemsOfLinearEquationsComponent() {
  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                <PageHeader
                    title="Systems of Linear Equations"
                    description="The mathematical basis for linear regression and portfolio optimization."
                    variant="aligned-left"
                />

                <article className="space-y-16">
                    <Lesson id="sle-matrix-form" title="Representing Systems in Matrix Form" time="~20 min">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>A system of linear equations is a collection of two or more linear equations involving the same set of variables. For example:</p>
                                <BlockMath math="\begin{cases} 2x + 3y = 8 \\ 5x - y = 3 \end{cases}" />
                                <p>This can be rewritten in the powerful matrix form <InlineMath math="A\vec{x} = \vec{b}" />, where:</p>
                                <ul>
                                    <li><InlineMath math="A" /> is the matrix of coefficients.</li>
                                    <li><InlineMath math="\vec{x}" /> is the vector of variables.</li>
                                    <li><InlineMath math="\vec{b}" /> is the vector of constants.</li>
                                </ul>
                                <BlockMath math="A = \begin{pmatrix} 2 & 3 \\ 5 & -1 \end{pmatrix}, \quad \vec{x} = \begin{pmatrix} x \\ y \end{pmatrix}, \quad \vec{b} = \begin{pmatrix} 8 \\ 3 \end{pmatrix}" />
                                <p>This representation allows us to use the tools of linear algebra to solve for <InlineMath math="\vec{x}" />.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>In finance, this is used to model a portfolio's exposure to different risk factors. For example, if you have two stocks with returns <InlineMath math="R_1" /> and <InlineMath math="R_2" />, and two risk factors like 'Market' and 'Size', the system might be:</p>
                                <BlockMath math="R_1 = \beta_{1,M} \cdot \text{Market} + \beta_{1,S} \cdot \text{Size} + \epsilon_1" />
                                <BlockMath math="R_2 = \beta_{2,M} \cdot \text{Market} + \beta_{2,S} \cdot \text{Size} + \epsilon_2" />
                                <p>This is a linear system where we solve for the betas (<InlineMath math="\beta" />) to understand each stock's sensitivity to market movements.</p>
                            </CardContent>
                        </Card>
                    </Lesson>

                    <Lesson id="gaussian-elimination" title="Gaussian Elimination" time="~25 min">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Gaussian elimination is a systematic algorithm for solving systems of linear equations. It transforms the augmented matrix <InlineMath math="[A|\vec{b}]" /> into an "upper triangular" or "row-echelon" form using three elementary row operations:</p>
                                <ol>
                                    <li>Swapping two rows.</li>
                                    <li>Multiplying a row by a non-zero scalar.</li>
                                    <li>Adding a multiple of one row to another row.</li>
                                </ol>
                                <p>The goal is to create zeros below the main diagonal, making the system easy to solve via back-substitution.</p>
                                <BlockMath math="\begin{pmatrix} 2 & 3 & | & 8 \\ 5 & -1 & | & 3 \end{pmatrix} \xrightarrow{\text{Row Ops}} \begin{pmatrix} 1 & 1.5 & | & 4 \\ 0 & -8.5 & | & -17 \end{pmatrix}" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle></CardHeader>
                            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                                <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
                            </CardContent>
                        </Card>
                    </Lesson>
                    
                    <Lesson id="solving-systems" title="Solving Systems of Equations" time="~20 min">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Once a system is in row-echelon form, we can solve it. There are three possibilities:</p>
                                <ol>
                                    <li><strong>One Unique Solution:</strong> The system is consistent and has no free variables. This corresponds to intersecting lines at a single point.</li>
                                    <li><strong>Infinitely Many Solutions:</strong> The system is consistent but has at least one free variable. This corresponds to lines that are identical.</li>
                                    <li><strong>No Solution:</strong> The system is inconsistent (e.g., a row becomes <InlineMath math="[0, 0, ..., 0 | c]" /> where <InlineMath math="c \neq 0" />). This corresponds to parallel lines.</li>
                                </ol>
                                <p>If matrix <InlineMath math="A" /> is invertible, there is a unique solution given by <InlineMath math="\vec{x} = A^{-1}\vec{b}" />.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Practice Problems</CardTitle></CardHeader>
                            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                                <p className="text-sm text-muted-foreground">Practice problems coming soon.</p>
                            </CardContent>
                        </Card>
                    </Lesson>
                </article>
            </div>
            <TableOfContents subTopics={subTopics} />
        </div>
    </div>
  );
}
