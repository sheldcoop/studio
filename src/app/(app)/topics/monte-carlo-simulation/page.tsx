
'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MonteCarloPiSimulation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dartsInside, setDartsInside] = useState(0);
  const [totalDarts, setTotalDarts] = useState(0);
  const [piEstimate, setPiEstimate] = useState(0);
  const [dartsToThrow, setDartsToThrow] = useState(1000);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw square background
    ctx.fillStyle = 'hsl(var(--muted))';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleThrowDarts = (count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const radius = canvas.width / 2;
    const radiusSq = radius * radius;

    let localInside = 0;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const dx = x - radius;
      const dy = y - radius;

      if (dx * dx + dy * dy <= radiusSq) {
        localInside++;
        ctx.fillStyle = 'hsla(var(--primary) / 0.7)';
      } else {
        ctx.fillStyle = 'hsla(var(--destructive) / 0.7)';
      }
      ctx.fillRect(x - 1, y - 1, 2, 2); // Draw a 2x2 pixel dart
    }

    const newTotalDarts = totalDarts + count;
    const newDartsInside = dartsInside + localInside;
    setTotalDarts(newTotalDarts);
    setDartsInside(newDartsInside);
    setPiEstimate(4 * (newDartsInside / newTotalDarts));
  };
  
  const handleReset = () => {
      setDartsInside(0);
      setTotalDarts(0);
      setPiEstimate(0);
      drawBoard();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
          const size = Math.min(container.clientWidth, 500);
          canvas.width = size;
          canvas.height = size;
          drawBoard();
          handleReset();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Estimating π with Randomness</CardTitle>
        <CardDescription>A Monte Carlo Simulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Controls and Stats */}
          <div className="bg-muted/50 p-6 rounded-lg border order-2 md:order-1">
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dartsInput" className="text-sm font-medium mb-1">Darts to Throw:</Label>
                <Input
                  type="number"
                  id="dartsInput"
                  value={dartsToThrow}
                  onChange={(e) => setDartsToThrow(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
              <Button onClick={() => handleThrowDarts(dartsToThrow)} className="w-full">Throw Darts</Button>
              <Button onClick={handleReset} variant="outline" className="w-full">Reset</Button>
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Darts in Circle:</span>
                <span className="font-mono text-primary">{dartsInside.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Darts:</span>
                <span className="font-mono">{totalDarts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-primary">Estimated π:</span>
                <span className="font-mono text-2xl font-bold">{piEstimate.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Simulation Canvas */}
          <div className="md:col-span-2 w-full aspect-square order-1 md:order-2">
            <canvas ref={canvasRef} className="w-full h-full rounded-md border"></canvas>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function MonteCarloSimulationPage() {
  return (
    <>
      <PageHeader
        title="Monte Carlo Simulation"
        description="Using randomness to solve problems that are difficult or impossible to solve analytically."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Why It Works: The Area Argument</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
               <p>This simulation works because of a simple ratio. The area of the square is $(2r)^2 = 4r^2$ and the area of the circle is $\pi r^2$.</p>
               <p>The ratio of the area of the circle to the area of the square is:</p>
               <p className="font-mono text-center text-lg bg-muted p-3 rounded-md">
                    (Area of Circle) / (Area of Square) = ($\pi r^2$) / ($4r^2$) = $\pi / 4$
               </p>
               <p>If we throw darts randomly, the ratio of (darts inside the circle) to (total darts thrown) should approximate this same value. Therefore, we can estimate $\pi$ by rearranging the formula:</p>
                <p className="font-mono text-center text-lg bg-muted p-3 rounded-md">
                    $\pi \approx 4 \times$ (Darts in Circle / Total Darts)
               </p>
            </CardContent>
        </Card>

        <MonteCarloPiSimulation />

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Applications in Quantitative Finance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
                <div>
                    <h4 className="font-semibold text-primary">Pricing Complex Derivatives</h4>
                    <p className="text-muted-foreground">Many exotic options don't have a neat, closed-form pricing formula like Black-Scholes. Monte Carlo methods are used to simulate thousands of possible future price paths for the underlying asset. The option's payoff is calculated for each path, and the average of all these discounted payoffs gives a fair price for the option today.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-primary">Risk Management & Value at Risk (VaR)</h4>
                    <p className="text-muted-foreground">How much could a portfolio lose in a bad month? Monte Carlo simulations can model the complex, correlated movements of all assets in a portfolio. By running thousands of simulations of the next month's market movements, we can build a distribution of possible portfolio outcomes and calculate the VaR—for instance, the maximum loss we can expect with 99% confidence.</p>
                </div>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
