
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/app/table-of-contents';
import type { SubTopic } from '@/lib/curriculum';
import { BookOpen, Code, BrainCircuit, BarChart, GitBranch, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'prob-conditional-probability-independence');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

const Lesson = ({ id, title, children }: { id: string; title: string; children: React.ReactNode; }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{title}</h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const subTopics: SubTopic[] = [
    { id: 'prob-conditional-def', title: 'Definition of Conditional Probability' },
    { id: 'prob-independence', title: 'Independence of Events' },
    { id: 'prob-multiplication-rule', title: 'The Multiplication Rule' },
];


export default function ConditionalProbabilityPage() {
    const topicInfo = allTopics.find(t => t.id === 'prob-conditional-probability-independence');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                <PageHeader
                    title="Conditional Probability & Independence"
                    description="How the occurrence of one event affects another."
                    variant="aligned-left"
                />

                <article className="space-y-16">
                    <Lesson id="prob-conditional-def" title="Definition of Conditional Probability">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Conditional probability is the probability of an event occurring, given that another event has already occurred. It's a way of updating our knowledge based on new information.</p>
                                <p>The notation for the conditional probability of event A given event B is <InlineMath math="P(A|B)" />. The formula is:</p>
                                <BlockMath math="P(A|B) = \frac{P(A \cap B)}{P(B)}" />
                                <p>Where:</p>
                                <ul>
                                    <li><InlineMath math="P(A \cap B)" /> is the probability that both A and B occur (their intersection).</li>
                                    <li><InlineMath math="P(B)" /> is the probability of event B. We assume <InlineMath math="P(B) > 0" />.</li>
                                </ul>
                                <p>Think of it as narrowing down your sample space. Instead of considering all possible outcomes, you're only looking at the outcomes where B has happened. Within that new, smaller world, you calculate the probability of A.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>A credit rating agency wants to know the probability of a company defaulting (<InlineMath math="D" />) given that the economy is in a recession (<InlineMath math="R" />). This is written as <InlineMath math="P(D|R)" />.</p>
                                <p>From historical data, they know:</p>
                                <ul>
                                    <li>The probability of a recession, <InlineMath math="P(R) = 0.20" /> (20%).</li>
                                    <li>The probability of a recession AND a company default, <InlineMath math="P(D \cap R) = 0.05" /> (5%).</li>
                                </ul>
                                <p>Using the formula:</p>
                                <BlockMath math="P(D|R) = \frac{P(D \cap R)}{P(R)} = \frac{0.05}{0.20} = 0.25" />
                                <p>So, if there is a recession, there's a 25% chance the company will default. This is much higher than the unconditional 5% probability, showing that the economic condition provides crucial information.</p>
                            </CardContent>
                        </Card>
                    </Lesson>

                    <Lesson id="prob-independence" title="Independence of Events">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Two events, A and B, are **independent** if the occurrence of one does not affect the probability of the other. In other words, knowing B happened gives you no new information about A.</p>
                                <p>Mathematically, A and B are independent if:</p>
                                <BlockMath math="P(A|B) = P(A)" />
                                <p>If this holds, it leads to a very simple rule for calculating their joint probability:</p>
                                <BlockMath math="P(A \cap B) = P(A) \cdot P(B)" />
                                <Alert variant="destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    Do not confuse **independent** events with **mutually exclusive** events. Mutually exclusive events cannot happen at the same time (<InlineMath math="P(A \cap B) = 0" />). If you know one happened, the probability of the other is zero, so they are highly dependent!
                                  </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Consider two stocks, a tech company (T) and a utility company (U). We want to know if their daily returns are independent.</p>
                                <ul>
                                    <li>Let A be the event that Stock T has a positive return tomorrow. <InlineMath math="P(A) = 0.55" />.</li>
                                    <li>Let B be the event that Stock U has a positive return tomorrow. <InlineMath math="P(B) = 0.52" />.</li>
                                </ul>
                                <p>If these events are independent, the probability that both have a positive return is:</p>
                                <BlockMath math="P(A \cap B) = P(A) \cdot P(B) = 0.55 \times 0.52 = 0.286" />
                                <p>However, if historical data shows that <InlineMath math="P(A \cap B) = 0.35" />, then the events are **not independent**. The joint probability is higher than expected, indicating they tend to move together (positive correlation). This is a critical concept for diversification.</p>
                            </CardContent>
                        </Card>
                    </Lesson>
                    
                    <Lesson id="prob-multiplication-rule" title="The Multiplication Rule">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>The Multiplication Rule is a direct rearrangement of the conditional probability formula. It's used to find the probability of the intersection of two events.</p>
                                <p>The general form is:</p>
                                <BlockMath math="P(A \cap B) = P(A|B) \cdot P(B)" />
                                <p>And equivalently:</p>
                                <BlockMath math="P(A \cap B) = P(B|A) \cdot P(A)" />
                                <p>This allows us to calculate the joint probability if we know one conditional probability and one marginal probability.</p>
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
