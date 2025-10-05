
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Book, FileText } from 'lucide-react';

export function TopicResources() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Additional Resources</CardTitle>
                <p className="text-muted-foreground">Dive deeper with these recommended books and papers.</p>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    <li className="flex items-start gap-4">
                        <Book className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">"Options, Futures, and Other Derivatives" by John C. Hull</h4>
                            <p className="text-sm text-muted-foreground">The bible of derivatives pricing. A must-have on any quant's bookshelf.</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-4">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold">Original Black-Scholes Paper (1973)</h4>
                            <p className="text-sm text-muted-foreground">"The Pricing of Options and Corporate Liabilities" - a foundational paper in finance.</p>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
}
