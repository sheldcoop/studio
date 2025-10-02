
import type { SubTopic } from '@/lib/curriculum';
import { TopicSectionCard } from './topic-section-card';
import { BookOpen, Code, BrainCircuit, BarChart } from 'lucide-react';

interface TopicSectionProps {
    subTopic: SubTopic;
}

export function TopicSection({ subTopic }: TopicSectionProps) {
    return (
        <section id={subTopic.id} className="scroll-mt-24">
            <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
            <div className="space-y-8">
                <TopicSectionCard icon={BookOpen} title="Theory" isEmpty />
                <TopicSectionCard icon={Code} title="Interactive Demo" isEmpty />
                <TopicSectionCard icon={BrainCircuit} title="Practice Problems" isEmpty />
                <TopicSectionCard icon={BarChart} title="Quant Finance Application" isEmpty />
            </div>
        </section>
    );
}
