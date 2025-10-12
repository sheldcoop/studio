
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/app/table-of-contents';
import type { SubTopic } from '@/lib/curriculum';
import { BrainCircuit, Code, BookOpen, BarChart, GraduationCap, Group, Bot } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Lesson = ({ id, title, children }: { id: string; title: string; children: React.ReactNode; }) => (
    <section id={id} className="scroll-mt-24">
        <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{title}</h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const subTopics: SubTopic[] = [
    { id: 'supervised-learning', title: 'Supervised Learning' },
    { id: 'unsupervised-learning', title: 'Unsupervised Learning' },
    { id: 'reinforcement-learning', title: 'Reinforcement Learning' },
];


export default function ThreeFlavorsOfLearningPage() {
    return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                <PageHeader
                    title="The Three Flavors of Learning"
                    description="Understanding the core paradigms of machine learning: Supervised, Unsupervised, and Reinforcement Learning."
                    variant="aligned-left"
                />

                <article className="space-y-16">
                    <Lesson id="supervised-learning" title="Supervised Learning: The Teacher">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="text-primary"/> Theory: Learning with Labeled Data</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Supervised learning is like learning with a teacher or a set of flashcards. The algorithm is given a dataset where each data point is **labeled** with the correct answer. The goal is for the model to learn the mapping function that turns the input (features) into the output (the label).</p>
                                <p>There are two main types of supervised learning:</p>
                                <ul>
                                    <li><strong>Classification:</strong> The output label is a category. The model learns to predict which class a data point belongs to. Examples: "Spam" or "Not Spam", "Buy" or "Sell".</li>
                                    <li><strong>Regression:</strong> The output label is a continuous numerical value. The model learns to predict a specific quantity. Example: Predicting the exact price of a stock tomorrow.</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p><strong>Example: Credit Default Prediction (Classification)</strong></p>
                                <p>A bank wants to predict whether a loan applicant will default. They train a model on a historical dataset of thousands of past loans.</p>
                                <ul>
                                    <li><strong>Features (Input):</strong> Applicant's income, credit score, loan amount, age, etc.</li>
                                    <li><strong>Label (Output):</strong> A binary value - `1` if the person defaulted, `0` if they paid it back successfully.</li>
                                </ul>
                                <p>After training, the model can take a new applicant's features and output a probability of them defaulting, allowing the bank to make a data-driven lending decision.</p>
                            </CardContent>
                        </Card>
                    </Lesson>

                    <Lesson id="unsupervised-learning" title="Unsupervised Learning: The Detective">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Group className="text-primary"/> Theory: Finding Hidden Structures</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Unsupervised learning is like being a detective given a box of evidence with no instructions. The data is **unlabeled**. The algorithm's job is to explore the data and find meaningful structures, patterns, or groups within it on its own.</p>
                                <p>Common types include:</p>
                                <ul>
                                    <li><strong>Clustering:</strong> Grouping similar data points together. Example: Grouping customers into different market segments based on their purchasing behavior.</li>
                                    <li><strong>Dimensionality Reduction:</strong> Simplifying data by reducing the number of variables (features) while preserving the most important information. Example: Principal Component Analysis (PCA).</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                             <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p><strong>Example: Asset Class Clustering (Clustering)</strong></p>
                                <p>An analyst wants to understand the "true" groupings of various financial assets, beyond traditional labels like "tech stock" or "industrial bond".</p>
                                <ul>
                                    <li><strong>Features (Input):</strong> A dataset containing various assets, each described by metrics like volatility, momentum, P/E ratio, correlation with the market, etc.</li>
                                    <li><strong>Goal (No Label):</strong> Find natural clusters in the data.</li>
                                </ul>
                                <p>The clustering algorithm might reveal surprising groups, such as a cluster of "low-volatility growth" assets that includes both tech stocks and certain corporate bonds, suggesting new diversification opportunities.</p>
                            </CardContent>
                        </Card>
                    </Lesson>
                    
                    <Lesson id="reinforcement-learning" title="Reinforcement Learning: The Game Player">
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> Theory: Learning Through Trial and Error</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p>Reinforcement Learning (RL) is like teaching a dog a new trick. You don't give it the answers directly. Instead, the algorithm (the "agent") learns by interacting with an environment. It takes actions, receives rewards or penalties, and over millions of trials, it learns a "policy" — a strategy for choosing actions that maximize its cumulative reward.</p>
                                <p>Key components:</p>
                                <ul>
                                    <li><strong>Agent:</strong> The learner or decision-maker.</li>
                                    <li><strong>Environment:</strong> The world the agent interacts with.</li>
                                    <li><strong>Action:</strong> A move the agent can make.</li>
                                    <li><strong>State:</strong> The current situation of the agent in the environment.</li>
                                    <li><strong>Reward:</strong> The feedback from the environment after an action.</li>
                                </ul>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle></CardHeader>
                            <CardContent className="prose prose-slate dark:prose-invert max-w-none text-base text-foreground/90 space-y-4">
                                <p><strong>Example: Optimal Trade Execution (RL)</strong></p>
                                <p>A trading firm wants to execute a large order (e.g., sell 1 million shares of a stock) with minimal market impact. Selling too fast will crash the price; selling too slow risks the price moving against them.</p>
                                 <ul>
                                    <li><strong>Agent:</strong> The trading algorithm.</li>
                                    <li><strong>Environment:</strong> The live electronic market (or a simulation of it).</li>
                                    <li><strong>State:</strong> Current stock price, order book depth, time remaining, shares left to sell.</li>
                                    <li><strong>Action:</strong> Sell X number of shares now, or wait.</li>
                                    <li><strong>Reward:</strong> A positive reward for selling at a good price, and a penalty for moving the market price negatively.</li>
                                </ul>
                                <p>Through repeated simulations, the RL agent learns a sophisticated policy for how to break up the large order and execute it over time to achieve the best possible average price.</p>
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
