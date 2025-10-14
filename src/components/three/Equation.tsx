
'use client';

import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

interface EquationProps {
    latex: string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * A React component to render a LaTeX equation overlaid on the 3D scene.
 * It uses react-katex for high-quality mathematical rendering.
 * Position is controlled via standard CSS.
 */
export function Equation({ latex, className, style }: EquationProps) {
    return (
        <div
            className={cn(
                "absolute text-xl pointer-events-none p-4 rounded-lg bg-background/30 backdrop-blur-sm",
                className
            )}
            style={style}
        >
            <BlockMath math={latex} />
        </div>
    );
}
