
import * as THREE from 'three';

// --- EASING FUNCTIONS ---

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


// --- INTERPOLATION FUNCTIONS ---

type Matrix2D = { a: number, b: number, c: number, d: number };

/**
 * Linearly interpolates between two 2D matrices.
 */
export const lerpMatrix = (m1: Matrix2D, m2: Matrix2D, t: number): Matrix2D => {
    const lerp = (v1: number, v2: number, alpha: number) => v1 * (1 - alpha) + v2 * alpha;
    return {
        a: lerp(m1.a, m2.a, t),
        b: lerp(m1.b, m2.b, t),
        c: lerp(m1.c, m2.c, t),
        d: lerp(m1.d, m2.d, t)
    };
};

/**
 * Returns an interpolated matrix using an easing function.
 */
export const animateTransformation = (
    fromMatrix: Matrix2D,
    toMatrix: Matrix2D,
    progress: number,
    easingFn: (t: number) => number = easeInOutCubic
): Matrix2D => {
    const t = easingFn(progress);
    return lerpMatrix(fromMatrix, toMatrix, t);
};

/**
 * Linearly interpolates between two THREE.Vector3 objects.
 */
export const lerpVector = (v1: THREE.Vector3, v2: THREE.Vector3, t: number): THREE.Vector3 => {
    return v1.clone().lerp(v2, t);
};

/**
 * Spherically interpolates between two THREE.Quaternion objects for smooth rotations.
 */
export const slerpQuaternion = (q1: THREE.Quaternion, q2: THREE.Quaternion, t: number): THREE.Quaternion => {
    return q1.clone().slerp(q2, t);
};


// --- ANIMATION HELPERS ---

/**
 * Fades in a Three.js object by animating its opacity.
 * @param object - The object to fade in.
 * @param duration - The duration of the fade in ms.
 * @param onUpdate - Callback function to execute on each frame.
 */
export const fadeIn = (object: THREE.Object3D, duration: number, onUpdate: (opacity: number) => void) => {
    let startTime: number | null = null;

    const animate = (time: number) => {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const opacity = easeInOutCubic(progress);

        object.traverse((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Sprite) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => {
                        m.transparent = true;
                        m.opacity = opacity;
                    });
                } else {
                    child.material.transparent = true;
                    child.material.opacity = opacity;
                }
            }
        });

        onUpdate(opacity);
        if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};

/**
 * Fades out a Three.js object by animating its opacity.
 */
export const fadeOut = (object: THREE.Object3D, duration: number, onUpdate: (opacity: number) => void) => {
    // Similar implementation to fadeIn, but animates opacity from 1 to 0
};

/**
 * Creates a pulsing effect on an object by animating its scale.
 */
export const pulseEffect = (object: THREE.Object3D, duration: number, pulseIntensity: number) => {
    let startTime: number | null = null;

    const animate = (time: number) => {
        if (startTime === null) startTime = time;
        const progress = (time - startTime) / duration;
        const scale = 1 + Math.sin(progress * Math.PI * 2) * pulseIntensity;
        
        object.scale.set(scale, scale, scale);

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};


type AnimationClip = {
    duration: number;
    update: (progress: number, easedProgress: number) => void;
};

/**
 * Executes a sequence of animation clips one after another.
 */
export const sequenceAnimations = (clips: AnimationClip[], onComplete?: () => void) => {
    let currentClipIndex = 0;
    let startTime: number | null = null;

    const animate = (time: number) => {
        if (currentClipIndex >= clips.length) {
            onComplete?.();
            return;
        }

        if (startTime === null) startTime = time;

        const clip = clips[currentClipIndex];
        const progress = Math.min((time - startTime) / clip.duration, 1);
        const easedProgress = easeInOutCubic(progress);

        clip.update(progress, easedProgress);

        if (progress >= 1) {
            currentClipIndex++;
            startTime = null;
        }

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};
