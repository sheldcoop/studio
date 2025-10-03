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
        topic: 'Best resources for understanding Ito\'s Lemma?',
        author: 'newbie_quant',
        replies: 12,
        views: 125,
        lastPost: { author: 'quant_master', time: '2 hours ago' },
    },
    {
        id: '2',
        topic: 'PCA for Pairs Trading - Does it work?',
        author: 'algo_trader_88',
        replies: 8,
        views: 98,
        lastPost: { author: 'stat_arb_king', time: '5 hours ago' },
    },
    {
        id: '3',
        topic: 'Interview Experience at Jane Street (First Round)',
        author: 'future_hf_trader',
        replies: 25,
        views: 543,
        lastPost: { author: 'jane_street_alum', time: '1 day ago' },
    },
    {
        id: '4',
        topic: 'Python vs C++ for high-frequency trading',
        author: 'speed_demon',
        replies: 42,
        views: 890,
        lastPost: { author: 'c++_purist', time: '1 day ago' },
    },
    {
        id: '5',
        topic: 'GARCH model implementation query',
        author: 'volatility_smile',
        replies: 5,
        views: 67,
        lastPost: { author: 'econometrics_wiz', time: '2 days ago' },
    },
];
