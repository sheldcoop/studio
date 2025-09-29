
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// --- Example 1: The Factory Inspector ---

const FactoryInspectorVisualization = () => {
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
        description: "The factory floor shows our 'prior' belief. Before inspecting any parts, we know that if we pick one at random, there's a 30% chance it's from Machine 1.",
        buttonText: "Run Quality Control",
      },
      {
        title: "Applying The Evidence: Finding Defects",
        description: "Now, let's introduce new evidence. We run a quality control check based on the known defect rates for each machine and highlight all the defective parts from the full batch.",
        buttonText: "Isolate Defective Parts",
      },
      {
        title: "Restricting The Universe: The Defect Box",
        description: "The moment a defective part is found, our world shrinks. We are no longer concerned with all 1000 parts; our focus shifts ONLY to the defective ones. This is the core of Bayes' theorem: new evidence shrinks the world of possibilities.",
        buttonText: "Calculate The Posterior",
      },
      {
        title: "The Visual Answer: The Posterior Probability",
        description: "Now we can answer our key question. Inside our new, smaller universe (the defect box), we can just count. The proportion of blue parts (from Machine 1) inside the box is our new, updated belief: P(M1|Defective).",
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
            highlight && "bg-primary/10 scale-110"
        )}>
            {children}
        </span>
    );

    const CalculationStep = ({ title, calculation, result, isVisible }: { title: string; calculation: React.ReactNode; result: string; isVisible: boolean }) => (
      <div className={cn("transition-opacity duration-700 ease-in-out", isVisible ? "opacity-100" : "opacity-0")}>
        <p className="font-semibold text-primary">{title}</p>
        <div className="mt-1 flex items-center justify-between rounded-lg bg-muted/70 p-2 font-mono text-sm">
          <span>{calculation}</span>
          <span className="font-bold text-foreground">{result}</span>
        </div>
      </div>
    );

    const CalculationBreakdown = ({ currentState }: { currentState: number }) => {
        const p_d_m1 = M1_DEFECT_RATE;
        const p_m1 = M1_RATIO;
        const p_d_m2 = M2_DEFECT_RATE;
        const p_m2 = M2_RATIO;
        const p_d = (p_d_m1 * p_m1) + (p_d_m2 * p_m2);
        const p_m1_d = (p_d_m1 * p_m1) / p_d;

        return (
            <Card className="mt-6">
                <CardHeader className="pb-2">
                    <CardTitle className="font-headline text-lg">Calculation Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <CalculationStep
                        title="1. Prior & Likelihood (Given)"
                        calculation={<>P(M1) & P(D|M1)</>}
                        result={`${p_m1.toFixed(2)} & ${p_d_m1.toFixed(2)}`}
                        isVisible={currentState >= 0}
                    />
                    <CalculationStep
                        title="2. Total Probability of Defect P(D)"
                        calculation={<>(P(D|M1) * P(M1)) + (P(D|M2) * P(M2))</>}
                        result={`= ${p_d.toFixed(4)}`}
                        isVisible={currentState >= 2}
                    />
                     <CalculationStep
                        title="3. Posterior Probability P(M1|D)"
                        calculation={<>(P(D|M1) * P(M1)) / P(D)</>}
                        result={`= ${p_m1_d.toFixed(4)}`}
                        isVisible={currentState >= 3}
                    />
                </CardContent>
            </Card>
        );
    };

    const [parts, setParts] = useState<Part[]>([]);
    const [defectiveParts, setDefectiveParts] = useState<Part[]>([]);
    const [currentState, setCurrentState] = useState(0);

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
        const nextState = (currentState + 1) % steps.length;
        setCurrentState(nextState);
        if (nextState === 0) { // Restarting
            createFactoryFloor();
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
      <div className="w-full bg-card text-card-foreground rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side: Visuals */}
              <div className="space-y-6">
                   <div className="w-full bg-muted/30 dark:bg-muted/50 rounded-lg shadow-inner aspect-[4/3] p-2">
                      <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-px">
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

                  <CalculationBreakdown currentState={currentState} />

                  <div className="text-center mt-8">
                      <Button onClick={handleNext} size="lg" className="w-full max-w-xs shadow-lg transform hover:scale-105">
                          {step.buttonText}
                      </Button>
                  </div>
              </div>
          </div>
      </div>
    )
}

