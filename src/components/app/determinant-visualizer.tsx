
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const DeterminantVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  const [matrixA, setMatrixA] = useState(1);
  const [matrixB, setMatrixB] = useState(1);
  const [matrixC, setMatrixC] = useState(0.5);
  const [matrixD, setMatrixD] = useState(2);
  
  const determinant = matrixA * matrixD - matrixB * matrixC;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 50;

    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * easeInOutCubic(t);
    
    const drawGrid = (t: number) => {
      const gridSize = 8;
      ctx.strokeStyle = '#4a90e2';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;
      
      for (let i = -gridSize; i <= gridSize; i++) {
        const x1 = i, y1 = -gridSize;
        const x2 = i, y2 = gridSize;
        
        const tx1 = lerp(x1, matrixA * x1 + matrixB * y1, t);
        const ty1 = lerp(y1, matrixC * x1 + matrixD * y1, t);
        const tx2 = lerp(x2, matrixA * x2 + matrixB * y2, t);
        const ty2 = lerp(y2, matrixC * x2 + matrixD * y2, t);
        
        ctx.beginPath();
        ctx.moveTo(centerX + tx1 * scale, centerY - ty1 * scale);
        ctx.lineTo(centerX + tx2 * scale, centerY - ty2 * scale);
        ctx.stroke();
      }
      for (let i = -gridSize; i <= gridSize; i++) {
        const x1 = -gridSize, y1 = i;
        const x2 = gridSize, y2 = i;

        const tx1 = lerp(x1, matrixA * x1 + matrixB * y1, t);
        const ty1 = lerp(y1, matrixC * x1 + matrixD * y1, t);
        const tx2 = lerp(x2, matrixA * x2 + matrixB * y2, t);
        const ty2 = lerp(y2, matrixC * x2 + matrixD * y2, t);
        
        ctx.beginPath();
        ctx.moveTo(centerX + tx1 * scale, centerY - ty1 * scale);
        ctx.lineTo(centerX + tx2 * scale, centerY - ty2 * scale);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawBasisVectors = (t: number) => {
      const ix = lerp(1, matrixA, t);
      const iy = lerp(0, matrixC, t);
      const jx = lerp(0, matrixB, t);
      const jy = lerp(1, matrixD, t);
      
      drawArrow(0, 0, ix, iy, '#ff6b6b', 'î');
      drawArrow(0, 0, jx, jy, '#51cf66', 'ĵ');
    };
    
    const drawTransformedSquare = (t: number) => {
      const ix = lerp(1, matrixA, t);
      const iy = lerp(0, matrixC, t);
      const jx = lerp(0, matrixB, t);
      const jy = lerp(1, matrixD, t);

      ctx.fillStyle = determinant < 0 ? 'rgba(255, 107, 107, 0.3)' : 'rgba(81, 207, 102, 0.3)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + ix * scale, centerY - iy * scale);
      ctx.lineTo(centerX + (ix + jx) * scale, centerY - (iy + jy) * scale);
      ctx.lineTo(centerX + jx * scale, centerY - jy * scale);
      ctx.closePath();
      ctx.fill();
    };

    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
      const sx2 = centerX + x2 * scale;
      const sy2 = centerY - y2 * scale;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
      
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = color;
      ctx.fillText(label, sx2 + 5, sy2 - 5);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f1e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      drawGrid(progress);
      drawTransformedSquare(progress);
      drawBasisVectors(progress);
    };
    
    render();
  }, [progress, matrixA, matrixB, matrixC, matrixD, determinant]);

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

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20">
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto aspect-[8/5] rounded-xl shadow-inner" />
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 p-4 rounded-xl border border-cyan-500/30">
        {[
          { label: 'a', value: matrixA, setter: setMatrixA },
          { label: 'b', value: matrixB, setter: setMatrixB },
          { label: 'c', value: matrixC, setter: setMatrixC },
          { label: 'd', value: matrixD, setter: setMatrixD },
        ].map(item => (
          <div key={item.label}>
            <label className="text-purple-200 text-xs block mb-1 uppercase">{item.label}: {item.value.toFixed(2)}</label>
            <input type="range" min="-3" max="3" step="0.1" value={item.value}
              onChange={(e) => item.setter(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setIsPlaying(!isPlaying)} className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2 font-bold text-base shadow-lg">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Pause' : 'Animate'}
          </button>
          <button onClick={reset} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm"><RotateCcw className="w-4 h-4" /> Reset</button>
        </div>
        
        <div className="text-right">
            <p className="text-purple-200 text-sm">Determinant (Area Scaling Factor)</p>
            <p className={`text-3xl font-bold font-mono transition-colors ${determinant < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {determinant.toFixed(2)}
            </p>
        </div>
      </div>

       <div className="mt-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-400/30 text-sm text-purple-200 leading-relaxed">
            {Math.abs(determinant) < 0.01 
              ? "A determinant of zero means the transformation squashes space into a lower dimension (a line or a point). The matrix is not invertible."
              : determinant < 0
              ? "A negative determinant signifies an orientation flip. The space has been inverted, like looking in a mirror."
              : "A positive determinant means the area has been scaled by this factor without changing the orientation of the space."
            }
        </div>
    </div>
  );
};

export default DeterminantVisualizer;
