
'use client';

import { useEffect, useRef } from 'react';

/**
 * A custom React hook that manages the requestAnimationFrame loop.
 * It provides a clean way to run animation logic on every frame.
 * @param callback The function to execute on each frame. It receives time and delta time.
 */
export const useAnimationLoop = (callback: (time: number, delta: number) => void) => {
    const callbackRef = useRef(callback);
    const frameIdRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const loop = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                const delta = time - previousTimeRef.current;
                callbackRef.current(time, delta);
            }
            previousTimeRef.current = time;
            frameIdRef.current = requestAnimationFrame(loop);
        };

        frameIdRef.current = requestAnimationFrame(loop);

        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, []);
};
