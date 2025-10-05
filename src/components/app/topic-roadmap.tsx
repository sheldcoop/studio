
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface TopicRoadmapProps {
    subTopics: SubTopic[];
    completedConcepts: number;
}

export function TopicRoadmap({ subTopics, completedConcepts }: TopicRoadmapProps) {
    return (
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
    );
}
