
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { type Topic, type SubTopic } from '@/lib/curriculum';
import { cn } from '@/lib/utils';
import { InteractiveTestWrapper } from '@/components/app/interactive-test-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart, CheckCircle, Clock, PlayCircle, Book, FileText, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

function TableOfContents({ subTopics }: { subTopics: SubTopic[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px' }
        );

        const elements = subTopics.map(sub => document.getElementById(sub.id)).filter(Boolean);
        elements.forEach(el => el && observer.observe(el));

        return () => {
            elements.forEach(el => el && observer.unobserve(el));
        };
    }, [subTopics]);

    return (
        <aside className="sticky top-24 h-fit w-64 flex-shrink-0 hidden lg:block">
            <h3 className="font-semibold mb-4">On this page</h3>
            <ul className="space-y-2">
                {subTopics.map((sub) => (
                    <li key={sub.id}>
                        <a 
                            href={`#${sub.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(sub.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className={cn(
                                "flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                                activeId === sub.id && "font-medium text-primary"
                            )}
                        >
                            <CheckCircle className={cn("h-4 w-4", activeId === sub.id ? "text-primary" : "text-muted-foreground/50")} />
                            <span>{sub.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
             <div className="mt-8">
                <h4 className="font-semibold mb-2 text-sm">Related Topics</h4>
                 <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
             </div>
        </aside>
    )
}

function SimpleContentPage({ topicInfo }: { topicInfo: Topic }) {
  const { title, description, content } = topicInfo;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader title={title} description={description} variant="aligned-left" />
        {content ? (
             <div className="prose prose-invert max-w-none space-y-8" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
                <p className="text-muted-foreground">This topic is under construction. Content will be added here soon.</p>
            </div>
        )}
    </div>
  );
}


export function TopicPageClient({ topicInfo }: { topicInfo: Topic }) {
  const { title, description, subTopics, interactiveExamples, content } = topicInfo;

  // Render interactive test page if examples are available
  if (interactiveExamples) {
      return <InteractiveTestWrapper topic={topicInfo} />;
  }

  // If there ARE sub-topics, render the new, detailed structure.
  if (subTopics && subTopics.length > 0) {
    const completedConcepts = subTopics.length > 3 ? 1 : 0; // Simulate some progress
    const totalConcepts = subTopics.length;
    const progress = (completedConcepts / totalConcepts) * 100;
    const estimatedTime = totalConcepts * 15; // Placeholder time

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-16">
                <div className="flex-1 min-w-0">
                    {/* 1. Hero Section */}
                    <PageHeader title={title} description={description} variant="aligned-left" />
                    <Card className="mb-8">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                                <p className="font-bold text-lg text-primary">{completedConcepts}/{totalConcepts} Concepts Completed</p>
                            </div>
                            <div className="w-1/3">
                                <Progress value={progress} />
                            </div>
                            <div className="text-right">
                                 <p className="text-sm font-medium text-muted-foreground">Est. Time</p>
                                <p className="font-bold text-lg">{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Learning Path / Table of Contents (Visual Roadmap) - simplified for now */}
                     <div className="mb-12">
                        <h2 className="font-headline text-2xl font-bold mb-4">Learning Roadmap</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subTopics.map((sub, index) => {
                            const status = index < completedConcepts ? 'completed' : (index === completedConcepts ? 'in-progress' : 'locked');
                            return (
                            <a href={`#${sub.id}`} key={sub.id} className="group">
                                <Card className={cn("text-center p-4 h-full transition-all duration-300", 
                                status === 'locked' ? 'bg-muted/50 opacity-60' : 'hover:border-primary hover:-translate-y-1 hover:shadow-lg',
                                status === 'in-progress' && 'border-primary ring-2 ring-primary/50'
                                )}>
                                <div className="flex justify-center mb-2">
                                    {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                                    {status === 'in-progress' && <PlayCircle className="h-6 w-6 text-primary" />}
                                    {status === 'locked' && <Clock className="h-6 w-6 text-muted-foreground" />}
                                </div>
                                <h4 className="font-semibold text-sm">{sub.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">~15 min</p>
                                </Card>
                            </a>
                            )
                        })}
                        </div>
                    </div>


                    {/* 3. Content Area */}
                    <article className="space-y-16">
                        {subTopics.map(sub => (
                            <section key={sub.id} id={sub.id} className="scroll-mt-24">
                                <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{sub.title}</h2>
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
                                        <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                                            <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
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
                        ))}
                    </article>
                    
                    {/* 4. Additional Resources & Q&A */}
                    <div className="mt-16 space-y-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Additional Resources</CardTitle>
                                <p className="text-muted-foreground">Dive deeper with these recommended books and papers.</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-4">
                                        <Book className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">"Options, Futures, and Other Derivatives" by John C. Hull</h4>
                                            <p className="text-sm text-muted-foreground">The bible of derivatives pricing. A must-have on any quant's bookshelf.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Original Black-Scholes Paper (1973)</h4>
                                            <p className="text-sm text-muted-foreground">"The Pricing of Options and Corporate Liabilities" - a foundational paper in finance.</p>
                                        </div>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                             <CardHeader>
                                <CardTitle className="font-headline text-2xl">Community Q&amp;A</CardTitle>
                                <p className="text-muted-foreground">Have a question? Ask the community!</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Textarea placeholder="Type your question about this topic..." />
                                    <div className="flex justify-end">
                                        <Button><Send className="h-4 w-4 mr-2" /> Submit Question</Button>
                                    </div>
                                </div>
                                <div className="space-y-6 border-t pt-6">
                                    {/* Mock Q&A Item 1 */}
                                    <div className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarFallback>Q</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">QuantAspirant</p>
                                            <p className="text-sm text-foreground/90">How does this concept apply in a high-volatility environment?</p>
                                        </div>
                                    </div>
                                    {/* Mock Q&A Item 2 */}
                                     <div className="flex items-start gap-4 pl-8">
                                        <Avatar>
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 border-l-2 border-primary/50 pl-4">
                                            <p className="text-sm font-semibold">SeniorQuant</p>
                                            <p className="text-sm text-foreground/90">Great question. In high-volatility regimes, the assumptions often break down. You need to be cautious about model parameters and consider using more robust, non-parametric approaches.</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                <button className="hover:text-primary">Reply</button>
                                                <span>2 hours ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
                {/* 5. Sticky Sidebar */}
                <TableOfContents subTopics={subTopics} />
            </div>
        </div>
    );
  }

  // If there are no sub-topics and no interactive examples, treat it as a simple content page.
  return <SimpleContentPage topicInfo={topicInfo} />;
}
