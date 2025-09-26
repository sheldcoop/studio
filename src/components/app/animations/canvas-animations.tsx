'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type AnimationType =
  | 'stats'
  | 'mental-math'
  | 'time-series'
  | 'ml'
  | 'trading'
  | 'toolkit';

interface CanvasAnimationProps {
  className?: string;
  animationType: AnimationType;
}

export function CanvasAnimation({
  className,
  animationType,
}: CanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = `hsl(var(--primary))`;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const onResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', onResize);
    onResize();

    // Animation-specific logic
    switch (animationType) {
      case 'stats': {
        let progress = 0;
        const speed = 0.005;
        const bellCurve = (x: number, stdDev: number, mean: number) =>
          (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));

        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();

          progress = (progress + speed) % 1.5;

          for (let i = 0; i < w * progress; i++) {
            const x = (i / w) * 10 - 5;
            const yVal = bellCurve(x, 1, 0);
            const plotX = i;
            const plotY = h - yVal * h * 2.5 - h * 0.2;
            if (i === 0) ctx.moveTo(plotX, plotY);
            else ctx.lineTo(plotX, plotY);
          }
          ctx.stroke();
        };
        animate();
        break;
      }
      // ... other cases
      case 'mental-math': {
        const symbols = ['+', '-', '×', '÷', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        let particles: { x: number; y: number; speed: number; char: string }[] = [];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.2 + Math.random() * 0.5,
            char: symbols[Math.floor(Math.random() * symbols.length)],
          });
        }

        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = color;
          ctx.font = '20px Arial';
          particles.forEach((p) => {
            p.y -= p.speed;
            if (p.y < -20) {
              p.y = canvas.height + 20;
              p.x = Math.random() * canvas.width;
            }
            ctx.fillText(p.char, p.x, p.y);
          });
        };
        animate();
        break;
      }
      case 'time-series': {
        const points: { x: number; y: number }[] = [];
        const numPoints = 50;
        let y = canvas.height / 2;
        for (let i = 0; i < numPoints; i++) {
          y += (Math.random() - 0.5) * 40;
          y = Math.max(canvas.height * 0.2, Math.min(canvas.height * 0.8, y));
          points.push({ x: (canvas.width / (numPoints - 1)) * i, y: y });
        }
        let progress = 0;

        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          progress += 0.5;
          if (progress > numPoints) progress = 0;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (let i = 1; i < progress; i++) {
            if (points[i]) {
              ctx.lineTo(points[i].x, points[i].y);
            }
          }
          ctx.stroke();
        };
        animate();
        break;
      }
      case 'ml': {
        const nodes = {
          input: [
            { x: 0.2, y: 0.2 },
            { x: 0.2, y: 0.5 },
            { x: 0.2, y: 0.8 },
          ],
          hidden: [
            { x: 0.5, y: 0.3 },
            { x: 0.5, y: 0.7 },
          ],
          output: [{ x: 0.8, y: 0.5 }],
        };
        let pulse = 0;

        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);
          pulse = (pulse + 0.02) % (Math.PI * 2);

          ctx.strokeStyle = color;
          nodes.input.forEach((iNode) => {
            nodes.hidden.forEach((hNode) => {
              ctx.globalAlpha = 0.5 + 0.5 * Math.sin(pulse + iNode.y + hNode.y);
              ctx.beginPath();
              ctx.moveTo(iNode.x * w, iNode.y * h);
              ctx.lineTo(hNode.x * w, hNode.y * h);
              ctx.stroke();
            });
          });
          nodes.hidden.forEach((hNode) => {
            nodes.output.forEach((oNode) => {
              ctx.globalAlpha = 0.5 + 0.5 * Math.sin(pulse * 1.5 + hNode.y);
              ctx.beginPath();
              ctx.moveTo(hNode.x * w, hNode.y * h);
              ctx.lineTo(oNode.x * w, oNode.y * h);
              ctx.stroke();
            });
          });

          ctx.globalAlpha = 1;
          ctx.fillStyle = color;
          Object.values(nodes)
            .flat()
            .forEach((node) => {
              ctx.beginPath();
              ctx.arc(node.x * w, node.y * h, 5, 0, 2 * Math.PI);
              ctx.fill();
            });
        };
        animate();
        break;
      }
      case 'trading': {
        const numCandles = 5;
        const candles: { open: number; close: number; high: number; low: number; color: string }[] = [];
        for (let i = 0; i < numCandles; i++) {
          const open = 0.3 + Math.random() * 0.4;
          const close = 0.3 + Math.random() * 0.4;
          const high = Math.max(open, close) + Math.random() * 0.1;
          const low = Math.min(open, close) - Math.random() * 0.1;
          candles.push({ open, close, high, low, color: open > close ? '#EF5350' : '#26A69A' });
        }

        let progress = 0;
        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          progress = (progress + 0.01) % (numCandles + 1);

          const w = canvas.width;
          const h = canvas.height;
          const candleWidth = w / (numCandles * 2);
          ctx.clearRect(0, 0, w, h);

          for (let i = 0; i < Math.floor(progress); i++) {
            const c = candles[i];
            const x = (w / numCandles) * i + candleWidth / 2;
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, c.high * h);
            ctx.lineTo(x + candleWidth / 2, c.low * h);
            ctx.stroke();
            ctx.fillStyle = c.color;
            const bodyTop = Math.min(c.open, c.close) * h;
            const bodyHeight = Math.abs(c.open - c.close) * h;
            ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
          }
        };
        animate();
        break;
      }
      case 'toolkit': {
        const icons = [
          { char: '📈', size: 2, x: 0.25, y: 0.2 },
          { char: '📊', size: 2.5, x: 0.15, y: 0.6 },
          { char: '📉', size: 2.2, x: 0.7, y: 0.25 },
          { char: '🧮', size: 2, x: 0.8, y: 0.65 },
        ];
        let time = 0;

        const animate = () => {
          if (!canvas.isConnected || !ctx) return;
          animationFrameId = requestAnimationFrame(animate);
          time += 0.01;
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          icons.forEach((icon, i) => {
            ctx.font = `${icon.size * 16}px sans-serif`;
            const fadeInOut = Math.sin(time * Math.PI + i * (Math.PI / 2));
            ctx.globalAlpha = Math.max(0, fadeInOut);
            ctx.fillText(icon.char, icon.x * w, icon.y * h);
          });
          ctx.globalAlpha = 1;
        };
        animate();
        break;
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
    };
  }, [animationType, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute top-0 left-0 w-full h-full z-0 opacity-20',
        className
      )}
    />
  );
}