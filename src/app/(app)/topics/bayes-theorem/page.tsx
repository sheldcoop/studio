
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Config ---
const TOTAL_PARTS = 1000;
const M1_RATIO = 0.3; // Machine 1 produces 30% of parts
const M2_RATIO = 0.7; // Machine 2 produces 70% of parts
const M1_DEFECT_RATE = 0.05; // 5%
const M2_DEFECT_RATE = 0.01; // 1%

type Part = {
  id: number;
  machine: '1' | '2';
  isDefective: boolean;
};

type Step = {
  title: string;
  description: string;
  buttonText: string;
};

const steps: Step[] = [
  {
    title: "The Initial State: The Full Batch",
    description: "Our factory has two machines. The old Machine 1 produces 30% of our parts, and the new Machine 2 produces 70%. This initial breakdown is our 'prior' belief. If we pick a part at random, we can be 30% sure it came from Machine 1. Let's find P(M1).",
    buttonText: "Run Quality Control",
  },
  {
    title: "Applying The Evidence: Finding Defects",
    description: "Now, let's introduce new evidence. We know the defect rate for each machine: Machine 1 has a 5% defect rate, and Machine 2 has a 1% rate. We'll now highlight all the defective parts from the full batch.",
    buttonText: "Isolate Defective Parts",
  },
  {
    title: "Restricting The Universe: The Defect Box",
    description: "A-ha! A defective part is found. Our world is no longer all 1000 parts. It's ONLY the defective ones. We can ignore everything else. This is the core of Bayes' theorem: new evidence shrinks our world of possibilities.",
    buttonText: "Calculate The Posterior",
  },
  {
    title: "The Visual Answer: The Posterior Probability",
    description: "Now for the key question: given that we have a defective part, what's the probability it came from the old Machine 1? Inside our new universe (the defect box), we can just count. The proportion of blue parts in the box is our new, updated belief: P(M1|Defective).",
    buttonText: "See The Formula",
  },
  {
    title: "The Formula is Just The Story",
    description: "The formula is simply a mathematical way of telling the story we just watched. It calculates the proportion of 'defects from M1' relative to the 'total pool of all defects', giving us our final, updated probability.",
    buttonText: "Restart Simulation",
  },
];

const FormulaPart = ({ id, visible, highlight, children }: { id: string, visible: boolean, highlight: boolean, children: React.ReactNode }) => (
    <span id={id} className={cn(
        "formula-part transition-all duration-500 ease-in-out px-2 py-1 rounded-md opacity-30",
        visible && "opacity-100",
        highlight && "bg-yellow-100 dark:bg-yellow-800 scale-110"
    )}>
        {children}
    </span>
);


