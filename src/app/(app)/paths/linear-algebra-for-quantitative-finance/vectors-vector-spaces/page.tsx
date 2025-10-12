import VectorsAndVectorSpacesComponent from '@/app/(app)/linear-algebra-theory/vectors-and-vector-spaces';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'vectors-vector-spaces');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function VectorsAndVectorSpacesPage() {
    const topicInfo = allTopics.find(t => t.id === 'vectors-vector-spaces');
    if (!topicInfo) {
        notFound();
    }
    return <VectorsAndVectorSpacesComponent />;
}