// --- Example 2: The Geometric Derivation ---
const GeometricBayesVisualization = () => {
  const [currentState, setCurrentState] = useState(0);

  const GEOMETRY = {
      h: { x: 10, y: 10, width: 80, height: 25 },
      e: { x: 10, y: 20, width: 40, height: 60 },
      intersection: { x: 10, y: 20, width: 40, height: 15 }
  };

  const PROBS = useMemo(() => {
    const h_area = GEOMETRY.h.width * GEOMETRY.h.height;
    const e_area = GEOMETRY.e.width * GEOMETRY.e.height;
    const int_area = GEOMETRY.intersection.width * GEOMETRY.intersection.height;
    const total_area = 10000;
    
    const h = h_area / total_area;
    const e = e_area / total_area;
    const intersection = int_area / total_area;

    return {
      h,
      e,
      intersection,
      e_given_h: intersection / h,
      h_given_e: intersection / e,
    };
  }, [GEOMETRY]);

  const steps = [
      {
          title: "The Universe of Possibilities",
          description: "Imagine this square represents all possible weather for a day. Based on historical data, the chance of rain is represented by the blue area. This is our **Prior Probability, P(Rain)**.",
          buttonText: "Introduce Evidence",
      },
      {
          title: "Calculating the Intersection",
          description: "We wake up and see it's cloudy (the red area). The numerator, **P(Cloudy|Rain) ⋅ P(Rain)**, calculates the area where it is both cloudy AND it rains.",
          buttonText: "Rescale the Universe",
      },
      {
          title: "The Bayesian Leap",
          description: "Knowing it's cloudy makes all non-cloudy weather impossible. We rescale our universe so the 'Cloudy' area becomes our new reality. This division by **P(Cloudy)** is the core of the theorem.",
          buttonText: "Calculate the Posterior",
      },
      {
          title: "The Posterior Probability",
          description: "After rescaling, the proportion of our new 'Cloudy' universe that is also rainy is the answer. This is the **Posterior Probability, P(Rain|Cloudy)**.",
          buttonText: "Restart",
      }
  ];

  const handleNext = () => {
    setCurrentState((prev) => (prev + 1) % steps.length);
  };
  
  const step = steps[currentState];

  const highlightFormula = (partsToHighlight: string[]) => {
    const allParts = ['p_h_given_e', 'p_e_given_h', 'p_h', 'p_e'];
    return allParts.map(part => ({
      name: part,
      highlight: partsToHighlight.includes(part),
    }));
  };
  
  let formulaHighlights: { name: string; highlight: boolean; }[];
  let currentHRect = GEOMETRY.h;
  let universeTransform = 'scale(1,1) translate(0,0)';
  let fadeOpacity = 0;

  switch (currentState) {
      case 0:
          formulaHighlights = highlightFormula(['p_h']);
          break;
      case 1:
          formulaHighlights = highlightFormula(['p_e_given_h', 'p_h']);
          currentHRect = GEOMETRY.intersection;
          break;
      case 2:
          formulaHighlights = highlightFormula(['p_e_given_h', 'p_h', 'p_e']);
          currentHRect = GEOMETRY.intersection;
          const { x, y, width, height } = GEOMETRY.e;
          universeTransform = `scale(${100/width}, ${100/height}) translate(${-x}, ${-y})`;
          fadeOpacity = 0.8;
          break;
      case 3:
          formulaHighlights = highlightFormula(['p_h_given_e', 'p_e_given_h', 'p_h', 'p_e']);
          currentHRect = GEOMETRY.intersection;
          const { x: ex, y: ey, width: ew, height: eh } = GEOMETRY.e;
          universeTransform = `scale(${100/ew}, ${100/eh}) translate(${-ex}, ${-ey})`;
          fadeOpacity = 0.8;
          break;
      default:
          formulaHighlights = highlightFormula([]);
  }

  const ValueDisplay = ({ title, value }: { title: string, value: React.ReactNode }) => (
    <div className="mt-3 rounded-md border-l-4 border-muted-foreground/50 bg-muted/30 p-3 font-mono text-sm">
      <strong className="text-foreground">{title}:</strong> {value}
    </div>
  );

  return (
      <div className="w-full bg-card text-card-foreground rounded-2xl shadow-xl p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side: Visuals */}
            <div className="w-full rounded-lg aspect-square bg-muted/20 border-2 border-muted/50 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <mask id="mask-e">
                            <rect x="0" y="0" width="100" height="100" fill={currentState >= 2 ? "black" : "white"} />
                             <rect x={GEOMETRY.e.x} y={GEOMETRY.e.y} width={GEOMETRY.e.width} height={GEOMETRY.e.height} fill="white" style={{ transition: 'all 1.2s ease-in-out' }} />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100" height="100" fill="hsl(var(--background))" />
                    <g style={{ transition: 'transform 1.2s ease-in-out', transform: universeTransform }}>
                        <rect {...GEOMETRY.e} fill="hsl(var(--chart-2))" fillOpacity="0.7" style={{ transition: 'all 1.2s ease-in-out' }} />
                        <rect {...currentHRect} fill="hsl(var(--chart-1))" fillOpacity="0.7" style={{ transition: 'all 1.2s ease-in-out' }} />
                        <rect {...GEOMETRY.intersection} fill="hsl(var(--chart-4))" fillOpacity="0.8" style={{ transition: 'all 1.2s ease-in-out' }} />
                        
                        <text x="50" y="7.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="hsl(var(--foreground))">Rain</text>
                        <text x="6" y="50" textAnchor="middle" fontSize="5" fontWeight="bold" transform="rotate(-90 6 50)" fill="hsl(var(--foreground))">Cloudy</text>
                    </g>
                    <rect x="0" y="0" width="100" height="100" fill="hsl(var(--muted))" mask="url(#mask-e)" style={{ transition: 'opacity 1.2s ease-in-out', opacity: fadeOpacity }}/>
                </svg>
            </div>

            {/* Right Side: The Story & Controls */}
            <div className="flex flex-col h-full bg-muted/30 p-6 rounded-lg">
                <div className="flex-grow space-y-4">
                    <h2 className="text-2xl font-bold text-foreground font-headline">{step.title}</h2>
                    <p className="text-base md:text-lg leading-relaxed text-muted-foreground">{step.description}</p>
                    <div>
                        {currentState === 0 && <ValueDisplay title="P(Rain)" value={PROBS.h.toFixed(2)} />}
                        {currentState === 1 && <>
                          <ValueDisplay title="P(Rain)" value={PROBS.h.toFixed(2)} />
                          <ValueDisplay title="P(Cloudy|Rain)" value={`${PROBS.e_given_h.toFixed(2)} (proportion of rainy days that are cloudy)`} />
                          <ValueDisplay title="Numerator Area" value={`P(Cloudy|Rain)⋅P(Rain) = ${PROBS.intersection.toFixed(2)}`} />
                        </>}
                         {currentState === 2 && <>
                          <ValueDisplay title="Numerator Area" value={PROBS.intersection.toFixed(2)} />
                          <ValueDisplay title="Evidence Area P(Cloudy)" value={PROBS.e.toFixed(2)} />
                        </>}
                        {currentState === 3 && <ValueDisplay title="Posterior P(Rain|Cloudy)" value={`Area_Intersection / Area_Cloudy = ${PROBS.intersection.toFixed(2)} / ${PROBS.e.toFixed(2)} = ${PROBS.h_given_e.toFixed(2)}`} />}
                    </div>
                </div>
                
                <div className="font-serif text-center bg-background/70 p-3 rounded-lg mt-6 text-xl md:text-2xl text-foreground/80">
                  {formulaHighlights.map((part, i) => (
                    <React.Fragment key={part.name}>
                      {i === 1 && <span className="font-bold mx-2">=</span>}
                      {i === 1 && <span className="inline-block"><span className="block border-b-2 border-current pb-1"></span></span>}
                      <span className={cn('formula-part', part.highlight && 'bg-primary text-primary-foreground')}>
                          {part.name === 'p_h_given_e' && 'P(Rain|Cloudy)'}
                          {part.name === 'p_e_given_h' && 'P(Cloudy|Rain)'}
                          {part.name === 'p_h' && 'P(Rain)'}
                          {part.name === 'p_e' && 'P(Cloudy)'}
                      </span>
                      {i === 1 && <span className="mx-1 font-bold">⋅</span>}
                      {i === 2 && <span className="sr-only">/</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div className="text-center mt-8">
                    <Button onClick={handleNext} size="lg" className="w-full max-w-xs shadow-lg transform hover:scale-105">{step.buttonText}</Button>
                </div>
            </div>
        </div>
    </div>
  );
};


export default function BayesTheoremPage() {
  return (
    <div className="max-w-7xl mx-auto">
        <PageHeader
            title="A Visual Guide to Bayes' Theorem"
            description="Build an intuition for how beliefs are updated with new evidence using two different visual approaches."
            variant="aligned-left"
        />

        <Tabs defaultValue="factory" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="factory">Example 1: The Factory Inspector</TabsTrigger>
                <TabsTrigger value="geometric">Example 2: A Geometric Derivation</TabsTrigger>
            </TabsList>
            <TabsContent value="factory" className="mt-6">
                 <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">The Inspector's Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-lg">
                            A factory has two machines. The old Machine 1 is error-prone, while the new Machine 2 is more reliable. You find a defective part on the factory floor.
                        </p>
                        <p className="font-bold text-xl">
                            Given that the part is defective, what is the probability it came from the old, error-prone Machine 1?
                        </p>
                        <div className="pt-2 text-sm text-muted-foreground grid grid-cols-2 gap-x-4">
                            <div><strong className="text-foreground">Production Share (Prior):</strong><br/>- Machine 1: 30%<br/>- Machine 2: 70%</div>
                            <div><strong className="text-foreground">Defect Rate (Likelihood):</strong><br/>- Machine 1: 5%<br/>- Machine 2: 1%</div>
                        </div>
                    </CardContent>
                </Card>
                <FactoryInspectorVisualization />
            </TabsContent>
            <TabsContent value="geometric" className="mt-6">
                 <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">The Meteorologist's Question</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <p className="text-lg">
                           Based on historical weather data, we have some initial probabilities about rain and clouds.
                        </p>
                        <p className="font-bold text-xl">
                            If you wake up and see that it is cloudy, what is the new probability that it will rain today?
                        </p>
                    </CardContent>
                </Card>
                <GeometricBayesVisualization />
            </TabsContent>
        </Tabs>
    </div>
  );
}
