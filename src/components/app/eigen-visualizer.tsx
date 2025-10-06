
'use client';

import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { drawGrid, drawVector, easeInOutCubic } from '@/lib/p5-helpers';
import { calculateEigen } from '@/lib/math';


const EigenVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState('intro'); // intro, compare, explore
  const [showControls, setShowControls] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  // Interactive matrix controls
  const [matrixA, setMatrixA] = useState(2);
  const [matrixB, setMatrixB] = useState(1);
  const [matrixC, setMatrixC] = useState(1);
  const [matrixD, setMatrixD] = useState(2);
  
  // Computed eigenvalues and eigenvectors
  const [eigenData, setEigenData] = useState<{
    lambda1: number;
    lambda2: number;
    v1: { x: number; y: number };
    v2: { x: number; y: number };
  } | null>(null);
  
  useEffect(() => {
    setEigenData(calculateEigen(matrixA, matrixB, matrixC, matrixD));
  }, [matrixA, matrixB, matrixC, matrixD]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let p5Instance: p5;

    const sketch = (p: p5) => {
        let scale: number;
        
        p.setup = () => {
            p.createCanvas(canvas.offsetWidth, canvas.offsetHeight);
        };

        const drawRandomVectors = (t: number, count = 6) => {
            const vectors = [
                [1.5, 0.5], [2, 1], [-1, 1.5], [-1.5, -0.5],
                [0.5, 2.5], [-2, -1.5]
            ];
            
            for (let i = 0; i < count; i++) {
                const [vx, vy] = vectors[i];
                const tx = p.lerp(vx, matrixA * vx + matrixB * vy, t);
                const ty = p.lerp(vy, matrixC * vx + matrixD * vy, t);
                
                const hue = (i / count) * 360;
                drawVector(p, p.createVector(tx, ty), scale, p.color(`hsla(${hue}, 80%, 70%, 0.6)`), null, 2);
            }
        };
        
        const drawEigenvector = (vx: number, vy: number, lambda: number, color: p5.Color, t: number, label: string) => {
            const ev = p.createVector(vx, vy);
            
            p.stroke(color);
            p.strokeWeight(2);
            if (p.drawingContext.setLineDash) {
              p.drawingContext.setLineDash([8, 8]);
              p.drawingContext.globalAlpha = 0.2;
            }
            const extend = 6;
            p.line(-vx * scale * extend, -vy * scale * extend, vx * scale * extend, vy * scale * extend);
            if (p.drawingContext.setLineDash) {
              p.drawingContext.setLineDash([]);
              p.drawingContext.globalAlpha = 1;
            }

            const scaledVx = p.lerp(vx * 2, vx * 2 * lambda, t);
            const scaledVy = p.lerp(vy * 2, vy * 2 * lambda, t);
            
            drawVector(p, p.createVector(scaledVx, scaledVy), scale, color, null, 4);
            
            const sx = scaledVx * scale;
            const sy = scaledVy * scale;

            p.push();
            p.scale(1, -1);
            p.textAlign(p.LEFT, p.BOTTOM);
            p.textFont('Arial');
            p.textSize(16);
            p.fill(color);
            if (p.drawingContext.shadowBlur) {
                p.drawingContext.shadowBlur = 10;
                p.drawingContext.shadowColor = '#000';
            }
            p.text(label, sx + 15, -sy + 10);
            p.text(`λ=${lambda.toFixed(2)}`, sx + 15, -sy - 10);
            if (p.drawingContext.shadowBlur) {
                p.drawingContext.shadowBlur = 0;
            }
            p.pop();
        };

        p.draw = () => {
          p.clear(0, 0, 0, 0); // Clear canvas for transparency
          const width = p.width;
          const height = p.height;
          const centerX = width / 2;
          const centerY = height / 2;
          scale = 50;

          // Gradient background
          const gradient = p.drawingContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
          gradient.addColorStop(0, '#1a1a2e');
          gradient.addColorStop(1, '#0f0f1e');
          p.drawingContext.fillStyle = gradient;
          p.drawingContext.fillRect(0, 0, width, height);

          p.translate(centerX, centerY);
          p.scale(1, -1);
          
          // Axes
          p.stroke('rgba(255, 255, 255, 0.1)');
          p.strokeWeight(1);
          p.line(-width, 0, width, 0);
          p.line(0, -height, 0, height);
          
          const t = easeInOutCubic(progress);
          
          const m = {
              a: p.lerp(1, matrixA, t),
              b: p.lerp(0, matrixB, t),
              c: p.lerp(0, matrixC, t),
              d: p.lerp(1, matrixD, t)
          };
          const b1 = p.createVector(m.a, m.c);
          const b2 = p.createVector(m.b, m.d);

          if (mode === 'intro') {
            drawGrid(p, b1, b2, p.color(72, 144, 226, 75), 1, scale);
            drawVector(p, b1, scale, p.color('#ff6b6b'), 'î', 3);
            drawVector(p, b2, scale, p.color('#51cf66'), 'ĵ', 3);
            drawRandomVectors(t, 4);
          } else if (mode === 'compare' || mode === 'explore') {
            drawGrid(p, b1, b2, p.color(72, 144, 226, 50), 1, scale);
            drawRandomVectors(t, 6);
            
            if (eigenData) {
              drawEigenvector(eigenData.v1.x, eigenData.v1.y, eigenData.lambda1, p.color('#ff6b6b'), t, 'v₁');
              drawEigenvector(eigenData.v2.x, eigenData.v2.y, eigenData.lambda2, p.color('#4ecdc4'), t, 'v₂');
            }
          }
        };
    };

    p5Instance = new p5(sketch, canvas);

    return () => {
        p5Instance?.remove();
    };
}, [progress, mode, matrixA, matrixB, matrixC, matrixD, eigenData]);


  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(prev => {
          const next = prev + 0.008;
          if (next >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  const reset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const modes: { [key: string]: { title: string; desc: string } } = {
    intro: {
      title: "Linear Transformations",
      desc: "Every matrix represents a transformation of space. Watch how vectors and the grid transform together. The red (î) and green (ĵ) vectors are our basis vectors."
    },
    compare: {
      title: "The Special Vectors",
      desc: "Most vectors (colorful ones) change direction when transformed. But eigenvectors (red v₁ and cyan v₂) stay on their original line - they only stretch or shrink!"
    },
    explore: {
      title: "Design Your Own Matrix",
      desc: "Adjust the matrix values below and see how the eigenvectors and eigenvalues change in real-time. Try making it stretch, rotate, or shear!"
    }
  };

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent className="p-0">
          <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20">
            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              className="w-full h-auto aspect-[3/2] rounded-xl shadow-2xl"
            />
            
            <div className="mt-4 md:mt-6">
                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-4 rounded-xl border border-purple-400/30 mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                        {modes[mode].title}
                    </h3>
                    <p className="text-purple-100 leading-relaxed text-sm">
                        {modes[mode].desc}
                    </p>
                </div>
              
                <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
                    <button
                        onClick={() => { setMode('intro'); reset(); }}
                        className={`px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
                        mode === 'intro' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                    >
                        1. Introduction
                    </button>
                    <button
                        onClick={() => { setMode('compare'); reset(); }}
                        className={`px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
                        mode === 'compare' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                    >
                        2. Compare Vectors
                    </button>
                    <button
                        onClick={() => { setMode('explore'); reset(); setShowControls(!showControls); }}
                        className={`px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-lg font-semibold transition-all flex items-center ${
                        mode === 'explore' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                    >
                        <Sliders className="w-4 h-4 inline mr-1.5" />
                        3. Explore
                    </button>
                </div>
              
                {mode === 'explore' && showControls && (
                <div className="bg-black/40 p-4 rounded-xl mb-4 border border-cyan-500/30">
                    <h4 className="text-white font-bold mb-3 text-base">Matrix Controls</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-purple-200 text-xs">a: {matrixA.toFixed(2)}</label>
                        <input type="range" min="-3" max="3" step="0.1" value={matrixA} 
                        onChange={(e) => setMatrixA(parseFloat(e.target.value))}
                        className="w-full h-1" />
                    </div>
                    <div>
                        <label className="text-purple-200 text-xs">b: {matrixB.toFixed(2)}</label>
                        <input type="range" min="-3" max="3" step="0.1" value={matrixB}
                        onChange={(e) => setMatrixB(parseFloat(e.target.value))}
                        className="w-full h-1" />
                    </div>
                    <div>
                        <label className="text-purple-200 text-xs">c: {matrixC.toFixed(2)}</label>
                        <input type="range" min="-3" max="3" step="0.1" value={matrixC}
                        onChange={(e) => setMatrixC(parseFloat(e.target.value))}
                        className="w-full h-1" />
                    </div>
                    <div>
                        <label className="text-purple-200 text-xs">d: {matrixD.toFixed(2)}</label>
                        <input type="range" min="-3" max="3" step="0.1" value={matrixD}
                        onChange={(e) => setMatrixD(parseFloat(e.target.value))}
                        className="w-full h-1" />
                    </div>
                    </div>
                    <div className="mt-4 p-2 bg-white/5 rounded">
                    <p className="text-purple-200 font-mono text-center text-sm">
                        [{matrixA.toFixed(1)}, {matrixB.toFixed(1)}] <br/>
                        [{matrixC.toFixed(1)}, {matrixD.toFixed(1)}]
                    </p>
                    </div>
                </div>
                )}
              
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-2 font-bold text-base shadow-lg"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isPlaying ? 'Pause' : 'Transform'}
                    </button>
                
                    <button
                        onClick={reset}
                        className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-100"
                        style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            </div>
          </div>
        
        {eigenData && mode !== 'intro' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur rounded-xl p-4 border border-red-400/30">
                    <h4 className="text-white font-bold mb-1 text-base">🔴 Eigenvector 1</h4>
                    <p className="text-red-200 text-xs mb-1">Direction: ({eigenData.v1.x.toFixed(2)}, {eigenData.v1.y.toFixed(2)})</p>
                    <p className="text-red-200 text-sm font-bold">Eigenvalue λ₁ = {eigenData.lambda1.toFixed(3)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur rounded-xl p-4 border border-cyan-400/30">
                    <h4 className="text-white font-bold mb-1 text-base">🔵 Eigenvector 2</h4>
                    <p className="text-cyan-200 text-xs mb-1">Direction: ({eigenData.v2.x.toFixed(2)}, {eigenData.v2.y.toFixed(2)})</p>
                    <p className="text-cyan-200 text-sm font-bold">Eigenvalue λ₂ = {eigenData.lambda2.toFixed(3)}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EigenVisualizer;
