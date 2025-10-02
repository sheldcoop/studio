
'use client';

import type { SubTopic } from '@/lib/curriculum';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningRoadmapProps {
    subTopics: SubTopic[];
}

export function LearningRoadmap({ subTopics }: LearningRoadmapProps) {
    // This is placeholder logic. It would come from a progress hook in a real app.
    const completedConcepts = subTopics.length > 3 ? 1 : 0; 
    
    return (
        <div className="mb-12">
            <h2 className="font-headline text-2xl font-bold mb-4">Learning Roadmap</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subTopics.map((sub, index) => {
                    const status = index < completedConcepts ? 'completed' : (index === completedConcepts ? 'in-progress' : 'locked');
                    return (
                        <a href={`#${sub.id}`} key={sub.id} className="group">
                            <Card className={cn(
                                "text-center p-4 h-full transition-all duration-300",
                                status === 'locked' ? 'bg-muted/50 opacity-60 cursor-not-allowed' : 'hover:border-primary hover:-translate-y-1 hover:shadow-lg',
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
    );
}
