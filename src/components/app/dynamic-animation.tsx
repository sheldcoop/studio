
'use client';

import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { ComponentType } from 'react';

type AnimationProps = {
  isHovered: boolean;
  className?: string;
};

// A mapping from a simple string ID to a dynamically imported animation component.
const animationMap: Record<string, ComponentType<AnimationProps>> = {
  'linear-algebra': dynamic(() => import('@/components/app/linear-algebra-animation').then(mod => mod.LinearAlgebraAnimation)),
  'mental-math': dynamic(() => import('@/components/app/mental-math-animation').then(mod => mod.MentalMathAnimation)),
  'time-series-analysis': dynamic(() => import('@/components/app/time-series-animation').then(mod => mod.TimeSeriesAnimation)),
  'statistics': dynamic(() => import('@/components/app/statistics-animation').then(mod => mod.StatisticsAnimation)),
  'machine-learning': dynamic(() => import('@/components/app/machine-learning-animation').then(mod => mod.MachineLearningAnimation)),
  'stat-toolkit': dynamic(() => import('@/components/app/confidence-interval-animation').then(mod => mod.ConfidenceIntervalAnimation)),
  'probability': dynamic(() => import('@/components/app/plinko-animation').then(mod => mod.PlinkoAnimation)),
  'probability-toolkit': dynamic(() => import('@/components/app/dice-animation').then(mod => mod.DiceAnimation)),
  'determinant': dynamic(() => import('@/components/app/determinant-animation').then(mod => mod.DeterminantAnimation)),
};


interface DynamicAnimationProps {
  animationId: string;
  isHovered: boolean;
}

export function DynamicAnimation({ animationId, isHovered }: DynamicAnimationProps) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger this once
    threshold: 0.1, // Trigger when 10% of the component is visible
  });

  const AnimationComponent = animationMap[animationId];

  return (
    <div ref={ref} className="h-full w-full">
      {inView ? (
        AnimationComponent ? (
          <AnimationComponent isHovered={isHovered} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <p>Animation not found.</p>
          </div>
        )
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}
