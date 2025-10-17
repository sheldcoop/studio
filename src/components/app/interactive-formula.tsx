
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormulaBlock } from '@/components/app/formula-block';
import { BlockMath, InlineMath } from 'react-katex';

interface InteractiveFormulaProps {
    title: string;
    description: string;
    formula: string;
    children: (highlightValue: string | number | null, onHover: (value: string | number | null) => void) => React.ReactNode;
    explanation: React.ReactNode;
}

export function InteractiveFormula({ title, description, formula, children, explanation }: InteractiveFormulaProps) {
    const [highlightValue, setHighlightValue] = useState<string | number | null>(null);

    const handleHover = (value: string | number | null) => {
        setHighlightValue(value);
    };

    const interactiveFormula = formula
        .replace(/k/g, `<span class="hover:text-primary transition-colors" onMouseEnter={() => handleHover('k')} onMouseLeave={() => handleHover(null)}>k</span>`)
        .replace(/n/g, `<span class="hover:text-primary transition-colors" onMouseEnter={() => handleHover('n')} onMouseLeave={() => handleHover(null)}>n</span>`)
        .replace(/p/g, `<span class="hover:text-primary transition-colors" onMouseEnter={() => handleHover('p')} onMouseLeave={() => handleHover(null)}>p</span>`);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <FormulaBlock>
                    <BlockMath math={formula} />
                </FormulaBlock>
                <div className="text-sm mt-4 prose prose-invert max-w-none">
                    {explanation}
                </div>
                <div className="mt-4">
                    {children(highlightValue, handleHover)}
                </div>
            </CardContent>
        </Card>
    );
}
