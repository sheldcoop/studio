
import FourFundamentalSubspacesComponent from '@/app/(app)/linear-algebra-theory/four-fundamental-subspaces';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'the-four-fundamental-subspaces');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function FourFundamentalSubspacesPage() {
    const topicInfo = allTopics.find(t => t.id === 'the-four-fundamental-subspaces');
    if (!topicInfo) {
        notFound();
    }
    return <FourFundamentalSubspacesComponent />;
}
