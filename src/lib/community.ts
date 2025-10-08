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
        id: '1',
        topic: 'How to prepare for a quant interview?',
        author: 'QuantAspirant',
        replies: 12,
        views: 1520,
        lastPost: { author: 'SeniorQuant', time: '2h ago' },
    },
    {
        id: '2',
        topic: 'Best resources for learning Stochastic Calculus?',
        author: 'CalculusConqueror',
        replies: 8,
        views: 980,
        lastPost: { author: 'MathWhiz', time: '5h ago' },
    },
    {
        id: '3',
        topic: 'Discussion: Is the market truly efficient?',
        author: 'MarketPhilosopher',
        replies: 25,
        views: 2300,
        lastPost: { author: 'EconMajor', time: '1d ago' },
    },
];
