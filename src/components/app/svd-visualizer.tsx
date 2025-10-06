'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sliders, ArrowLeft, ArrowRight } from 'lucide-react';

const SVDVisualizer = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  // --- State Management ---
  const [mode, setMode] = useState<'geometric' | 'steps'>('geometric');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matrix, setMatrix] = useState({ a: 1.5, b: 0.5, c: 0.5, d: 1.0 });
  const [svdData, setSvdData] = useState<any>(null);
  const [showControls, setShowControls] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  const stepDescriptions = [
    "Start: We begin with a standard grid and a unit circle.",
    "Step 1: Rotate with Vᵀ. The first rotation aligns the space so the 'stretch' directions are on the axes.",
    "Step 2: Scale with Σ. A pure stretch along the new axes by the singular values (σ₁ and σ₂).",
    "Step 3: Rotate with U. The final rotation aligns the stretched space to its final destination."
  ];

  // --- SVD Calculation ---
  useEffect(() => {
    const { a, b, c, d } = matrix;
    const ata_11 = a * a + c * c;
    const ata_12 = a * b + c * d;
    const ata_22 = b * b + d * d;
    const trace = ata_11 + ata_22;
    const det = ata_11 * ata_22 - ata_12 * ata_12;
    const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
    const lambda1 = (trace + discriminant) / 2;
    const lambda2 = (trace - discriminant) / 2;
    const s1 = Math.sqrt(lambda1);
    const s2 = Math.sqrt(lambda2);
    let v1x = (Math.abs(ata_12) < 0.001) ? 1 : lambda1 - ata_22;
    let v1y = (Math.abs(ata_12) < 0.001) ? 0 : ata_12;
    const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    if (len1 > 0.001) { v1x /= len1; v1y /= len1; }
    let v2x = -v1y; let v2y = v1x;
    let u1x = 0, u1y = 0, u2x = 0, u2y = 0;
    if (s1 > 0.001) { u1x = (a * v1x + b * v1y) / s1; u1y = (c * v1x + d * v1y) / s1; }
    if (s2 > 0.001) { u2x = (a * v2x + b * v2y) / s2; u2y = (c * v2x + d * v2y) / s2; }
    if (u1x * u2y - u1y * u2x < 0) { u2x *= -1; u2y *= -1; }
    setSvdData({ U: { u1: { x: u1x, y: u1y }, u2: { x: u2x, y: u2y } }, Sigma: { s1, s2 }, V: { v1: { x: v1x, y: v1y }, v2: { x: v2x, y: v2y } } });
  }, [matrix]);

  // --- p5.js Sketch ---
  useEffect(() => {
    if (sketchRef.current) sketchRef.current.remove();
    if (!canvasRef.current || !svdData) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(canvasRef.current!.offsetWidth, 400).parent(canvasRef.current!);
        p.noLoop();
      };

      p.draw = () => {
        const t = p.constrain(progress, 0, 1);
        const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        const scaleFactor = p.min(p.width, p.height) / 6;

        p.background(17, 24, 39);
        p.translate(p.width / 2, p.height / 2);
        p.scale(1, -1);

        const { U, Sigma, V } = svdData;

        const applyMatrix = (x:number, y:number, m11:number, m12:number, m21:number, m22:number) => ({ x: m11 * x + m12 * y, y: m21 * x + m22 * y });
        const lerpPoint = (p1: {x:number, y:number}, p2: {x:number, y:number}, t:number) => ({ x: p.lerp(p1.x, p2.x, t), y: p.lerp(p1.y, p2.y, t) });

        let currentTransform: (x: number, y: number) => { x: number, y: number };

        if (mode === 'geometric') {
            currentTransform = (x, y) => {
                const final = applyMatrix(x, y, matrix.a, matrix.b, matrix.c, matrix.d);
                return lerpPoint({x,y}, final, easedT);
            };
        } else { // steps mode
            const p0 = {x:1,y:0}, p1 = {x:0,y:1};
            const vRot = {x:V.v1.x, y:V.v2.x}, vRot1 = {x:V.v1.y, y:V.v2.y};
            const sigmaScale = {x: vRot.x*Sigma.s1, y: vRot1.x*Sigma.s1, x1:vRot.y*Sigma.s2, y1: vRot1.y*Sigma.s2 };
            const uRot = {x:U.u1.x, y:U.u2.x}, uRot1={x:U.u1.y, y:U.u2.y};

            switch (currentStep) {
                case 1:
                    currentTransform = (x, y) => lerpPoint({x,y}, applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y), easedT);
                    break;
                case 2:
                    currentTransform = (x, y) => {
                        const rotated = applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y);
                        return lerpPoint(rotated, applyMatrix(rotated.x, rotated.y, Sigma.s1, 0, 0, Sigma.s2), easedT);
                    };
                    break;
                case 3:
                     currentTransform = (x, y) => {
                        const rotated = applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y);
                        const scaled = applyMatrix(rotated.x, rotated.y, Sigma.s1, 0, 0, Sigma.s2);
                        return lerpPoint(scaled, applyMatrix(scaled.x, scaled.y, U.u1.x, U.u2.x, U.u1.y, U.u2.y), easedT);
                    };
                    break;
                default:
                    currentTransform = (x, y) => ({x, y});
                    break;
            }
        }
        
        drawTransformedGrid(currentTransform, scaleFactor, p.color(72, 144, 226, 50));
        drawTransformedCircle(currentTransform, scaleFactor, p.color('#ffd93d'));

        const transformed_e1 = currentTransform(1, 0);
        const transformed_e2 = currentTransform(0, 1);
        drawVector(0,0, transformed_e1.x * scaleFactor, transformed_e1.y * scaleFactor, p.color('#ff6b6b'));
        drawVector(0,0, transformed_e2.x * scaleFactor, transformed_e2.y * scaleFactor, p.color('#4ecdc4'));
      };

      const drawTransformedGrid = (transform: (x:number,y:number) => {x:number, y:number}, scale:number, c: p5.Color) => {
          p.stroke(c); p.strokeWeight(1);
          const gridSize = 8;
          for (let i = -gridSize; i <= gridSize; i++) {
              p.beginShape(p.LINE_STRIP);
              for (let j = -gridSize; j <= gridSize; j++) { const {x, y} = transform(i, j); p.vertex(x * scale, y * scale); }
              p.endShape();
              p.beginShape(p.LINE_STRIP);
              for (let j = -gridSize; j <= gridSize; j++) { const {x, y} = transform(j, i); p.vertex(x * scale, y * scale); }
              p.endShape();
          }
      };
      
      const drawTransformedCircle = (transform: (x:number,y:number) => {x:number, y:number}, scale:number, c:p5.Color) => {
          p.noFill(); p.stroke(c); p.strokeWeight(3);
          p.beginShape();
          for (let i = 0; i <= 64; i++) {
              const angle = p.map(i, 0, 64, 0, p.TWO_PI);
              const {x, y} = transform(p.cos(angle), p.sin(angle));
              p.vertex(x * scale, y * scale);
          }
          p.endShape(p.CLOSE);
      };

      const drawVector = (x1:number, y1:number, x2:number, y2:number, c:p5.Color, label:string|null = null) => {
          p.stroke(c); p.strokeWeight(4); p.line(x1, y1, x2, y2);
          p.push();
          p.translate(x2, y2);
          const angle = p.atan2(y2 - y1, x2 - x1);
          p.rotate(angle);
          p.noStroke(); p.fill(c);
          p.triangle(0, 0, -10, 5, -10, -5);
          p.pop();
      };

      p.windowResized = () => {
          if(canvasRef.current) p.resizeCanvas(canvasRef.current.offsetWidth, 400);
      };

      sketchRef.current = p;
    };
    new p5(sketch);
  }, [svdData, mode, currentStep]);

  useEffect(() => {
    sketchRef.current?.redraw();
  }, [progress, svdData, mode, currentStep]);
  
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(prev => {
          const next = prev + 0.005;
          if (next >= 1) { setIsPlaying(false); return 1; }
          return next;
        });
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    }
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [isPlaying]);

  const resetAnimation = () => { setIsPlaying(false); setProgress(0); };
  const togglePlay = () => { if (progress >= 1) setProgress(0); setIsPlaying(!isPlaying); };
  
  const handleUIModeChange = (newMode: 'geometric' | 'steps') => {
      setMode(newMode);
      if (newMode === 'steps') setCurrentStep(0);
      resetAnimation();
  };

  const handleStepChange = (direction: number) => {
      let newStep = currentStep + direction;
      newStep = Math.max(0, Math.min(3, newStep));
      setCurrentStep(newStep);
      resetAnimation();
  };

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent className="p-0">
          <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20">
            <div ref={canvasRef} className="w-full h-auto aspect-[5/3] rounded-xl shadow-2xl bg-gray-900/50 mb-4" />
            
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-xl border border-indigo-400/30 mb-4">
                <h3 className="text-lg font-bold text-white mb-1">
                    {mode === 'geometric' ? "The Geometric Picture" : stepDescriptions[currentStep].title}
                </h3>
                <p className="text-purple-100 leading-relaxed text-sm">
                    {mode === 'geometric' ? "Watch the unit circle transform into an ellipse! SVD decomposes this complex transformation into simple rotations and stretches." : stepDescriptions[currentStep].desc}
                </p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
              <Button onClick={() => handleUIModeChange('geometric')} variant={mode === 'geometric' ? 'default' : 'secondary'}>Geometric View</Button>
              <Button onClick={() => handleUIModeChange('steps')} variant={mode === 'steps' ? 'default' : 'secondary'}>Step-by-Step</Button>
              <Button onClick={() => setShowControls(!showControls)} variant="outline"><Sliders className="w-4 h-4 mr-2" />Controls</Button>
            </div>

            {showControls && (
                <div className="bg-black/40 p-4 rounded-xl mb-4 border border-cyan-500/30">
                    <h4 className="text-white font-bold mb-3 text-base">Adjust Matrix A</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['a', 'b', 'c', 'd'] as const).map(key => (
                            <div key={key}>
                                <Label htmlFor={key} className="text-purple-200 text-xs block mb-1">{key}: {matrix[key].toFixed(2)}</Label>
                                <Slider id={key} min={-2} max={2} step={0.1} value={[matrix[key]]} onValueChange={(v) => setMatrix(prev => ({...prev, [key]: v[0]}))} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
          
            <div className="flex items-center gap-2 md:gap-3">
              {mode === 'steps' && <Button onClick={() => handleStepChange(-1)} disabled={currentStep === 0}><ArrowLeft/></Button>}
              <Button onClick={togglePlay} className="flex-grow">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Slider value={[progress]} min={0} max={1} step={0.01} onValueChange={(v) => setProgress(v[0])} />
              {mode === 'steps' && <Button onClick={() => handleStepChange(1)} disabled={currentStep === 3}><ArrowRight/></Button>}
            </div>
          </div>
      
          {svdData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['U', 'Sigma', 'V'] as const).map(key => (
                    <Card key={key} className="bg-background/50">
                        <CardHeader className="p-3">
                            <CardTitle className="text-base">{key === 'U' ? 'U (Left Vectors)' : key === 'Sigma' ? 'Σ (Singular Values)' : 'V (Right Vectors)'}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 text-xs font-mono text-muted-foreground">
                            {key === 'Sigma' ? `σ₁=${svdData.Sigma.s1.toFixed(3)}, σ₂=${svdData.Sigma.s2.toFixed(3)}` :
                             `v₁=(${svdData[key].u1.x.toFixed(2)},${svdData[key].u1.y.toFixed(2)}) v₂=(${svdData[key].u2.x.toFixed(2)},${svdData[key].u2.y.toFixed(2)})`}
                        </CardContent>
                    </Card>
                ))}
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default SVDVisualizer;
