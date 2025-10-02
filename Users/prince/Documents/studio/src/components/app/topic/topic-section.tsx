
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

// Reusable empty state component
function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

interface TopicSectionCardProps {
    icon: React.ElementType;
    title: string;
    children?: React.ReactNode;
    isEmpty?: boolean;
}

function TopicSectionCard({ icon: Icon, title, children, isEmpty = false }: TopicSectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-primary"/> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? <EmptyState message={`${title} content coming soon.`} /> : children}
      </CardContent>
    </Card>
  );
}
