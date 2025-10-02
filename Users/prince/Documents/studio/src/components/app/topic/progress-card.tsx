
'use client';

import type { SubTopic } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
    subTopics: SubTopic[];
}

export function ProgressCard({ subTopics }: ProgressCardProps) {
    // This is placeholder logic. In a real app, this would come from a progress hook.
    const completedConcepts = subTopics.length > 3 ? 1 : 0;
    const totalConcepts = subTopics.length;
    const progress = (completedConcepts / totalConcepts) * 100;
    const estimatedTime = totalConcepts * 15; // Placeholder time
    
    return (
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
    );
}
