
'use client';

import p5 from 'p5';

/**
 * A cubic easing function that speeds up and then slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * An easing function that starts slow and speeds up.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInCubic = (t: number): number => t * t * t;

/**
 * An easing function that starts fast and slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * A quadratic easing function that speeds up and then slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInOutQuad = (t: number): number => 
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * A quartic easing function that speeds up and then slows down.
 * @param t - The progress of the animation (0 to 1).
 * @returns The eased progress.
 */
export const easeInOutQuart = (t: number): number => 
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * A linear easing function (no easing).
 * @param t - The progress of the animation (0 to 1).
 * @returns The original progress.
 */
export const linear = (t: number): number => t;


/**
 * Linearly interpolates between two matrices.
 * @param p - The p5 instance.
 * @param m1 - The starting matrix.
 * @param m2 - The ending matrix.
 * @param t - The progress of the interpolation (0 to 1).
 * @returns The interpolated matrix.
 */
export const lerpMatrix = (
    p: p5, 
    m1: {a: number, b: number, c: number, d: number}, 
    m2: {a: number, b: number, c: number, d: number}, 
    t: number
): {a: number, b: number, c: number, d: number} => {
    return {
        a: p.lerp(m1.a, m2.a, t),
        b: p.lerp(m1.b, m2.b, t),
        c: p.lerp(m1.c, m2.c, t),
        d: p.lerp(m1.d, m2.d, t)
    };
};

/**
 * Returns an interpolated matrix between two transformation matrices based on eased progress (0 to 1).
 * Use for smooth animations showing how one transformation morphs into another.
 * @param p - The p5 instance.
 * @param fromMatrix - The starting matrix.
 * @param toMatrix - The ending matrix.
 * @param progress - The progress of the animation (0 to 1).
 * @returns The interpolated matrix.
 */
export const animateTransformation = (p: p5, fromMatrix: {a: number, b: number, c: number, d: number}, toMatrix: {a: number, b: number, c: number, d: number}, progress: number): {a: number, b: number, c: number, d: number} => {
    const t = easeInOutCubic(progress);
    return lerpMatrix(p, fromMatrix, toMatrix, t);
};

/**
 * Linearly interpolates between two vectors.
 * A consistent wrapper around p5.Vector.lerp.
 * @param p - The p5 instance.
 * @param v1 - The starting vector.
 * @param v2 - The ending vector.
 * @param t - The progress of the interpolation (0 to 1).
 * @returns The interpolated vector.
 */
export const lerpVector = (p: p5, v1: p5.Vector, v2: p5.Vector, t: number): p5.Vector => {
    return p5.Vector.lerp(v1, v2, t);
};
