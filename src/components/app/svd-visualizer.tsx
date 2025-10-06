
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';

const SVDVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'geometric' | 'steps'>('geometric');
  const [currentStep, setCurrentStep] = useState(0); // 0=original, 1=V^T, 2=Σ, 3=U
  const animationRef = useRef<number | null>(null);
  
  // Matrix for transformation
  const [matrixA, setMatrixA] = useState(1.5);
  const [matrixB, setMatrixB] = useState(0.5);
  const [matrixC, setMatrixC] = useState(0.5);
  const [matrixD, setMatrixD] = useState(1);
  
  // SVD components
  const [svdData, setSvdData] = useState<{
    U: { u1: { x: number; y: number }, u2: { x: number; y: number } };
    Sigma: { s1: number; s2: number };
    V: { v1: { x: number; y: number }, v2: { x: number; y: number } };
  } | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  // Calculate SVD
  useEffect(() => {
    const a = matrixA, b = matrixB, c = matrixC, d = matrixD;
    
    const ata_11 = a*a + c*c;
    const ata_12 = a*b + c*d;
    const ata_22 = b*b + d*d;
    
    const trace = ata_11 + ata_22;
    const det = ata_11 * ata_22 - ata_12 * ata_12;
    const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
    
    const lambda1 = (trace + discriminant) / 2;
    const lambda2 = (trace - discriminant) / 2;
    
    const sigma1 = Math.sqrt(lambda1);
    const sigma2 = Math.sqrt(lambda2);
    
    let v1x = 1, v1y = 0;
    if (Math.abs(ata_12) > 0.001) {
      v1x = lambda1 - ata_22;
      v1y = ata_12;
    }
    const len1 = Math.sqrt(v1x*v1x + v1y*v1y);
    if (len1 > 0.001) { v1x /= len1; v1y /= len1; }

    let v2x = -v1y, v2y = v1x;
    
    let u1x = 0, u1y = 0, u2x = 0, u2y = 0;
    if (sigma1 > 0.001) {
      u1x = (a * v1x + b * v1y) / sigma1;
      u1y = (c * v1x + d * v1y) / sigma1;
    }
    if (sigma2 > 0.001) {
      u2x = (a * v2x + b * v2y) / sigma2;
      u2y = (c * v2x + d * v2y) / sigma2;
    }
    
    setSvdData({
      U: { u1: {x: u1x, y: u1y}, u2: {x: u2x, y: u2y} },
      Sigma: { s1: sigma1, s2: sigma2 },
      V: { v1: {x: v1x, y: v1y}, v2: {x: v2x, y: v2y} }
    });
  }, [matrixA, matrixB, matrixC, matrixD]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 60;

    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * easeInOutCubic(t);

    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, width = 3, label: string | null = null) => {
      const sx1 = centerX + x1 * scale;
      const sy1 = centerY - y1 * scale;
      const sx2 = centerX + x2 * scale;
      const sy2 = centerY - y2 * scale;
      
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
      
      const angle = Math.atan2(sy2 - sy1, sx2 - sx1);
      const headLen = 15;
      
      ctx.beginPath();
      ctx.moveTo(sx2, sy2);
      ctx.lineTo(sx2 - headLen * Math.cos(angle - Math.PI / 7), sy2 - headLen * Math.sin(angle - Math.PI / 7));
      ctx.lineTo(sx2 - headLen * Math.cos(angle + Math.PI / 7), sy2 - headLen * Math.sin(angle + Math.PI / 7));
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      if (label) {
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#000';
        ctx.fillText(label, sx2 + 15, sy2 - 10);
        ctx.shadowBlur = 0;
      }
    };

    const drawGrid = (transform: (x:number, y:number, t:number) => number[], t: number, color = '#4a90e2', opacity = 0.15) => {
      const gridSize = 6;
      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          const x1 = i, y1 = j;
          const x2 = i + 1, y2 = j;
          const x3 = i, y3 = j + 1;
          
          const [tx1, ty1] = transform(x1, y1, t);
          const [tx2, ty2] = transform(x2, y2, t);
          const [tx3, ty3] = transform(x3, y3, t);
          
          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          ctx.moveTo(centerX + tx1 * scale, centerY - ty1 * scale);
          ctx.lineTo(centerX + tx2 * scale, centerY - ty2 * scale);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(centerX + tx1 * scale, centerY - ty1 * scale);
          ctx.lineTo(centerX + tx3 * scale, centerY - ty3 * scale);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const applyMatrix = (x:number, y:number, m11:number, m12:number, m21:number, m22:number) => [m11 * x + m12 * y, m21 * x + m22 * y];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f1e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      if (!svdData) return;

      const t = progress;
      const { U, Sigma, V } = svdData;

      if (mode === 'geometric') {
        const transform = (x:number, y:number, progress:number) => {
          const tx = lerp(x, matrixA * x + matrixB * y, progress);
          const ty = lerp(y, matrixC * x + matrixD * y, progress);
          return [tx, ty];
        };

        drawGrid(transform, t, '#4a90e2', 0.2);

        const circlePoints = 64;
        ctx.strokeStyle = '#ffd93d';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd93d';
        
        ctx.beginPath();
        for (let i = 0; i <= circlePoints; i++) {
          const angle = (i / circlePoints) * Math.PI * 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          const [tx, ty] = transform(x, y, t);
          i === 0 ? ctx.moveTo(centerX + tx * scale, centerY - ty * scale) : ctx.lineTo(centerX + tx * scale, centerY - ty * scale);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (t > 0.5) {
          const [u1x, u1y] = transform(V.v1.x, V.v1.y, 1);
          const [u2x, u2y] = transform(V.v2.x, V.v2.y, 1);
          drawArrow(0, 0, u1x, u1y, '#ff6b6b', 4, 'σ₁u₁');
          drawArrow(0, 0, u2x, u2y, '#4ecdc4', 4, 'σ₂u₂');
        }

        drawArrow(0, 0, V.v1.x, V.v1.y, '#ff6b6b', 3, 'v₁');
        drawArrow(0, 0, V.v2.x, V.v2.y, '#4ecdc4', 3, 'v₂');

      } else if (mode === 'steps') {
        const transforms = [
          (x:number, y:number, t:number) => [x, y],
          (x:number, y:number, t:number) => {
            const [tx, ty] = applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y);
            return [lerp(x, tx, t), lerp(y, ty, t)];
          },
          (x:number, y:number, t:number) => {
            const [tx1, ty1] = applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y);
            return [lerp(tx1, tx1 * Sigma.s1, t), lerp(ty1, ty1 * Sigma.s2, t)];
          },
          (x:number, y:number, t:number) => {
            const [tx1, ty1] = applyMatrix(x, y, V.v1.x, V.v1.y, V.v2.x, V.v2.y);
            const sx = tx1 * Sigma.s1;
            const sy = ty1 * Sigma.s2;
            const [fx, fy] = applyMatrix(sx, sy, U.u1.x, U.u2.x, U.u1.y, U.u2.y);
            return [lerp(sx, fx, t), lerp(sy, fy, t)];
          }
        ];

        const currentTransform = transforms[currentStep];
        drawGrid(currentTransform, t, '#4a90e2', 0.25);

        const circlePoints = 64;
        ctx.strokeStyle = '#ffd93d';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd93d';
        
        ctx.beginPath();
        for (let i = 0; i <= circlePoints; i++) {
          const angle = (i / circlePoints) * Math.PI * 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          const [tx, ty] = currentTransform(x, y, t);
          i === 0 ? ctx.moveTo(centerX + tx * scale, centerY - ty * scale) : ctx.lineTo(centerX + tx * scale, centerY - ty * scale);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (currentStep <= 1) {
          drawArrow(0, 0, 1, 0, '#ff6b6b', 3, 'e₁');
          drawArrow(0, 0, 0, 1, '#4ecdc4', 3, 'e₂');
        }

        if (currentStep === 1 && t > 0.7) {
          const [v1x, v1y] = currentTransform(1, 0, 1);
          const [v2x, v2y] = currentTransform(0, 1, 1);
          drawArrow(0, 0, v1x, v1y, '#ff6b6b', 3, 'v₁');
          drawArrow(0, 0, v2x, v2y, '#4ecdc4', 3, 'v₂');
        }

        if (currentStep === 2 && t > 0.7) {
          const [s1x, s1y] = currentTransform(1, 0, 1);
          const [s2x, s2y] = currentTransform(0, 1, 1);
          drawArrow(0, 0, s1x, s1y, '#ff6b6b', 3, `σ₁=${Sigma.s1.toFixed(2)}`);
          drawArrow(0, 0, s2x, s2y, '#4ecdc4', 3, `σ₂=${Sigma.s2.toFixed(2)}`);
        }

        if (currentStep === 3 && t > 0.7) {
          const [u1x, u1y] = currentTransform(1, 0, 1);
          const [u2x, u2y] = currentTransform(0, 1, 1);
          drawArrow(0, 0, u1x, u1y, '#ff6b6b', 4, 'u₁');
          drawArrow(0, 0, u2x, u2y, '#4ecdc4', 4, 'u₂');
        }
      }
    };

    render();
  }, [progress, mode, currentStep, matrixA, matrixB, matrixC, matrixD, svdData]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(prev => {
          const next = prev + 0.012;
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

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      reset();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      reset();
    }
  };

  const stepDescriptions = [
    { title: "Start: Identity", desc: "We begin with the standard basis vectors and a unit circle." },
    { title: "Step 1: Rotate with Vᵀ", desc: "First rotation aligns the space to the principal axes. V's columns are the 'input' directions." },
    { title: "Step 2: Scale with Σ", desc: "Pure stretching along the axes by singular values σ₁ and σ₂. No rotation!" },
    { title: "Step 3: Rotate with U", desc: "Final rotation to the output space. U's columns are the 'output' directions." }
  ];

  return (
    <div className="bg-transparent border-0 shadow-none">
      <div className="bg-black/30 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-2xl border border-purple-500/20">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          className="w-full h-auto aspect-[5/3] rounded-xl shadow-2xl"
        />
        
        <div className="mt-4 md:mt-6">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-xl border border-indigo-400/30 mb-4">
            {mode === 'geometric' ? (
              <>
                <h3 className="text-xl font-bold text-white mb-1">The Geometric Picture</h3>
                <p className="text-purple-100 leading-relaxed text-sm">
                  Watch the unit circle transform into an ellipse! The principal axes of the ellipse are the left singular vectors (u₁, u₂), and their lengths are the singular values (σ₁, σ₂). The input directions (v₁, v₂) show where these axes came from.
                </p>
              </>
            ) : mode === 'steps' ? (
              <>
                <h3 className="text-xl font-bold text-white mb-1">{stepDescriptions[currentStep].title}</h3>
                <p className="text-purple-100 leading-relaxed text-sm">{stepDescriptions[currentStep].desc}</p>
              </>
            ) : null}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
            <button
              onClick={() => { setMode('geometric'); reset(); }}
              className={`px-4 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${mode === 'geometric' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}
            >
              🎯 Geometric View
            </button>
            <button
              onClick={() => { setMode('steps'); setCurrentStep(0); reset(); }}
              className={`px-4 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${mode === 'steps' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}
            >
              📐 Step-by-Step
            </button>
            <button
              onClick={() => { setShowControls(!showControls); }}
              className="px-4 py-2 text-xs md:text-sm rounded-lg font-semibold bg-white/10 text-purple-200 hover:bg-white/20 transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              Matrix Controls
            </button>
          </div>

          {showControls && (
            <div className="bg-black/40 p-4 rounded-xl mb-4 border border-cyan-500/30">
              <h4 className="text-white font-bold mb-3 text-base">Adjust Matrix A</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'a₁₁', value: matrixA, setter: setMatrixA },
                  { label: 'a₁₂', value: matrixB, setter: setMatrixB },
                  { label: 'a₂₁', value: matrixC, setter: setMatrixC },
                  { label: 'a₂₂', value: matrixD, setter: setMatrixD },
                ].map(item => (
                  <div key={item.label}>
                    <label className="text-purple-200 text-xs block mb-1">{item.label}: {item.value.toFixed(2)}</label>
                    <input type="range" min="-3" max="3" step="0.1" value={item.value} 
                      onChange={(e) => item.setter(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 md:gap-3">
            {mode === 'steps' && (
              <button onClick={prevStep} disabled={currentStep === 0} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm">← Prev</button>
            )}
            
            <button onClick={() => setIsPlaying(!isPlaying)} className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center gap-2 font-bold text-base shadow-lg">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Animate'}
            </button>
            
            <button onClick={reset} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm"><RotateCcw className="w-4 h-4" /> Reset</button>
            
            {mode === 'steps' && (
              <button onClick={nextStep} disabled={currentStep === 3} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm">Next →</button>
            )}
            
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden ml-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-100" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
        
        {svdData && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur rounded-xl p-4 border border-red-400/30">
              <h4 className="text-white font-bold mb-2 text-base">U (Left Singular Vectors)</h4>
              <p className="text-red-200 text-xs mb-1">u₁ = ({svdData.U.u1.x.toFixed(2)}, {svdData.U.u1.y.toFixed(2)})</p>
              <p className="text-red-200 text-xs">u₂ = ({svdData.U.u2.x.toFixed(2)}, {svdData.U.u2.y.toFixed(2)})</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur rounded-xl p-4 border border-yellow-400/30">
              <h4 className="text-white font-bold mb-2 text-base">Σ (Singular Values)</h4>
              <p className="text-yellow-200 text-sm mb-1">σ₁ = {svdData.Sigma.s1.toFixed(3)}</p>
              <p className="text-yellow-200 text-sm">σ₂ = {svdData.Sigma.s2.toFixed(3)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur rounded-xl p-4 border border-cyan-400/30">
              <h4 className="text-white font-bold mb-2 text-base">V (Right Singular Vectors)</h4>
              <p className="text-cyan-200 text-xs mb-1">v₁ = ({svdData.V.v1.x.toFixed(2)}, {svdData.V.v1.y.toFixed(2)})</p>
              <p className="text-cyan-200 text-xs">v₂ = ({svdData.V.v2.x.toFixed(2)}, {svdData.V.v2.y.toFixed(2)})</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SVDVisualizer;
