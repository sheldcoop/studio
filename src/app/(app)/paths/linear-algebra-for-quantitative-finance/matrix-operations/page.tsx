
import MatrixOperationsComponent from '@/app/(app)/linear-algebra-theory/matrix-operations';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'matrix-operations');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function MatrixOperationsPage() {
    const topicInfo = allTopics.find(t => t.id === 'matrix-operations');
    if (!topicInfo) {
        notFound();
    }
    return <MatrixOperationsComponent />;
}
