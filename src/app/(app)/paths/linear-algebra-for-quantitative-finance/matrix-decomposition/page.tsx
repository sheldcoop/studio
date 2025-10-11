import MatrixDecompositionComponent from '@/app/(app)/quantlab/matrix-decomposition/component';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'matrix-decomposition');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function MatrixDecompositionPage() {
    const topicInfo = allTopics.find(t => t.id === 'matrix-decomposition');
    if (!topicInfo) {
        notFound();
    }
    return <MatrixDecompositionComponent />;
}