export default function BayesTheoremPage() {
    const [parts, setParts] = useState<Part[]>([]);
    const [defectiveParts, setDefectiveParts] = useState<Part[]>([]);
    const [currentState, setCurrentState] = useState(0);
    const [isIsolating, setIsIsolating] = useState(false);

    const step = steps[currentState];

    const createFactoryFloor = () => {
        const newParts: Part[] = [];
        for (let i = 0; i < TOTAL_PARTS; i++) {
            const isM1 = i < (TOTAL_PARTS * M1_RATIO);
            const machine = isM1 ? '1' : '2';
            const defectRate = isM1 ? M1_DEFECT_RATE : M2_DEFECT_RATE;
            newParts.push({
                id: i,
                machine,
                isDefective: Math.random() < defectRate,
            });
        }
        setParts(newParts);
        const defects = newParts.filter(p => p.isDefective);
        // Ensure a reasonable number of defects for a good visual
        if (defects.length < 5 || defects.length > 50) {
           setTimeout(createFactoryFloor, 0);
        } else {
           setDefectiveParts(defects);
        }
    };
    
    useEffect(() => {
        createFactoryFloor();
    }, []);

    const handleNext = () => {
        setCurrentState((prev) => (prev + 1) % steps.length);
        if (currentState === steps.length - 1) { // Restarting
            createFactoryFloor();
            setIsIsolating(false);
        }
         if (currentState === 1) { // After 'Run Quality Control'
            setTimeout(() => setIsIsolating(true), 800);
        }
    };

    const getFormulaHighlight = (part: string) => {
        switch (currentState) {
            case 0: return part === 'p_h';
            case 1: return ['p_h', 'p_e_given_h'].includes(part);
            case 2: return ['p_h', 'p_e_given_h', 'p_e'].includes(part);
            case 3:
            case 4: return true;
            default: return false;
        }
    }

    const defectiveM1Count = defectiveParts.filter(p => p.machine === '1').length;
    const defectiveM2Count = defectiveParts.length - defectiveM1Count;
    const totalDefects = defectiveParts.length;
    const posteriorM1 = totalDefects > 0 ? defectiveM1Count / totalDefects : 0;
    const posteriorM2 = totalDefects > 0 ? defectiveM2Count / totalDefects : 0;

    return (
        <>
            <PageHeader
                title="The Factory Inspector: A Visual Guide to Bayes' Theorem"
                description="Build an intuition for how beliefs are updated with new evidence."
                variant="aligned-left"
            />
             <div className="w-full max-w-7xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Side: Visuals */}
                    <div className="space-y-6">
                         <div className={cn("w-full bg-muted/30 dark:bg-muted/50 rounded-lg shadow-inner aspect-[4/3] relative transition-opacity duration-1000", currentState >= 2 && 'opacity-30')}>
                            <div className="grid grid-cols-40 gap-px p-1">
                                {parts.map(part => (
                                    <div key={part.id} className={cn(
                                        "aspect-square rounded-sm transition-all duration-500",
                                        part.machine === '1' ? 'bg-blue-300' : 'bg-red-300',
                                        currentState >= 1 && part.isDefective && (part.machine === '1' ? 'bg-blue-700 scale-125 z-10 border border-white' : 'bg-red-700 scale-125 z-10 border border-white'),
                                        currentState >= 2 && !part.isDefective && "opacity-10 scale-90"
                                    )} />
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h3 className="text-xl font-bold text-center text-foreground/80">{currentState < 3 ? "Full Production Batch" : "Origin of Defective Part"}</h3>
                            <div>
                                <div className="flex justify-between font-medium mb-1 text-sm">
                                    <span>Machine 1 (Old)</span>
                                    <span>{currentState < 3 ? `${M1_RATIO*100}%` : `${(posteriorM1 * 100).toFixed(0)}%`}</span>
                                </div>
                                <div className="w-full rounded-full h-6 bg-muted overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-700" style={{ width: `${currentState < 3 ? M1_RATIO*100 : posteriorM1 * 100}%`}}>
                                        {currentState < 3 ? `${TOTAL_PARTS * M1_RATIO} parts` : `${defectiveM1Count} defects`}
                                    </div>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between font-medium mb-1 text-sm">
                                    <span>Machine 2 (New)</span>
                                    <span>{currentState < 3 ? `${M2_RATIO*100}%` : `${(posteriorM2 * 100).toFixed(0)}%`}</span>
                                </div>
                                <div className="w-full rounded-full h-6 bg-muted overflow-hidden">
                                    <div className="bg-red-500 h-full rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-700" style={{ width: `${currentState < 3 ? M2_RATIO*100 : posteriorM2 * 100}%`}}>
                                       {currentState < 3 ? `${TOTAL_PARTS * M2_RATIO} parts` : `${defectiveM2Count} defects`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: The Story & Controls */}
                    <div className="flex flex-col h-full bg-muted/30 dark:bg-muted/50 p-6 rounded-lg">
                        <div className="flex-grow space-y-4">
                            <h2 className="text-2xl font-bold text-foreground font-headline">{step.title}</h2>
                            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">{step.description}</p>
                            {currentState === 3 && (
                                 <div className="text-center font-medium text-lg p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary/20">
                                     New Universe: <span className="font-bold text-blue-400">{defectiveM1Count} from M1</span> + <span className="font-bold text-red-400">{defectiveM2Count} from M2</span> = {totalDefects} total defects.
                                 </div>
                            )}
                        </div>
                        
                        <div className="font-serif text-center bg-background/70 p-3 rounded-lg mt-6 text-xl md:text-2xl text-foreground/80">
                            <FormulaPart id="p_h_given_e" visible={getFormulaHighlight('p_h_given_e')} highlight={currentState === 3}>P(M₁|D)</FormulaPart>
                            <span className="font-bold mx-1">=</span>
                            <span className="inline-block">
                                <span className="block border-b-2 border-current pb-1">
                                    <FormulaPart id="p_e_given_h" visible={getFormulaHighlight('p_e_given_h')} highlight={currentState === 1}>P(D|M₁)</FormulaPart>
                                    <span className="mx-1 font-bold">⋅</span>
                                    <FormulaPart id="p_h" visible={getFormulaHighlight('p_h')} highlight={currentState === 0}>P(M₁)</FormulaPart>
                                </span>
                                <FormulaPart id="p_e" visible={getFormulaHighlight('p_e')} highlight={currentState === 2}>P(D)</FormulaPart>
                            </span>
                        </div>

                        <div className="text-center mt-8">
                            <Button onClick={handleNext} size="lg" className="w-full max-w-xs shadow-lg transform hover:scale-105">
                                {step.buttonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
