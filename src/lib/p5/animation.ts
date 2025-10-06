
'use client';

import p5 from 'p5';

/**
 * A cubic easing function that speeds up and then slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;


/**
 * Linearly interpolates between two matrices.
 * @param p - The p5 instance.
 * @param m1 - The starting matrix.
 * @param m2 - The ending matrix.
 * @param t - The progress of the interpolation (0 to 1).
 * @returns The interpolated matrix.
 */
export const lerpMatrix = (p: p5, m1: any, m2: any, t: number) => {
    const res: { [key: string]: number } = {};
    for (const key in m1) {
        res[key] = p.lerp(m1[key], m2[key], t);
    }
    return res as any;
};

/**
 * Returns an interpolated matrix between two transformation matrices based on progress (0 to 1).
 * Use with for smooth animations showing how one transformation morphs into another.
 * @param p - The p5 instance.
 * @param fromMatrix - The starting matrix.
 * @param toMatrix - The ending matrix.
 * @param progress - The progress of the animation (0 to 1).
 * @returns The interpolated matrix.
 */
export const animateTransformation = (p: p5, fromMatrix: {a: number, b: number, c: number, d: number}, toMatrix: {a: number, b: number, c: number, d: number}, progress: number): {a: number, b: number, c: number, d: number} => {
    const t = easeInOutCubic(progress);
    return {
        a: p.lerp(fromMatrix.a, toMatrix.a, t),
        b: p.lerp(fromMatrix.b, toMatrix.b, t),
        c: p.lerp(fromMatrix.c, toMatrix.c, t),
        d: p.lerp(fromMatrix.d, toMatrix.d, t)
    };
};
