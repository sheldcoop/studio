'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { easeInOutCubic } from '../three/animation';
import { BlockMath } from 'react-katex';

type Matrix2D = { a: number; b: number; c: number; d: number };

const initialMatrix: Matrix2D = { a: 2, b: 1, c: 1, d: 2 };

function MatrixInput({ matrix, setMatrix, label }: { matrix: Matrix2D, setMatrix: (m: Matrix2D) => void, label: string }) {
    // Component content here
    return <div>Matrix Input Placeholder</div>;
}

export function EigenvectorAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState<Matrix2D>(initialMatrix);
  const [eigenvalues, setEigenvalues] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Placeholder for Three.js initialization logic
  }, [matrix]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 relative aspect-square w-full min-h-[300px] overflow-hidden rounded-lg border bg-muted/20 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="absolute inset-0" />
      </div>
      <Card className="lg:col-span-1 w-full">
        <CardHeader>
          <CardTitle className="font-headline">Eigen-Machine</CardTitle>
          <CardDescription>
            Input a 2x2 matrix to see its transformation and find its real
            eigenvectors—the special vectors that only stretch or shrink.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MatrixInput matrix={matrix} setMatrix={setMatrix} label="Transformation Matrix (A)" />
          <div className="flex justify-center mt-4">
            <Button onClick={() => setIsPlaying(true)} disabled={isPlaying}>
              Apply Transformation
            </Button>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg w-full mt-4">
            <p className="text-xs text-muted-foreground mb-1">
              Calculated Eigenvalues (λ)
            </p>
            {eigenvalues.length > 0 ? (
                <div className="font-mono text-lg font-bold text-primary">
                    {eigenvalues.join(', ')}
                </div>
            ) : (
                <div className="font-mono text-sm text-muted-foreground">
                    No real eigenvalues found.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
