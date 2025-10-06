
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const EigenVisualizer = () => {
  const canvasRef = useRef(null);
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
    // Calculate eigenvalues and eigenvectors
    const a = matrixA, b = matrixB, c = matrixC, d = matrixD;
    const trace = a + d;
    const det = a * d - b * c;
    const discriminant = trace * trace - 4 * det;
    
    if (discriminant >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
      const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
      
      // Eigenvector for lambda1
      let v1x, v1y;
      if (Math.abs(b) > 0.001) {
        v1x = 1;
        v1y = (lambda1 - a) / b;
      } else if (Math.abs(c) > 0.001) {
        v1y = 1;
        v1x = (lambda1 - d) / c;
      } else {
        v1x = 1;
        v1y = 0;
      }
      
      // Normalize
      const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
      v1x /= len1;
      v1y /= len1;
      
      // Eigenvector for lambda2
      let v2x, v2y;
      if (Math.abs(b) > 0.001) {
        v2x = 1;
        v2y = (lambda2 - a) / b;
      } else if (Math.abs(c) > 0.001) {
        v2y = 1;
        v2x = (lambda2 - d) / c;
      } else {
        v2x = 0;
        v2y = 1;
      }
      
      const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
      v2x /= len2;
      v2y /= len2;
      
      setEigenData({
        lambda1, lambda2,
        v1: { x: v1x, y: v1y },
        v2: { x: v2x, y: v2y }
      });
    } else {
      setEigenData(null); // Handle cases with complex eigenvalues
    }
  }, [matrixA, matrixB, matrixC, matrixD]);

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(900, 600).parent(canvasParentRef);
  };

  const draw = (p5: any) => {
    const ctx = p5.drawingContext as CanvasRenderingContext2D;
    const width = p5.width;
    const height = p5.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 50;

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * easeInOutCubic(t);
    
    const drawGrid = (t: number, opacity = 0.15) => {
      const gridSize = 8;
      
      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          const x1 = i, y1 = j;
          const x2 = i + 1, y2 = j;
          const x3 = i, y3 = j + 1;
          
          const tx1 = lerp(x1, matrixA * x1 + matrixB * y1, t);
          const ty1 = lerp(y1, matrixC * x1 + matrixD * y1, t);
          const tx2 = lerp(x2, matrixA * x2 + matrixB * y2, t);
          const ty2 = lerp(y2, matrixC * x2 + matrixD * y2, t);
          const tx3 = lerp(x3, matrixA * x3 + matrixB * y3, t);
          const ty3 = lerp(y3, matrixC * x3 + matrixD * y3, t);
          
          const hue = ((i + gridSize) / (2 * gridSize)) * 60 + 180;
          p5.stroke(`hsla(${hue}, 70%, 60%, ${opacity})`);
          p5.strokeWeight(1);
          
          p5.line(centerX + tx1 * scale, centerY - ty1 * scale, centerX + tx2 * scale, centerY - ty2 * scale);
          p5.line(centerX + tx1 * scale, centerY - ty1 * scale, centerX + tx3 * scale, centerY - ty3 * scale);
        }
      }
    };

    const drawBasisVectors = (t: number) => {
      const ix = lerp(1, matrixA * 1 + matrixB * 0, t);
      const iy = lerp(0, matrixC * 1 + matrixD * 0, t);
      const jx = lerp(0, matrixA * 0 + matrixB * 1, t);
      const jy = lerp(1, matrixC * 0 + matrixD * 1, t);
      
      drawArrow(0, 0, ix, iy, '#ff6b6b', 3, 'î');
      drawArrow(0, 0, jx, jy, '#51cf66', 3, 'ĵ');
    };

    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, width: number, label: string | null) => {
      const sx1 = centerX + x1 * scale;
      const sy1 = centerY - y1 * scale;
      const sx2 = centerX + x2 * scale;
      const sy2 = centerY - y2 * scale;
      
      p5.stroke(color);
      p5.fill(color);
      p5.strokeWeight(width);
      p5.strokeCap(p5.ROUND);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      p5.line(sx1, sy1, sx2, sy2);
      
      const angle = p5.atan2(sy2 - sy1, sx2 - sx1);
      const headLen = 15;
      
      p5.push();
      p5.translate(sx2, sy2);
      p5.rotate(angle);
      p5.triangle(0, 0, -headLen, headLen / 2, -headLen, -headLen / 2);
      p5.pop();
      
      ctx.shadowBlur = 0;
      
      if (label) {
        p5.noStroke();
        p5.fill(color);
        p5.textSize(18);
        p5.textStyle(p5.BOLD);
        p5.text(label, sx2 + 15, sy2 - 15);
      }
    };

    const drawEigenvector = (vx: number, vy: number, lambda: number, color: string, t: number, label: string) => {
      ctx.globalAlpha = 0.2;
      p5.stroke(color);
      p5.strokeWeight(2);
      ctx.setLineDash([8, 8]);
      const extend = 6;
      p5.line(
        centerX - vx * scale * extend, centerY + vy * scale * extend,
        centerX + vx * scale * extend, centerY - vy * scale * extend
      );
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      
      const scaledVx = lerp(vx * 2, vx * 2 * lambda, t);
      const scaledVy = lerp(vy * 2, vy * 2 * lambda, t);
      
      drawArrow(0, 0, scaledVx, scaledVy, color, 4, null);
      
      const sx = centerX + scaledVx * scale;
      const sy = centerY - scaledVy * scale;
      p5.noStroke();
      p5.fill(color);
      p5.textSize(16);
      p5.textStyle(p5.BOLD);
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 10;
      p5.text(label, sx + 15, sy - 10);
      p5.text(`λ=${lambda.toFixed(2)}`, sx + 15, sy + 10);
      ctx.shadowBlur = 0;
    };

    const drawRandomVectors = (t: number, count = 12) => {
      const vectors = [
        [1.5, 0.5], [2, 1], [-1, 1.5], [-1.5, -0.5],
        [0.5, 2], [-2, 0.5], [1, -1.5], [-0.5, -2],
        [2.5, 0], [0, 2.5], [-2, -1], [1.5, -1.5]
      ];
      
      for (let i = 0; i < count; i++) {
        const [vx, vy] = vectors[i];
        const tx = lerp(vx, matrixA * vx + matrixB * vy, t);
        const ty = lerp(vy, matrixC * vx + matrixD * vy, t);
        
        const hue = (i / count) * 360;
        drawArrow(0, 0, tx, ty, `hsla(${hue}, 80%, 70%, 0.6)`, 2, null);
      }
    };
    
    // Main draw function logic
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    p5.stroke('rgba(255, 255, 255, 0.1)');
    p5.strokeWeight(1);
    p5.line(0, centerY, width, centerY);
    p5.line(centerX, 0, centerX, height);
    
    const t = progress;
    
    if (mode === 'intro') {
      drawGrid(t, 0.3);
      drawBasisVectors(t);
      drawRandomVectors(t, 8);
    } else if (mode === 'compare') {
      drawGrid(t, 0.2);
      drawRandomVectors(t, 12);
      if (eigenData) {
        drawEigenvector(eigenData.v1.x, eigenData.v1.y, eigenData.lambda1, '#ff6b6b', t, 'v₁');
        drawEigenvector(eigenData.v2.x, eigenData.v2.y, eigenData.lambda2, '#4ecdc4', t, 'v₂');
      }
    } else if (mode === 'explore') {
      drawGrid(t, 0.25);
      if (eigenData) {
        drawEigenvector(eigenData.v1.x, eigenData.v1.y, eigenData.lambda1, '#ff6b6b', t, 'v₁');
        drawEigenvector(eigenData.v2.x, eigenData.v2.y, eigenData.lambda2, '#4ecdc4', t, 'v₂');
      }
    }
  };
  
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

  const modes = {
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
            <div ref={canvasRef} className="w-full h-auto aspect-[3/2] rounded-xl shadow-2xl overflow-hidden">
                {typeof window !== 'undefined' && <Sketch setup={setup} draw={draw} />}
            </div>
            
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

