
'use client';

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface DeterminantAnimationProps {
  className?: string;
  isHovered: boolean;
}

export function DeterminantAnimation({ className, isHovered }: DeterminantAnimationProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(isHovered);
  const { theme } = useTheme();

  useEffect(() => {
    isMouseOver.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const currentMount = canvasRef.current;
    let sketch: p5;

    const script = (p: p5) => {
      let t = 0;
      let targetT = 0;
      let matrix = { a: 1.5, b: 0.5, c: -0.5, d: 1 };
      
      let primaryColor: p5.Color;

      p.setup = () => {
        const renderer = p.createCanvas(p.windowWidth, p.windowHeight);
        renderer.parent(currentMount);
        p.windowResized();
        
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColorValue = computedStyle.getPropertyValue('--animation-primary-color').trim();
        primaryColor = p.color(primaryColorValue);
        primaryColor.setAlpha(255);
      };

      p.draw = () => {
        p.clear(0, 0, 0, 0); // Use clear() for transparency
        p.translate(p.width / 2, p.height / 2);
        p.scale(1, -1); // Flip y-axis to match standard math coordinates

        const scaleFactor = p.min(p.width, p.height) / 8;
        
        targetT = isMouseOver.current ? 1 : 0;
        t += (targetT - t) * 0.05;

        const ease = (val: number) => val < 0.5 ? 2 * val * val : 1 - Math.pow(-2 * val + 2, 2) / 2;
        const easedT = ease(t);

        const currentMatrix = {
          a: p.lerp(1, matrix.a, easedT),
          b: p.lerp(0, matrix.b, easedT),
          c: p.lerp(0, matrix.c, easedT),
          d: p.lerp(1, matrix.d, easedT),
        };
        
        const det = currentMatrix.a * currentMatrix.d - currentMatrix.b * currentMatrix.c;

        // Draw grid
        drawGrid(currentMatrix, scaleFactor);

        // Draw transformed square
        p.noStroke();
        primaryColor.setAlpha(80);
        p.fill(primaryColor);
        
        p.beginShape();
        p.vertex(0, 0);
        p.vertex(currentMatrix.a * scaleFactor, currentMatrix.c * scaleFactor);
        p.vertex((currentMatrix.a + currentMatrix.b) * scaleFactor, (currentMatrix.c + currentMatrix.d) * scaleFactor);
        p.vertex(currentMatrix.b * scaleFactor, currentMatrix.d * scaleFactor);
        p.endShape(p.CLOSE);

        // Draw basis vectors
        drawVector(currentMatrix.a, currentMatrix.c, '#ff6b6b', scaleFactor); // i-hat
        drawVector(currentMatrix.b, currentMatrix.d, '#51cf66', scaleFactor); // j-hat
        
        // Draw determinant text
        p.push();
        p.scale(1, -1); // Un-flip for text
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(18);
        p.text(`Determinant (Area) = ${det.toFixed(2)}`, 0, p.height / 2 - 20);
        p.pop();
      };
      
      const drawGrid = (m: {a:number,b:number,c:number,d:number}, s: number) => {
        primaryColor.setAlpha(40);
        p.stroke(primaryColor);
        p.strokeWeight(1);
        
        const gridSize = 10;
        for (let i = -gridSize; i <= gridSize; i++) {
          const x1 = i, y1 = -gridSize;
          const x2 = i, y2 = gridSize;
          
          const tx1 = m.a * x1 + m.b * y1;
          const ty1 = m.c * x1 + m.d * y1;
          const tx2 = m.a * x2 + m.b * y2;
          const ty2 = m.c * x2 + m.d * y2;
          
          p.line(tx1 * s, ty1 * s, tx2 * s, ty2 * s);
        }
        for (let i = -gridSize; i <= gridSize; i++) {
          const x1 = -gridSize, y1 = i;
          const x2 = gridSize, y2 = i;

          const tx1 = m.a * x1 + m.b * y1;
          const ty1 = m.c * x1 + m.d * y1;
          const tx2 = m.a * x2 + m.b * y2;
          const ty2 = m.c * x2 + m.d * y2;
          
          p.line(tx1 * s, ty1 * s, tx2 * s, ty2 * s);
        }
        primaryColor.setAlpha(255);
      };

      const drawVector = (x: number, y: number, color: string, s: number) => {
        p.stroke(color);
        p.fill(color);
        p.strokeWeight(3);
        p.line(0, 0, x * s, y * s);
        
        p.push();
        p.translate(x * s, y * s);
        const angle = p.atan2(y, x);
        p.rotate(angle);
        p.triangle(0, 0, -8, 4, -8, -4);
        p.pop();
      };

      p.windowResized = () => {
        if(currentMount) {
            p.resizeCanvas(currentMount.offsetWidth, currentMount.offsetHeight);
        }
      };
    };

    sketch = new p5(script);

    return () => {
      sketch.remove();
    };
  }, [theme]);

  return <div ref={canvasRef} className={cn('w-full h-full', className)} />;
}
