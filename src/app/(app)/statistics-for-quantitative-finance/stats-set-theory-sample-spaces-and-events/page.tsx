
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/app/table-of-contents';
import type { SubTopic } from '@/lib/curriculum';
import { BookOpen, BarChart, Scaling, BrainCircuit } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'stats-set-theory-sample-spaces-and-events');
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
    { id: 'sample-space', title: 'What is a Sample Space?' },
    { id: 'events', title: 'Events & Set Notation' },
    { id: 'axioms', title: 'The Axioms of Probability' },
];


export default function SetTheoryPage() {
    const topicInfo = allTopics.find(t => t.id === 'stats-set-theory-sample-spaces-and-events');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                <PageHeader
                    title="Set Theory, Sample Spaces, and Events"
                    description="The language and foundational rules of probability theory."
                    variant="aligned-left"
                />

                <article className="space-y-16">
                    <Lesson id="sample-space" title="What is a Sample Space?">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>The **sample space**, denoted by <InlineMath math="\Omega" />, is the set of all possible outcomes of a random experiment. Each outcome is a point or element within the sample space.</p>
                                <ul>
                                    <li>For a single coin flip: <InlineMath math="\Omega = \{H, T\}" /> (Heads, Tails)</li>
                                    <li>For a six-sided die roll: <InlineMath math="\Omega = \{1, 2, 3, 4, 5, 6\}" /></li>
                                </ul>
                                <p>The sample space must be **exhaustive** (it includes all possibilities) and its outcomes must be **mutually exclusive** (no two outcomes can happen at the same time).</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Consider modeling the next day's movement of a stock. A very simple sample space could be:</p>
                                <BlockMath math="\Omega = \{\text{Up}, \text{Down}, \text{Unchanged}\}" />
                                <p>A more complex, continuous sample space would be the set of all possible percentage returns, which is the set of all real numbers: <InlineMath math="\Omega = \mathbb{R}" />.</p>
                                <p>Defining the sample space is the first step in building any probabilistic model of asset returns.</p>
                            </CardContent>
                        </Card>
                    </Lesson>

                    <Lesson id="events" title="Events & Set Notation">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>An **event** is a subset of the sample space <InlineMath math="\Omega" />. It's a collection of one or more outcomes.</p>
                                <p>Using the die roll example (<InlineMath math="\Omega = \{1, 2, 3, 4, 5, 6\}" />):</p>
                                <ul>
                                    <li>The event "rolling an even number" is the set <InlineMath math="A = \{2, 4, 6\}" />.</li>
                                    <li>The event "rolling a number greater than 4" is the set <InlineMath math="B = \{5, 6\}" />.</li>
                                </ul>
                                <p>We can use set theory to combine events:</p>
                                <ul>
                                    <li>**Union (<InlineMath math="A \cup B" />):** Event A OR B occurs. For our example, <InlineMath math="A \cup B = \{2, 4, 5, 6\}" />.</li>
                                    <li>**Intersection (<InlineMath math="A \cap B" />):** Event A AND B occur. For our example, <InlineMath math="A \cap B = \{6\}" />.</li>
                                    <li>**Complement (<InlineMath math="A^c" />):** Event A does not occur. For our example, <InlineMath math="A^c = \{1, 3, 5\}" />.</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Let's define events for a stock's return (<InlineMath math="R" />) in a day:</p>
                                <ul>
                                    <li>Event A: The return is positive (<InlineMath math="R > 0" />).</li>
                                    <li>Event B: The return is greater than 2% (<InlineMath math="R > 0.02" />).</li>
                                    <li>Event C: The return is less than -2% (<InlineMath math="R < -0.02" />).</li>
                                </ul>
                                <p>The event "a large price move" can be described as <InlineMath math="B \cup C" />. A risk manager is interested in the probability of this event, <InlineMath math="P(B \cup C)" />.</p>
                            </CardContent>
                        </Card>
                    </Lesson>
                    
                    <Lesson id="axioms" title="The Axioms of Probability">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle></Header>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>All of probability theory is built on three simple rules, known as the Kolmogorov Axioms:</p>
                                <ol>
                                    <li><strong>Non-negativity:</strong> The probability of any event is non-negative. <InlineMath math="P(A) \geq 0" /> for any event A.</li>
                                    <li><strong>Normalization:</strong> The probability of the entire sample space is 1. <InlineMath math="P(\Omega) = 1" />. (Something must happen).</li>
                                    <li><strong>Additivity:</strong> For any sequence of mutually exclusive events <InlineMath math="A_1, A_2, ..." /> (meaning they can't happen at the same time), the probability that one of them occurs is the sum of their individual probabilities.</li>
                                </ol>
                                <BlockMath math="P(A_1 \cup A_2 \cup ...) = P(A_1) + P(A_2) + ..." />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Financial Implication</CardTitle></Header>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>The axioms ensure our models are logical. For example, the Additivity axiom is crucial for risk management.</p>
                                <p>If Event A is "Stock A defaults" and Event B is "Stock B defaults", and they are mutually exclusive (in this simplified case), then the probability of "at least one default" is <InlineMath math="P(A \cup B) = P(A) + P(B)" />. This allows risk managers to sum up the probabilities of individual, disjoint negative events to get a picture of overall portfolio risk.</p>
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
