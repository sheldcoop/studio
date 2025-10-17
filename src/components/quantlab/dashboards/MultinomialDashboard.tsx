
'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import 'katex/dist/katex.min.css';
import { multinomialProbability } from '@/lib/math';

export function MultinomialDashboard() {
    const [trials, setTrials] = useState(10);
    const [outcomes, setOutcomes] = useState([
        { name: 'Win', prob: 0.5, count: 5 },
        { name: 'Loss', prob: 0.3, count: 3 },
        { name: 'Draw', prob: 0.2, count: 2 },
    ]);
    const [calculatedProb, setCalculatedProb] = useState<number | null>(null);
    
    const handleProbChange = (index: number, newProb: number) => {
        const newOutcomes = [...outcomes];
        newOutcomes[index].prob = newProb;
        
        // Normalize probabilities
        const totalProb = newOutcomes.reduce((sum, o, i) => i !== index ? sum + o.prob : sum, newProb);
        if (totalProb > 1) {
            const excess = totalProb - 1;
            const otherSum = totalProb - newProb;
            if (otherSum > 0) {
                 newOutcomes.forEach((o, i) => {
                    if (i !== index) {
                        o.prob -= excess * (o.prob / otherSum);
                    }
                });
            }
        }
        
        setOutcomes(newOutcomes);
    }
    
    const handleCountChange = (index: number, newCount: number) => {
        const newOutcomes = [...outcomes];
        newOutcomes[index].count = newCount;
        setOutcomes(newOutcomes);
    }

    const calculate = () => {
        const counts = outcomes.map(o => o.count);
        const probs = outcomes.map(o => o.prob);
        const totalCount = counts.reduce((a, b) => a + b, 0);
        if (totalCount !== trials) {
            alert('The sum of outcome counts must equal the total number of trials.');
            return;
        }
        setCalculatedProb(multinomialProbability(trials, counts, probs));
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="trials-slider">Total Number of Trials (n): {trials}</Label>
                <Slider id="trials-slider" min={1} max={50} step={1} value={[trials]} onValueChange={(val) => setTrials(val[0])} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Probability (p_i)</TableHead>
                        <TableHead>Desired Count (x_i)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {outcomes.map((outcome, index) => (
                        <TableRow key={index}>
                            <TableCell>{outcome.name}</TableCell>
                            <TableCell>
                                <Input type="number" value={outcome.prob} onChange={e => handleProbChange(index, parseFloat(e.target.value))} step="0.01" min="0" max="1" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" value={outcome.count} onChange={e => handleCountChange(index, parseInt(e.target.value))} step="1" min="0" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={calculate} className="w-full">Calculate Probability</Button>
            {calculatedProb !== null && (
                 <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">Calculated Probability</p>
                    <p className="text-3xl font-bold font-mono tracking-tight text-primary">{calculatedProb.toExponential(4)}</p>
                </div>
            )}
        </div>
    );
}
