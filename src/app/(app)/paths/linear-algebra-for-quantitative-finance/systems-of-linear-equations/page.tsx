import SystemsOfLinearEquationsComponent from '@/app/(app)/linear-algebra-theory/systems-of-linear-equations';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'systems-of-linear-equations');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function SystemsOfLinearEquationsPage() {
    const topicInfo = allTopics.find(t => t.id === 'systems-of-linear-equations');
    if (!topicInfo) {
        notFound();
    }
    return <SystemsOfLinearEquationsComponent />;
}
