
import ChangeOfBasisComponent from '@/app/(app)/linear-algebra-theory/change-of-basis';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'change-of-basis');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function ChangeOfBasisPage() {
    const topicInfo = allTopics.find(t => t.id === 'change-of-basis');
    if (!topicInfo) {
        notFound();
    }
    return <ChangeOfBasisComponent />;
}
