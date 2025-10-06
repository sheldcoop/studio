'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface DistributionInfo {
    title: string;
    description: string;
    card1: {
        title: string;
        description: string;
    };
    card2: {
        title: string;
        description: string;
        formula: string;
        formulaItems: string[];
    };
    card3: {
        title: string;
        description: string;
    };
}

interface Parameter {
    name: string;
    label: string;
    min: number;
    max: number;
    step: number;
    initialValue: number;
}

interface ProbabilityDistributionPageClientProps {
    distribution: DistributionInfo;
    parameters: Parameter[];
    ChartComponent: React.ComponentType<any>;
}

export default function ProbabilityDistributionPageClient({
    distribution,
    parameters,
    ChartComponent,
}: ProbabilityDistributionPageClientProps) {
    
    const initialState = parameters.reduce((acc, param) => {
        acc[param.name] = param.initialValue;
        return acc;
    }, {} as { [key: string]: number });

    const [paramValues, setParamValues] = useState(initialState);

    const handleSliderChange = (name: string, value: number) => {
        setParamValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <PageHeader
                title={distribution.title}
                description={distribution.description}
                variant="aligned-left"
            />
            <div className="mx-auto max-w-5xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">{distribution.card1.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
                        <p>{distribution.card1.description}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">{distribution.card2.title}</CardTitle>
                        <CardDescription>{distribution.card2.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-muted/50 p-4 text-center">
                            <BlockMath math={distribution.card2.formula} />
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                           {distribution.card2.formulaItems.map((item, index) => (
                                <li key={index}><InlineMath math={item} /></li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">{distribution.card3.title}</CardTitle>
                        <CardDescription>{distribution.card3.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            {parameters.map(param => (
                                <div key={param.name} className="space-y-3">
                                    <Label htmlFor={`${param.name}-slider`}>{param.label}: {paramValues[param.name].toFixed(param.step < 1 ? 2 : 0)}</Label>
                                    <Slider
                                        id={`${param.name}-slider`}
                                        min={param.min}
                                        max={param.max}
                                        step={param.step}
                                        value={[paramValues[param.name]]}
                                        onValueChange={(val) => handleSliderChange(param.name, val[0])}
                                    />
                                </div>
                            ))}
                        </div>
                        <ChartComponent {...paramValues} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}