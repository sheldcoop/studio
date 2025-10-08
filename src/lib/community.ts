export type CommunityPost = {
    id: string;
    topic: string;
    author: string;
    replies: number;
    views: number;
    lastPost: {
        author: string;
        time: string;
    };
};

export const communityPosts: CommunityPost[] = [
    {
        id: '999',
        topic: 'This is a test post from the old, static file.',
        author: 'The Developer',
        replies: 0,
        views: 0,
        lastPost: { author: 'The Developer', time: 'Just now' },
    },
];
