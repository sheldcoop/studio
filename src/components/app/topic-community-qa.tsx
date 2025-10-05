
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

export function TopicCommunityQA() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Community Q&A</CardTitle>
                <p className="text-muted-foreground">Have a question? Ask the community!</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Textarea placeholder="Type your question about this topic..." />
                    <div className="flex justify-end">
                        <Button><Send className="h-4 w-4 mr-2" /> Submit Question</Button>
                    </div>
                </div>
                <div className="space-y-6 border-t pt-6">
                    {/* Mock Q&A Item 1 */}
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarFallback>Q</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-sm font-semibold">QuantAspirant</p>
                            <p className="text-sm text-foreground/90">How does this concept apply in a high-volatility environment?</p>
                        </div>
                    </div>
                    {/* Mock Q&A Item 2 */}
                        <div className="flex items-start gap-4 pl-8">
                        <Avatar>
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 border-l-2 border-primary/50 pl-4">
                            <p className="text-sm font-semibold">SeniorQuant</p>
                            <p className="text-sm text-foreground/90">Great question. In high-volatility regimes, the assumptions often break down. You need to be cautious about model parameters and consider using more robust, non-parametric approaches.</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <button className="hover:text-primary">Reply</button>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
